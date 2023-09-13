import "./login.css";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../utils/utils";

interface InputsType {
  email: string;
  password: string;
}
const rootUrl= import.meta.env.VITE_APP_BASE_API_URL;

export const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InputsType>();

  const onSubmit: SubmitHandler<InputsType> = (data) => {
    axios
      .post(`${rootUrl}/api/token`, {
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        if (response.status === 200) {
          encryptData("authToken",response.data.token)
          const data = response.data;
          navigate("/home", { state: data });
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
      </div>
    </div>
  );
};
