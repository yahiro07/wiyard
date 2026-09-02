import { ReactNode } from "react";

export const Button = (props: {
  active?: boolean;
  text?: string;
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      className="min-w-[60px] h-[36px] border border-[#888] flex-c"
      style={{
        backgroundColor: props.active ? "#ccffcc" : "#fff",
        cursor: props.disabled ? "default" : "pointer",
        opacity: props.disabled ? 0.5 : 1,
      }}
    >
      {props.text && <span>{props.text}</span>}
      {props.children}
    </button>
  );
};
