export type ToastProps =
  | { errorMessage: string }
  | { successMessage: string }
  | { warningMessage: string };

export const Toast = (props: ToastProps) => {
  let message;
  let toastClass;

  console.log("toast props", props);

  if ("errorMessage" in props) {
    message = props.errorMessage;
    toastClass = "toast-error";
  } else if ("successMessage" in props) {
    message = props.successMessage;
    toastClass = "toast-success";
  } else {
    message = props.warningMessage;
    toastClass = "toast-warning";
  }

  if (message) {
    return (
      <div className={`toast ${toastClass}`}>
        <p>{message}</p>
      </div>
    );
  }

  return null;
};
