import { ErrorType, UserVTOFrames } from "../types";
import Auth from "./Auth";

export const getVTOFrames = async ({ sku }): Promise<ErrorType | UserVTOFrames> => {
  try {
    const userProfile = await Auth.getUserProfile();
    const { key } = window.theFittingRoom;

    console.log("userProfile: ", userProfile);
    console.log("sku: ", sku, " key: ", key);

    const userVTOFrames = userProfile?.vto?.[`${key}`]?.[`${sku}`]?.frames || [];

    return {userVTOFrames};
  } catch (error) {
    console.log("getUserProfile error: ", error)
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
