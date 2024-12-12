import { CSSProperties, ReactNode } from "react";
import "./index.scss";

interface ITagProps {
  fill?: boolean;
  children: ReactNode;
  style?: CSSProperties
}

export default function Tag(props: ITagProps) {
  return (
    <div
      className="components--tag-container"
      title={typeof props.children === "string" ? props.children : undefined}
      data-fill={props.fill}
      style={props.style}
    >
      {props.children}
    </div>
  );
}
