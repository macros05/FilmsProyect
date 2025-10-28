export interface ApiResponse {
  results: any;
  status: any;
  ok: boolean;
  message?: string;
  data?: any;
  permises?: Permises;
}

export interface Permises {
  add: boolean;
  edit: boolean;
  delete: boolean;
}
