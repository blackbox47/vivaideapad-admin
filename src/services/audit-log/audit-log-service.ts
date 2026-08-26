import type {
  AuditLogListParams,
  AuditLogResponse,
} from '@/models/audit-log/audit-log-model';
import { baseService } from '@/services/core/base-service';
import { AUDIT_LOG_URL } from '@/utils/constants/api-end-points';

export const auditLogService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLog: builder.query<
      AuditLogResponse,
      AuditLogListParams | void
    >({
      query: (params) => ({
        url: AUDIT_LOG_URL,
        method: 'GET',
        params: {
          category: params?.category,
          search: params?.search,
        },
      }),
      providesTags: ['audit-log'],
    }),
  }),
});

export const { useGetAuditLogQuery } = auditLogService;