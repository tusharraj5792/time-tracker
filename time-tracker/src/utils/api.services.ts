import axios, { AxiosResponse } from "axios"
// import { getItem } from "./utils";
// import store from "../store/store"
// import { LoginActions } from "src/store/login/actions";
export const rootUrl= import.meta.env.VITE_APP_BASE_API_URL;

export class ApiService {
    public static async postData(url: string, data: any): Promise<AxiosResponse> {
        return new Promise((resolve, reject) => {
            debugger
            axios({
                method: "post",
                url: `${rootUrl}/${url}`,
                headers: { Authorization: `Bearer` },
                data
            })
                .then((res) => resolve(res))
                .catch((err) => {
                    if (err.response && err.response.status === 401) {
                        console.log(err.response);
                    } else {
                        reject(err)
                    }
                });
        });
    }
    
}