from model.DatabasePool import DatabasePool
from config.Settings import Settings

import datetime
import jwt
import bcrypt

class User:

    #class method: login user and return jwt when input pass hash
    @classmethod
    def loginUser(cls,userJson):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get query to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query to generate jwt
            sql = "SELECT * FROM user WHERE email = %s"
            #execute sql 
            cursor.execute(sql,(userJson["email"],))
            #fetch one user details
            user = cursor.fetchone()
            #if user exists
            if user != None:
                #checking input password with hashed password from database
                #get input password to UTF-8 byte arrays
                passwordInput = userJson["password"].encode()
                #sql line for retrieving hashed password from database
                sqlPassword = "SELECT password FROM user WHERE email = %s"
                #execute sql line
                cursor.execute(sqlPassword,(userJson["email"],))
                #fetch user hashed password
                hashedPassword = cursor.fetchone()
                #bcrypt checking of hash
                result = bcrypt.checkpw(passwordInput,hashedPassword["password"].encode())
                if result == False:
                    return "Invalid password"
                else:
                    #if pass hash test
                    payload={"userID":user["userID"],"name":user["name"],"role":user["role"],"exp": datetime.datetime.utcnow()+datetime.timedelta(hours=2)}
                    jwtToken = jwt.encode(payload,Settings.secretKey,algorithm="HS256")
                    return jwtToken
            else:
                return "Invalid email"
        finally:
            dbConn.close()
    
    #register new user
    @classmethod
    def registerUser(cls,userJson):
        try: 
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get query to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #Hash password for the first time with bcrypt and salt
            password = userJson["password"].encode()#convert string to bytes
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password,salt)

            #sql query
            sql = "INSERT INTO user (email,name,role,password) values(%s,%s,%s,%s)"
            #run query with cursor
            cursor.execute(sql,(userJson["email"],userJson["name"],userJson["role"],hashed))
            #apply changes
            dbConn.commit()
            #get rows modified
            rows = cursor.rowcount
            #return results of rows modified
            return rows
        finally:
            #release connection back to database pool
            dbConn.close()
    
    #get role details of a user
    @classmethod
    def getRole(cls, email):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get query to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query
            sql = "SELECT role FROM user WHERE email = %s"
            #execute sql
            cursor.execute(sql,(email,))
            #fetch matching record
            role = cursor.fetchone()
            #return query result
            return role
        finally:
            #release connection back to database pool
            dbConn.close()

    #get name details of a user
    @classmethod
    def getName(cls, email):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get query to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query
            sql = "SELECT name FROM user WHERE email = %s"
            #execute sql
            cursor.execute(sql,(email,))
            #fetch matching record
            name = cursor.fetchone()
            #return query result
            return name
        finally:
            #release connection back to database pool
            dbConn.close()


    #get 1 user details, matching email
    @classmethod
    def getUser(cls,email):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #send query to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query
            sql = "SELECT * FROM user WHERE email = %s"
            #execute sql
            cursor.execute(sql,(email,))
            #fetch matching email
            user = cursor.fetchone()
            #return
            return user
        finally:
            dbConn.close()

            