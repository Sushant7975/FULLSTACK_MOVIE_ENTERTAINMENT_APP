import express from "express";
import body from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller";
import requestHandler from "../handlers/request.handler";
import userModel from "../models/user.model";
import tokenMiddleware from "../middlewares/token.middleware";

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 8 })
    .withMessage("username must be 8 character")
    .custom(async (value) => {
      const user = await userModel.findOne({ username: value });

      if (user) return Promise.reject("username already used");
    }),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be 8 characters"),
  body("confirmPassword")
    .exists()
    .withMessage("confirmPassword is required")
    .isLength({ min: 8 })
    .withMessage("confirmPassword must be 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("confirmPassword not match");
      return true;
    }),
  body("dispalyName")
    .exists()
    .withMessage("dispalyName is required")
    .isLength({ min: 8 })
    .withMessage("displayName must be 8 characters"),
  requestHandler.validate,
  userController.signup
);

router.post(
  "/signin",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 8 })
    .withMessage("username must be 8 characters"),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be 8 characters"),
  requestHandler.validate,
  userController.signin
);

router.put(
  "update-password",
  tokenMiddleware.auth,
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be 8 characters"),
  body("newPassword")
    .exists()
    .withMessage("newPassword is required")
    .isLength({ min: 8 })
    .withMessage("newPassword must be 8 characters"),
  body("cofirmNewPassword")
    .exists()
    .withMessage("confirmNewPassword is required")
    .isLength({ min: 8 })
    .withMessage("confirmnewPassword must be 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword)
        throw new Error("conformNewPassword not match");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

router.get("/info", tokenMiddleware.auth, userController.getInfo);

router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getFavoritesOfUser
);

router.post(
  "/favorites",
  tokenMiddleware.auth,
  body("mediaType")
    .exists()
    .withMessage("mediaType is required")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("invalid mediaType"),
  body("mediaId")
    .exists()
    .withMessage("mediaid is required")
    .isLength({ min: 1 })
    .withMessage("mediaId can not be empty"),
  body("mediaTitle").exists().withMessage("mediaTitle is required"),
  body("mediaPoster").exists().withMessage("mediaPoster is required"),
  body("mediaRate").exists().withMessage("mediaRate is required"),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

export default router;
