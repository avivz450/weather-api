export interface BaseMessage {
  message: string;
}

export interface ResponseMessage extends BaseMessage {
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
