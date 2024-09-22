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
} from 'class-validator';

@ValidatorConstraint({ async: false })
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
