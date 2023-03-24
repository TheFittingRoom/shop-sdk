import { ModalManager } from "../components/Modals/ModalManager";

function GetVarName(variable: Object) { return Object.keys(variable)[0]; }

export interface ModalContent {
    Title: string;
    Body: () => string;
    Hook(): void;
    Unhook(): void;
}

export interface ModalProps{
    manager: ModalManager;
    title: string;
}
export interface EnterEmailModalProps {
    Error: string;
};
export interface ForgotPasswordModalProps {
    //
};
export interface NoAvatarModalProps {
    //
};
export interface LoadingAvatarModalProps {
    //
};
export interface ErrorModalProps extends ErrorType {
    error: string,
    sizes?: {
        recommended: string,
        optionalSizes: string[];
    };
};
export interface ResetLinkModalProps {
    //
};
export interface ScanCodeModalProps {
    //
};
export interface SignInModalProps extends ModalProps {
    email: string,
    password: string;
    onSignIn: (email: string, password: string) => void;
    onForgotPassword: (email?: string) => void;
    onScanCode: () => void;
}
export interface SuccessModalProps {
    //
};
export interface SignInParams {
    email: string,
    password: string;
}
export interface RecommendedSizeParams {
    sku: string,
}

export interface SignInResponse {}
export interface PasswordResetEmailProps {
    email: string;
}
export interface TryOnTheFittingRoomProps {
    sku: any,
}

export type VirtualTryOnFramesResponse = string[];
export interface GetRecommendedSizeProps {
    sku: any,
}
export interface GetRecommendedSizesResponse {
    recommended: string,
    optionalSizes: string[];
}
export interface DownloadLinkEmailProps {
    email: string;
}

export interface ProfileResponse {
    hasAvatar: boolean;
}

export type TryOnFrames = string[];

export type ErrorType = {
    code: number | null,
    errorMessage: string;
};

export enum Response {
    SUCCESS = 'success',
    NO_AVATAR = 'no_avatar'
}

export enum AvatarState {
    NOT_CREATED = 'NOT_CREATED',
    CREATED = 'CREATED',
    PENDING = 'PENDING'
}
