import { ErrorType, GetRecommendedSizeProps, GetRecommendedSizesResponse } from "../types";
import Api from './Api';
import ErrorHandler from "./ErrorHandler";

export const getRecommendedSizes = async ({ sku }: GetRecommendedSizeProps): Promise<GetRecommendedSizesResponse | ErrorType> => {
    try {
        const data = await Api.get(`/get-sizes/${sku}`);

        return {
            recommended: data.recommended,
            optionalSizes: data.optionalSizes
        };
    } catch (error) {
        // Todo - remove this and handle all types of api errors (based on possible types)
        window.theFittingRoom.renderErrorModal({sizes: {recommended: "1", optionalSizes: ["2", "3"]}});
        return ErrorHandler.getError(error?.status?.code);
    }
}
