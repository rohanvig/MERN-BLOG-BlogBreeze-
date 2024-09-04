import express from 'express';
import { verifyToken } from '../utils/verifyUser.js'
import {create,getposts,deletepost,updatepost,premiumblogs}  from '../controllers/post.controller.js';
import {verifyPayment} from '../middleware/verifyPayment.js' 

const router =express.Router();
router.post('/create',verifyToken,create);
router.get('/getposts',getposts)
router.delete('/deletepost/:postId/:userId',verifyToken,deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
router.get('/premium-blogs',verifyToken,verifyPayment,premiumblogs )
export default router;