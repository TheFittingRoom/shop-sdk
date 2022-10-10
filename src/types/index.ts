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
export interface NoSizeAvailableModalProps extends ModalProps {
    sizes: {
        recommended: string[],
        optionalSizes: string[]
    }
};
export interface ResetLinkModalProps extends ModalProps {
    // 
};
export interface ScanCodeModal1Props extends ModalProps {
    // 
};
export interface ScanCodeModal2Props extends ModalProps {
    // 
};
export interface ScanCodeModal3Props extends ModalProps {
    // 
};
export interface SignInModalProps extends ModalProps {
    // 
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

export interface VerifyEmailProps {
    email: string
}
export interface VerifyEmailResponse { 
    id: number,
    email: string
}
