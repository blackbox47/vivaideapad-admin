import type {
  AuditEvent,
  AuditEventDetail,
  AuditLogListParams,
  AuditLogResponse,
} from '@/models/audit-log/audit-log-model';
import { toAuditLogResponse } from '@/services/audit-log/map-audit-log';
import { baseService } from '@/services/core/base-service';
import {
  AUDIT_EVENT_DETAIL_URL,
  AUDIT_EVENTS_URL,
} from '@/utils/constants/api-end-points';

export interface AuditEventsListParams extends AuditLogListParams {
  actorId?: string;
  targetType?: 'application' | 'submission' | 'payout_request' | 'user';
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const auditLogService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLog: builder.query<AuditLogResponse, AuditLogListParams | void>({
      query: (params) => ({
        url: AUDIT_EVENTS_URL,
        method: 'GET',
        params: {
          search: params?.search?.trim() || undefined,
          page: 1,
          limit: 100,
        },
      }),
      transformResponse: toAuditLogResponse,
      providesTags: ['audit-log'],
    }),
    /** Spec §5.9 — GET /admin/audit-events */
    getAuditEvents: builder.query<
      { data: AuditEvent[]; total: number },
      AuditEventsListParams | void
    >({
      query: (params) => ({
        url: AUDIT_EVENTS_URL,
        method: 'GET',
        params: {
          actor_id: params?.actorId,
          category: params?.category,
          target_type: params?.targetType,
          action: params?.action,
          date_from: params?.dateFrom,
          date_to: params?.dateTo,
          search: params?.search?.trim() || undefined,
          page: params?.page,
          limit: params?.limit,
        },
      }),
      transformResponse: (response: unknown) => {
        const mapped = toAuditLogResponse(response);
        return { data: mapped.events, total: mapped.total };
      },
      providesTags: ['audit-events', 'audit-log'],
    }),
    /** Spec §5.9 — GET /admin/audit-events/:id */
    getAuditEvent: builder.query<{ event: AuditEventDetail }, string>({
      query: (id) => ({ url: AUDIT_EVENT_DETAIL_URL(id), method: 'GET' }),
      providesTags: (_r, _e, id) => [{ type: 'audit-events', id }],
    }),
  }),
});

export const {
  useGetAuditLogQuery,
  useGetAuditEventsQuery,
  useLazyGetAuditEventQuery,
  useGetAuditEventQuery,
} = auditLogService;
