import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainStackParamList> | undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  PhoneVerification: undefined;
};

export type MainStackParamList = {
  Deliveries: undefined;
  OptimizedRoute: undefined;
  Settings: undefined;
};
