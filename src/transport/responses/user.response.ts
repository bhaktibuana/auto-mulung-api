import { S_User } from '@/app/models';

export class UserResponse {
	/**
	 * User Register Response
	 *
	 * @param payload
	 * @returns
	 */
	public register(payload: S_User | null): S_User | null {
		if (!payload) return null;
		return {
			_id: payload.id,
			email: payload.email,
			is_verified: payload.is_verified,
		} as S_User;
	}
}
