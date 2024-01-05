import express from "express"

import infoRouter from "./routes/info";

const router = express.Router();

router.use("/info", infoRouter);

export default router;