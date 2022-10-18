import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { ResetLinkModalProps } from "../../types";

const ResetLinkModal = ({override}: ResetLinkModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, backToSignIn, associatedEmail } = Strings;

    return `
        <div class="modal">
            <div class="modal-content-container pt-7-p pb-7-p pr-20 pl-20">
                <div class="modal-content">
                    <div class="modal-title-logo-container">
                        <div class="poppins-light-24-300 c-dark mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div class="poppins-regular-20-default c-dark mt-15-p mb-13-p w-80-p m-h-auto">${associatedEmail}</div>
                </div>

                <div class="t-a-center">
                    <span class="roboto-16-default c-dark-o5 underline cursor mr-20" onclick="window.theFittingRoom.renderSignInModal()">${backToSignIn}</span>
                </div>
            </div>
        </div>
    `;
}

export default ResetLinkModal;
