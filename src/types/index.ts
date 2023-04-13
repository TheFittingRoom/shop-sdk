import * as firebase from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import {DocumentData } from "firebase/firestore";
import { Firestore } from "firebase/firestore";
import * as responses from "../api/responses";
import * as errors from "../api/errors";

export const NotLoggedIn = new Error('user not logged in');

export interface Firebase {
    App: firebase.FirebaseApp;
    Auth: firebaseAuth.Auth;
    Firestore: Firestore;
}

export interface FirebaseInstance {
    Firebase: Firebase,
    SendPasswordResetEmail(email: string): Promise<void>;
    ConfirmPasswordReset(code: string, newPassword: string): Promise<void>;
    Login(email: string, password: string, onSignout: () => void): Promise<FirebaseUser>;
    User(onSignout: () => void): Promise<FirebaseUser>;
}

export interface FirebaseUser {
    User: firebaseAuth.User | null;
    FirebaseInstance: Firebase;
    EnsureLogin: () => void;
    ID: () => string;
    Token: () => Promise<string>;
    GetUserProfile: () => Promise<DocumentData | null>;
    SignOut: () => Promise<void>;
}

export interface Shop {
    LookupColorwayIDBySKU: (colorwaySKU: string, styles: FirebaseStyles) => number | undefined;
    User: () => FirebaseUser;
    AwaitAvatarCreated: () => Promise<void>;
    AwaitColorwayFrames: (colorwaySKU: string) => Promise<TryOnFrames>;
    GetColorwayFrames: (colorwaySKU: string) => Promise<TryOnFrames>;
    TryOn: (colorwaySKU: string) => Promise<TryOnFrames>;
    GetRecommendedSizes(BrandStyleID: string): Promise<responses.SizeRecommendation | errors.ErrorResponse>;

    GetStyles: () => Promise<FirebaseStyles>;
    RequestColorwayFrames(colorwayID: number): Promise<void>;
}

export interface ModalContent {
    Body: () => string;
    Hook(): void;
    Unhook(): void;
}

export interface ModalProps {
}

export interface SignInParams {
    email: string,
    password: string;
}
export interface SignInModalProps extends ModalProps {
    email: string,
    onSignIn: (email: string, password: string, validationError: (message: string) => void ) => void;
    onNavForgotPassword: (email?: string) => void;
    onNavScanCode: () => void;
}
export interface ForgotPasswordModalProps extends ModalProps {
    email: string;
    onNavSignIn: (email: string) => void;
    onPasswordReset: (email: string) => void;
};
export interface NoAvatarModalProps extends ModalProps {};
export interface LoadingAvatarModalProps extends ModalProps {};
export interface ErrorModalProps extends ModalProps {
    error: string,
    onNavBack: () => void;
    onClose: () => void;
};

export interface SizeErrorModalProps {
    onNavBack: () => void;
    onClose: () => void;
    sizes?: {
        recommended: string,
        avaliable: string[];
    };
}

export interface ResetLinkModalProps {
    onNavSignIn: (email: string) => void;
};
export interface ScanCodeModalProps extends ModalProps {
    //
};
export interface LoggedOutModalProps {
    onClose: () => void;
    onNavSignIn: (email: string) => void;
};

export type TryOnFrames = string[];

export enum AvatarState {
    NOT_CREATED = 'NOT_CREATED',
    CREATED = 'CREATED',
    PENDING = 'PENDING'
}

export type FirebaseStyles = Map<string, {
    id: number;
    brand_id: number;
    brand_style_id: string;
    name: string;
    description: string;
    garment_category: string;
    is_published: boolean;
    sale_type: string;
    colorways: [{ id: number, name: string; }];
    sizes: Map<number, {
        id: number;
        size: string;
        size_system: string;
        size_value_id: string;
        colorways_size_assets: [{
            id: number;
            sku: string;
            colorway: {
                id: number;
                name: string;
            };
        }],
        garment_measurements: Map<string, {
            tolerance: number;
            value: number;
        }>;
    }>;
}>;
