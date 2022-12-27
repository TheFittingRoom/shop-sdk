interface ModalProps {
    override?: any
}
export interface EnterEmailModalProps extends ModalProps {
    // 
};
export interface ForgotPasswordModalProps extends ModalProps {
    // 
};
export interface NoAvatarModalProps extends ModalProps {
    // 
};
export interface LoadingAvatarModalProps extends ModalProps {
    // 
};
export interface ErrorModalProps extends ModalProps {
    errorText?: string
    sizes?: {
        recommended: string,
        optionalSizes: string[]
    };
};
export interface ResetLinkModalProps extends ModalProps {
    // 
};
export interface ScanCodeModalProps extends ModalProps {
    // 
};
export interface SignInModalProps extends ModalProps {
    imgUrl?: string
};
export interface SuccessModalProps extends ModalProps {
    // 
};
export interface SignInParams {
    email: string,
    password: string
}
export interface RecommendedSizeParams {
    sku: string,
}
export interface SignInProps {
    email: string,
    password: string
}

export interface SignInResponse { }
export interface PasswordResetEmailProps {
    email: string
}
export interface GetVirtualTryOnFramesProps {
    sku: string,
    size: string,
    backgroundColor: string
}

export type GetVirtualTryOnFramesResponse = string[];
export interface GetRecommendedSizeProps {
    sku: string,
}
export interface GetRecommendedSizesResponse {
    recommended: string,
    optionalSizes: string[]
}
export interface DownloadLinkEmailProps {
    email: string
}

export interface ProfileResponse {
    hasAvatar: boolean
}

export type ErrorType = {
    code: number | null,
    errorMessage: string
}
