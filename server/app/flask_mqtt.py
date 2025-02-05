import json, os, ssl
from flask_mqtt import Mqtt
from app import app
from .database import *

mqtt_client = Mqtt(app)

topic = 'Papa/#'

prev_1min_timestamp = datetime.datetime.utcnow()
prev_1min_changed = False
prev_10min_timestamp = datetime.datetime.utcnow()
prev_10min_changed = False

# on_connect() is what happens when we are connected to the mqtt broker
@mqtt_client.on_connect()
def handle_connect(client, _userdata, _flags, return_code):
  if return_code == 0:
      print('MQTT: Connected successfully')
      mqtt_client.subscribe(topic) # subscribe topic
  else:
      print('MQTT: Bad connection. Code:', return_code)

@mqtt_client.on_message()
def handle_mqtt_message(_client, _userdata, message):
  global prev_1min_timestamp
  global prev_1min_changed
  global prev_10min_timestamp
  global prev_10min_changed
  print(message.topic)

  data_as_dict: dict = json.loads(message.payload)
  timestamp = datetime.datetime.utcnow()
  for printer_id, printer_data in data_as_dict.copy().items():
    if printer_data != None: # TODO: flyttes ind i database.py ? 
      printer_data["printer_name"] = f"Printer {printer_id}"
    update_printers_live_data(printer_id, printer_data, timestamp)
    if timestamp > (prev_1min_timestamp + datetime.timedelta(minutes=1)):
      print("Inserting 1min data")
      insert_1min_printer_data(printer_id, printer_data, timestamp)
      prev_1min_changed = True
    if timestamp > (prev_10min_timestamp + datetime.timedelta(minutes=10)):
      print("Inserting 10min data")
      insert_10min_printer_data(printer_id, printer_data, timestamp)
      prev_10min_changed = True
  if prev_1min_changed:
    prev_1min_timestamp = timestamp
    prev_1min_changed = False
  if prev_10min_changed:
    prev_10min_timestamp = timestamp
    prev_10min_changed = False

    #if message.topic == 'Papa/printerdata/approx1min': # TODO: hardcoded atm
    #if message.topic == 'Papa/printerdata/approx10min': # TODO: hardcoded atm



