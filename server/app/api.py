from doctest import Example
from http import HTTPStatus
import json
import bson.json_util
from sqlite3 import Cursor
from turtle import title
from unicodedata import name
from app import app
from flask import jsonify, Response, request
from flask_openapi3 import OpenAPI, Info, Tag
from pydantic import BaseModel, Field

#from app import extensions

# from bson.json_util import dumps #Måske nødvendigt hvis det fucker senere
from .database import *

live_data_tag = Tag(name="Live Data")
temperature_data_tag = Tag(name="Temperature Data")
uptime_data_tag = Tag(name="Uptime Data")
material_data_tag = Tag(name="Material Data")
test_tag = Tag(name="Mongodb Tests")

class PrinterDTO(BaseModel):
    """The data gathered from a 3D printer"""
    temp_nozzle: int = Field(example=120, title="Temperature of printer nozzle")
    temp_bed: int = Field(example=60, title="Temperature of printer bed")
    material: str = Field(example="PETG", title="Material type of print")
    pos_z_mm: int = Field(example=30, title="Position (in mm) of z axis of the printer")
    progress: int = Field(example=50, title="Progress of print as percentage")
    print_dur: str = Field(example="27s", title="Print duration in ?seconds?")
    time_est: int = Field(example=5760, title="Time estimation in ?seconds?")
    time_zone: int = Field(example=0, title="?The current timezone?")
    project_name: str = Field(example="coolprint.gcode", title="Name of the project file")
    timestamp: str = Field(example="")

class TemperatureDTO(BaseModel):
    temp_nozzle: int = Field(example=120, title="Temperature of printer nozzle")
    temp_bed: int = Field(example=60, title="Temperature of printer bed")
    timestamp: str = Field(example="2022-11-25T11:41:10.636+0100", title="timestamp in UTC")

class UptimeDTO(BaseModel):
    uptime_procent: list[int] = Field(example="[30, 20, 20, 50]", title="Array of procents for the usage uptime of the printers")

class MaterialDTO(BaseModel):
    name: str = Field(example="PLA", title="The name of the type of material")
    procent: int = Field(example=30, title="Procent of usage since 28/11")

class PrinterPath(BaseModel):
    printerid: str = Field(..., description='printer id')

@app.get('/')
def get_server_status():
  return {'success':True}, HTTPStatus.OK

@app.get('/api/printers/livedata', tags=[live_data_tag], description="test", responses={f"{HTTPStatus.OK}": PrinterDTO, })
def get_all_printers():
  """
  Returns live data on all printers
  """
  data = list(get_all_printers_live_data())
  return Response(bson.json_util.dumps(data), HTTPStatus.OK, mimetype='application/json')

@app.get('/api/printers/livedata/<string:printerid>', tags=[live_data_tag], responses={f"{HTTPStatus.OK}": PrinterDTO})
def get_printer(path: PrinterPath):
  """
  Returns live data on a specific printer
  """
  data = get_printer_data(path.printerid)
  if data is None:
    return Response(f"Error 404: {path.printerid} does not exist in the database", HTTPStatus.NOT_FOUND) #, mimetype='application/json'
  else:
    return Response(bson.json_util.dumps(data), HTTPStatus.OK, mimetype='application/json')

@app.get('/api/printers/10min/temperature', tags=[temperature_data_tag], responses={f"{HTTPStatus.OK}": TemperatureDTO})
def get_all_10min_temperatures():
  """
  Returns temperature data on all printers (10min interval data)
  """
  start_date = request.args.get("startdate")
  end_date = request.args.get("enddate")
  data = get_all_10min_temperatures_data(start_date, end_date)
  return Response(bson.json_util.dumps(data), HTTPStatus.OK, mimetype='application/json')

@app.get('/api/printers/10min/temperature/<string:printerid>', tags=[temperature_data_tag], responses={f"{HTTPStatus.OK}": TemperatureDTO})
def get_10min_temperature(path: PrinterPath):
  """
  Returns temperature data on a specific printer (10min interval data)
  """
  start_date = request.args.get("startdate")
  end_date = request.args.get("enddate")
  data = get_10min_temperature_data(path.printerid, start_date, end_date)
  if data is None:
    return Response(f"Error 404: {path.printerid} does not exist in the database", status=404) #, mimetype='application/json'
  else:
    return Response(bson.json_util.dumps(data), HTTPStatus.OK, mimetype='application/json')

@app.get('/api/printers/1min/temperature', tags=[temperature_data_tag], responses={f"{HTTPStatus.OK}": TemperatureDTO})
def get_all_1min_temperatures():
  """
  Returns temperature data on all printers (1min interval data)
  """
  start_date = request.args.get("startdate")
  end_date = request.args.get("enddate")
  data = get_all_1min_temperatures_data(start_date, end_date)
  return Response(bson.json_util.dumps(data), HTTPStatus.OK, mimetype='application/json')

@app.get('/api/printers/1min/temperature/<string:printerid>', tags=[temperature_data_tag], responses={f"{HTTPStatus.OK}": TemperatureDTO})
def get_1min_temperature(path: PrinterPath):
  """
  Returns temperature data on a specific printer (1min interval data)
  """
  start_date = request.args.get("startdate")
  end_date = request.args.get("enddate")
  data = get_1min_temperature_data(path.printerid, start_date, end_date)
  if data is None:
    return Response(f"Error 404: {path.printerid} does not exist in the database", status=404) #, mimetype='application/json'
  else:
    return Response(bson.json_util.dumps(data), HTTPStatus.OK, mimetype='application/json')

@app.get('/api/printers/uptime', tags=[uptime_data_tag], responses={f"{HTTPStatus.OK}": UptimeDTO})
def get_all_uptime_procent():
  """
  Returns uptime procent data of all printers (1min interval data)
  """
  start_date = request.args.get("startdate")
  end_date = request.args.get("enddate")
  data = get_all_uptime_procent_data(start_date, end_date)
  return Response(bson.json_util.dumps(data), HTTPStatus.OK, mimetype='application/json')

@app.get('/api/printers/uptime/<string:printerid>', tags=[uptime_data_tag], responses={f"{HTTPStatus.OK}": UptimeDTO})
def get_uptime_procent(path: PrinterPath):
  """
  Returns uptime procent data of specific printer (1min interval data)
  """
  start_date = request.args.get("startdate")
  end_date = request.args.get("enddate")
  data = get_uptime_procent_data(path.printerid, start_date, end_date)
  if data is None:
    return Response(f"Error 404: {path.printerid} does not exist in the database", status=404) #, mimetype='application/json'
  else:
    return Response(bson.json_util.dumps(data), HTTPStatus.OK, mimetype='application/json')

@app.get('/api/printers/material', tags=[material_data_tag], responses={f"{HTTPStatus.OK}": MaterialDTO})
def get_material_usage():
  """
  Returns material usage of all printers in procent (10min interval data)
  """
  data = get_material_usage_data()
  return Response(bson.json_util.dumps(data), HTTPStatus.OK, mimetype='application/json')

@app.get('/api/testmongodb', tags=[test_tag])
def test_mongodb():
  """
  Used during development to test mongodb queries
  """
  data = get_material_usage_data()
  return Response(bson.json_util.dumps(data), HTTPStatus.OK, mimetype='application/json')
  # id_param= str(request.args.get('id'))
  # ret = dict()
  # cursor = db.scores.find({"id": { "$gt": id_param }}).sort("id",1).limit(20) #ascending
  # for document in cursor:
  #   print(document)
  #   ret = document
  # return jsonify(json_utils.dumps(ret))