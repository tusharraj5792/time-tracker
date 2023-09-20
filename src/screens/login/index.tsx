import "./login.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../../utils/utils";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { ApiService } from "../../utils/api.services";
import * as AppConstants from '../../utils/Constants';
import FormFieldError from "../../components/formFieldError";
import { useState } from "react";

interface InputsType {
  email: string;
  password: string;
}
export const rootUrl = import.meta.env.VITE_APP_BASE_API_URL;
const googleAuthId = import.meta.env.VITE_GOOGLE_AUTH_ID;

export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit,formState:{errors}} = useForm<InputsType>();
const [isError,setIsError]=useState<boolean>(false)
  const redirectAfterLogin = (response: any) => {
    if (response.status === 200) {
      setIsError(false)
      encryptData("userData", response.data);
      encryptData("authToken", response.data.token);
      const data = response.data;
      navigate("/", { state: data });
    } else {
      navigate(-1);
    }
  };

  const responseMessage = async (response: any) => {
    const resp = await ApiService.postLoginData("api/user/login-with-google", {
      idToken: response.credential,
    });
    redirectAfterLogin(resp);
  };
  const errorMessage = (error: any) => {
    console.log(error);
  };
  const onSubmit: SubmitHandler<InputsType> = async (data) => {
    await ApiService.postLoginData("api/token", data)
      .then((response) => {
        redirectAfterLogin(response);
      })
      .catch((e) => {
        if(e.response.status)setIsError(true)

      });
  };
  return (
    <div className="container-fluid main-container">
      {/* <!-- Logo --> */}
      <div className="mt-4">
        <img
          src="./ensuesoft.jpg"
          alt="Logo"
          className="img-fluid d-block mx-auto"
        />
      </div>
      {/* <!-- welcome msg --> */}
      <div className="text-center my-3">
        <h3 className="mb-0 fw-normal">Welcome!</h3>
        <p className="text-secondary mb-0">Please sign-in to continue</p>
      </div>
      {/* <!-- form --> */}
      <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <!-- email --> */}
          <div className="mb-1">
            <label
              htmlFor="userEmail"
              className="form-label text-secondary fw-normal mb-1"
            >
              Email
            </label>
            <br />
            <input
              {...register("email",{
                required:true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
              type="email"
              id="userEmail"
              
              className="form-control shadow-none"
            />
          </div>
          {errors.email?.type === 'required' && (
            <FormFieldError message={AppConstants.requiredField} />
          )}
          {errors.email?.type === 'pattern' && (
            <FormFieldError message={AppConstants.notValidEmail} />
          )}
          {/* <!-- password --> */}
          <div className="mb-1 mt-2">
            <div className="d-flex justify-content-between align-items-start">
              <label
                htmlFor="password"
                className="form-label text-secondary fw-normal"
              >
                Password
              </label>
            </div>
            <input
              {...register("password",{required:true})}
              name="password"
              id="password"
              className="form-control shadow-none"
              type="password"
            />
          </div>
          {errors.password?.type === 'required' && (
            <FormFieldError message={AppConstants.requiredField} />
          )}
          
          {/* <!-- Sign in btn --> */}
          <button
            type="submit"
            id="submit"
            className="btn text-white bg-danger text-center w-100 shadow-none"
          >
            Sign-in
          </button>
        </form>
        {isError?
        <span className="text-danger d-flex item-center error-txt my-3">
        <span>Please check the email or password is wrong</span>
      </span>:null}
        
        
        
        
        {/* Login with google */}
        <div className="mt-3 d-flex justify-content-center">
          <GoogleOAuthProvider clientId={googleAuthId}>
            <div className="flex justify-center">
              <GoogleLogin
                theme="outline"
                type="icon"
                shape="square"
                onSuccess={responseMessage}
                onError={() => errorMessage}
              />
            </div>
          </GoogleOAuthProvider>
        </div>
      
      </div>
    </div>
  );
};
