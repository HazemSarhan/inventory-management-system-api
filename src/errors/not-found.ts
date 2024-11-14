import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api';

export default class NotFoundError extends CustomAPIError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
