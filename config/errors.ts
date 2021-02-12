const errors = {
	userNotFound: 'userNotFound',
	emailNotVerified: 'emailNotVerified',
	invalidPassword: 'invalidPassword',
	invalidEmail: 'invalidEmail',
	invalidUsername: 'invalidUsername',
	passwordTooWeak: 'passwordTooWeak',
	wrongParameters: 'wrongParameters',
	unauthorized: 'unauthorized',
	expired: 'expired',
	unprivileged: 'unprivileged',
	serverError: 'serverError',
	emailTaken: 'emailTaken',
	usernameTaken: 'usernameTaken',
	tokenNotFound: 'tokenNotFound',
	tokenExpired: 'tokenExpired',
	notFound: 'notFound',
	resourceExists: 'resourceExists',
	resourceDoesNotExist: 'resourceDoesNotExist',
	profileNotFound: 'profileNotFound'
};

export default errors;

export const messages: { [index: string]: string } = {
	userNotFound: 'The document you are looking for is either deleted or has been moved. Please check your link again',
	emailNotVerified: 'Your email address is not verified',
	invalidPassword: 'Your password seems to be incorrect',
	invalidEmail: 'Your email address is not valid',
	invalidUsername: 'Your username is not valid',
	passwordTooWeak: 'Your password is too weak. Please choose a stronger password',
	wrongParameters: 'An internal error occurred. This incident has been reported',
	unauthorized: 'An error occurred. If this persists, please contact the administrator',
	expired: 'An error occurred. If this persists, please try logging in again',
	unprivileged: 'You do not have the permission to perform that action',
	serverError: 'An internal server error has occurred. Please try again later',
	emailTaken: 'Sorry. That email address is already in use.',
	usernameTaken: 'Sorry. That username is taken.',
	tokenNotFound: 'Your link seems to be invalid. Please request for a new link again',
	tokenExpired: 'Your link has expired. Please request for a new link again',
	notFound: 'That route doesn\'t seem to exist',
	resourceExists: 'That resource already exists',
	resourceDoesNotExist: 'That resource doesn\'t seem to exist',
	profileNotFound: 'The profile doesn\'t seem to exist'
};