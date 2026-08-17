import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Add.css";

export default function AddMovie() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Movie");
  const [status, setStatus] = useState("Unwatched");
  const [rating, setRating] = useState(0);

  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // POSTER SELECTION
  // =========================================

  const handlePosterChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Only allow images
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Limit to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Poster image must be smaller than 5 MB.");
      return;
    }

    setError("");

    setPoster(file);

    // Preview image
    const previewUrl = URL.createObjectURL(file);
    setPosterPreview(previewUrl);
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a movie title.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // FormData is required when sending an image
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("type", type);
      formData.append("status", status);

      if (rating > 0) {
        formData.append("rating", rating);
      }

      if (poster) {
        formData.append("poster", poster);
      }

      await api.post("media/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/watchlist");

    } catch (err) {
      console.error("Failed to add movie:", err);

      console.error(
        "Backend response:",
        err.response?.data
      );

      setError(
        err.response?.data?.detail ||
        "Unable to add this movie. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-movie-page">

      <div className="add-movie-container">

        {/* BACK */}

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/watchlist")}
        >
          ← Back to Watchlist
        </button>

        {/* TITLE */}

        <p className="add-movie-brand">
          CINEVAULT
        </p>

        <h1>Add a Movie</h1>

        <p className="add-movie-subtitle">
          Add a film to your personal collection.
        </p>

        <form onSubmit={handleSubmit}>

          {/* =====================================
              TITLE
          ===================================== */}

          <div className="form-group">

            <label htmlFor="title">
              Movie / Show Title
            </label>

            <input
              id="title"
              type="text"
              placeholder="Enter movie title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

          </div>


          {/* =====================================
              TYPE
          ===================================== */}

          <div className="form-group">

            <label htmlFor="type">
              Type
            </label>

            <select
              id="type"
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              <option value="Movie">
                Movie
              </option>

              <option value="TV">
                TV Show
              </option>

            </select>

          </div>


          {/* =====================================
              STATUS
          ===================================== */}

          <div className="form-group">

            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="Unwatched">
                Unwatched
              </option>

              <option value="Watched">
                Watched
              </option>

            </select>

          </div>


          {/* =====================================
              RATING
          ===================================== */}

          <div className="form-group">

            <label>
              Rating
            </label>

            <div className="add-rating">

              {[1, 2, 3, 4, 5].map(
                (star) => (

                  <button
                    key={star}
                    type="button"
                    className={
                      star <= rating
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setRating(star)
                    }
                  >
                    ★
                  </button>

                )
              )}

              <span>
                {rating > 0
                  ? `${rating}/5`
                  : "Not rated"}
              </span>

            </div>

          </div>


          {/* =====================================
              POSTER
          ===================================== */}

          <div className="form-group">

            <label htmlFor="poster">
              Movie Poster
            </label>

            <div className="poster-upload">

              {posterPreview ? (

                <div className="poster-preview">

                  <img
                    src={posterPreview}
                    alt="Movie poster preview"
                  />

                  <button
                    type="button"
                    className="remove-poster"
                    onClick={() => {
                      setPoster(null);
                      setPosterPreview("");
                    }}
                  >
                    Remove
                  </button>

                </div>

              ) : (

                <label
                  htmlFor="poster"
                  className="poster-upload-box"
                >

                  <div className="upload-icon">
                    🎬
                  </div>

                  <span>
                    Choose Movie Poster
                  </span>

                  <small>
                    JPG, PNG or WEBP · Max 5MB
                  </small>

                </label>

              )}

              <input
                id="poster"
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                hidden
              />

            </div>

          </div>


          {/* =====================================
              ERROR
          ===================================== */}

          {error && (
            <div className="add-movie-error">
              {error}
            </div>
          )}


          {/* =====================================
              BUTTONS
          ===================================== */}

          <div className="add-movie-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/watchlist")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-movie-button"
              disabled={loading}
            >
              {loading
                ? "Adding..."
                : "Add Movie"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}