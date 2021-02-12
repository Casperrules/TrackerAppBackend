import { Router } from 'express';
import auth from "./authentication";
import sensorData from "./sensorData";
import deviceData from "./deviceData";

const router = Router();

/* /auth handles the authentication routes for signin, signup, reset password */
router.use("/auth",auth);
/* /sensor routes to the urls for getting sensor data*/
router.use("/sensor",sensorData);
/* /device routes to handle information about the device*/
router.use("/device",deviceData);
export default router;