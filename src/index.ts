import Auth from './classes/Auth';
import { FirebaseInstance } from './classes/Firebase';
import { TheFittingRoomInit } from './classes/Initialization';
import { Locale } from './classes/Locale';
import { getRecommendedSizes } from './classes/Sizes';
import { getVirtualTryOnFrames } from './classes/VirtualTryOnFrames';
import { notifyEmail } from './classes/Email';
import { initializeModal, closeModal, validate } from './components';
import {
    renderNoAvatarModal,
    renderSignInModal,
    renderForgotPasswordModal,
    renderScanCodeModal,
    renderEnterEmailModal,
    renderErrorModal,
    renderSuccessModal,
    renderResetLinkModal,
} from './lib/previewModal';
import { getProfile } from './classes/Profile';

declare global {
    interface Window {
        theFittingRoom: any;
    }
}

// User current script for params
let currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
})();

window.addEventListener('load', () => {
    initializeModal();
    new FirebaseInstance();
    const instance = new TheFittingRoomInit(currentScript);

    // Public
    window.theFittingRoom = {
        ...instance,
        _internal: {
            signIn: Auth.signIn
        },
        // Auth
        sendPasswordResetEmail: Auth.sendPasswordResetEmail,
        signOut: Auth.signOut,
        isLoggedIn: Auth.isLoggedIn,
        // Sizes
        getRecommendedSizes,
        // Avatar
        getVirtualTryOnFrames,
        getProfile,
        notifyEmail,
        // Language service
        getLocale: Locale.getLocale,
        setLocale: Locale.setLocale,
        // Modals
        renderNoAvatarModal,
        closeModal,
        renderSignInModal,
        renderForgotPasswordModal,
        renderScanCodeModal,
        renderEnterEmailModal,
        renderErrorModal,
        renderSuccessModal,
        renderResetLinkModal,
        validate,
    }
});
