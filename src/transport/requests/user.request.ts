import {
	IsString,
	IsNotEmpty,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	ValidationOptions,
	registerDecorator,
	MinLength,
	Matches,
	IsEmail,
	MaxLength,
	IsArray,
	ArrayNotEmpty,
	ArrayUnique,
	IsIn,
	IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { T_UserRole } from '@/shared/types';
import { Constant } from '@/shared/constants';

@ValidatorConstraint({ name: 'matchPasswordsConstraint', async: false })
class MatchPasswordsConstraint implements ValidatorConstraintInterface {
	validate(password_confirmation: string, args: ValidationArguments) {
		const [relatedPropertyName] = args.constraints;
		const password = (args.object as any)[relatedPropertyName];
		return password === password_confirmation;
	}

	defaultMessage(args: ValidationArguments) {
		return 'Passwords do not match';
	}
}

function MatchPasswords(
	property: string,
	validationOptions?: ValidationOptions,
) {
	return (object: any, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [property],
			validator: MatchPasswordsConstraint,
		});
	};
}

export class UserRegisterRequestBody {
	@IsString()
	@IsNotEmpty()
	@IsEmail({}, { message: 'Email must be a valid email address' })
	email!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@Matches(/(?=.*[a-z])/, {
		message: 'Password must contain at least one lowercase letter',
	})
	@Matches(/(?=.*[A-Z])/, {
		message: 'Password must contain at least one uppercase letter',
	})
	@Matches(/(?=.*\d)/, {
		message: 'Password must contain at least one number',
	})
	@Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
		message: 'Password must contain at least one special character',
	})
	password!: string;

	@IsString()
	@IsNotEmpty()
	@MatchPasswords('password')
	password_confirmation!: string;
}

export class UserLoginRequestBody {
	@IsString()
	@IsNotEmpty()
	@IsEmail({}, { message: 'Email must be a valid email address' })
	email!: string;

	@IsString()
	@IsNotEmpty()
	password!: string;
}

export class UserUpdateRequestBody {
	@IsString()
	@IsNotEmpty()
	@MinLength(3, { message: 'Username must be at least 3 characters long' })
	@MaxLength(16, {
		message: 'Username must be not exceed 16 characters long',
	})
	username!: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail({}, { message: 'Email must be a valid email address' })
	email!: string;

	@IsString()
	wallet_address!: string;
}

export class UserUpdatePasswordRequestBody {
	@IsString()
	@IsNotEmpty()
	password!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@Matches(/(?=.*[a-z])/, {
		message: 'Password must contain at least one lowercase letter',
	})
	@Matches(/(?=.*[A-Z])/, {
		message: 'Password must contain at least one uppercase letter',
	})
	@Matches(/(?=.*\d)/, {
		message: 'Password must contain at least one number',
	})
	@Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
		message: 'Password must contain at least one special character',
	})
	new_password!: string;

	@IsString()
	@IsNotEmpty()
	@MatchPasswords('new_password')
	new_password_confirmation!: string;
}

export class UserUpdateRolesRequestParams {
	@IsString()
	@IsNotEmpty()
	id!: string;
}

export class UserUpdateRolesRequestBody {
	@IsArray()
	@ArrayNotEmpty()
	@ArrayUnique()
	@IsIn(Constant.user.ROLES, { each: true })
	roles!: T_UserRole[];
}

export class UserListRequestQuery {
	@IsString()
	keyword!: string;

	@Transform(({ value }) => {
		if (
			value === 'username' ||
			value === 'email' ||
			value === 'updated_at'
		) {
			return value;
		} else return 'created_at';
	})
	@IsString()
	sort_by!: 'username' | 'email' | 'created_at' | 'updated_at';

	@Transform(({ value }) => (value === 'asc' ? 1 : -1))
	@IsNumber()
	sort!: 1 | -1;

	@Transform(({ value }) => {
		const val = Number(value);
		if (val) {
			return val < 1 ? 1 : val;
		} else {
			return 1;
		}
	})
	@IsNumber()
	page!: number;

	@Transform(({ value }) => {
		const val = Number(value);
		if (val) {
			return val < 1 ? 1 : val;
		} else {
			return 10;
		}
	})
	@IsNumber()
	per_page!: number;
}
