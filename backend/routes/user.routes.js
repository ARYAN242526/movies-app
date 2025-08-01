import { Router } from "express";
import {
       createUser,
       getAllUsers,
       loginUser,
       logoutUser,
       getCurrentUserProfile,
       updateCurrentUserProfile
      } from "../controllers/user.controller.js";

import { authenticate , authorizeAdmin } from "../middlewares/auth.middleware.js";
const router = Router();

router
      .route('/')
      .post(createUser)
      .get(authenticate , authorizeAdmin, getAllUsers)


router.post('/auth' , loginUser);
router.post('/logout',authenticate, logoutUser);

router
      .route('/profile')
      .get(authenticate , getCurrentUserProfile)
      .put(authenticate , updateCurrentUserProfile)

export default router;