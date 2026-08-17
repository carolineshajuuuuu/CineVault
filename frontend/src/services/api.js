import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});


/* =========================================
   REQUEST INTERCEPTOR
========================================= */

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("access_token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },
  (error) => {

    return Promise.reject(error);

  }
);


/* =========================================
   RESPONSE INTERCEPTOR
   Automatically refresh expired access token
========================================= */

api.interceptors.response.use(

  /* Successful response */

  (response) => {

    return response;

  },


  /* Error response */

  async (error) => {

    const originalRequest = error.config;


    /*
      Only try refresh when:

      1. Server returned 401
      2. This request hasn't already been retried
      3. A refresh token exists
    */

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      const refreshToken =
        localStorage.getItem("refresh_token");


      /*
        If there is no refresh token,
        send the user to login.
      */

      if (!refreshToken) {

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "refresh_token"
        );

        window.location.href = "/login";

        return Promise.reject(error);

      }


      originalRequest._retry = true;


      try {

        /*
          Ask Django for a new access token
        */

        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/refresh/",
          {
            refresh: refreshToken,
          }
        );


        const newAccessToken =
          response.data.access;


        /*
          Save new access token
        */

        localStorage.setItem(
          "access_token",
          newAccessToken
        );


        /*
          Update the failed request
        */

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;


        /*
          Try the original request again
        */

        return api(originalRequest);

      } catch (refreshError) {

        console.error(
          "Refresh token failed:",
          refreshError
        );


        /*
          Refresh token is also invalid.
          User must login again.
        */

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "refresh_token"
        );

        window.location.href = "/login";

        return Promise.reject(
          refreshError
        );

      }

    }


    return Promise.reject(error);

  }

);


export default api;