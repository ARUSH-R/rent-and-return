export const isAdmin = (user) => {
  return user?.role === 'ADMIN';
};

export const isUser = (user) => {
  return user?.role === 'USER';
};
