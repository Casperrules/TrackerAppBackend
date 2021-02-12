export interface sensorData{
    emp_id: number,
    timestamp: number,//unix style system time stored as a number
    violation_count: number,
    sensor1: number,
    sensor2: number,
    sensor3: number,
    action: string,
    date: number,
    month: number,
    year: number
}