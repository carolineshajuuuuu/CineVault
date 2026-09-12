import { Routes, Route, useNavigate } from "react-router-dom";
import Add from "./pages/Add";
import DriftWall from "./components/DriftWall";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Watchlist from "./pages/watchlist";

import { useAuth } from "./context/AuthContext";

import "./App.css";


function Home() {
  return (
    <main className="movie-wall-page">

      <div className="movie-wall">
        <DriftWall
          columns={5}
          tileWidth={180}
          tileHeight={260}
          gap={18}
          speed={30}
          direction="up"
          pauseOnHover={false}
        />
      </div>

      <div className="movie-wall-content">

        <h1>CINEVAULT</h1>

        <p>
          Your personal movie watchlist
        </p>

        <button
          className="enter-vault-btn"
          onClick={() => window.location.href = "/login"}
        >
          ENTER CINEVAULT
        </button>

      </div>

    </main>
  );
}


function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();


  // SIGN IN
  const handleSignIn = async ({ username, password }) => {
    try {
      await login(username, password);

      navigate("/watchlist");
    } catch (error) {
      console.error("Login failed:", error);

      throw new Error(
        error?.response?.data?.detail ||
        "Invalid username or password."
      );
    }
  };


  // SIGN UP
  const handleSignUp = async ({ email, username, password }) => {
    try {
      await register(email, username, password);

      // Registration successful
      // Go back to login page
      window.location.href = "/login";

    } catch (error) {
      console.error("Registration failed:", error);

      const message =
        error?.response?.data?.username?.[0] ||
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.password?.[0] ||
        error?.response?.data?.detail ||
        "Account creation failed. Please try again.";

      throw new Error(message);
    }
  };


  return (
    <Login
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
    />
  );
}


function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-movie"
        element={
          <ProtectedRoute>
            <Add />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}


export default App;