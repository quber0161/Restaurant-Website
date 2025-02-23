import express from "express";
import { addExtra, listExtras, removeExtra } from "../controllers/extraController.js";

const extraRouter = express.Router();

extraRouter.post("/add", addExtra);
extraRouter.get("/list", listExtras);
extraRouter.post("/remove", removeExtra);

export default extraRouter;
