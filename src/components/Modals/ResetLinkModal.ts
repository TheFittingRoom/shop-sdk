import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { ResetLinkModalProps } from "../../types";

const ResetLinkModal = ({override}: ResetLinkModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, backToSignIn, associatedEmail } = Strings;

    return `
        <div class="tfr-modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
            <div class="tfr-modal-content-container tfr-pb-7-p tfr-pt-20 tfr-pr-20 tfr-pl-20">
                <div class="tfr-close-container" onclick="window.theFittingRoom.closeModal()">
                    <span class="tfr-close tfr-cursor">&times;</span>
                </div>

                <div class="tfr-modal-content">
                    <div class="tfr-modal-title-logo-container">
                        <div class="tfr-poppins-light-24-300 tfr-c-dark tfr-mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div class="tfr-poppins-regular-20-default tfr-c-dark tfr-mt-15-p tfr-mb-13-p tfr-w-80-p tfr-m-h-auto">${associatedEmail}</div>
                </div>

                <div class="tfr-t-a-center">
                    <span class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mr-20" onclick="window.theFittingRoom.renderSignInModal()">${backToSignIn}</span>
                </div>
            </div>
        </div>
    `;
}

export default ResetLinkModal;
