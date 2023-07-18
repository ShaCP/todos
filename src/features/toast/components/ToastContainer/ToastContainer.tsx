import { useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import styles from "./ToastContainer.module.css";
import { Toast } from "../Toast/Toast";
export function ToastContainer() {
  const stateToasts = useAppSelector((state: RootState) => state.toasts);

  const toasts = stateToasts.map((toast) => {
    return <Toast key={toast.id} toast={toast} />;
  });

  return (
    <div id="toast-container" className={styles.toastContainer}>
      {toasts}
    </div>
  );
}
