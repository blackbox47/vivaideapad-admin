import { Input } from '@/components/ui/input';
import type { NotificationPreferences } from '@/models/profile/profile-model';

interface ProfileNotificationsCardProps {
  preferences: NotificationPreferences;
  isUpdating: boolean;
  onToggle: (key: keyof NotificationPreferences, value: boolean) => void;
}

interface ToggleRow {
  id: keyof NotificationPreferences;
  label: string;
}

const TOGGLE_ROWS: ToggleRow[] = [
  { id: 'email', label: 'Email notifications' },
  { id: 'inApp', label: 'In-app notifications' },
];

export default function ProfileNotificationsCard({
  preferences,
  isUpdating,
  onToggle,
}: ProfileNotificationsCardProps) {
  return (
    <section className="rounded-[20px] border border-border bg-card p-[22px]">
      <h3 className="mb-4 font-heading text-base font-semibold text-foreground">
        Notification preferences
      </h3>
      <div className="flex flex-col gap-3.5">
        {TOGGLE_ROWS.map((row) => {
          const checked = preferences[row.id];
          return (
            <label
              key={row.id}
              className="flex items-center justify-between text-[13px] text-foreground"
            >
              <span>{row.label}</span>
              <Input
                type="checkbox"
                checked={checked}
                disabled={isUpdating}
                onChange={(event) => onToggle(row.id, event.target.checked)}
                className="size-4 cursor-pointer accent-primary disabled:opacity-60"
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}