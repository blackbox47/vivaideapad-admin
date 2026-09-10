import type { CreatorStat } from '@/models/creator/creator-dashboard-model';
import type {
  CreatorLeaderboardOverview,
  CreatorLeaderboardPerson,
} from '@/models/creator/creator-leaderboard-model';
import { readSessionHint } from '@/reducers/auth-slice';
import { baseService } from '@/services/core/base-service';
import { CREATOR_LEADERBOARD_URL } from '@/utils/constants/api-end-points';
import { deriveInitials } from '@/utils/helpers/initials';

const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

export function formatLeaderboardPoints(value: number): string {
  return NUMBER_FORMAT.format(Math.round(value));
}

function formatStreak(streak: number): string {
  if (!streak || streak <= 0) return '—';
  if (streak === 1) return '1 week';
  return `${streak} weeks`;
}

const AVATAR_COLORS = ['#dff8eb', '#e7e3ff', '#ffe6d5', '#e8ffc0'] as const;
const MEDALS = ['🥇', '🥈', '🥉'] as const;

interface ContributorLeaderboardApiRow {
  rank?: number;
  user_id?: string;
  email?: string | null;
  display_name?: string | null;
  score?: string | number;
  approvals?: number;
  submissions_count?: number;
  streak?: number;
  last_updated?: string | null;
}

interface ContributorLeaderboardEnvelope {
  period?: string;
  data?: ContributorLeaderboardApiRow[];
  podium?: CreatorLeaderboardPerson[];
  standings?: CreatorLeaderboardPerson[];
  stats?: CreatorStat[];
  eyebrow?: string;
  title?: string;
  description?: string;
  visibility?: string;
}

function buildOverviewWithStats(
  podium: CreatorLeaderboardPerson[],
  standings: CreatorLeaderboardPerson[],
  allPersons: CreatorLeaderboardPerson[],
  eyebrow?: string,
  title?: string,
  description?: string,
  visibility?: string,
): CreatorLeaderboardOverview {
  const you = allPersons.find((p) => p.isYou);
  const youIndex = you ? allPersons.indexOf(you) : -1;

  const rankStat: CreatorStat = {
    id: 'rank',
    label: 'Your rank',
    value: you ? `#${you.rank}` : '—',
    description: you
      ? you.rank === 1
        ? allPersons.length > 1
          ? `Ranked #1 of ${allPersons.length}`
          : 'Top contributor'
        : `Ranked #${you.rank} of ${allPersons.length}`
      : 'Not yet ranked',
    tone: you?.rank === 1 ? 'positive' : 'muted',
  };

  const pointsStat: CreatorStat = {
    id: 'points',
    label: 'Your points',
    value: you ? formatLeaderboardPoints(you.points) : '0',
    description: you
      ? `${you.approved} approved idea${you.approved === 1 ? '' : 's'}`
      : '0 approved ideas',
    tone: 'muted',
  };

  let nextValue = '—';
  let nextDescription = 'Submit ideas to rank';
  let nextTone: CreatorStat['tone'] = 'muted';

  if (you) {
    if (you.rank === 1) {
      nextValue = '0';
      nextDescription = 'You lead the board';
      nextTone = 'positive';
    } else {
      const ahead = youIndex > 0 ? allPersons[youIndex - 1] : null;
      const diff = ahead ? Math.max(0, ahead.points - you.points) : 0;
      nextValue = formatLeaderboardPoints(diff);
      nextDescription = ahead
        ? `Ahead: ${ahead.name.replace(/\s+\(you\)$/, '')}`
        : 'Next rank';
      nextTone = 'danger';
    }
  } else if (allPersons.length > 0) {
    const last = allPersons[allPersons.length - 1];
    nextValue = formatLeaderboardPoints(last.points);
    nextDescription = `Target: ${last.name.replace(/\s+\(you\)$/, '')}`;
    nextTone = 'muted';
  }

  const nextStat: CreatorStat = {
    id: 'next',
    label: 'Points to next rank',
    value: nextValue,
    description: nextDescription,
    tone: nextTone,
  };

  const streakStat: CreatorStat = {
    id: 'streak',
    label: 'Current streak',
    value: you && you.streak !== '—' ? you.streak : '0',
    description:
      you && you.streak !== '—'
        ? 'Submit again to extend it'
        : 'Submit ideas to build a streak',
    tone: 'muted',
  };

  return {
    eyebrow: eyebrow ?? 'Community',
    title: title ?? 'Leaderboard',
    description:
      description ??
      'Celebrating original thinking and consistent positive contribution.',
    visibility: visibility ?? 'Public',
    stats: [rankStat, pointsStat, nextStat, streakStat],
    podium,
    standings,
  };
}

