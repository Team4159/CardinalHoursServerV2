import express from "express";

import User, { getUserByPassword, updateUser } from "../../models/User.model";
import { createSession, getSessionsByUserId } from "../../models/Session.model";
import Time, { isOverlappingPreviousTimes } from "../../utils/time";

const router = express.Router();

// Middleware to check if a password in passed in the body
router.use(async (req, res, next) => {
    if (!req.body || !req.body.password) {
        return res.status(401).json({
            description: "Missing password!", // TODO: Standardize error message punctuation
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

        throw err; // TODO: Update other routes with error handling
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

    await updateUser(user.user_id, {
        signed_in: true,
        last_signed_in: Date.now(),
    });

    return res.status(200).json({
        description: `Signed in as ${user.first_name} ${user.last_name}!`,
    });
});

router.post("/sign-out", async (_req, res) => {
    const user: User = res.locals.user;

    if (!user.signed_in) {
        return res.status(400).json({
            description: `${user.first_name} ${user.last_name} is not signed in!`,
        });
    }

    await updateUser(user.user_id, { signed_in: false });
    await createSession(user.user_id, user.last_signed_in, Date.now(), false);

    return res.status(200).json({
        description: `Signed out as ${user.first_name} ${user.last_name}!`,
    });
});

router.post("/session", async (req, res) => {
    const user: User = res.locals.user;

    if (!req.body.start_time || !req.body.end_time) {
        return res.status(400).json({
            description: "Missing start and/or end times!",
        });
    }

    let newSessionTime: Time;

    try {
        newSessionTime = new Time(req.body.start_time, req.body.end_time);
    } catch (err) {
        if (err instanceof InvalidTimeError) {
            return res.status(400).json({
                description: "Start time must be less than end time!",
            });
        }

        throw err;
    }

    const previousSessions = await getSessionsByUserId(user.user_id);
    let previousSessionTimes: Time[] = [];

    for (const session of previousSessions) {
        previousSessionTimes.push(
            new Time(session.start_time, session.end_time)
        );
    }

    if (isOverlappingPreviousTimes(newSessionTime, previousSessionTimes)) {
        return res.status(400).json({
            description: "New session overlaps with existing session!",
        });
    }

    await createSession(
        user.user_id,
        req.body.start_time,
        req.body.end_time,
        true
    );

    return res.status(200).json({
        description: "Amended new session",
    });
});

export default router;
