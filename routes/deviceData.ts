import { Router } from 'express';
import { type } from 'os';
import {device} from '../database/tables/device';

const router = Router();

router.post("/startDeviceUse/:emp_id/:device_id/:on_time", async (req,res)=>{
    //url parametes to insert new entry for device
    if(!req.params.emp_id){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter emp_id provided is not correct"
        });
        return;
    }
    if(!req.params.device_id){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter emp_id provided is not correct"
        });
        return;
    }
    if(!req.params.on_time){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter emp_id provided is not correct"
        });
        return;
    }

    else{
        const emp_id = parseInt(req.params.emp_id);
        const device_id = parseInt(req.params.device_id);
        const on_time = parseInt(req.params.on_time);
        device.makeDeviceUseStartRecord(emp_id,device_id,on_time);
        res.send("succesfully added device data");
    }

});

router.post("/endDeviceUse/:emp_id/:device_id/:on_time/:off_time",async(req,res)=>{
    if(!req.params.emp_id){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter emp_id provided is not correct"
        });
        return;
    }
    if(!req.params.device_id){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter emp_id provided is not correct"
        });
        return;
    }
    if(!req.params.on_time){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter emp_id provided is not correct"
        });
        return;
    }
    else{
        const emp_id = parseInt(req.params.emp_id);
        const device_id = parseInt(req.params.device_id);
        const on_time = parseInt(req.params.on_time);
        const off_time = parseInt(req.params.off_time);
        device.makeDeviceUseEndRecord(emp_id,device_id,on_time,off_time);
        res.send("succesfully added device data");
    }
})

router.post("/getUser/:device_id/:timestamp",async(req,res)=>{
    if(!req.params.timestamp){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter emp_id provided is not correct"
        });
        return;
    }
    if(!req.params.device_id){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter emp_id provided is not correct"
        });
        return;
    }
    const device_id = parseInt(req.params.device_id);
    const timestamp = parseInt(req.params.timestamp);

    const emp_id = device.getUserByDeviceID(device_id,timestamp).then(emp_id=>res.json(emp_id));;
    //do something with emp_id

});
export default router;