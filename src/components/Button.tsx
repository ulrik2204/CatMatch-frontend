import { ReactNode } from "react";

type ButtonProps = {
  onClick?: () => void;
  children?: ReactNode;
  color?: "primary" | "secondary";
};

const Button = (props: ButtonProps) => {
  const colorClasses = {
    primary: "bg-primary hover:bg-primarydark",
    secondary: "bg-secondary hover:bg-secondarydark",
  };

  return (
    <button
      onClick={props.onClick}
      className={`rounded px-3 py-2 shadow-sm ${colorClasses[props.color ?? "primary"]}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
