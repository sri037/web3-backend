/**
 * @me
 * User Interface
 */
export interface UserDocument {
    _id?: any;
    email?: string;
    password?: string;
    salt?: string;
    registration_type?: string;
    verificationToken?: string;
    roles?: Roles;
    active?: boolean;
    verified?: boolean;
    resetPasswordToken?: string;
    resetPasswordExpires?: string;
    created?: Date;
    updated?: Date;
    isUserLoggedIn?: boolean;
    failedLoggedInCount?: number;
    lastLoggedInDate?: Date;
    departed?: boolean;
}

/**
 * @me
 * Enum for roles
 */
export enum Roles {
    admin = 'admin',
    guest = 'guest'
}
