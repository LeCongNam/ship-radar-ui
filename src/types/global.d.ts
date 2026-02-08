export {};

declare global {
  type ResponseWiPagination<T> = {
    data: T[];
    metadata: { page: number; pageSize: number; total: number };
  };
}
