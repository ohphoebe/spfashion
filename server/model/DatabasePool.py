# import os
# from dotenv import load_dotenv

# load_dotenv()

# # Create pool with these variables
# # Remember to specify their values in .env first (See README on creating .env)
# host = os.getenv('DB_HOST')
# database = os.getenv('DB_DATABASE')
# user = os.getenv('DB_USER')
# password = os.getenv('DB_PASSWORD')

#establishing connection
from mysql.connector import pooling

class DatabasePool:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="ws_pool",
        pool_size=5,
        host='localhost',
        database='sp_fashion',
        user='root',
        password='Jaesroid2!'
    )

    @classmethod
    def getConnection(cls):
        dbConn = cls.connection_pool.get_connection()
        return dbConn