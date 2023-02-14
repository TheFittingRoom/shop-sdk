import { ErrorType } from "../types";

export const getVTOFrames = async ({ sku }): Promise<ErrorType | void> => {
  window.theFittingRoom?.getUserProfile().then(userProfile => {
    console.log("userProfile: ", userProfile?.vto);
    console.log("sku: ", sku);

    const getBrandStyleId = () => {
      const brandStyleId = sku?.split('-')?.[0];
      return String(brandStyleId || "");
    }

    const getUserVTO = () => {
      let userVTO = null;

      if (userProfile?.vto) {
        userVTO = userProfile?.vto;
      } else {
        userVTO = userProfile?.vto?.[`${getBrandStyleId()}`]?.[`${sku}`];
      }

      return userVTO || null;
    }

    return {frames: getUserVTO()};

  }).catch(error => {
    console.log("getUserProfile error: ", error)
    throw new Error(error)
  })
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
*/
