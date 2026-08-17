import { useState } from "react";
import "./Login.css";

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 4.22-5.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 7 11 7a20.3 20.3 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function VaultBackdrop() {
  return (
    <div className="vault-backdrop" aria-hidden="true">
      <div className="starfield" />
      <div className="reel-band one" />
      <div className="reel-band two" />
      <div className="flare" />
    </div>
  );
}

export default function Login({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [signIn, setSignIn] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [signUp, setSignUp] = useState({
    email: "",
    username: "",
    password: "",
  });

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signin") {
      if (!signIn.username.trim() || !signIn.password) {
        setError("Enter your username and password to continue.");
        return;
      }
    } else {
      if (
        !signUp.email.trim() ||
        !signUp.username.trim() ||
        !signUp.password
      ) {
        setError("Fill in every field to request access.");
        return;
      }
    }

    try {
      setLoading(true);

      if (mode === "signin" && onSignIn) {
        await onSignIn(signIn);
      } else if (mode === "signup" && onSignUp) {
        await onSignUp(signUp);
      }
    } catch (err) {
      setError(
        err?.message || "That combination didn't work. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <VaultBackdrop />

      <div className="login-card">
        <p className="login-wordmark">CineVault</p>

        <div className="login-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            className={mode === "signin" ? "active" : ""}
            onClick={() => switchMode("signin")}
          >
            Sign In
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={mode === "signup" ? "active" : ""}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {error && <div className="login-error">{error}</div>}

          {mode === "signin" ? (
            <>
              <div className="field">
                <label htmlFor="username">Username</label>

                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={signIn.username}
                  onChange={(e) =>
                    setSignIn({
                      ...signIn,
                      username: e.target.value,
                    })
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={signIn.password}
                  onChange={(e) =>
                    setSignIn({
                      ...signIn,
                      password: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() =>
                    setShowPassword((v) => !v)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              <div className="login-remember">
                <input
                  id="remember"
                  type="checkbox"
                  checked={signIn.remember}
                  onChange={(e) =>
                    setSignIn({
                      ...signIn,
                      remember: e.target.checked,
                    })
                  }
                />

                <label htmlFor="remember">
                  Keep me logged in
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={signUp.email}
                  onChange={(e) =>
                    setSignUp({
                      ...signUp,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="new-username">
                  Username
                </label>

                <input
                  id="new-username"
                  type="text"
                  autoComplete="username"
                  value={signUp.username}
                  onChange={(e) =>
                    setSignUp({
                      ...signUp,
                      username: e.target.value,
                    })
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="new-password">
                  Password
                </label>

                <input
                  id="new-password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  autoComplete="new-password"
                  value={signUp.password}
                  onChange={(e) =>
                    setSignUp({
                      ...signUp,
                      password: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() =>
                    setShowPassword((v) => !v)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? mode === "signin"
                ? "Unlocking…"
                : "Creating…"
              : mode === "signin"
              ? "Login"
              : "Create Account"}
          </button>

          {mode === "signin" && (
            <div className="login-forgot">
              <a href="/forgot-password">
                Forgot password?
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}