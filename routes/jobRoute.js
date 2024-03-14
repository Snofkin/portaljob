

import { Router } from "express";
import JobController from "../controllers/jobController.js";
import userAuth from "../middlewares/authMIddleware.js";





const router = Router();
const jobController = new JobController()

router.get('/getJobs',userAuth,jobController.getAllJobs);
router.post('/createJob',userAuth,jobController.createJob);
router.put('/updateJob/:id',userAuth,jobController.updateJob);
router.delete("/removeJob/:id",userAuth,jobController.removeJob)
router.get("/job-stats",userAuth,jobController.jobStats)
router.get("/jobfilter",userAuth,jobController.filterJob)





export default router;