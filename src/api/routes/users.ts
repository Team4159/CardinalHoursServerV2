import express from "express";
import { createSession } from "../../models/Session.model";

import User, { getUserByPassword, updateUser } from "../../models/User.model";


const router = express.Router();

// Middleware to check if a password in passed in the body
router.use(async (req, res, next) => {
    if (!req.body.password) {
        return res.status(401).json({
            description: "Missing Password",
        });
    }

    let user;

    try {
        user = await getUserByPassword(req.body.password);
    } catch (err) {
        if (err instanceof RowNotFoundError) {
            return res.status(403).json({
                description: err.message,
            });
        }

        return res.sendStatus(500);
    }

    res.locals.user = user;
    return next();
});

router.post("/sign-in", async (_req, res) => {
    const user: User = res.locals.user;
    
    if (user.signed_in) {
        return res.status(400).json({
            description: `${user.first_name} ${user.last_name} is already signed in!`,
        });
    }

    await updateUser(user.user_id, { signed_in: true, last_signed_in: Date.now() });

    return res.status(200).json({
        description: `Signed in as ${user.first_name} ${user.last_name}`
    });
});



export default router;