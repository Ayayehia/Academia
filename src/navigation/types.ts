// Route param lists for each navigator. Real routes are added per epic.

export type AuthStackParamList = {
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  NewPassword: { email: string };
};

export type AppStackParamList = {
  Home: undefined;
  Settings: undefined;
  // Placeholder for Story 2.3 (Course Detail). Carousel taps route here for now.
  CourseDetail: { courseId: string };
};
