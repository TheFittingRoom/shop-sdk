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
        return ErrorHandler.NOT_FOUND;
    }
}
