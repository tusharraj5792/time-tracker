import axios from "axios";
import { decryptData } from "./utils";
export const rootUrl = import.meta.env.VITE_APP_BASE_API_URL;

function getAccessToken() {
  return  decryptData('authToken');
}

axios.interceptors.request.use((request) => {
  request.headers['Authorization'] = `Bearer ${getAccessToken()}`;
  return request;
});

export class ApiService {
  public static async getData(url: string,projectId:number|null) {
    let headers;
    if (projectId) {
      headers = {
        Authorization: `Bearer  ${getAccessToken()}`,
        ProjectId: projectId,
      };
    }else{
      headers ={Authorization:`Bearer  ${getAccessToken()}`}
    }
    const config = {
      headers,
    };
    const response = await axios.get(`${rootUrl}/${url}`, config).then((res)=>{
      if(res.status === 200)
      {
        return (res.data);
      }
    }).catch((err)=>{
      console.log(err);
    });
    return response;
  }

  public static async postData(url: string, data: any,projectId:number|null) {
    let headers;
    if (projectId) {
      headers = {
        Authorization: `Bearer  ${getAccessToken()}`,
        ProjectId: projectId,
      };
    }else{
      headers ={Authorization:`Bearer  ${getAccessToken()}`}
    }
    const config = {
      headers,
    };
    const response = await axios.post(`${rootUrl}/${url}`, data,config)
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
