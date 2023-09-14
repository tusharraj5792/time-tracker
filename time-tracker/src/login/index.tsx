import "./login.css";
import axios from "axios";
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

const responseMessage = (response: any) => {
  ApiService.postData('api/user/login-with-google',{idToken:response.credential});
  
};
const errorMessage = (error: any) => {
  console.log(error);
};

export const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<InputsType>();

  const onSubmit: SubmitHandler<InputsType> = (data) => {    
    axios
      .post(`${rootUrl}/api/token`, {
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        if (response.status === 200) {
          encryptData("userData",response.data)
          encryptData("authToken", response.data.token);
          const data = response.data;
          navigate("/", { state: data });
        } else {
          navigate(-1);
        }
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
              defaultValue={"abhishek.choudhary@ensuesoft.com"}
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
              defaultValue={"Abhi@12345"}
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
        {/* <!-- Google icon here --> */}
        {/* <i className="fa-brands fa-google"></i>  */}

        <div className="text-center text-secondary mt-3">
          <p className="mb-0 text-">
            Doesn't have an account?
            <a className="text-danger text-decoration-none" href="#">
              Sign Up
            </a>
          </p>
        </div>
        {/* Login with google */}
        <div className="mt-3">
          <GoogleOAuthProvider clientId="961644620937-07n0d959mcsm23rd92aga657stou7rp1.apps.googleusercontent.com">
            <div className="flex justify-center">
              <GoogleLogin
                theme="outline"
                type="icon"
                shape="square"
                // text="signin with google"
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
