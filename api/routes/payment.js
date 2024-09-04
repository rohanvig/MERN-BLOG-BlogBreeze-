import express from "express";
import { verifyToken } from "../utils/verifyUser.js"
import {Payment,paymentUpdate} from "../controllers/payment.controller.js"

const router = express.Router();




router.post("/create-payment-intent",verifyToken ,Payment)

router.post("/update-subscription", verifyToken,paymentUpdate);

export default router;
