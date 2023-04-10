import { TfrLogo } from "../../Modals/svgUrl";
import { ModalContent } from "../../types";
import { L } from "../../api/Locale";

interface ModalManager{
	Open(content: ModalContent): void;
	Close(): void;
	Content(): ModalContent;
}

const InitModalManager = (elementID: string): ModalManager => {
	const element = document.getElementById(elementID);
	if (!element) {
		throw new Error(`element with id ${elementID} not found`);
	}
	let previousContent: ModalContent;

	const renderBody = (modalBody: string) => {
		return `
        <div class="tfr-modal" id="modalContainer">
            <div class="tfr-modal-content-container tfr-p-20">
                <div class="tfr-close-container">
                    <span id="tfr-close" class="tfr-close tfr-cursor">&times;</span>
                </div>

                <div class="tfr-modal-content tfr-pt-20 tfr-pb-50">
                    <div class="tfr-modal-title-logo-container">
                        <div tfr-element="true" class="tfr-poppins-light-24-300 tfr-c-dark tfr-mr-10">${L.VirtualTryOnWith}</div>
                        <div>
                            <object data="tfr-logo.svg" type="image/svg+xml">
                                <img src="${TfrLogo}" />
                            </object>
                        </div>
                    </div>
										${modalBody}
                </div>
            </div>
        </div>
    `;
	}

	const Open = (content: ModalContent) => {
		if (previousContent) {
			previousContent.Unhook();
		}
		element.innerHTML = renderBody(content.Body());
		hook()
		content.Hook();
		element.style.display = "block";
		previousContent = content
	}

	const Close = () => {
		unhook();
		previousContent.Unhook();
		element.style.display = "none";
	};

	const hook = () => {
		element.querySelector("#tfr-close").addEventListener("click", Close);
	};

	const unhook = () => {
		element.querySelector(".tfr-close-container").removeEventListener("click", Close);
	};

	const Content = () => {
		return previousContent;
	}

	return {
		Open,
		Close,
		Content
	}
}


	export {InitModalManager, ModalManager};
