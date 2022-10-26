import Auth from './classes/Auth';
import { FirebaseInstance } from './classes/Firebase';
import { TheFittingRoomInit } from './classes/Initialization';
import { Locale } from './classes/Locale';
import { getRecommendedSizes } from './classes/Sizes';
import { getVirtualTryOnFrames } from './classes/VirtualTryOnFrames';
import { initializeModal, closeModal, validate } from './components';
import {
    renderNoAvatarModal,
    renderSignInModal,
    renderForgotPasswordModal,
    renderScanCodeModal,
    renderErrorModal,
    renderSuccessModal,
    renderResetLinkModal,
} from './lib/previewModal';
import { getProfile } from './classes/Profile';
import { tryOnWithTheFittingRoom } from './classes/TryOnWithTheFittingRoom';

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
            signIn: Auth.signIn,
            sendPasswordResetEmail: Auth.sendPasswordResetEmail,
            validate,
        },
        // Auth
        isLoggedIn: Auth.isLoggedIn,
        signOut: Auth.signOut,
        // Sizes
        getRecommendedSizes,
        // Avatar
        getVirtualTryOnFrames,
        getProfile,
        // Language service
        getLocale: Locale.getLocale,
        setLocale: Locale.setLocale,
        // Modals
        closeModal,
        renderNoAvatarModal,
        renderSignInModal,
        renderForgotPasswordModal,
        renderScanCodeModal,
        renderErrorModal,
        renderSuccessModal,
        renderResetLinkModal,
        tryOnWithTheFittingRoom,
    }
});
