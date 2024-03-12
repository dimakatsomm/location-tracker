import { LocationController } from "controllers/location.controller";
import express from "express";
import { validateUserToken } from "middleware";
import Container from "typedi";

const router = express.Router();
const controller = Container.get(LocationController);

router.get("/", validateUserToken(), controller.locationHistory);
router.post("/", validateUserToken(), controller.saveLocation);

export default router;