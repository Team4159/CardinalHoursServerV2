import express from "express";

import User, { getAllUsers, getUserById } from "../../models/User.model";
import { RowNotFoundError } from "../../utils/errors";

const router = express.Router();

// Returns user_id, first_name, last_name, signed_in, last_signed_in, total_time for all users
router.get("/users", async (req, res) => {
    const users = await getAllUsers();
    users.map((user: Partial<User>) => {delete user.password}); // Remove password field

    return res.status(200).json({
        description: "Returning all users!",
        users: users,
    })
});

// Return user_id, first_name, last_name, signed_in, last_signed_in, total_time of user with given valid ID
router.get("/users/:id", async (req, res) => {
    // Is user ID a number?
    if (isNaN(Number(req.params.id))) {
        return res.status(400).json({
            description: "User ID is not a number!",
        });
    }

    let user: Partial<User>;

    try {
        user = await getUserById(Number(req.params.id));
    } catch (err) {
        if (err instanceof RowNotFoundError) {
            return res.status(404).json({
                description: "User not found!",
            });
        }

        return res.sendStatus(500);
    }

    delete user.password; // Remove password field
    
    return res.status(200).json({
        description: "User found!",
        user: user,
    }); 
});

export default router;