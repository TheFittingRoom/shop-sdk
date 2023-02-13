import { ErrorType } from "../types";

export const getTFRFrames = async ({ sku }): Promise<ErrorType | void> => {
  window.theFittingRoom?.getUserProfile().then(userProfile => {
    console.log("userProfile: ", userProfile?.vto);
    console.log("sku: ", sku);

    const getBrandId = () => {
      const brandStyleId = sku?.split('-')?.[0];
      return String(brandStyleId || "");
    }

    const getUserFrames = () => {
      let frames = [];

      if (userProfile?.vto?.frames) {
        frames = userProfile?.vto?.frames;
      } else {
        frames = userProfile?.vto?.[`${getBrandId()}`]?.[`${sku}`]?.frames;
      }

      return frames || [];
    }

  /*
    const getColorWayId = () => {
      const colorWayId = userProfile?.vto?.[`${getBrandId()}`]?.[`${sku}`]?.colorway_id;
      return Number(colorWayId || null);
    }
  */

    const getUserSku = () => {
      let sku = "";

      if (userProfile?.vto?.sku) {
        sku = userProfile?.vto?.sku;
      } else {
        sku = Object.keys(userProfile?.vto?.[`${getBrandId()}`])?.[0];
      }

      return String(sku || "");
    }

    return {frames: getUserFrames(), userSku: getUserSku()};
  }).catch(error => {
    console.log("getUserProfile error: ", error)
    throw new Error(error)
  })
}
