import { ModalContent, TfrLogo } from "../../types";
import { L } from "../../api/Locale";

interface ModalManager {
	Open(content: ModalContent): void;
	Close(): void;
	Content(): ModalContent;
}

const InitModalManager = (elementID: string): ModalManager => {
	const modal = document.getElementById(elementID);
	if (!modal) {
		throw new Error(`element with id ${elementID} not found`);
	}

	let previousContent: ModalContent;

	const renderBody = (modalBody: string) => {
		return `
        <div class="tfr-modal" id="tfr-modal-background">
            <div class="tfr-modal-content-container tfr-p-20">
                <div class="tfr-close-container">
                    <span id="tfr-close-container" class="tfr-close tfr-cursor">&times;</span>
                </div>

                <div class="tfr-modal-content tfr-pt-20 tfr-pb-50">
                    <div class="tfr-modal-title-logo-container">
                        <div tfr-element="true" class="tfr-title-font tfr-light-24-300 tfr-c-dark tfr-mr-10">${L.VirtualTryOnWith}</div>
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
	};

	const Open = (content: ModalContent) => {
		if (previousContent) {
			previousContent.Unhook();
		}
		modal.innerHTML = renderBody(content.Body());
		hook();
		content.Hook();
		modal.style.display = "block";
		previousContent = content;
	};

	const Close = () => {
		if (previousContent) {
			previousContent.Unhook();
			unhook();
		}
		modal.style.display = "none";
	};

	const EscClose = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			Close();
		}
	};

	const ContainerClose = (e: MouseEvent) => {
		const background = modal.querySelector("#tfr-modal-background");
		if (e.target === background) {
			console.log("container close")
			Close();
		}
	};

	const hook = () => {
		modal.querySelector("#tfr-close-container").addEventListener("click", Close);
		document.addEventListener("keydown", EscClose);
		document.addEventListener("click", ContainerClose);
	};

	const unhook = () => {
		let closeLink = modal.querySelector("#tfr-close-container")
		if (closeLink) {
			closeLink.removeEventListener("click", Close);
		} else {
			console.error("#tfr-close-container not found on unhook")
			console.debug(document.getElementById(elementID)?.innerHTML)
		}
		document.removeEventListener("keydown", EscClose);
		document.removeEventListener("click", ContainerClose);
	};

	const Content = () => {
		return previousContent;
	};

	return {
		Open,
		Close,
		Content
	};
};


export { InitModalManager, ModalManager };
