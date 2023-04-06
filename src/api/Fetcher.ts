import { FirebaseUser } from "../auth/Firebase";
import { ErrorResponse } from "./errors";

const Fetcher = {
    Fetch: async (user: FirebaseUser, endpointPath: string, method: string, body: object | null): Promise<Response> => {
        return new Promise(async (resolve, reject) => {
            user.Token().then((token) => {
                let config: RequestInit = {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    credentials: 'include'
                };
                if (body) {
                    config.body = JSON.stringify(body);
                }
                let url = process.env.API_ENDPOINT + endpointPath;
                fetch(url, config).then((r) => {
                    if (r.ok) {
                        resolve(r);
                    } else {
                        if (r.status === 500) {
                            // 500s dont return error responses
                            reject(new Error(r.statusText));
                        } else {
                            r.json().then((json) => {
                                reject(json as ErrorResponse);
                            }).catch((error: SyntaxError) => {
                                reject(error);
                            });
                        }
                    }
                }).catch((error) => {
                    console.error("failed to fetch", error);
                    reject(error);
                });
            }).catch((error) => {
                console.error("failed to get token", error);
                reject(error);
            });
        });
    },

    Get: async (user: FirebaseUser, endpointPath: string, body: any): Promise<object> => {
        return Fetcher.Fetch(user, endpointPath, "GET", body);
    },

    Post: async (user: FirebaseUser, endpointPath: string, body: object): Promise<object> => {
        return Fetcher.Fetch(user, endpointPath, "POST", body);
    },

    Put: async (user: FirebaseUser, endpointPath: string, body: object): Promise<object> => {
        return Fetcher.Fetch(user, endpointPath, "PUT", body);
    },

    Patch: async (user: FirebaseUser, endpointPath: string, body: object): Promise<object> => {
        return Fetcher.Fetch(user, endpointPath, "PATCH", body);
    },

    Delete: async (user: FirebaseUser, endpointPath: string, body: object): Promise<object> => {
        return Fetcher.Fetch(user, endpointPath, "DELETE", body);
    }
};

export { Fetcher };
