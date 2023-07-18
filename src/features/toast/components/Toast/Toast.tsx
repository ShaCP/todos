import { useEffect } from "react";
import styles from "./Toast.module.css";
import { removeToast, IToast } from "../../toastSlice";
import { useDispatch } from "react-redux";

type ToastProps = {
  toast: IToast;
};
export const Toast = ({ toast }: ToastProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => dispatch(removeToast(toast.id)), 3000);
  }, [dispatch, toast]);

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <p className={`${styles.message}`}>{toast.message}</p>
    </div>
  );
};
