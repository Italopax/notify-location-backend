export type ChangePasswordDTO = {
  actualPassword: string;
  newPassword: string;
}

export type RecoveryPasswordDTO = {
  email: string;
  verificationCode: string;
  newPassword: string;
}

export interface SendLocationDTO {
  latitude: string;
  longitude: string;
}
