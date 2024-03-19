import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContainer from "./UI/AuthContainer";
import InputComponent from "./UI/InputComponent";
import ButtonComponent from "./UI/ButtonComponent";
import {
  resetErrors,
  resetPasswordRequest,
  selectAuth,
} from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import ErrorMessage from "./UI/ErrorMessage";
import { isEmailValid } from "../helpers/emailValidation";
import css from "./ForgotPassword.module.scss";

const redirect_url = import.meta.env.VITE_REDIRECT_URL;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const { resetError } = useSelector(selectAuth);

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!isEmailValid(email)) {
      setEmailError("Please enter a valid email.");
      return;
    }
    dispatch(resetPasswordRequest({ email, redirect_url }));
  };

  useEffect(() => {
    return () => {
      dispatch(resetErrors());
    };
  }, [dispatch]);

  return (
    <AuthContainer title="Forgot Password?">
      <form className={css.forgotPasswordForm} onSubmit={handleSubmit}>
        <InputComponent
          type="text"
          value={email}
          onChange={(ev) => {
            setEmail(ev.target.value),
              setEmailError(null),
              dispatch(resetErrors());
          }}
          placeholder="Enter your email"
          required
        />
        {emailError && <ErrorMessage message={emailError} />}
        {resetError && typeof resetError === "string" && (
          <ErrorMessage message={resetError} />
        )}
        <ButtonComponent type="submit" variant="primary">
          Send
        </ButtonComponent>
        <Link to="/login">
          <ButtonComponent type="submit" variant="secondary">
            Cancel
          </ButtonComponent>
        </Link>
      </form>
    </AuthContainer>
  );
};

export default ForgotPassword;
