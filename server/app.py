from flask import Flask, request, jsonify, g
from flask_cors import CORS
from model.User import User
from model.Clothing import Clothing
from model.Category import Category
from model.Logs import Logs
from validation.Validator import *
from config.Settings import Settings
#import encryption
import bcrypt
#import regexp
import re
#os for write file, base64 for sending image. KOK PIN
import os
import base64

import datetime

app = Flask(__name__)
CORS(app)

#route for login user
@app.route('/users/login', methods=["POST"])
def loginUser():
    try:
        # Retrieve data from the login form
        email = request.json['email']
        password = request.json['password']
        userJson = {"email": email, "password": password}
        #call model
        token=User.loginUser(userJson)
        if token == "Invalid email":
            return jsonify({"message":"Invalid email"}),401
        elif token == "Invalid password":
            return jsonify({"message":"Invalid password"}),401
        else:
            #return user role and jwt token and name
            role = User.getRole(userJson["email"])
            print(role)
            name = User.getName(userJson["email"])
            print(name)
            jsonResult={'jwt':token,'role':role,'name':name}
            return jsonify(jsonResult),201
    #raise exception for any errors
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error has occurred."}),500


#route for register new user
@app.route('/users/register',methods=['POST'])
def registerUser():
    try:
        userJson = {
        "email": request.json['email'],
        "name": request.json['name'],
        "role": request.json['role'],
        "password": request.json['password']
        } 
        #validation from backend
        #email regexp
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if userJson["email"] == "" or userJson["email"].strip()=="":
            return jsonify({"message":"invalid email"}),422
        if not re.match(pattern, userJson["email"]):
            return jsonify({"message":"invalid email"}),422
        if userJson["role"] == "Select a role":
            return jsonify({"message":"select a role"}),422
        if userJson["password"] == "" or userJson["password"].strip()=="":
            return jsonify({"message":"enter a password"}),422
        #userid is auto-increment
        else:
            rows = User.registerUser(userJson)
            #return number of rows modified
            output = str(rows) +' user(s) are inserted'
            jsonResult = {"message":output}
            print(jsonResult)
            return jsonify(jsonResult),201  
    except Exception as err:
        print(err.__class__, err)
        return jsonify({"message":"Error occurred"}),500

#route for getting 1 user details, matching email
@app.route('/users/email',methods=["GET"])
def getUser():
    try:
        email = request.args['email']
        userData = User.getUser(email)
        if not userData:
            return jsonify({"message":"no account registered"}),200
        else:
            return jsonify({"message":"account already registered"}),409
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error occurred"}),500

#route for getting all clothing with no order
@app.route("/clothing/getall",methods=["GET"])
@login_required
def getAllClothing():
    try:
        #get clothing from database
        clothing = Clothing.getAllClothing()
        #empty clothing array
        clothingList = []
        for item in clothing:
            #get category name according to categoryId
            categoryName = Category.getCategoryName(item["categoryId"])[0]
            #append item to clothing array
            clothingList.append({
            "clothingID": item["clothingID"],
            "name": item["name"],
            "description": item["description"],
            "image_url": item["image_url"],
            "categoryName": categoryName["name"],
            "price": item["price"],
            "quantity": item["quantity"],
            "DateInserted": item["DateInserted"]
            })
        if g.role == "admin":
            #return clothing as json
            return jsonify({"clothing":clothingList}),200
        if g.role == "user":
            #return clothing as json
            return jsonify({"clothing":clothingList,"message":"user"}),200
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error occurred"}),500

#route to get all clothing, order by price low to high
@app.route("/clothing/getClothingByPriceLowToHigh",methods=["GET"])
@login_required
def getClothingByPriceLowToHigh():
    try:
        clothing = Clothing.getClothingByPriceLowToHigh()
        clothingList = []
        for item in clothing:
            #get category name according to categoryId
            categoryName = Category.getCategoryName(item["categoryId"])[0]
            #append item to clothing array
            clothingList.append({
            "clothingID": item["clothingID"],
            "name": item["name"],
            "description": item["description"],
            "image_url": item["image_url"],
            "categoryName": categoryName["name"],
            "price": item["price"],
            "quantity": item["quantity"],
            "DateInserted": item["DateInserted"]
            })
        if g.role == "admin":
            #return clothing as json
            return jsonify({"clothing":clothingList}),200
        if g.role == "user":
            #return clothing as json
            return jsonify({"clothing":clothingList,"message":"user"}),200
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error occurred"}),500

