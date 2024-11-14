export default class CustomAPIError extends Error {
  constructor(message: string) {
    super(message);
  }
}
