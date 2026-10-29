import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css";

export default function Login({ onLogin }) {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();

async function handleLogin(e) {
e.preventDefault();
setError("");


try {
  const response = await api.post("/login", {
    username: username.trim(),
    password,
  });

  onLogin(response.data.user);
  navigate("/admin", { replace: true });
} catch (err) {
  setError(
    err.response?.data?.message ||
      "Unable to connect to the server."
  );
}


}

return ( <div className="login-page"> <form className="login-card" onSubmit={handleLogin}> <h1>PayNthra</h1> <p>Sign in to continue</p>


    {error && <p className="login-error">{error}</p>}

    <label htmlFor="username">Username</label>
    <input
      id="username"
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />

    <label htmlFor="password">Password</label>
    <input
      id="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button type="submit">Login</button>
  </form>
</div>


);
}
