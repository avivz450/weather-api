export default abstract class HttpError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}
