export interface GetJobsQuery {
  pageSize: number;
  cursor: string | null;
  cursorId: string | null;
  from?: string;
  to?: string;
}