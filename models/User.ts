export interface employee{
    emp_id: number;
    full_name: string;
    designation: string;
    manager: number; // emp_id of manager
    department: string;
    revenue:number;
    email:string;
    password: string ;
}