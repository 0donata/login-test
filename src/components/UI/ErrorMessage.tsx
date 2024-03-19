import React from "react";
import css from "./ErrorMessage.module.scss";

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return <div className={css.error}>{message}</div>;
};

export default ErrorMessage;
