import { StatusCodes } from 'http-status-codes';

import { SystemLog } from '@/app/models';
import { AppError } from '@/shared/utils';
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
		throw new AppError(
			statusCode,
			message,
			errorData,
			this.constructor.name,
		);
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

	/**
	 * Service Catch Error Handler
	 *
	 * @param error
	 * @param functionName
	 */
	protected async catchErrorHandler(
		error: unknown,
		functionName: string,
	): Promise<void> {
		if (error instanceof AppError) {
			if (error.sourceError === this.constructor.name) {
				await this.systemLog(functionName, error);
				this.errorHandler(error.statusCode, error.message, error);
			}
		} else {
			await this.systemLog(functionName, error);
		}
		const errorMessage =
			(error as { message: string }).message || 'Internal Server Error';
		this.errorHandler(this.STATUS_CODE.INTERNAL_SERVER_ERROR, errorMessage, error);
	}
}
