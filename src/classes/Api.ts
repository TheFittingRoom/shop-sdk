import ErrorHandler from "./ErrorHandler";
import { FirebaseInstance } from "./Firebase";
class Api {
    static fetch = async (url, data) => {
        if (!navigator.onLine) {
            return ErrorHandler.NO_INTERNET;
        }

        const token = await FirebaseInstance.getTokenId();
        if (!token) {
            return ErrorHandler.UNAUTHORIZED;
        }

        return fetch(process.env.MOCK_DB_URL+url, {
            ...data,
            body: JSON.stringify(data?.body),
            headers: {
                ...(data?.headers ||{}),
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }).then(res =>res.json());
    }

    static get = (url, data = {}) => Api.fetch(url, {...data, method:"GET"})

    static post = (url, data = {}) => Api.fetch(url, {...data, method:"POST"})
}

export default Api;