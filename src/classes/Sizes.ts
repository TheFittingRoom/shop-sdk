import { ErrorType, GetRecommendedSizeProps, GetRecommendedSizesResponse } from "../types";
import Api from './Api';
import ErrorHandler from "./ErrorHandler";
import { Locale } from "./Locale";

const { Strings } = Locale.getLocale();
const { getRecommendedSizesErrorText } = Strings;

export const getRecommendedSizes = async ({ sku }: GetRecommendedSizeProps): Promise<GetRecommendedSizesResponse | ErrorType> => {
    try {
        const data = await Api.get(`/get-sizes/${sku}`);

        return data;
    } catch (error) {
        const {code, message} = error;
        const errorMsg = (message?.recommended && message?.optionalSizes?.length) ? {sizes: message} : {errorText: getRecommendedSizesErrorText};
        window.theFittingRoom.renderErrorModal(errorMsg);
        return ErrorHandler.getError(code);
    }
}
