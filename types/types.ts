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

export type Profile = {
  id: number
  userId: number
  firstName: string
  lastName: string
  bio: string
  phone: string
  website: string
  location: string
  profileImage: string
  createdAt: string
  updatedAt: string
}