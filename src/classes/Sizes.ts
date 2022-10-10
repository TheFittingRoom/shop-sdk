import { GetRecommendedSizeProps, GetRecommendedSizesResponse } from "../types";
import Api from './Api';

export const getRecommendedSizes = async ({ sku }: GetRecommendedSizeProps): Promise<GetRecommendedSizesResponse> => {
    try {
        const data = await Api.get(`/get-sizes/${sku}`);

        return {
            recommended: data.recommended,
            optionalSizes: data.optionalSizes
        };
    } catch (error) {
        throw new Error(error)
    }
}
