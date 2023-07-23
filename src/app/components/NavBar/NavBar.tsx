import React from "react";
import globalStyles from "styles/global.module.css";
import styles from "./NavBar.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { AUTH_TOKEN_KEY, logout } from "features/auth/authSlice";

const NavBar: React.FC = React.memo(function NavBar() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    dispatch(logout());
  };

  const logoutButton = user ? (
    <button
      className={`${globalStyles.button} ${styles.logoutButton}`}
      onClick={handleLogout}
    >
      Logout
    </button>
  ) : null;

  return (
    <div className={styles.navBar}>
      <ul>
        <li>{user?.userName}</li>
        <li>{logoutButton}</li>
      </ul>
    </div>
  );
});

export { NavBar };
