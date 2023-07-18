import { Route, Routes } from "react-router-dom";
import { Todos } from "./features/todos/components/Todos/Todos";
import { Login } from "./features/auth/components/Login/Login";
import { Register } from "./features/auth/components/Register/Register";
import { ToastContainer } from "./features/toast/components/ToastContainer/ToastContainer";
import { NavBar } from "./app/components/NavBar/NavBar";
import { useAuthenticate } from "app/hooks";
import { useState } from "react";

function App() {
  const { isAuthenticated, isLoading, attemptedAuth } = useAuthenticate();
  const [showRegister, setShowRegister] = useState(false);

  const handleShowRegister = (shouldShow: boolean) => () => {
    setShowRegister(shouldShow);
  };

  let home;

  if (isLoading || !attemptedAuth) {
    home = null;
  } else if (isAuthenticated) {
    home = <Todos />;
  } else if (showRegister) {
    home = <Register hideRegister={handleShowRegister(false)} />;
  } else {
    home = <Login showRegister={handleShowRegister(true)} />;
  }

  return (
    <div className="App">
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route path="/" element={home} />
      </Routes>
    </div>
  );
}

export default App;
