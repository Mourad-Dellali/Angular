export interface GetChequesQueryModel {
  from?: string | null;      // ISO datetime
  to?: string | null;        // ISO datetime
  cursor?: string | null;    // ISO datetime
  cursorId?: string | null;  // Guid
  pageSize?: number;
  checkType?: number | null;
}