export interface IIdempotencyRequest {
  agent_id: number,
  idempotency_key: string,
  body?: any
}

export interface IIdempotencyResponse {
  data: string
}