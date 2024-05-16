import { ComponentProps } from "react";

export default function Button(props: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={`min-w-20 rounded px-3 py-2 bg-blue-600 hover:bg-blue-700 transition active:scale-95 font-semibold ${
        props.className ?? ""
      }`}
    />
  );
}
