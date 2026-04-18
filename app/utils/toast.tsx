"use client";

import { createRoot } from "react-dom/client";

export type ToastAction = {
  text: string;
  onClick: () => void;
};

function Toast(props: {
  content: string;
  action?: ToastAction;
  onClose?: () => void;
}) {
  return (
    <div>
      <span>{props.content}</span>
      {props.action && (
        <button
          onClick={() => {
            props.action?.onClick?.();
            props.onClose?.();
          }}
        >
          {props.action.text}
        </button>
      )}
    </div>
  );
}

export function showToast(
  content: string,
  action?: ToastAction,
  delay = 3000,
) {
  // Only run on client-side
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);
  const close = () => {
    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 300);
  };

  setTimeout(() => {
    close();
  }, delay);

  root.render(<Toast content={content} action={action} onClose={close} />);
}