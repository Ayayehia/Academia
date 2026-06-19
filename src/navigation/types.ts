// Route param lists for each navigator. Real routes are added per epic.

export type AuthStackParamList = {
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  NewPassword: { email: string };
};

export type AppStackParamList = {
  HomePlaceholder: undefined;
  Settings: undefined;
};
