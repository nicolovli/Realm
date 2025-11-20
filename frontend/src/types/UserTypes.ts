export interface CreateUserResponse {
  createUser: {
    id: string;
    username: string;
    email: string;
  };
}

export interface CreateUserVariables {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserResponse {
  loginUser: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}

export interface LoginUserVariables {
  username: string;
  password: string;
}
