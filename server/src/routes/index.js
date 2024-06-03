import express from "express";
import userRoute from "./user.route";
import mediaRoute from "./media.route";
import personRoute from "./person.route";
import reviewRoute from "./review.route";

const router = express.Router();

router.use("/user", userRoute);
router.use("/person", personRoute);
router.use("/review", reviewRoute);
router.use("/:mediaType", mediaRoute);

export default router;
