import * as firebase from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { Firestore } from "firebase/firestore";
import * as responses from "../api/responses";
import * as errors from "../api/errors";

export const TfrLogo = process.env.ASSETS_URL + "/tfr-logo.svg";
export const AposeLogo = process.env.ASSETS_URL + "/apose-logo.svg";
export const AppStoreLogo = process.env.ASSETS_URL + "/app-store-logo.svg";
export const QrCodeLogo = process.env.ASSETS_URL + "/qr-code-logo.svg";

export const NotLoggedIn = new Error('user not logged in');
export const NoFramesFound = new Error('No frames found for this colorway');
export const NoColorwaySizeAssetsFound = new Error('No colorway size assets found');
export const NoStylesFound = new Error('No styles found');

export interface RecommendedAvailableSizes {
    error: string;
    recommended_size: string;
    available_sizes: string[];
}
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
    User: () => FirebaseUser;
    AwaitAvatarCreated: () => Promise<void>;
    AwaitColorwaySizeAssetFrames: (colorwaySizeAssetSKU: string) => Promise<TryOnFrames>;
    GetColorwaySizeAssetFrames: (colorwaySizeAssetSKU: string) => Promise<TryOnFrames>;
    TryOn: (colorwaySizeAssetSKU: string) => Promise<TryOnFrames | Promise<TryOnFrames>>;
    GetRecommendedSizes(BrandStyleID: string): Promise<responses.SizeRecommendation | errors.ErrorResponse>;

    GetStyles: (ids: number[]) => Promise<Map<number, FirestoreStyle>>;
    GetColorwaySizeAssets: (style_id?: number, skus?: string[]) => Promise<Map<number, FirestoreColorwaySizeAsset>>;
    RequestColorwaySizeAssetFrames(colorwayID: number): Promise<void>;
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
    onSignIn: (email: string, password: string, validationError: (message: string) => void) => void;
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
        available: string[];
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

export type FirestoreColorwaySizeAsset = {
    id: number;
    size_id: number;
    style_id: number;
    colorway_id: number;
    colorway_name: string;
    sku: string;
};

export type FirestoreGarmentMeasurement = {
    id: number;
    garment_measurement_location: string;
    tolerance: number;
    value: number;
};

export type FirestoreSize = {
    id: number;
    size: string;
    label: string;
    size_system: string;
    size_value_id: string;
    garment_measurements: Map<string, FirestoreGarmentMeasurement>;
};

export type FirestoreColorway = {
    id: number;
    name: string;
}

export type FirestoreStyle = {
    id: number;
    brand_id: number;
    brand_style_id: string;
    name: string;
    description: string;
    garment_category: string;
    is_published: boolean;
    sale_type: string;
    colorways: {[key:number]: FirestoreColorway};
    sizes: {[key:number]: FirestoreSize};
}
