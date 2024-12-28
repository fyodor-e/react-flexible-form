import { ComponentProps, FC } from "react";

type Props = {
  error?: string | undefined;
  touched: boolean;
  label: string;
} & ComponentProps<"input">;

const SimpleInput: FC<Props> = ({ touched, error, label, style, ...rest }) => {
  const isInvalid = !!(error && touched);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        ...(style ?? {}),
      }}
    >
      <label>{label}</label>
      <input {...rest} />
      <span style={{ color: isInvalid ? "red" : "inherit", whiteSpace: "pre" }}>
        {isInvalid ? error : " "}
      </span>
    </div>
  );
};

export default SimpleInput;