export function toCreatorLeaderboardOverview(
  response: unknown,
  currentUserId?: string | null,
): CreatorLeaderboardOverview {
  const resolvedUserId = currentUserId ?? readSessionHint().userId;

  if (response && typeof response === 'object') {
    const rawObj = response as ContributorLeaderboardEnvelope;
    if (Array.isArray(rawObj.podium) && Array.isArray(rawObj.standings)) {
      return personalizeCreatorLeaderboard(
        rawObj as CreatorLeaderboardOverview,
        resolvedUserId,
      );
    }
  }

  const raw = (
    response && typeof response === 'object' ? response : {}
  ) as ContributorLeaderboardEnvelope;
  const rows = Array.isArray(raw.data)
    ? raw.data
    : Array.isArray(response)
      ? (response as ContributorLeaderboardApiRow[])
      : [];

  const allPersons: CreatorLeaderboardPerson[] = rows.map((r, idx) => {
    const isYou = Boolean(resolvedUserId && r.user_id === resolvedUserId);
    const baseName =
      r.display_name?.trim() || r.email?.trim() || 'Contributor';
    const initials = deriveInitials(r.display_name, r.email ?? '');
    const points = Math.round(Number(r.score ?? 0));
    const approved = Number(r.approvals ?? 0);
    const streak = formatStreak(Number(r.streak ?? 0));
    const rank = Number(r.rank ?? idx + 1);
    const rankLabel = `#${rank}`;
    const avatarBg = isYou
      ? '#e8ffc0'
      : AVATAR_COLORS[idx % AVATAR_COLORS.length];
    const prevRank = idx > 0 ? Number(rows[idx - 1].rank ?? idx) : 0;
    const showGap = idx > 0 && rank > prevRank + 1;

    return {
      id: r.user_id || String(idx + 1),
      rank,
      rankLabel,
      name: isYou ? `${baseName} (you)` : baseName,
      initials,
      points,
      approved,
      streak,
      avatarBg,
      visibility: 'Public',
      isYou,
      showGap,
    };
  });

  const podium = allPersons.slice(0, 3).map((person, idx) => ({
    ...person,
    medal: MEDALS[idx],
  }));

  const standings = allPersons.length > 3 ? allPersons.slice(3) : allPersons;

  return buildOverviewWithStats(
    podium,
    standings,
    allPersons,
    raw.eyebrow,
    raw.title,
    raw.description,
    raw.visibility,
  );
}

export function personalizeCreatorLeaderboard(
  overview: CreatorLeaderboardOverview,
  currentUserId?: string | null,
): CreatorLeaderboardOverview {
  if (!overview) return overview;
  const resolvedUserId = currentUserId ?? readSessionHint().userId;

  const updatePerson = (
    p: CreatorLeaderboardPerson,
  ): CreatorLeaderboardPerson => {
    const isYou = Boolean(resolvedUserId && p.id === resolvedUserId);
    const baseName = p.name.replace(/\s+\(you\)$/, '');
    return {
      ...p,
      isYou,
      name: isYou ? `${baseName} (you)` : baseName,
      avatarBg: isYou ? '#e8ffc0' : p.avatarBg,
    };
  };

  const podium = overview.podium.map(updatePerson);
  const standings = overview.standings.map(updatePerson);

  const map = new Map<string, CreatorLeaderboardPerson>();
  for (const p of podium) {
    map.set(p.id, p);
  }
  for (const s of standings) {
    if (!map.has(s.id)) {
      map.set(s.id, s);
    }
  }
  const allPersons = Array.from(map.values()).sort((a, b) => a.rank - b.rank);

  return buildOverviewWithStats(
    podium,
    standings,
    allPersons,
    overview.eyebrow,
    overview.title,
    overview.description,
    overview.visibility,
  );
}

export const creatorLeaderboardService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getCreatorLeaderboard: builder.query<CreatorLeaderboardOverview, void>({
      query: () => ({ url: CREATOR_LEADERBOARD_URL, method: 'GET' }),
      transformResponse: (response: unknown) =>
        toCreatorLeaderboardOverview(response),
      providesTags: ['creator-leaderboard'],
    }),
  }),
});

export const { useGetCreatorLeaderboardQuery } = creatorLeaderboardService;
