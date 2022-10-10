import Api from './Api';
import { VerifyEmailProps, VerifyEmailResponse } from '../types';
import { validateEmail } from '../lib/validations';

export const verifyEmail = async ({ email }: VerifyEmailProps): Promise<VerifyEmailResponse | string | void> => {
    if (!validateEmail(email)) {
        return "Not a valid email";
    }

    try {
        await Api.post("/verify-email", { body: { email } });
        window.theFittingRoom.closeModal();
    } catch (error) {
        return "Invalid email";
        // throw new Error(error);
    }
}
