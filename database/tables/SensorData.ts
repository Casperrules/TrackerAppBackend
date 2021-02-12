import { pool } from '../utils';
import { sensorData } from '../../models/sensorData';

export const sensor={
    ensureTable: async (): Promise<void> => {
        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS sensorValues(
                emp_id INT(16) NOT NULL,
                timestamp INT(11),
                sensor1 FLOAT(10),
                sensor2 FLOAT(10),
                sensor3 FLOAT(10),
                sensor4 FLOAT(10),
                sensor5 FLOAT(10),
                sensor6 FLOAT(10),                
                PRIMARY KEY(emp_id,timestamp)
            );
            `
            );
    },
    // makeSensorRecord : async (emp_id: sensorData['emp_id'],timestamp: sensorData['timestamp'],violation_count: sensorData['violation_count'],sensor1: sensorData['sensor1'],sensor2: sensorData['sensor1'],sensor3: sensorData['sensor1'],action: sensorData['action'],date: sensorData['date'],month: sensorData['month'],year: sensorData['year']):Promise<void>=>{
    //     await pool.query(
    //         "INSERT INTO sensorData(emp_id,timestamp,violation_count,sensor1,sensor2,sensor3,action,date,month,year) VALUES (?,?,?,?,?,?,?,?,?,?);",
    //         [emp_id,timestamp,violation_count,sensor1,sensor2,sensor3,action,date,month,year]
    //     );
    // },
    getSensorData: async (emp_id: sensorData['emp_id'],startTime: sensorData['timestamp'],endTime:sensorData['timestamp'])=>{
        
        const data = await pool.query("SELECT * FROM sensorValues WHERE emp_id = ? AND timestamp>=? and timestamp<=?",[emp_id,startTime,endTime]);
        return data==null? null:data;
    },
    insertSensorData : async (id:sensorData['emp_id'],timestamp:sensorData['timestamp'],value1:sensorData['sensor1'],value2:sensorData['sensor1'],value3:sensorData['sensor1'],value4:sensorData['sensor1'],value5:sensorData['sensor1'],value6:sensorData['sensor1'])=>{
        await pool.query("INSERT INTO sensorValues(emp_id,timestamp,sensor1,sensor2,sensor3,sensor4,sensor5,sensor6) VALUES (?,?,?,?,?,?,?,?);",[id,timestamp,value1,value2,value3,value4,value5,value6]);
        console.log("inserted one row");
    }
}