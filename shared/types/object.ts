export interface Response {
  statusCode: number;
  statusMessage: string;
  data?: object;
}

export interface SuccessResponse extends Response {
  data: object;
}

export interface IpResponse extends SuccessResponse {
  data: {
    ip: string;
  };
}

export interface DnsRecordResponse extends SuccessResponse {
  result: {
    id: string;
    name: string;
    type: string;
    content: string;
    proxiable: boolean;
    proxied: boolean;
    ttl: number;
    settings: object;
    meta: object;
    comment: string;
    tags: string[];
    created_on: string;
    modified_on: string;
  };
  success: boolean;
  errors: any[];
  messages: any[];
  result_info: {
    page: number;
    per_page: number;
    count: number;
    total_count: number;
    total_pages: number;
  };
}
