interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string | null;
  role: string;
  profile_picture: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface TokenUser {
  name: string;
  userId: string;
  email: string;
  role: string;
  bio?: string | null;
  image?: string;
}

export const createTokenUser = (user: Partial<User>) => {
  return {
    name: user.name,
    userId: user.id,
    email: user.email,
    role: user.role,
    bio: user.bio,
    image: user.profile_picture,
  };
};
