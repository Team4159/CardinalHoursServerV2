import express from "express"

import infoRouter from "./routes/info";
import usersRouter from "./routes/users";

const router = express.Router();

router.use("/info", infoRouter);
router.use("/users", usersRouter);

export default router;