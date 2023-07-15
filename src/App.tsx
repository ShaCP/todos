import { Route, Routes } from "react-router-dom";
import { Todos } from "./features/todos/components/Todos/Todos";
import { Login } from "./features/auth/components/Login/Login";
import { Register } from "./features/auth/components/Register/Register";
import { ToastContainer } from "./app/components/Toast/ToastContainer/ToastContainer";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todos" element={<Todos />} />
      </Routes>
    </div>
  );
}

export default App;
