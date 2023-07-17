interface BaseMessage {
  status: string;
}

export interface ErrorMessage extends BaseMessage {
  [key: string]: any;
}

export interface SuccessMessage extends BaseMessage {
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

