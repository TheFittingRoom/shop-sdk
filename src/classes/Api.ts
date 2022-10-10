import { FirebaseInstance } from "./Firebase";

// const BASE_URL = "https://thefittingroom.tech/api/v1/";
const BASE_URL = "http://localhost:3000";

class Api {
    static fetch = async (url, data) => {
        const token = await FirebaseInstance.getTokenId();
        return fetch(BASE_URL+url, {
            ...data,
            body: JSON.stringify(data?.body),
            headers: {
                ...(data?.headers ||{}),
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }).then(res=>res.json());
    }

    static get = (url,data ={}) => this.fetch(url, {...data, method:"GET"})

    static post = (url,data ={}) => this.fetch(url, {...data, method:"POST"})

    static put = (url,data ={}) => this.fetch(url, {...data, method:"PUT"})

    static delete = (url,data ={}) => this.fetch(url, {...data, method:"DELETE"})
}

export default Api;