import { T_AppErrorData } from '@/shared/types';

export class AppError extends Error {
	constructor(
		public statusCode: number,
		public message: string,
		public errorData: T_AppErrorData = null,
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}
