exports.userData = (user) => ({
  userId: user._id,
  email: user.email,
  emailVerified: user.emailVerified,
  isAdmin: user.isAdmin,
  data: user.data,
  schedule: user.schedule,
  league: user.league,
});
