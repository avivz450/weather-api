interface BaseMessage {
  status: number;
  message: string;
}

export interface ErrorMessage extends BaseMessage {
  stack?: string;
}

export interface ResponseMessage extends BaseMessage {
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
