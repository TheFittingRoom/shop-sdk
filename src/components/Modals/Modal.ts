import {ModalManager} from "./ModalManager";
import {L} from "../../api/Locale";

class Modal {
  Title: string;
  ModalTitle: string;
  Manager: ModalManager;

  constructor(title: string) {
    this.Title = title;
  }

  Hook(): void {}
  Unhook(): void {}
  Body() {
    return '';
  }
}

export default Modal;
