exports.userData = (user) => ({
  userId: user._id,
  email: user.email,
  emailVerified: user.emailVerified,
  isAdmin: user.isAdmin,
  displayName: user.displayName,
  avatarUrl: user.avatarUrl,
  phone: user.phone,
  scheduled: user.scheduled,
  category: user.category,
});