#route to get all clothing, order by price high to low
@app.route("/clothing/getClothingByPriceHighToLow",methods=["GET"])
@login_required
def getClothingByPriceHighToLow():
    try:
        clothing = Clothing.getClothingByPriceHighToLow()
        clothingList = []
        for item in clothing:
            #get category name according to categoryId
            categoryName = Category.getCategoryName(item["categoryId"])[0]
            #append item to clothing array
            clothingList.append({
            "clothingID": item["clothingID"],
            "name": item["name"],
            "description": item["description"],
            "image_url": item["image_url"],
            "categoryName": categoryName["name"],
            "price": item["price"],
            "quantity": item["quantity"],
            "DateInserted": item["DateInserted"]
            })
        if g.role == "admin":
            #return clothing as json
            return jsonify({"clothing":clothingList}),200
        if g.role == "user":
            #return clothing as json
            return jsonify({"clothing":clothingList,"message":"user"}),200
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error occurred"}),500


#route to get all clothing, order by name a to z
@app.route("/clothing/getClothingByNameAToZ",methods=["GET"])
@login_required
def getClothingByNameAToZ():
    try:
        clothing = Clothing.getClothingByNameAToZ()
        clothingList = []
        for item in clothing:
            #get category name according to categoryId
            categoryName = Category.getCategoryName(item["categoryId"])[0]
            #append item to clothing array
            clothingList.append({
            "clothingID": item["clothingID"],
            "name": item["name"],
            "description": item["description"],
            "image_url": item["image_url"],
            "categoryName": categoryName["name"],
            "price": item["price"],
            "quantity": item["quantity"],
            "DateInserted": item["DateInserted"]
            })
        if g.role == "admin":
            #return clothing as json
            return jsonify({"clothing":clothingList}),200
        if g.role == "user":
            #return clothing as json
            return jsonify({"clothing":clothingList,"message":"user"}),200
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error occurred"}),500


#route to get all clothing, order by name z to a
@app.route("/clothing/getClothingByNameZToA",methods=["GET"])
@login_required
def getClothingByNameZToA():
    try:
        clothing = Clothing.getClothingByNameZToA()
        clothingList = []
        for item in clothing:
            #get category name according to categoryId
            categoryName = Category.getCategoryName(item["categoryId"])[0]
            #append item to clothing array
            clothingList.append({
            "clothingID": item["clothingID"],
            "name": item["name"],
            "description": item["description"],
            "image_url": item["image_url"],
            "categoryName": categoryName["name"],
            "price": item["price"],
            "quantity": item["quantity"],
            "DateInserted": item["DateInserted"]
            })
        if g.role == "admin":
            #return clothing as json
            return jsonify({"clothing":clothingList}),200
        if g.role == "user":
            #return clothing as json
            return jsonify({"clothing":clothingList,"message":"user"}),200
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error occurred"}),500


#route to get all clothing, order by price low to high, filter by category
@app.route("/clothing/getClothingByPriceLowToHighAndCategory",methods=["GET"])
@login_required
def getClothingByPriceLowToHighAndCategory():
    try:
        categoryName = request.args['categoryName']
        categoryId = Category.getCategoryId(categoryName)
        clothing = Clothing.getClothingByPriceLowToHighAndCategory(categoryId['categoryId'])
        clothingList = []
        for item in clothing:
            #get category name according to categoryId
            categoryName = Category.getCategoryName(item["categoryId"])[0]
            #append item to clothing array
            clothingList.append({
            "clothingID": item["clothingID"],
            "name": item["name"],
            "description": item["description"],
            "image_url": item["image_url"],
            "categoryName": categoryName["name"],
            "price": item["price"],
            "quantity": item["quantity"],
            "DateInserted": item["DateInserted"]
            })
        if g.role == "admin":
            #return clothing as json
            return jsonify({"clothing":clothingList}),200
        if g.role == "user":
            #return clothing as json
            return jsonify({"clothing":clothingList,"message":"user"}),200
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error occurred"}),500



#route to get all clothing, order by price high to low, filter by category
@app.route("/clothing/getClothingByPriceHighToLowAndCategory",methods=["GET"])
@login_required
def getClothingByPriceHighToLowAndCategory():
    try:
        categoryName = request.args['categoryName']
        categoryId = Category.getCategoryId(categoryName)
        clothing = Clothing.getClothingByPriceHighToLowAndCategory(categoryId['categoryId'])
        clothingList = []
        for item in clothing:
            #get category name according to categoryId
            categoryName = Category.getCategoryName(item["categoryId"])[0]
            #append item to clothing array
            clothingList.append({
            "clothingID": item["clothingID"],
            "name": item["name"],
            "description": item["description"],
            "image_url": item["image_url"],
            "categoryName": categoryName["name"],
            "price": item["price"],
            "quantity": item["quantity"],
            "DateInserted": item["DateInserted"]
            })
        if g.role == "admin":
            #return clothing as json
            return jsonify({"clothing":clothingList}),200
        if g.role == "user":
            #return clothing as json
            return jsonify({"clothing":clothingList,"message":"user"}),200
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error occurred"}),500


