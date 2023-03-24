import { TfrLogo } from "../../Modals/svgUrl";
import { ModalContent } from "../../types";
import { L } from "../../api/Locale";

class ModalManager {
	element: HTMLElement;
	content: ModalContent;
	private constructor(elementID: string) {
		this.element = document.getElementById(elementID);
		if (!this.element) {
			throw new Error(`element with id ${elementID} not found`);
		}
	}
	Open(content: ModalContent) {
		if(this.content){
			this.content.Unhook();
		}
		this.content = content;
		this.element.innerHTML = this.RenderBody(this.content.Title, this.content.Body());
		this.Hook();
		this.element.style.display = "block";
		this.content.Hook();
	}

	Close() {
		this.element.style.display = "none";
		this.content.Unhook();
	}

	Hook() {
		// this.element.querySelector(".tfr-modal").addEventListener("click", this.Close);
		this.element.querySelector("#tfr-close").addEventListener("click",  this.Close);
	}

	Unhook() {
		// this.element.querySelector(".tfr-modal").removeEventListener("click", this.Close);
		this.element.querySelector(".tfr-close-container").removeEventListener("click", this.Close);
	}

	 RenderBody(title: string, modalBody: string) {
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

                    <div tfr-element="true" class="tfr-poppins-light-22-300 tfr-c-dark tfr-w-85-p tfr-m-h-auto mt-40">${title}</div>
										${modalBody}
                </div>
            </div>
        </div>
    `;
	}
}

export {ModalManager};
