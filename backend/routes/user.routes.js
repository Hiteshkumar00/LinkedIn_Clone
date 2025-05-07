import {
  register, 
  login, 
  uploadProfilePicture, 
  updateUser, 
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadResume,
  sendConnectionRequest,
  getMyConnectionsRequest,
  acceptConnectionRequest,
  whatAreMyConnections,
  getUserByUsername

} from "../controllers/user.controller.js";

import wrapAsync from "../middleware/wrapAsync.js";

import {Router} from "express";
const router = Router();

//1 reginster
router.route("/register").post(wrapAsync(register));

//2 login
router.route("/login").post(wrapAsync(login));

//3 upload profile picture
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.route("/update_profile_picture").post(
  upload.single('profile_picture'),
  wrapAsync(uploadProfilePicture)
);

//4 update user profile
router.route("/user_update").post(wrapAsync(updateUser));

// 5. get user and profile
router.route("/get_user_and_profile").get(wrapAsync(getUserAndProfile));

// 6. update profile data
router.route("/update_profile_data").post(wrapAsync(updateProfileData));

// 7. get All Users
router.route("/get_all_users").get(wrapAsync(getAllUserProfile));

// 8. download resume pdf
router.route("/download_resume").get(wrapAsync(downloadResume));


// 9. send connection request
router.route("/send_connection_request").post(wrapAsync(sendConnectionRequest));

// 10. get my connections
router.route("/my_connections_requests").get(wrapAsync(getMyConnectionsRequest));

// 11. accept connection request
router.route("/accept_connection_request").post(wrapAsync(acceptConnectionRequest));

// 12. what are my connections
router.route("/user_connection_requests").get(wrapAsync(whatAreMyConnections));

// 13. get user by username

router.route("/getUserByUsername").get(wrapAsync(getUserByUsername));

export default router;