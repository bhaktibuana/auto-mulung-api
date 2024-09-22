import { S_User } from '@/app/models';

export class UserResponse {
	/**
	 * User Register Response
	 *
	 * @param payload
	 * @returns
	 */
	public register(payload: S_User | null) {
		if (!payload) return null;
		return {
			_id: payload.id,
			email: payload.email,
			is_verified: payload.is_verified,
		};
	}

	/**
	 * User Login Response
	 *
	 * @param payload
	 * @returns
	 */
	public login(payload: { user: S_User | null; token: string } | null) {
		if (!payload || !payload.user) return null;
		return {
			_id: payload.user.id,
			email: payload.user.email,
			token: payload.token,
		};
	}

	/**
	 * User Update Response
	 *
	 * @param payload
	 * @returns
	 */
	public update(payload: S_User | null) {
		if (!payload) return null;
		return {
			_id: payload.id,
			username: payload.username,
			email: payload.email,
			wallet_address: payload.wallet_address,
		};
	}

	/**
	 * User Update Password Response
	 *
	 * @param payload
	 * @returns
	 */
	public updatePassword(payload: S_User | null) {
		if (!payload) return null;
		return {
			_id: payload.id,
		};
	}

	/**
	 * User Update Role Response
	 *
	 * @param payload
	 * @returns
	 */
	public updateRole(payload: S_User | null) {
		if (!payload) return null;
		return {
			_id: payload.id,
			roles: payload.roles,
		};
	}

	/**
	 * User List Response
	 *
	 * @param payload
	 * @returns
	 */
	public list(payload: S_User[] | null) {
		if (payload === null) return null;
		if (payload.length === 0) return [] as S_User[];
		return payload;
	}
}
