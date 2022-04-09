export interface tableListParams {
  pageNumber: number
  pageSize: number
  filters: { [key: string | number]: any } | {}
}
