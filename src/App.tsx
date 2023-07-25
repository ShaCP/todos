import { Route, Routes } from "react-router-dom";
import { Todos } from "./features/todos/components/Todos/Todos";
import { Login } from "./features/auth/components/Login/Login";
import { Register } from "./features/auth/components/Register/Register";
import { ToastContainer } from "./features/toast/components/ToastContainer/ToastContainer";
import { NavBar } from "./app/components/NavBar/NavBar";
import { useAppSelector, useAuthenticate } from "app/hooks";

function App() {
  const { isAuthenticated, isLoading, attemptedAuth } = useAuthenticate();
  const showLogin = useAppSelector((state) => state.auth.showLogin);

  let home = <div>Loading...</div>;

  if (!isLoading && attemptedAuth) {
    if (isAuthenticated) {
      home = <Todos />;
    } else if (showLogin) {
      home = <Login />;
    } else {
      home = <Register />;
    }
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
