import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { SystemLog } from '@/app/models';
import { AppError, HTTP } from '@/shared/utils';
import { T_AppErrorData } from '@/shared/types';

export abstract class Service {
	protected readonly STATUS_CODE = StatusCodes;

	/**
	 * Error Handler
	 *
	 * @param statusCode
	 * @param message
	 * @param errorData
	 */
	protected errorHandler(
		statusCode: StatusCodes,
		message: string,
		errorData: T_AppErrorData = null,
	): void {
		throw new AppError(statusCode, message, errorData);
	}

	/**
	 * Generate HTTP Error Response
	 *
	 * @param res
	 * @param error
	 */
	protected errorResponse<T>(res: Response, error: T): void {
		HTTP.errorResponse(res, error);
	}

	/**
	 * Handle SystemLog to DB
	 *
	 * @param functionName
	 * @param data
	 * @param status
	 * @param slug
	 */
	protected async systemLog(
		functionName: string,
		data: object | unknown = {},
		status: 'success' | 'failed' = 'failed',
		slug: string | null = null,
	): Promise<void> {
		const systemLog = new SystemLog();
		systemLog.payload = {
			class_name: this.constructor.name,
			function_name: functionName,
			slug,
			status,
			data,
		};
		await systemLog.save();
	}
}
