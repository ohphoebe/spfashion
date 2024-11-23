from model.DatabasePool import DatabasePool

class Category:

    #class method: get category name
    @classmethod
    def getCategoryName(cls, clothingID):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get sql to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql line
            sql = "SELECT name FROM category WHERE categoryId = %s"
            #execute sql
            cursor.execute(sql,(clothingID,))
            #fetch data
            name = cursor.fetchall()
            return name
        finally:
            #close connection
            dbConn.close()

    #class method: get category id
    @classmethod
    def getCategoryId(cls, name):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get sql to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql line
            sql = "SELECT categoryId FROM category WHERE name = %s"
            #execute sql
            cursor.execute(sql,(name,))
            #fetch data
            id = cursor.fetchone()
            return id
        finally:
            #close connection
            dbConn.close()