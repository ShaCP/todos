import React from "react";
import componentStyles from "./NavBar.module.css";
import commonStyles from "app/styles/common.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { combineStyles } from "utilities/combineStyles";
import { AUTH_TOKEN_KEY, logout } from "features/auth/authSlice";

const styles = combineStyles([commonStyles, componentStyles]);

const NavBar: React.FC = React.memo(function NavBar() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    dispatch(logout());
  };

  const logoutButton = user ? (
    <button className={styles.button} onClick={handleLogout}>
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
