import { ErrorType, GetRecommendedSizeProps, GetRecommendedSizesResponse } from "../types";
import Api from './Api';
import ErrorHandler from "./ErrorHandler";
// import { Locale } from "./Locale";

// const { Strings } = Locale.getLocale();
// const { getRecommendedSizesErrorText } = Strings;

export const getRecommendedSizes = async ({ id }: GetRecommendedSizeProps): Promise<GetRecommendedSizesResponse | ErrorType> => {
    try {

        console.log("id:: ", id)

        const data = await Api.get(`/styles/${id}/recommendation`);

        console.log("Data::: ", data)

        return data;
    } catch (error) {
        const errMsg = error?.message?.error;
        window.theFittingRoom.renderErrorModal({errorText: errMsg || 'Something went wrong while fetching recommended sizes. Try again!'});
        return ErrorHandler.getError(error?.code);
    }
}
