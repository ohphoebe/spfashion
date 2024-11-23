import functools

from flask import Flask,jsonify,request,g
from config.Settings import Settings

import jwt

def login_required(func):
    @functools.wraps(func)
    def checkToken(*args, **kwargs):
        #Do something before
        #check for valid token
        auth_header=request.headers.get("Authorization")
        auth=False

        if auth_header: #auth_header should be Bearer <JWT>
            headerList=auth_header.split(" ")
            bearer=headerList[0]
            token=headerList[1]

            if bearer=="Bearer" and token:
                try:
                    payload=jwt.decode(token,Settings.secretKey,algorithms=["HS256"])
                    
                    g.role=payload["role"]
                    # g.userID=payload["userID"]
                    g.name=payload["name"]
                    
                    auth=True
                except Exception as err:
                    print(err)
            
        if auth==False:
            return jsonify({"Message":"You are not authorized!"}),401
        else:
            value = func(*args, **kwargs)
            # Do something after
            return value

    return checkToken
