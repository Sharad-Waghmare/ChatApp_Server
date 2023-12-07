import express from "express";
import { addMessage, getMessage } from "../controllers/messageController";


const router = express.Router();


router.post('/addmsg', addMessage);
router.post('/getmsg', getMessage);

export default router;