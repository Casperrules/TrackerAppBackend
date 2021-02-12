//handle routes forsensor data
import { Router } from 'express';
import { type } from 'os';
import {sensor} from '../database/tables/SensorData';
console.log(2);
const router = Router();
/**
 *@api {get} request on /sensor/sensorData handles get request to get sensor data from database for a given timestamp range
 *  parameters: emp_id
 *              start_timestamp
 *              end_timestamp
 *
 */
router.get("/sensorData/:start/:end/:emp_id",async (req,res)=>{
    if(!req.params.emp_id){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter emp_id provided is not correct"
        });
        return;
    }
    if(!req.params.start){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter start data provided is not correct"
        });
        return;
    }
    if(!req.params.end){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter end date provided is not correct"
        });
        return;
    }
    else{
        const id = parseInt(req.params.emp_id);
        //recieved timestamp captured
        const start = parseInt(req.params.start);
        const end = parseInt(req.params.end);
        console.log(start);
        console.log(end);
        console.log(id);
        if(start>end){
            res.status(400).json({
                success: false,
                error: "wrongValues",
                message:"Values provided are not correct"
            });
            return;
        }
        const data = sensor.getSensorData(id,start,end).then(data=>res.send(data));
        

    }
});

router.post("/updateData", async (req,res)=>{
    
    // console.log(req);
    // console.log(req.body);
    let data = req.body;
    for(let i =0;i<data.length;i++){
        console.log(data[i]);
        let {col1,col2,col3,col4,col5,col6,col7,col8} = data[i];
        console.log(col1+"\t"+col2+"\t"+col3+"\t"+col4+"\t"+col5+"\t"+col6+"\t"+col7+"\t"+col8);
        sensor.insertSensorData(col1,col2,col3,col4,col5,col6,col7,col8);
    }
    res.send("testing");

});

export default router;