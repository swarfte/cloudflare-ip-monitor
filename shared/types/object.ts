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

export interface Settings {
  zoneId: string;
  apiToken: string;
  syncInterval: number;
}

export interface DnsRecord {
  domain: string;
  proxied: boolean;
  syncedTime: string;
  syncedIP: string;
  result: string;
}

export interface RawDnsRecord {
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
}

export interface DnsRecordResponse extends SuccessResponse {
  result: RawDnsRecord[];
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
