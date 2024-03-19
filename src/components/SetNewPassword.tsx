import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContainer from "./UI/AuthContainer";
import InputComponent from "./UI/InputComponent";
import { resetErrors, selectAuth, setNewPassword } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import ErrorMessage from "./UI/ErrorMessage";
import ButtonComponent from "./UI/ButtonComponent";
import css from "./SetNewPassword.module.scss";

const SetNewPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchError, setMatchError] = useState<string | null>(null);

  const location = useLocation();

  const [token, setToken] = useState<string>("");
  const [secret, setSecret] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const { isNewPasswordSet, newPasswordError } = useSelector(selectAuth);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get("token");
    const urlSecret = queryParams.get("secret");

    if (urlToken && urlSecret) {
      setToken(urlToken);
      setSecret(urlSecret);
    }
  }, [location]);

  const handleSubmit = (ev: { preventDefault: () => void }) => {
    ev.preventDefault();

    if (password !== confirmPassword) {
      setMatchError("Passwords do not match");
      return;
    }

    dispatch(
      setNewPassword({
        token,
        secret,
        password,
        passwordConfirm: confirmPassword,
      })
    );
  };

  useEffect(() => {
    if (isNewPasswordSet) {
      navigate("/login");
    }
  }, [isNewPasswordSet, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetErrors());
    };
  }, [dispatch]);

  return (
    <AuthContainer title="Create new Password?">
      <form className={css.setPasswordForm} onSubmit={handleSubmit}>
        <p>Password</p>
        <InputComponent
          className={css.inputComponent}
          type="password"
          value={password}
          onChange={(ev) => {
            setPassword(ev.target.value),
              setMatchError(null),
              dispatch(resetErrors());
          }}
          placeholder="Password"
          minLength={8}
          required
        />
        <p>Confirm Password</p>
        <InputComponent
          className={css.inputComponent}
          type="password"
          value={confirmPassword}
          onChange={(ev) => {
            setConfirmPassword(ev.target.value),
              setMatchError(null),
              dispatch(resetErrors());
          }}
          placeholder="Password"
          minLength={8}
          required
        />
        {matchError && <ErrorMessage message={matchError} />}
        {newPasswordError && typeof newPasswordError === "string" && (
          <ErrorMessage message={newPasswordError} />
        )}
        <ButtonComponent
          className={css.resetButton}
          variant="primary"
          type="submit"
        >
          Reset Password
        </ButtonComponent>
      </form>
    </AuthContainer>
  );
};

export default SetNewPassword;
