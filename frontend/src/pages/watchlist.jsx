import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./watchlist.css";

/* =========================================
   POSTER URL
========================================= */

function getPosterUrl(poster) {
  if (!poster) {
    return null;
  }

  // If backend already returns a complete URL
  if (poster.startsWith("http://") || poster.startsWith("https://")) {
    return poster;
  }

  // Django Media URL
  const cleanPoster = poster.replace(/^\/?media\//, "");

  return `http://127.0.0.1:8000/media/${cleanPoster}`;
}


/* =========================================
   CLAPPER ICON
========================================= */

function ClapperIcon() {
  return (
    <svg
      className="poster-icon"
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M3 8.5H20V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5Z" />

      <path d="m3 8.5 1.2-4.2a1 1 0 0 1 1.2-.7l13.3 3.1a1 1 0 0 1 .75 1.2L19 8.5" />

      <path d="M6.5 3.8 8.8 8.2" />

      <path d="M11 3.2l2.3 4.4" />

      <path d="M15.4 2.7l2.3 4.4" />
    </svg>
  );
}


/* =========================================
   STAR ICON
========================================= */

function StarIcon({ filled }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <polygon
        points="
          12 2.5
          15.1 8.9
          22.2 9.9
          17.1 14.9
          18.3 22
          12 18.6
          5.7 22
          6.9 14.9
          1.8 9.9
          8.9 8.9
        "
      />
    </svg>
  );
}


/* =========================================
   STAR RATING
========================================= */

function StarRating({ rating, onRate }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="movie-rating">

      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={star <= rating ? "filled" : ""}
          onClick={() => onRate(star)}
          aria-label={`Rate ${star} out of 5`}
        >
          <StarIcon filled={star <= rating} />
        </button>
      ))}

      <span className="rating-label">
        {rating > 0 ? `${rating}/5` : "Not rated"}
      </span>

    </div>
  );
}


/* =========================================
   MOVIE CARD
========================================= */

function MovieCard({
  movie,
  onToggleWatched,
  onRate,
  onDelete,
}) {
  const watched = movie.status === "Watched";

  const posterUrl = getPosterUrl(movie.poster);

  return (
    <div className="movie-card">

      {/* POSTER */}
      <div className="movie-poster">

        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="movie-poster-image"
            onError={(e) => {
              console.error(
                "Poster failed to load:",
                posterUrl
              );

              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <ClapperIcon />
        )}

        {/* STATUS */}
        <button
          type="button"
          className={`status-badge ${
            watched ? "watched" : ""
          }`}
          onClick={() => onToggleWatched(movie)}
        >
          {watched ? "WATCHED" : "UNWATCHED"}
        </button>

      </div>


      {/* MOVIE INFORMATION */}
      <div className="movie-info">

        <h3 className="movie-title">
          {movie.title}
        </h3>

        <span className="movie-type">
          {movie.type}
        </span>

        <StarRating
          rating={movie.rating || 0}
          onRate={(rating) =>
            onRate(movie, rating)
          }
        />

        {/* DELETE */}
        {onDelete && (
          <button
            type="button"
            className="delete-movie-button"
            onClick={() => onDelete(movie)}
          >
            DELETE
          </button>
        )}

      </div>

    </div>
  );
}


/* =========================================
   WATCHLIST
========================================= */

