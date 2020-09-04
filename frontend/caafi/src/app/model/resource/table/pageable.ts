export interface Pageable {
  page: number;
  size: number;
  sort: string[];
  filter: string;
  filterFields: string[];
}
