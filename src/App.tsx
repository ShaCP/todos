import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Todos } from "./features/todos/components/Todos/Todos";
import { Login } from "./features/auth/components/Login/Login";
import { Register } from "./features/auth/components/Register/Register";

function App() {
    return (
      <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/todos" element={<Todos />} />
          </Routes>
      </div>
    );
  }

export default App;
