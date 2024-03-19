import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import AuthService from "../services/AuthService";
import axios from "axios";

interface LoginPayload {
  email: string;
  password: string;
}

interface SetNewPasswordPayload {
  token: string;
  secret: string;
  password: string;
  passwordConfirm: string;
}

interface ResetPasswordPayload {
  email: string;
  redirect_url: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpire: number | null;
  refreshTokenExpire: number | null;
  loginSuccessMessage: string | null;
  isLoading: boolean;
  loginError: string | null;
  resetError: string | null;
  newPasswordError: string | null;
  isResetEmail: boolean;
  isNewPasswordSet: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  tokenExpire: null,
  refreshTokenExpire: null,
  loginSuccessMessage: null,
  isLoading: false,
  loginError: null,
  resetError: null,
  newPasswordError: null,
  isResetEmail: false,
  isNewPasswordSet: false,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(email, password);
      if (
        response.status === 200 &&
        response.data.access_token &&
        response.data.refresh_token
      ) {
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);

        return response.data;
      } else {
        return rejectWithValue("Login failed: No tokens received");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response || !error.response.data) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
    }
  }
);

export const resetPasswordRequest = createAsyncThunk(
  "auth/resetPasswordRequest",
  async (
    { email, redirect_url }: ResetPasswordPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.resetPassword(email, redirect_url);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
    }
  }
);

export const setNewPassword = createAsyncThunk(
  "auth/setNewPassword",
  async (
    { token, secret, password, passwordConfirm }: SetNewPasswordPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.setNewPassword(
        token,
        secret,
        password,
        passwordConfirm
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetErrors(state) {
      state.resetError = null;
      state.loginError = null;
      state.newPasswordError = null;
    },
    clearLoginSuccessMessage(state) {
      state.loginSuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.loginError = null;
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.tokenExpire = action.payload.token_expire;
      state.refreshTokenExpire = action.payload.refresh_token_expire;
      state.loginSuccessMessage = "Login successful!";
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      const payload = action.payload as { detail?: string };
      state.loginError = payload.detail || "Login failed";
    });
    builder
      .addCase(resetPasswordRequest.fulfilled, (state) => {
        state.isResetEmail = true;
      })
      .addCase(resetPasswordRequest.rejected, (state, action) => {
        const payload = action.payload as { detail?: string };
        state.resetError = payload.detail || "An error occurred";
      });
    builder.addCase(setNewPassword.fulfilled, (state) => {
      state.isNewPasswordSet = true;
    });
    builder.addCase(setNewPassword.rejected, (state, action) => {
      const payload = action.payload as { detail?: string };
      state.newPasswordError = payload.detail || "An error occurred";
    });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
export const { resetErrors, clearLoginSuccessMessage } = authSlice.actions;
