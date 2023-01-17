import { ErrorType } from "../types";
import { virtualTryOnFrames } from "./VirtualTryOnFrames";

export const tryOnWithTheFittingRoom = async ({ sku }): Promise<ErrorType | void> => {
    if (window.theFittingRoom.isLoggedIn()) {
        const data = await virtualTryOnFrames({ sku });

        return data;
    } else {
        window.theFittingRoom.renderSignInModal();
    }
}