export default function Watchlist() {

  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);

  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =========================================
     FETCH MOVIES
  ========================================= */

  useEffect(() => {

    const fetchMovies = async () => {

      try {

        setLoading(true);

        setError("");

        const response = await api.get("media/");

        console.log(
          "Movies received from backend:",
          response.data
        );

        setMovies(response.data);

      } catch (err) {

        console.error(
          "Failed to load movies:",
          err
        );

        console.error(
          "Backend response:",
          err.response?.data
        );

        if (err.response?.status === 401) {

          setError(
            "Your session has expired. Please login again."
          );

        } else {

          setError(
            `Server error ${
              err.response?.status || ""
            }: ${
              err.response?.data?.detail ||
              "Unable to load your watchlist."
            }`
          );

        }

      } finally {

        setLoading(false);

      }

    };

    fetchMovies();

  }, []);


  /* =========================================
     ADD MOVIE
  ========================================= */

  const handleAddMovie = () => {

    navigate("/add-movie");

  };


  /* =========================================
     TOGGLE WATCHED
  ========================================= */

  const handleToggleWatched = async (movie) => {

    const newStatus =
      movie.status === "Watched"
        ? "Unwatched"
        : "Watched";

    try {

      const response = await api.patch(
        `media/${movie.id}/`,
        {
          status: newStatus,
        }
      );

      setMovies((currentMovies) =>
        currentMovies.map((item) =>
          item.id === movie.id
            ? response.data
            : item
        )
      );

    } catch (err) {

      console.error(
        "Failed to update status:",
        err
      );

      alert(
        "Unable to update movie status."
      );

    }

  };


  /* =========================================
     RATE MOVIE
  ========================================= */

  const handleRate = async (
    movie,
    rating
  ) => {

    try {

      const response = await api.patch(
        `media/${movie.id}/`,
        {
          rating: rating,
        }
      );

      setMovies((currentMovies) =>
        currentMovies.map((item) =>
          item.id === movie.id
            ? response.data
            : item
        )
      );

    } catch (err) {

      console.error(
        "Failed to update rating:",
        err
      );

      alert(
        "Unable to update rating."
      );

    }

  };


  /* =========================================
     DELETE MOVIE
  ========================================= */

  const handleDelete = async (movie) => {

    const confirmed = window.confirm(
      `Delete "${movie.title}" from your watchlist?`
    );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `media/${movie.id}/`
      );

      setMovies((currentMovies) =>
        currentMovies.filter(
          (item) =>
            item.id !== movie.id
        )
      );

    } catch (err) {

      console.error(
        "Failed to delete movie:",
        err
      );

      alert(
        "Unable to delete this movie."
      );

    }

  };


  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    navigate("/login");

  };


  /* =========================================
     FILTER
  ========================================= */

  const filteredMovies = useMemo(() => {

    if (filter === "watched") {

      return movies.filter(
        (movie) =>
          movie.status === "Watched"
      );

    }

    if (filter === "unwatched") {

      return movies.filter(
        (movie) =>
          movie.status === "Unwatched"
      );

    }

    return movies;

  }, [movies, filter]);


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (
      <div className="watchlist-page">

        <div className="watchlist-loading">

          <div className="loading-ring"></div>

          <p>
            Opening your vault...
          </p>

        </div>

      </div>
    );

  }


  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="watchlist-page">

      {/* HEADER */}

      <header className="watchlist-header">

        <div className="watchlist-title-area">

          <p className="watchlist-brand">
            CINEVAULT
          </p>

          <h1 className="watchlist-title">
            My Watchlist
          </h1>

          <p className="watchlist-subtitle">
            Your personal collection of films.
          </p>

        </div>


        <div className="watchlist-actions">

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddMovie}
          >
            + Add Movie
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* DIVIDER */}

      <div className="watchlist-divider"></div>


      {/* ERROR */}

      {error && (

        <div className="watchlist-error">

          {error}

        </div>

      )}


      {/* FILTERS */}

      <div className="watchlist-filters">

        <button
          type="button"
          className={`filter-chip ${
            filter === "all"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("all")
          }
        >
          ALL
        </button>


        <button
          type="button"
          className={`filter-chip ${
            filter === "unwatched"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("unwatched")
          }
        >
          TO WATCH
        </button>


        <button
          type="button"
          className={`filter-chip ${
            filter === "watched"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("watched")
          }
        >
          WATCHED
        </button>

      </div>


      {/* MOVIE GRID */}

      <div className="watchlist-grid">

        {filteredMovies.length === 0 ? (

          <div className="watchlist-empty">

            <div className="empty-icon">
              🎬
            </div>

            <h2>
              Your vault is empty
            </h2>

            <p>
              Add your first movie to start
              building your collection.
            </p>

            <button
              type="button"
              className="empty-add-btn"
              onClick={handleAddMovie}
            >
              + Add Movie
            </button>

          </div>

        ) : (

          filteredMovies.map(
            (movie) => (

              <MovieCard
                key={movie.id}
                movie={movie}
                onToggleWatched={
                  handleToggleWatched
                }
                onRate={
                  handleRate
                }
                onDelete={
                  handleDelete
                }
              />

            )
          )

        )}

      </div>

    </div>
  );
}