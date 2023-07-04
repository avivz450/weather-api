interface BaseMessage {
  status: string;
}

export interface ErrorMessage extends BaseMessage {
  message: string;
}

export interface SuccessMessage extends BaseMessage {
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface DateRange {
  from: number;
  to: number;
}

export interface Pagination {
  page: number;
  limit: number;
}
