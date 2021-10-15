const express = require('express');

const userController = require('../controllers/user');
const isAdmin = require('../middleware/isAdmin');

const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/get', isAuth, userController.getUser);

router.get('/get-all', isAuth, userController.getAllUsers);

router.get('/list-users/:limit/:offset', isAuth, userController.listUsers);

router.get('/verify-email/:token', userController.verifyUserEmail);

router.post('/resend', isAuth, userController.resendVerificationEmail);

router.post('/edit', isAuth, userController.updateUserData);

router.post('/reset-password', userController.resetPassword);

router.delete('/delete', isAuth, userController.deleteUser);

router.delete(
  '/delete-all-user-schedule',
  isAuth,
  isAdmin,
  userController.emptyUsersSchedule
);

module.exports = router;
