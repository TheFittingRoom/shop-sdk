import ErrorHandler from "./ErrorHandler";
import { FirebaseInstance } from "./Firebase";
class Api {
    static fetch = (url, data) => {
        return new Promise(async (resolve,reject) => {
            if (!navigator.onLine) {
                return reject(ErrorHandler.NO_INTERNET);
            }

            const token = await FirebaseInstance.getTokenId();
            if (!token) {
                return reject(ErrorHandler.UNAUTHORIZED);
            }

            const { key } = window.theFittingRoom;
            if (!key) {
                return reject(ErrorHandler.CLIENT_UNAUTHORIZED);
            }

            const path = window?.location?.pathname || "";

            fetch(process.env.API_ENDPOINT+url, {
                ...data,
                body: JSON.stringify(data?.body),
                headers: {
                    ...(data?.headers ||{}),
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    key,
                    path
                },
                //Add credentials to requests on cross-origin calls
                credentials: 'include'
            }).then(async res => {
                if (res.status >= 400 && res.status < 600) {
                    const response = await res.json();
                    throw {code: res?.status, message: response?.message || response};
                }

                return await res.json();
            }).then(resolve).catch(reject);
        })
    }

    static get = (url, data = {}): any => Api.fetch(url, {...data, method:"GET"});

    static post = (url, data = {}): any => Api.fetch(url, {...data, method:"POST"});
}

export default Api;
