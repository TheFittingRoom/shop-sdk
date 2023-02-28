import { ErrorType, UserVTOFrames } from "../types";
import Auth from "./Auth";

export const isImgValid = (url: string) => {
  const img = new Image();
  img.src = url;

  return new Promise((resolve) => {
    img.onerror = () => resolve(false);
    img.onload = () => resolve(true);
  });
}

export const getVTOFrames = async ({ sku }): Promise<ErrorType | UserVTOFrames | void> => {
  try {
    const userProfile = await Auth.getUserProfile();

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

/*
  const getColorWayId = () => {
    const colorWayId = userProfile?.vto?.[`${getBrandStyleId()}`]?.[`${sku}`]?.colorway_id;
    return Number(colorWayId || null);
  }

  const getUserLoadedSku = () => {
    let sku = "";

    if (userProfile?.vto?.sku) {
      sku = userProfile?.vto?.sku;
    } else {
      sku = userProfile?.vto?.[`${getBrandStyleId()}`]?.[`${sku}`]
    }

    return String(sku || "");
  }

  const getBrandStyleId = () => {
    const brandStyleId = sku?.split('-')?.[0];
    return String(brandStyleId || "");
  }
*/
