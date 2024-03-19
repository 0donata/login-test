import axios, { AxiosInstance } from "axios";

class AuthService {
  private apiInstance: AxiosInstance;

  constructor() {
    this.apiInstance = axios.create({
      baseURL: "https://auth-qa.qencode.com/v1/auth",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  login(email: string, password: string) {
    return this.apiInstance.post("/login", { email, password });
  }

  refreshToken(refreshToken: string) {
    return this.apiInstance.post("/refresh-token", { refreshToken });
  }

  resetPassword(email: string, redirect_url: string) {
    return this.apiInstance.post("/password-reset", { email, redirect_url });
  }

  setNewPassword(
    token: string,
    secret: string,
    password: string,
    passwordConfirm: string
  ) {
    return this.apiInstance.post("/password-set", {
      token,
      secret,
      password,
      password_confirm: passwordConfirm,
    });
  }
}

export default new AuthService();
