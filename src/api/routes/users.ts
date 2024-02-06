import express from "express";

import User, { getUserByPassword, updateUser } from "../../models/User.model";
import { createSession, deleteSessionBySessionId, doesSessionExist, getSessionBySessionId, getSessionsByUserId, updateSession } from "../../models/Session.model";
import Time, { isOverlappingPreviousTimes } from "../../utils/time";
import { InvalidTimeError, RowNotFoundError } from "../../utils/errors";

const router = express.Router();

// Middleware to check if a password in passed in the body
router.use(async (req, res, next) => {
    if (!req.body || !req.body.password) {
        return res.status(401).json({
            description: "Missing password!", // TODO: Standardize error message punctuation
        });
    }

    let user: User;

    try {
        user = await getUserByPassword(req.body.password);
    } catch (err) {
        if (err instanceof RowNotFoundError) {
            return res.status(403).json({
                description: "Invalid password!",
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

// TODO: ADD GET SESSIONS AND GET SESSION

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
        description: "Amended new session!",
    });
});

router.patch("/session", async (req, res) => {
    const user: User = res.locals.user;

    if (!req.body.session_id || !req.body.start_time || !req.body.end_time) {
        return res.status(400).json({
            description: "Missing session ID and/or start time and/or end time!",
        });
    }

    let editedSessionTime: Time;

    try {
        editedSessionTime = new Time(req.body.start_time, req.body.end_time);
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
        if (session.session_id === req.body.session_id) {
            continue;
        }

        previousSessionTimes.push(
            new Time(session.start_time, session.end_time)
        );
    }

    if (isOverlappingPreviousTimes(editedSessionTime, previousSessionTimes)) {
        return res.status(400).json({
            description: "Edited session overlaps with existing session!",
        });
    }

    await updateSession(req.body.session_id, {
        start_time: editedSessionTime.startTime,
        end_time: editedSessionTime.endTime,
    });

    return res.status(200).json({
        description: "Edited session!",
    });
});

router.delete("/session", async (req, res) => {
    if (!req.body.session_id) {
        return res.status(400).json({
            description: "Missing session ID!",
        });
    }

    if (!(await doesSessionExist(req.body.session_id))) {
        return res.status(400).json({
            description: "Session does not exist!",
        });
    }

    if ((await getSessionBySessionId(req.body.session_id)).user_id !== res.locals.user.user_id) {
        return res.status(403).json({
            description: "Cannot delete session by other user!",
        });
    }

    const deleted = await deleteSessionBySessionId(req.body.session_id);

    if (!deleted) { // Should never happen
        return res.status(500).json({
            description: "Could not delete session!",
        })
    }

    return res.status(200).json({
        description: "Deleted session!",
    });
});

export default router;
