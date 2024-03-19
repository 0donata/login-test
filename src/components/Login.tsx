import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearLoginSuccessMessage,
  loginUser,
  resetErrors,
  selectAuth,
} from "../redux/authSlice";
import { AppDispatch } from "../redux/store";
import { Link } from "react-router-dom";
import gitSvg from "../assets/Git.svg";
import googleSvg from "../assets/Google.svg";
import InputComponent from "./UI/InputComponent";
import ButtonComponent from "./UI/ButtonComponent";
import css from "./Login.module.scss";
import AuthContainer from "./UI/AuthContainer";
import { isEmailValid } from "../helpers/emailValidation";
import ErrorMessage from "./UI/ErrorMessage";

export const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);

  const { loginSuccessMessage, loginError } = useSelector(selectAuth);

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!isEmailValid(email)) {
      setEmailError("Please enter a valid email.");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    return () => {
      dispatch(resetErrors());
      dispatch(clearLoginSuccessMessage());
    };
  }, [dispatch]);

  return (
    <AuthContainer title="Log in to your account">
      <div className={css.socialLogin}>
        <button>
          <img src={googleSvg} alt="google" />
          <p>Google</p>
        </button>
        <button>
          <img src={gitSvg} alt="git" />
          <p>Github</p>
        </button>
      </div>

      <div className={css.orSeparator}>
        <span>OR</span>
      </div>

      <form className={css.loginForm} onSubmit={handleSubmit}>
        <InputComponent
          type="text"
          value={email}
          onChange={(ev) => {
            setEmail(ev.target.value),
              setEmailError(null),
              dispatch(resetErrors());
          }}
          placeholder="Email"
          required
        />
        {emailError && <ErrorMessage message={emailError} />}
        <InputComponent
          type="password"
          value={password}
          onChange={(ev) => {
            setPassword(ev.target.value), dispatch(resetErrors());
          }}
          placeholder="Password"
          minLength={8}
          required
        />
        <div className={css.forgotPassword}>
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
        {loginError && typeof loginError === "string" && (
          <ErrorMessage message={loginError} />
        )}
        {loginSuccessMessage && (
          <div className={css.loginSuccess}>{loginSuccessMessage}</div>
        )}
        <ButtonComponent
          className={css.loginButton}
          variant="primary"
          type="submit"
        >
          Log in to Qencode
        </ButtonComponent>
      </form>

      <span className={css.signUpLink}>
        Is your company new to Qencode?<Link to="#">Sign up</Link>
      </span>
    </AuthContainer>
  );
};
