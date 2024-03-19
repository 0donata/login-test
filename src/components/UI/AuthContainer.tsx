import React from "react";
import logoSvg from "../../assets/LogoName.svg";
import css from "./AuthContainer.module.scss";

interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children, title }) => {
  return (
    <div className={css.authContainer}>
      <img src={logoSvg} alt="logo" />
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default AuthContainer;
