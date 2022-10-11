import Api from './Api';
import { NotifyEmailProps, NotifyEmailResponse, ErrorType } from '../types';
import { validateEmail } from '../lib/validations';
import ErrorHandler from './ErrorHandler';

export const notifyEmail = async ({ email }: NotifyEmailProps): Promise<NotifyEmailResponse | ErrorType> => {
    if (!validateEmail(email)) {
        return ErrorHandler.BAD_REQUEST;
    }

    try {
        const data = await Api.post("/notify-email", { body: { email } });
        window.theFittingRoom.closeModal();

        return {id: data.id, email: data.email};
    } catch (error) {
        return ErrorHandler.BAD_REQUEST;
    }
}
