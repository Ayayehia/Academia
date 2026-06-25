// Route param lists for each navigator. Real routes are added per epic.

import { type NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  NewPassword: { email: string };
};

// Bottom tabs shown on the main app sections.
export type MainTabsParamList = {
  Home: undefined;
  Listing: undefined;
  Settings: undefined;
};

// App stack: the tabs plus screens pushed *over* them (which hides the tab bar).
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList> | undefined;
  // Placeholder for Story 2.3 (Course Detail). Carousel taps route here for now.
  CourseDetail: { courseId: string };
  // Placeholder subscription flow. The banner CTA routes here for now.
  Subscription: undefined;
};
