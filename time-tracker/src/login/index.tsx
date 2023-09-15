import "./login.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../utils/utils";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { ApiService } from "../utils/api.services";
// import { ApiService } from "../utils/api.services"

interface InputsType {
  email: string;
  password: string;
}
export const rootUrl = import.meta.env.VITE_APP_BASE_API_URL;
const googleAuthId=import.meta.env.GOOGLE_AUTH_ID


export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<InputsType>();

  const redirectAfterLogin = (response:any)=>{
    if (response.status === 200) {
      encryptData("userData",response.data)
      encryptData("authToken", response.data.token);
      const data = response.data;
      navigate("/", { state: data });
    } else {
      navigate(-1);
    }
  }

  const responseMessage = async (response: any) => {
    const resp = await ApiService.postData('api/user/login-with-google',{idToken:response.credential});
    redirectAfterLogin(resp);    
  };
  const errorMessage = (error: any) => {
    console.log(error);
  };
{}
  const onSubmit: SubmitHandler<InputsType> =async (data) => {  
    const response=await ApiService.postData("api/token",data).then((response) => {
          redirectAfterLogin(response);
        })
        .catch((e) => {
          console.log(e);
        });
  };
  return (
    <div className="container-fluid main-container">
      {/* <!-- Logo --> */}
      <div className="mt-5">
        <img
          src="./asia-logo.png"
          alt="Logo"
          className="img-fluid w-25 d-block mx-auto"
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
          <div className="mb-3">
            <label
              htmlFor="userEmail"
              className="form-label text-secondary fw-normal mb-1"
            >
              Email
            </label>
            <br />
            <input
              {...register("email")}
              type="email"
              id="userEmail"
              className="form-control shadow-none"
            />
          </div>
          {/* <!-- password --> */}
          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-start">
              <label
                htmlFor="password"
                className="form-label text-secondary fw-normal"
              >
                Password
              </label>
              <a href="#" className="text-decoration-none text-danger">
                Forgot password?
              </a>
            </div>
            <input
              {...register("password")}
              name="password"
              id="password"
              className="form-control shadow-none"
              type="password"
            />
          </div>
          {/* <!-- checkbox --> */}
          <div className="mb-3 d-flex gap-2 align-items-start justify-content-start">
            <input
              className="form-check-input shadow-none outline-none"
              type="checkbox"
              value=""
              id="checkbox"
            />
            <label
              className="form-check-label text-secondary"
              htmlFor="checkbox"
            >
              Remember me
            </label>
          </div>
          {/* <!-- Sign in btn --> */}
          <div className="bg-danger text-center custom-borderRaduis">
            <button type="submit" id="submit" className="btn text-white">
              Sign-in
            </button>
          </div>
        </form>
        {/* Login with google */}
        <div className="mt-3 d-flex justify-content-center">
          <GoogleOAuthProvider clientId={googleAuthId}>
            <div className="flex justify-center">
              <GoogleLogin
                theme="outline"
                type="icon"
                shape="square"
                onSuccess={responseMessage}
                onError={() =>errorMessage}
              />
            </div>
          </GoogleOAuthProvider>
        </div>
        <div className="text-center text-secondary mt-3">
          <p className="mb-0 text-">
            Doesn't have an account?
            <a className="text-danger text-decoration-none" href="#">
              Sign Up
            </a>
          </p>
        </div>
        
      </div>
    </div>
  );
};
