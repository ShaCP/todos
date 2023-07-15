import ReactDOM from "react-dom";

import { ToastProps, Toast } from "../app/components/Toast/Toast";

export function showToast(message: ToastProps) {
  console.log("showToast", message);
  const toastRoot = document.getElementById("toast-container");
  if (toastRoot != null) {
    ReactDOM.createPortal(<Toast {...message} />, toastRoot);
  }
}