#route to get all clothing, order by name a to z, filter by category
@app.route("/clothing/getClothingByNameAToZAndCategory",methods=["GET"])
@login_required
def getClothingByNameAToZAndCategory():
    try:
        categoryName = request.args['categoryName']
        categoryId = Category.getCategoryId(categoryName)
        clothing = Clothing.getClothingByNameAToZAndCategory(categoryId['categoryId'])
        clothingList = []
        for item in clothing:
            #get category name according to categoryId
            categoryName = Category.getCategoryName(item["categoryId"])[0]
            #append item to clothing array
            clothingList.append({
            "clothingID": item["clothingID"],
            "name": item["name"],
            "description": item["description"],
            "image_url": item["image_url"],
            "categoryName": categoryName["name"],
            "price": item["price"],
            "quantity": item["quantity"],
            "DateInserted": item["DateInserted"]
            })
        if g.role == "admin":
            #return clothing as json
            return jsonify({"clothing":clothingList}),200
        if g.role == "user":
            #return clothing as json
            return jsonify({"clothing":clothingList,"message":"user"}),200
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error occurred"}),500


#route to get all clothing, order by name z to a, filter by category
@app.route("/clothing/getClothingByNameZToAAndCategory",methods=["GET"])
@login_required
def getClothingByNameZToAAndCategory():
    try:
        categoryName = request.args['categoryName']
        categoryId = Category.getCategoryId(categoryName)
        clothing = Clothing.getClothingByNameZToAAndCategory(categoryId['categoryId'])
        clothingList = []
        for item in clothing:
            #get category name according to categoryId
            categoryName = Category.getCategoryName(item["categoryId"])[0]
            #append item to clothing array
            clothingList.append({
            "clothingID": item["clothingID"],
            "name": item["name"],
            "description": item["description"],
            "image_url": item["image_url"],
            "categoryName": categoryName["name"],
            "price": item["price"],
            "quantity": item["quantity"],
            "DateInserted": item["DateInserted"]
            })
        if g.role == "admin":
            #return clothing as json
            return jsonify({"clothing":clothingList}),200
        if g.role == "user":
            #return clothing as json
            return jsonify({"clothing":clothingList,"message":"user"}),200
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error occurred"}),500


#route for deleting 1 clothing based on clothingID
@app.route("/clothing/delete",methods=["DELETE"])
@login_required
def deleteClothing():
    try:
        if g.role=="admin":
            #get name of clothing
            clothingID = request.json['clothingID']
            clothingName = Clothing.getClothingName(clothingID)
            clothingName = clothingName.get('name')

            #name of clothingID
            categoryId = Clothing.getCategoryId(clothingID)
            categoryId = categoryId.get('categoryId')
            categoryName = Category.getCategoryName(categoryId)
            categoryName = categoryName[0].get('name')

            #delete
            rowcount = Clothing.deleteClothing(clothingID)

            #log into database
            log = {"name":g.name,"action":f"{clothingName} deleted from {categoryName}","message":f"{rowcount} row(s) deleted."}
            report = Logs.insertLog(log)

            return jsonify({"message":f"{rowcount} row(s) deleted."}),200
        else:
            return jsonify({"Message":"You are not authorized"}),401
    except Exception as err:
        print(err.__class__,err)
        return jsonify({"message":"Error occurred"}),500


#route for getting all details of logs
@app.route("/list/logs",methods=["GET"])
@login_required
def getAllLogs():
    try:
        #get clothing from database
        logs = Logs.getAllLogs()
        #empty clothing array
        logsList = []
        for log in logs:
            #append item to clothing array
            logsList.append({
            "#": log["#"],
            "timestamp": log["timestamp"],
            "name": log["name"],
            "action": log["action"],
            "message": log["message"]
            })
        if g.role == "admin":
            #return logs as json
            return jsonify({"logs":logsList}),200
        if g.role == "user":
            #return message as json
            return jsonify({"message":"user"}),200
    except Exception as err:
        print(err.__class__,err)

# Get particular clothing from database. KOK PIN
@app.route("/clothing/<int:clothingID>",methods=["GET"])
def getClothing(clothingID):

    try:
        jsonSResult=Clothing.getClothing(clothingID)

        # If clothing ID exist, get image file and send out
        #encode image to Base64 representation so it can be sent as a string 
        if jsonSResult != []:

            image_url = jsonSResult[0]['image_url']
        
            with open(image_url, 'rb') as image_file:
                sendimage = base64.b64encode(image_file.read()).decode('utf-8') 

            # Return clothing data and image file
            return jsonify(data=jsonSResult,image=sendimage),200
    
        else:
    
            # Return empty string so receiving would know clothing ID does not exist. 
            return jsonify(data=jsonSResult),200
        
    except Exception as err:
        print(err)
        return jsonify({"Message":"Error Occur - "+str(err)}),500
    
