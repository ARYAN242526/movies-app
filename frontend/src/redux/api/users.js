import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
import { setCredentials, logout as logoutAction } from "../features/auth/authSlice.js";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // store user + token in redux/localStorage
          dispatch(setCredentials(data.data));
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch }) {
        try {
          // clear redux + localStorage
          dispatch(logoutAction());
        } catch (err) {
          console.error("Logout failed:", err);
        }
      },
    }),

    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // update redux state with updated profile
          dispatch(setCredentials(data.data));
        } catch (err) {
          console.error("Profile update failed:", err);
        }
      },
    }),

    getUsers : builder.query({
      query : () => ({
        url: USERS_URL,
      })
    })
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetUsersQuery,
} = userApiSlice;
