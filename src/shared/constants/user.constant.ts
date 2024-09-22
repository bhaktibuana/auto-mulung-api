import { T_UserRole } from '@/shared/types';

export class UserConstant {
	public readonly ROLES: T_UserRole[] = ['admin', 'tester', 'airdrop_free'];
	public readonly ROLE_ADMIN: T_UserRole = 'admin';
	public readonly ROLE_TESTER: T_UserRole = 'tester';
	public readonly ROLE_AIRDROP_FREE: T_UserRole = 'airdrop_free';
}
