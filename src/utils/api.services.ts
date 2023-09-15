import axios from "axios";

export const rootUrl = import.meta.env.VITE_APP_BASE_API_URL;

export class ApiService {
  public static async postData(url: string, data: any) {
    const response = await axios
      .post(`${rootUrl}/${url}`, data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          console.log(err.response);
        } else {
          console.log(err);
        }
      });

    return response;
  }

  public static async postLoginData(url: string, data: any) {
    const config = {
      method: "post",
      url: `${rootUrl}/${url}`,
      data: data,
    };

    const response = await axios(config);
    return response;
  }
}
