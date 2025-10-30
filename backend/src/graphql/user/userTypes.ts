export interface CreateUserArgs {
  username: string;
  email: string;
  password: string;
}

export interface LoginArgs {
  username: string;
  password: string;
}

export interface AuthPayload {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface PrismaError {
  code?: string;
  meta?: {
    target?: string[];
  };
}
