import { useState } from "react";
import eyeIcon from "../../assets/Eye.svg";
import css from "./InputComponent.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: (value: string) => string | null;
}

const InputComponent: React.FC<InputProps> = ({ type, validate, ...props }) => {
  const [inputType, setInputType] = useState(type);
  const [error, setError] = useState<string | null>(null);

  const toggleShowPassword = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validate) {
      const validationError = validate(e.target.value);
      setError(validationError);
    }
    props.onChange(e);
  };

  return (
    <div className={`${css.inputWrapper} ${props.className || ""}`}>
      <input {...props} type={inputType} onChange={handleChange} />
      {type === "password" && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className={css.togglePassword}
        >
          <img src={eyeIcon} alt="Toggle visibility" />
        </button>
      )}
      {error && <div className={css.errorMessage}>{error}</div>}
    </div>
  );
};

export default InputComponent;
