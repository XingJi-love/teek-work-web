declare namespace httpNs {
  interface Response<T = any> {
    /** 状态码 */
    code: number;
    /** 状态码信息 */
    status: string;
    /** 消息 */
    message: string;
    /** 数据 */
    data: T;
    [key: string]: any;
  }

  interface Page<T> {
    /** 状态码 */
    code: number;
    /** 状态码信息 */
    status: string;
    /** 消息 */
    message: string;
    data: PageData<T>;
  }

  interface PageData<T> {
    /** 页码 */
    pageNum: number;
    /** 每页数量 */
    pageSize: number;
    /** 总记录数 */
    total: number;
    /** 数据 */
    list: T;
  }

  interface PageParams {
    pageNo: number;
    pageSize: number;
  }
}
