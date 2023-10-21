import { ReactNode } from "react";

// Create a button with some border radius and a background color
type ButtonProps = {
  onClick?: () => void;
  children?: ReactNode;
  color?: "primary" | "secondary";
};

const Button = (props: ButtonProps) => {
  // Define color classes based on the color prop
  const colorClasses = {
    primary: "bg-primary hover:bg-primarydark",
    secondary: "bg-secondary hover:bg-secondarydark",
    // ... add more color variations as needed
  };

  return (
    <button
      onClick={props.onClick}
      className={`rounded px-4 py-2 shadow-sm ${colorClasses[props.color ?? "primary"]}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