# Add clothing to database. KOK PIN    
@app.route("/clothing",methods=["POST"]) 
@login_required
def AddClothing():

    try:
        
        name=request.form['name']
        description=request.form['description']
        categoryId=request.form['categoryId']
        price=request.form['price']
        quantity=request.form['quantity']
        fimage = request.files['image']

        file_to_check_path = "images/products/" + fimage.filename
        
        if os.path.exists(file_to_check_path):

            output = 'Image file already exist'

        else:
           
            image_URL = file_to_check_path # Get image url to save

            Item_count, ReturnName=Clothing.AddClothing(name,description,image_URL,categoryId,price,quantity)
            output=str(Item_count)+" clothing item: " + str(ReturnName) + ". Added to database."

            #fimage.save(os.path.join(uploads_path, fimage.filename))
            fimage.save(image_URL)

            #log into database
            categoryName = Category.getCategoryName(categoryId)
            categoryName = categoryName[0].get('name')
            log = {"name":g.name,"action":f"{name} added to {categoryName}","message":"1 row added."}
            report = Logs.insertLog(log)
                       
        jsonResult={"Message":output}

        return jsonify(jsonResult),201
    except Exception as err:
        print(err)
        return jsonify({"Message":"error occur - "+str(err)}),500
    
# Update clothing detail to database according to clothing ID. KOK PIN.
@app.route("/clothing/<int:clothingID>",methods=["PUT"])  
@login_required
def UpdateClothing(clothingID):

    try:
        name=request.json['name']
        description=request.json['description']
        categoryId=request.json['categoryId']
        price=request.json['price']
        quantity=request.json['quantity']

        # Update clothing data
        Item_count=Clothing.UpdateClothing(name,description,categoryId,price,quantity,clothingID)
       
        if Item_count != 0:  # message if item is updated

            output=str(Item_count)+" clothing item updated"

            #log into database
            categoryName = Category.getCategoryName(categoryId)
            categoryName = categoryName[0].get('name')
            log = {"name":g.name,"action":f"{name} updated in {categoryName}","message":"1 row updated."}
            report = Logs.insertLog(log)

            jsonResult={"Message":output}
        
        else:  # message if no item is found or updated

            output=str(Item_count)+" clothing item updated, clothing not in database or same data updated"
            jsonResult={"Message":output}

        return jsonify(jsonResult),201
    except Exception as err:
        print(err)
        return jsonify({"Message":"error occur - "+str(err)}),500

# Update clothing image according to clothing ID. KOK PIN
@app.route("/clothing/image/<int:clothingID>",methods=["PUT"])  
@login_required
def UpdateImage(clothingID):

    try:

        fimage = request.files['image'] # Get imaging file

        new_image_URL = "images/products/" + fimage.filename
             
        temp = Clothing.getImageurl(clothingID) #Get current image url
        current_image_url = temp[0]['image_url']

        # As file is save by filename. To prevent overwrite other product file.
        # Check if filename exist and is not belong to this clothing product.
        if os.path.exists(new_image_URL) and new_image_URL != current_image_url:

            output = 'Image filename already exist for other product'

        else:
        
            # Update clothing data
            Item_count=Clothing.updateImageurl(new_image_URL,clothingID)

            # Save and delete old file if exist
            if os.path.exists(current_image_url):
                os.remove(current_image_url)
                
            #fimage.save(os.path.join(uploads_path, fimage.filename))
            fimage.save(new_image_URL)

            # message if image is save and url updated to database
            if Item_count != 0 or new_image_URL == current_image_url:  

                output="Clothing image updated"

                #log into database
                categoryId = Clothing.getCategoryId(clothingID)
                categoryId = categoryId.get('categoryId')
                categoryName = Category.getCategoryName(categoryId)
                categoryName = categoryName[0].get('name')
                clothingName = Clothing.getClothingName(clothingID)
                clothingName = clothingName.get('name')
                categoryName = Category.getCategoryName(categoryId)
                categoryName = categoryName[0].get('name')
                log = {"name":g.name,"action":f"{clothingName}'s image updated in {categoryName}","message":"1 row updated."}
                report = Logs.insertLog(log)

                jsonResult={"Message":output}
        
            else:  # message if no item is found or updated

                output="Error in clothing image updated"

        jsonResult={"Message":output}

        return jsonify(jsonResult),201
    except Exception as err:
        print(err)
        return jsonify({"Message":"error occur - "+str(err)}),500


if __name__ == "__main__":
    app.run(debug=True)
