export interface IfilterSearch {
  limit?: number;
  page?: number;
  order?: {
    key: string;
    value: string;
  };
  query?: {
    key: string;
    value: string;
  }[];
  exclude?: {
    key: string;
    value: string;
  }[];
}
