/**
 * Pagination envelopes — REST spec §1 (Pagination Standard).
 *
 *   {
 *     "data": [ ... ],
 *     "meta": { "page": 1, "limit": 20, "total_items": 142, "total_pages": 8 }
 *   }
 *
 * The legacy endpoints in this app return a flat shape (e.g.
 * `{ concepts: [...], total }`) — services that wrap those legacy shapes
 * are responsible for projecting them into `Paginated<T>` for callers.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export function buildPaginationMeta(
  totalItems: number,
  page: number,
  limit: number,
): PaginationMeta {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
  return {
    page: safePage,
    limit: safeLimit,
    totalItems,
    totalPages,
  };
}

export function paginate<T>(
  items: T[],
  page: number,
  limit: number,
): Paginated<T> {
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: buildPaginationMeta(items.length, page, limit),
  };
}
