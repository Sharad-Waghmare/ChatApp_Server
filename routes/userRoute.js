import express from "express";
import { getAllusers, loginRouter, registerRouter, setAvatar } from "../controllers/userController";


const router = express.Router();

router.post('/register', registerRouter);
router.post('/login', loginRouter);
router.post('/avatar/:id', setAvatar);
router.get('/allusers/:id', getAllusers);

export default router;