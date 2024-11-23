from model.DatabasePool import DatabasePool
from datetime import datetime

class Logs:

    #class method: to insert a log into database
    @classmethod
    def insertLog(cls,log):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get query to database in json format
            cursor = dbConn.cursor(dictionary = True)
            
            #sql query
            sql = 'INSERT into logs (name,action,message) values(%s,%s,%s)'
            #execute sql line
            cursor.execute(sql,(log["name"],log["action"],log["message"]))
            #apply changes
            dbConn.commit()
            #get rows modified
            rows = cursor.rowcount
            #return results of rows modified
            return rows
        finally:
            #release connection back to database pool
            dbConn.close()

    #class method to get all logs
    @classmethod
    def getAllLogs(cls):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get sql to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql line
            sql = "SELECT * FROM logs ORDER BY '#' ASC"
            #run query with sql line
            cursor.execute(sql,())
            #fetch all matching records
            logs = cursor.fetchall()
            #return query results
            return logs
        finally:
            #close connection
            dbConn.close()
