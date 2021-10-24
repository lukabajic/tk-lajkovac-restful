const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'drqml7o5d',
  api_key: '773451592588417',
  api_secret: 'At8W2Ca3PZ1j0duzExw9j4mpqxI',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'DEV',
  },
});

const upload = multer({ storage: storage });

const userController = require('../controllers/user');
const isAdmin = require('../middleware/isAdmin');

const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/get', isAuth, userController.getUser);

router.get('/get-all', isAuth, userController.getAllUsers);

router.get('/list-users/:limit/:offset', isAuth, userController.listUsers);

router.get('/verify-email/:token', userController.verifyUserEmail);

router.post('/resend', isAuth, userController.resendVerificationEmail);

router.post(
  '/edit',
  isAuth,
  upload.single('avatar'),
  userController.updateUserData
);

router.post('/reset-password', userController.resetPassword);

router.delete('/delete', isAuth, userController.deleteUser);

router.delete(
  '/delete-all-user-schedule',
  isAuth,
  isAdmin,
  userController.emptyUsersSchedule
);

module.exports = router;
