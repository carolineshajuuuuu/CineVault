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
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async ({ username, password }) => {
    try {
      await login(username, password);

      navigate("/watchlist");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Login
      onSignIn={handleSignIn}
    />
  );
}


function App() {
  return (
    <Routes>

  <Route path="/" element={<Home />} />

  <Route path="/login" element={<LoginPage />} />

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