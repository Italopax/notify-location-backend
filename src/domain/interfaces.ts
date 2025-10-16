export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenOutput {
  accessToken: string;
}

export interface Session {
  userId: string;
};