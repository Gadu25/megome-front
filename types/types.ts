export type LoginResponse = {
  'access-token': string;
  'message': string;
};

export type LoginPayload = {
  'email': string;
  'password': string;
}

export type LogoutResponse = {
  'message': string;
}