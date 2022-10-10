import Auth from './classes/Auth';
import { FirebaseInstance } from './classes/Firebase';
import { TheFittingRoomInit } from './classes/Initialization';
import { Locale } from './classes/Locale';
import { getRecommendedSizes } from './classes/Sizes';
import { getVirtualTryOnFrames } from './classes/VirtualTryOnFrames';
import { verifyEmail } from './classes/Email';
import { initializeModal, closeModal, validate } from './components';
import {
    renderNoAvatarModal,
    renderSignInModal,
    renderForgotPasswordModal,
    renderScanCodeModal1,
    renderScanCodeModal2,
    renderScanCodeModal3,
    renderEnterEmailModal,
    renderNoSizeAvailableModal,
    renderSuccessModal,
    renderResetLinkModal,
} from './lib/previewModal';

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
        // Auth
        Auth,
        // Sizes
        getRecommendedSizes,
        // Avatar
        getVirtualTryOnFrames,
        verifyEmail,
        // Language service
        getLocale: Locale.getLocale,
        setLocale: Locale.setLocale,
        // Modals
        renderNoAvatarModal,
        closeModal,
        renderSignInModal,
        renderForgotPasswordModal,
        renderScanCodeModal1,
        renderScanCodeModal2,
        renderScanCodeModal3,
        renderEnterEmailModal,
        renderNoSizeAvailableModal,
        renderSuccessModal,
        renderResetLinkModal,
        validate,
    }
});
