export interface IfilterSearch {
  limit?: number;
  page?: number;
  order?: {
    key: string;
    value: string;
  };
  query?: {
    key: string;
    value: any;
  }[];
  exclude?: {
    key: string;
    value: any;
  }[];
  explicit?: {
    key: string;
    value: any;
  }[];
}
