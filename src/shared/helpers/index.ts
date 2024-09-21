import crypto from 'crypto';

import { Constant } from '@/shared/constants';

export class Helper {
	/**
	 * Sleep the program
	 *
	 * @param ms
	 * @returns
	 */
	public static async sleep(ms: number): Promise<unknown> {
		return await new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Hash String
	 *
	 * @param str
	 * @returns
	 */
	public static hash(str: string): string {
		return crypto
			.createHmac('sha256', Constant.app.HASH_SALT)
			.update(str)
			.digest('hex');
	}

	/**
	 * Generate Random Username
	 *
	 * @returns
	 */
	public static generateUsername(): string {
		const chars =
			'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		const minLength = 3;
		const maxLength = 16;

		const usernameLength =
			Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
		let username = '';

		for (let i = 0; i < usernameLength; i++) {
			username += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		return username;
	}
}
