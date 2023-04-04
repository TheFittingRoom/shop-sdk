import { UIError } from "../api/UIError";
import { ModalManager } from "../components/Modals/ModalManager";

function GetVarName(variable: Object) { return Object.keys(variable)[0]; }

export interface ModalContent {
    Body: () => string;
    Hook(): void;
    Unhook(): void;
}

export interface ModalProps {
    title: string;
}

export interface SignInParams {
    email: string,
    password: string;
}
export interface SignInModalProps extends ModalProps {
    email: string,
    onSignIn: (email: string, password: string) => void;
    onNavForgotPassword: (email?: string) => void;
    onNavScanCode: () => void;
}
export interface ForgotPasswordModalProps extends ModalProps {
    email: string;
    onNavSignIn: (email: string) => void;
    onPasswordReset: (email: string) => void;
};
export interface NoAvatarModalProps extends ModalProps {
    //
};
export interface LoadingAvatarModalProps extends ModalProps {
};
export interface ErrorModalProps extends ModalProps {
    error: string,
    onNavBack: () => void;
    onClose: () => void;
    sizes?: {
        recommended: string,
        optionalSizes: string[];
    };
};
export interface ResetLinkModalProps {
    //
};
export interface ScanCodeModalProps extends ModalProps {
    //
};
export interface EnterEmailModalProps {
};

export interface LoggedOutModalProps {
    onClose: () => void;
    onNavSignIn: (email: string) => void;
};

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
