import express from "express";

const router = express.Router();

router.get("/users", (req, res) => {

});

router.get("/users/:id", (req, res) => {
    // req.params.id
});

export default router;