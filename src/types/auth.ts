export type LoginPayload = {
  emailOrPhone: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  emailOrPhone: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};
