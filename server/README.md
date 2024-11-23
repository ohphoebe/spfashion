## 1. Create .env file

Create .env file in the server folder with the following content:

```
DB_HOST=localhost
DB_DATABASE=<your db schema name>
DB_USER=<your mysql username>
DB_PASSWORD=<your mysql password>
```

![#f03c15](https://placehold.co/15x15/f03c15/f03c15.png) Replace the above values accordingly ![#f03c15](https://placehold.co/15x15/f03c15/f03c15.png) 

The `.env` file is meant to contain secrets, thus it is not checked into git, thus it is unique to you.

## 2. Install dependencies

```
pip install -r requirements.txt
```

## 3. Start server

```
python ./app.py
```
