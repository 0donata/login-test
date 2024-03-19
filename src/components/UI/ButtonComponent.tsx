import React from "react";
import css from "./ButtonComponent.module.scss";

type ButtonProps = {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonComponent: React.FC<ButtonProps> = ({
  variant,
  children,
  className,
  ...props
}) => {
  const variantClass =
    variant === "primary" ? css.btnPrimary : css.btnSecondary;
  return (
    <button className={`${css.btn} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default ButtonComponent;
