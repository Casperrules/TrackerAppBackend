## Routes
#### /auth :
* handles the authentication routes for signin, signup, reset password 
    - [post] /auth/signin 
    *  request to the route authenticates and returns an error or logs the user and redirects to the dashboard
    * ##### Parameters:
        * emp_id
        * password
    * ##### Errors:
        * improper parameters respond with status 400 error and a message that proper values are not provided
        * if wrong id is passed, the user not found error is thrown
        * if passwords dont match, invalid password error is responded
    
    - [get] /auth/signin
    * takes the user to signin page

    - [post] /auth/signup
    * adds a new user to the database
    * ##### Parameters:
        * emp_id
        * manager
        * designation
        * fullname
        * department
        * revenue
        * password
        * email
    * ##### Error:
        * if user exist, return user already exist error is returned
    
    - [get] /auth/signup
    * takes to the signup page

    - [get] /auth/forgotPassword
    * creates a reset password request, generates a token and sends email to the user with link to reset password
    * ##### Parameters:
        * email
    * ##### Error:
        * is email is not present in request invalid parameter passed error is returned
    
    - [post] /auth/resetPassword
    * takes in the new password and sets it as password for the given emp_id and deletes the reset request
    * ##### Parameters:
        * email
        * token
        * new-passowrd
    * ##### Errors:
        * if the token expiers, returns a 401 status code with error message that the token has expired
        * if token is not found in the database, returns a 401 status with message of token not found
        * if new password is not provided, responds with an error message wrong parameter recieved

#### /sensor:
* routes to the urls for getting sensor data
    - [get] /sensor/sensorData
    * handles get request to get sensor data from database for a given timestamp range
    * ##### Parameters:
        * emp_id
        * start_timestamp
        * end_timestamp
    * ##### Errors:
        * missing any of the above parameters will respond with a status code of 400 and error message parameters provided are incorrect
        
        * if start_time> end_time, responds with an error message that the values provided are wrong
