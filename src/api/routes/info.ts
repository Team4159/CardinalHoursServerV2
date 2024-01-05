import express from "express";

const router = express.Router();

// Return all users
router.get("/users", (req, res) => {
    // Return user_id, first_name, last_name, signed_in, last_signed_in, total_time for all users
});

// Return user given valid ID
router.get("/users/:id", (req, res) => {
    // req.params.id

    // Is user ID valid?

    // Return user_id, first_name, last_name, signed_in, last_signed_in, total_time of given user
});

export default router;