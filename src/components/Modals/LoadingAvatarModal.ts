import { L } from "../../api/Locale";
import { ModalContent } from "../../types";
import { LoadingAvatarModalProps } from "../../types";

const LoadingAvatarModal = (props:LoadingAvatarModalProps): ModalContent => {

    function startProgressBar(milliseconds, progressBar) {
        let percentCount = 0;
        let millisecondStep = milliseconds / 200;
        progressBar.style.width = percentCount + "%";
        const id = setInterval(() => {
            if (percentCount >= 100) {
                clearInterval(id);
            }
            else {
                percentCount += 0.5;
                progressBar.style.width = percentCount + "%";
            }
        }, millisecondStep);
    }

    const Hook = () => {
        let progressBar = document.querySelector(".progress-bar-fill");
        startProgressBar(props.timeoutMS, progressBar);
    }

    const Unhook = () => {

    }

    const Body = () => {
        return `
        <div tfr-element="true" class="tfr-title-font tfr-light-22-300 tfr-c-dark tfr-mt-60" > ${L.LoadingAvatar} </div>
        <div class="progress-bar">
            <span class="progress-bar-fill"></span>
        </div>
        `;
    }

    return {
        Hook,
        Unhook,
        Body
    }
}

export default LoadingAvatarModal;
