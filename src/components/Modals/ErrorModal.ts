import { Locale } from "../../classes/Locale";
import { TfrLogo } from "../../lib/svgUrl";
import { ErrorModalProps } from "../../types";

const ErrorModal = ({override, errorText, sizes}: ErrorModalProps) => {
    const { Strings } = override || Locale.getLocale();
    const { title, noSizeAvailable, trySize, orSize, somethingWentWrong, returnToProductPage, returnToCatalogPage, somethingIsWrongWithThisUser } = Strings;

    const sizeText = `${noSizeAvailable} ${trySize} ${sizes?.recommended} ${orSize} ${sizes?.optionalSizes?.join(", ")}.`;
    let errorMsg = errorText || (Boolean(sizes?.recommended) && `${sizeText}`) || somethingWentWrong;

    if (errorMsg.toLocaleLowerCase() === 'user not found') {
        errorMsg = somethingIsWrongWithThisUser;
    }

    return `
        <div class="tfr-modal" id="modalContainer" onclick="window.theFittingRoom.closeModal(true)">
            <div class="tfr-modal-content-container tfr-pb-7-p tfr-pt-20 tfr-pr-20 tfr-pl-20">
                <div class="tfr-close-container" onclick="window.theFittingRoom.closeModal()">
                    <span class="tfr-close tfr-cursor">&times;</span>
                </div>

                <div class="tfr-modal-content">
                    <div class="tfr-modal-title-logo-container">
                        <div tfr-element="true" class="tfr-poppins-light-24-300 tfr-c-dark tfr-mr-10">${title}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>

                    <div class="tfr-mt-15-p tfr-mb-13-p">
                        <div tfr-element="true" class="tfr-poppins-regular-20-default tfr-c-dark">${errorMsg}</div>
                    </div>

                    <div class="tfr-t-a-center">
                        <span tfr-element="true" class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor tfr-mr-20" onclick="window.history.back()">${returnToCatalogPage || "Return to Catalog Page"}</span>
                        <span tfr-element="true" class="tfr-roboto-16-default tfr-c-dark-o5 tfr-underline tfr-cursor" id="returnToSite" onclick="window.theFittingRoom.closeModal()">${returnToProductPage || "Return to Product Page"}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export default ErrorModal;
