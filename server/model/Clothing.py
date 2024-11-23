from model.DatabasePool import DatabasePool

class Clothing:
    #class method to get list of clothing products, ordered by name ascending A-Z
    @classmethod
    def getAllClothing(cls):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get sql to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql line
            sql = "SELECT * FROM clothing ORDER BY price ASC"
            #run query with sql line
            cursor.execute(sql,())
            #fetch all matching records
            clothing = cursor.fetchall()
            #return query results
            return clothing
        finally:
            #close connection
            dbConn.close()

    #class method to get name of product based on clothingID
    @classmethod
    def getClothingName(cls,clothingID):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get sql to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql line
            sql = "SELECT name FROM clothing WHERE clothingID = %s"
            #run query with sql line
            cursor.execute(sql,(clothingID,))
            #fetch all matching records
            name = cursor.fetchone()
            #return query results
            return name
        finally:
            #close connection
            dbConn.close()
    
    #class method to get name of product based on clothingID
    @classmethod
    def getCategoryId(cls,clothingID):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get sql to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql line
            sql = "SELECT categoryId FROM clothing WHERE clothingID = %s"
            #run query with sql line
            cursor.execute(sql,(clothingID,))
            #fetch all matching records
            name = cursor.fetchone()
            #return query results
            return name
        finally:
            #close connection
            dbConn.close()
    
    #class method: sort clothing by price low to high
    @classmethod
    def getClothingByPriceLowToHigh(cls):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get sql to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query
            sql = "SELECT * FROM clothing ORDER BY price ASC;"
            #execute sql
            cursor.execute(sql,())
            #fetch sql data
            clothing = cursor.fetchall()
            return clothing
        finally:
            #close connection
            dbConn.close()

    #class method: sort clothing by price high to low
    @classmethod
    def getClothingByPriceHighToLow(cls):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get query to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql line
            sql = "SELECT * FROM clothing ORDER BY price DESC;"
            #execute sql
            cursor.execute(sql,())
            #fetch sql data
            clothing = cursor.fetchall()
            return clothing
        finally:
            #close connection
            dbConn.close()

    #class method: sort clothing by name A-Z
    @classmethod
    def getClothingByNameAToZ(cls):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get query to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql line
            sql = "SELECT * FROM clothing ORDER BY name ASC;"
            #execute sql
            cursor.execute(sql,())
            #fetch sql data
            clothing = cursor.fetchall()
            return clothing
        finally:
            dbConn.close()

    #class method: sort clothing by name Z-A
    @classmethod
    def getClothingByNameZToA(cls):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get query to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql line
            sql = "SELECT * FROM clothing ORDER BY name DESC;"
            #execute sql
            cursor.execute(sql,())
            #fetch sql data
            clothing = cursor.fetchall()
            return clothing
        finally:
            dbConn.close()

    #class method: sort clothing by price low to high and filter by category
    @classmethod
    def getClothingByPriceLowToHighAndCategory(cls,categoryId):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get sql to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query
            sql = "SELECT * FROM clothing WHERE categoryId=%s ORDER BY price ASC;"
            #execute sql
            cursor.execute(sql,(categoryId,))
            #fetch sql data
            clothing = cursor.fetchall()
            return clothing
        finally:
            #close connection
            dbConn.close()
    
    #class method: sort clothing by price high to low and filter by category
    @classmethod
    def getClothingByPriceHighToLowAndCategory(cls,categoryId):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get sql to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query
            sql = "SELECT * FROM clothing WHERE categoryId=%s ORDER BY price DESC;"
            #execute sql
            cursor.execute(sql,(categoryId,))
            #fetch sql data
            clothing = cursor.fetchall()
            return clothing
        finally:
            #close connection
            dbConn.close()

    #class method: sort clothing by name a to z and filter by category
    @classmethod
    def getClothingByNameAToZAndCategory(cls,categoryId):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get sql to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query
            sql = "SELECT * FROM clothing WHERE categoryId=%s ORDER BY name ASC;"
            #execute sql
            cursor.execute(sql,(categoryId,))
            #fetch sql data
            clothing = cursor.fetchall()
            return clothing
        finally:
            #close connection
            dbConn.close()

    
    #class method: sort clothing by name a to z and filter by category
    @classmethod
    def getClothingByNameZToAAndCategory(cls,categoryId):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get sql to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query
            sql = "SELECT * FROM clothing WHERE categoryId=%s ORDER BY name DESC;"
            #execute sql
            cursor.execute(sql,(categoryId,))
            #fetch sql data
            clothing = cursor.fetchall()
            return clothing
        finally:
            #close connection
            dbConn.close()

    #class method: to update image in database based on clothingID
    @classmethod
    def updateImage(cls,image_url,clothingID):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get query to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query
            sql = "UPDATE clothing SET image_url=%s WHERE clothingID=%s"
            #execute sql
            cursor.execute(sql,(image_url,clothingID))
            #commit sql changes
            dbConn.commit()
            #get number of rows modified
            rows=cursor.rowcount
            #return query results
            return rows
        finally:
            #release connection back to connection pool
            dbConn.close()


    #class method: to update image in database based on clothingID
    #[NEED TO MERGE THIS CLASS METHOD WITH INSERT CLOTHING METHOD]
    @classmethod
    def uploadImage(cls,image_url,clothingID):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get query to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query
            sql = "INSERT INTO clothing (image_url) VALUES (%s) WHERE clothingID = %s"
            #execute sql
            cursor.execute(sql,(image_url,clothingID))
        finally:
            #release connection back to connection pool
            dbConn.close()

    #class method to delete 1 clothing based on clothingID
    @classmethod
    def deleteClothing(cls,clothingID):
        try:
            #establish connection
            dbConn = DatabasePool.getConnection()
            #get query to database in json format
            cursor = dbConn.cursor(dictionary=True)
            #sql query
            sql = "DELETE FROM clothing WHERE clothingID = %s"
            #execute sql
            cursor.execute(sql,(clothingID,))
            #commit changes
            dbConn.commit()
            #fetch row count of rows deleted
            rows = cursor.rowcount
            #return results
            return rows
        finally:
            #close connection
            dbConn.close()

    # Get Image URL. Kok Pin
    @classmethod
    def getImageurl(cls,clothingID): 
        try:
            dbConn=DatabasePool.getConnection()
            cursor = dbConn.cursor(dictionary=True)

            sql="select image_url from clothing where clothingId=%s"
            cursor.execute(sql,(clothingID,))
            
            getImageurl=cursor.fetchall()
            return getImageurl
        
        finally:
            dbConn.close()    

    # Update Image URL. Kok Pin
    @classmethod
    def updateImageurl(cls,new_image_URL,clothingID): 
        try:
            dbConn=DatabasePool.getConnection()
            cursor = dbConn.cursor(dictionary=True)
            
            sql="update clothing set image_url=%s where clothingID=%s"
            cursor.execute(sql,(new_image_URL,clothingID))

            dbConn.commit() # confirm changes for new clothing row

            Item_count=cursor.rowcount # check number of item modified in database
                       
            return Item_count
        
        finally:
            dbConn.close()  

    # Get particular clothing data. Kok Pin
    @classmethod
    def getClothing(cls,clothingID):
        try:
            dbConn=DatabasePool.getConnection()
            cursor = dbConn.cursor(dictionary=True)

            sql="select * from clothing where clothingId=%s"
            cursor.execute(sql,(clothingID,))
            
            Selectclothing=cursor.fetchall()
            return Selectclothing
        
        finally:
            dbConn.close()   

    # Add clothing to database. Kok Pin
    @classmethod
    def AddClothing(cls,name,description,image_URL,categoryId,price,quantity): 
        try:
            dbConn=DatabasePool.getConnection()
            cursor = dbConn.cursor(dictionary=True)

            sql="insert into clothing(name,description,image_URL,categoryId,price,quantity) values(%s,%s,%s,%s,%s,%s)"
            cursor.execute(sql,(name,description,image_URL,categoryId,price,quantity))

            dbConn.commit() # confirm changes for new clothing row

            Item_count=cursor.rowcount # check number of item modified in database

            sql="select name from clothing where clothingID=last_insert_id()" # read back name of clothing added
            cursor.execute(sql,())

            ReturnData=cursor.fetchall()
            ReturnName=ReturnData[0]["name"]
            
            return Item_count, ReturnName
        
        finally:
            dbConn.close()   

    # Update clothing detail to database according to clothing ID. Kok Pin
    @classmethod
    def UpdateClothing(cls,name,description,categoryId,price,quantity,clothingID): 
        try:
            dbConn=DatabasePool.getConnection()
            cursor = dbConn.cursor(dictionary=True)

           #update clothing to database
            sql="update clothing set name=%s,description=%s,categoryId=%s,price=%s,quantity=%s where clothingID=%s"
            cursor.execute(sql,(name,description,categoryId,price,quantity,clothingID))

            dbConn.commit() # confirm changes for new clothing row

            Item_count=cursor.rowcount # check number of item modified in database
                       
            return Item_count
        
        finally:
            dbConn.close() 