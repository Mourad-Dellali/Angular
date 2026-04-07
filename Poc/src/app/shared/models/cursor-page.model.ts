export interface CursorPageModel<T> {
  items: T[];
  nextCursor: string | null;
  nextCursorId: string | null;
  hasNextPage: boolean;
}