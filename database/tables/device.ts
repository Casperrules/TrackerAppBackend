import { pool } from '../utils';
import { deviceOwnership } from '../../models/Device';

export const device = {
    ensureTable: async (): Promise<void> => {
        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS deviceOwnership(
                emp_id INT(16) NOT NULL,
                device_id INT(16),
                on_time INT(11),
                off_time INT(11),
                PRIMARY KEY(emp_id,device_id,on_time)
            );
            `
            );
    },

    makeDeviceUseStartRecord: async (emp_id:deviceOwnership['emp_id'], device_id:deviceOwnership['device_id'], on_time:deviceOwnership['on_time']):Promise<void> =>{
        try{
            await pool.query(
                "INSERT INTO deviceOwnership(emp_id,device_id,on_time,off_time) VALUES (?,?,?);",
                [emp_id,device_id,on_time]
            );
        }catch(err){
            throw err;
        }
    },

    makeDeviceUseEndRecord: async (emp_id:deviceOwnership['emp_id'], device_id:deviceOwnership['device_id'], on_time:deviceOwnership['on_time'],off_time:deviceOwnership['off_time'])=>{
        try{
            await pool.query(
                "UPDATE deviceOwnership SET off_time=? WHERE emp_id=? AND device_id=? AND on_time=?;",
                [off_time,emp_id,device_id,on_time]
            );
        }catch(err){
            throw err;
        }
    },

    getUserByDeviceID: async (device_id:deviceOwnership['device_id'],timestamp:number)=>{
        try{
            const user = await pool.query("SELECT emp_id FROM deviceOwnership WHERE device_id=? and on_time<=? and off_time>=? ;",[device_id,timestamp,timestamp]);
            return user == null? null:user;
        }catch(err){
            throw err;
        }
    },
    getDeviceByUserID: async (emp_id:deviceOwnership['emp_id']) => {
        try{
            const device = await pool.query("SELECT device_id FROM deviceOwnership WHERE emp_id=? ;",[emp_id]);
            return device == null? null:device;
        }catch(err){
            throw err;
        }
    },
}