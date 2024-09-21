import dayjs from 'dayjs';

import { Config } from '@/config';
import { T_Console } from '@/shared/types';

export class Console {
	/**
	 * App Log
	 *
	 * @param title
	 * @param payload
	 */
	public static log<T>(title: string, payload: T): void {
		Console.console<T>('log', title, payload);
	}

	/**
	 * App Log Error
	 *
	 * @param title
	 * @param payload
	 */
	public static error<T>(title: string, payload: T): void {
		Console.console<T>('error', title, payload);
	}

	/**
	 * Console
	 *
	 * @param type
	 * @param title
	 * @param payload
	 */
	private static console<T>(
		type: T_Console,
		title: string,
		payload: T,
	): void {
		if (Config.app.NODE_ENV === 'production') return;

		const date = dayjs().format('HH:mm:ss');
		if (type === 'log') {
			console.log(`[${title}] ${date} =>`, payload);
		} else if (type === 'error') {
			console.error(`[${title}] ${date} =>`, payload);
		}
	}
}
