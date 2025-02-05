import ssl, os
from flask import Flask
from flask_mqtt import Mqtt
from flask_cors import CORS
from flask_openapi3 import OpenAPI, Info, Tag
from pydantic import BaseModel, Field
from http import HTTPStatus
from dotenv import find_dotenv, load_dotenv
from app.extensions import mongo

load_dotenv(find_dotenv())

info = Info(title="Protolab 3D Printer API", version="1.0.0")
app = OpenAPI(__name__, info=info)
CORS(app)

#Configs
app.config['MQTT_BROKER_URL'] = 'diotp2p.mooo.com'
app.config['MQTT_BROKER_PORT'] = 8883
app.config['MQTT_USERNAME'] = os.environ.get('MQTT_USERNAME') # Set this item when you need to verify username and password
app.config['MQTT_PASSWORD'] = os.environ.get('MQTT_PASSWORD') # Set this item when you need to verify username and password
app.config['MQTT_KEEPALIVE'] = 300  # Set KeepAlive time in seconds
app.config['MQTT_TLS_ENABLED'] = True  # If your server supports TLS, set it True
# app.config['MQTT_TLS_INSECURE'] = True
app.config["MQTT_TLS_VERSION"] = ssl.PROTOCOL_TLS_CLIENT

mongodb_password = os.environ.get("MONGODB_PASSWORD")
mongodb_database_name = "Printers"
app.config['MONGO_URI'] = f"mongodb+srv://papa:{mongodb_password}@protolabdatabase.jpzjqxr.mongodb.net/{mongodb_database_name}?retryWrites=true&w=majority"
mongo.init_app(app)


from app import api
#from app import flask_mqtt