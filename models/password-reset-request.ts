import {employee} from './user';

export interface PasswordResetRequest {
    userId: employee['emp_id'];
    token: string;
    tokenExpiry: number
}