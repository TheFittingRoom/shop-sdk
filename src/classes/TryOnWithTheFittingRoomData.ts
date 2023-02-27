
import { AvatarState, ErrorType, Response, UserVTOFrames, VirtualTryOnFramesProps } from '../types';
import Api from './Api';
import ErrorHandler from './ErrorHandler';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FirebaseInstance } from './Firebase';
import { getRecommendedSizes } from './Sizes';
import Auth from './Auth';
import { isImgValid } from './Frames';

const getVTOFramesData = async ({ sku }): Promise<ErrorType | UserVTOFrames | Response.NO_AVATAR | void> => {
  try {
    const userProfile = await Auth.getUserProfile();

    if (userProfile?.avatar_status === AvatarState.PENDING || userProfile?.avatar_status === AvatarState.NOT_CREATED) {
      return Response.NO_AVATAR;
    }

    const { key } = window.theFittingRoom;

    console.log("sku: ", sku, " brand_id: ", key, "userProfile: ", userProfile);

    const userVTOFrames = userProfile?.vto?.[`${key}`]?.[`${sku}`]?.frames || [];

    if (userVTOFrames?.length) {
      const isValid = await isImgValid(userVTOFrames?.[0]);

      console.log("is first image of vto frame valid: ", isValid);

      if (isValid) {
        return userVTOFrames;
      }
    }

    return [];
  } catch (error) {
    console.log("getVTOFrames error: ", error)
    throw new Error(error)
  }
}

const virtualTryOnFramesData = async ({ sku }: VirtualTryOnFramesProps): Promise<UserVTOFrames | string | ErrorType | void> => {
  try {
      const userVTOFramesResponse = await getVTOFramesData({ sku: sku }) as UserVTOFrames | Response.NO_AVATAR;

      if (userVTOFramesResponse === Response.NO_AVATAR) {
        return "No avatar created";
      }

      if (userVTOFramesResponse?.length) {
        return userVTOFramesResponse as UserVTOFrames;
      }

      const db = FirebaseInstance.firestoreApp;

      console.log("sku: ", sku)

      const brandStyleId = sku?.split('-')?.[0];

      console.log("brandStyleId: ", brandStyleId)

      const q = query(collection(db, 'styles'), where('brand_style_id', '==', String(brandStyleId)));

      const querySnapshot = await getDocs(q);

      const style = querySnapshot?.docs?.[0]?.data();

      console.log("style: ", style)

      let colorwayId = null;

      if (style?.sizes?.length) {
        for (const size of style?.sizes) {
          if (size?.colorways?.length) {
            const foundColorway = size?.colorways?.find((colorway: any) => String(colorway?.sku) === String(sku));
            if (foundColorway && foundColorway?.id) {
              colorwayId = foundColorway?.id;
              break;
            }
          }
        };
      }

      console.log("colorwayId: ", colorwayId);

      if (colorwayId) {
          await Api.post(`/colorways/${colorwayId}/frames`);

          return Response.SUCCESS;
      } else {
        return 'Something went wrong while fetching colorway id. Try again!'
      }
  } catch (error) {
    console.log("error virtualTryOnFrames: ", error)
    const errMsg = error?.message?.error;

    if (errMsg === 'size id is outside of recommended range') {
      try {
        const recommendedSizeText = await getRecommendedSizes({ sku: sku });

        const errRecommendedSizeText = recommendedSizeText.replace('You can try on a size', 'Please try on one of the recommended sizes: ').replace('We recommend', 'We suggest');

        return errRecommendedSizeText;
      } catch (error) { }
    } else {
      return 'Something went wrong. Try again!'
    }
    return ErrorHandler.getError(error?.code);
  }
}

export const tryOnWithTheFittingRoomData = async ({ sku }): Promise<UserVTOFrames | string | ErrorType | void> => {
  if (window.theFittingRoom.isLoggedIn()) {
    const data = await virtualTryOnFramesData({ sku });

    return data;
  } else {
    return "User is not authenticated"
  }
}
