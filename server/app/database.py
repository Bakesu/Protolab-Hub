import datetime
import os
import pytz
from .extensions import mongo
from bson.codec_options import CodecOptions


# Collection for each printer
# mongo.db.create_collection('Printer1_10min', timeseries={ 'timeField': 'timestamp' })
# mongo.db.create_collection('Printer2_10min', timeseries={ 'timeField': 'timestamp' })
# mongo.db.create_collection('Printer3_10min', timeseries={ 'timeField': 'timestamp' })
# mongo.db.create_collection('Printer4_10min', timeseries={ 'timeField': 'timestamp' })

# mongo.db.create_collection('Printer1_1min', timeseries={ 'timeField': 'timestamp' })
# mongo.db.create_collection('Printer2_1min', timeseries={ 'timeField': 'timestamp' })
# mongo.db.create_collection('Printer3_1min', timeseries={ 'timeField': 'timestamp' })
# mongo.db.create_collection('Printer4_1min', timeseries={ 'timeField': 'timestamp' })

codec_options = CodecOptions(tz_aware=True, tzinfo=pytz.timezone(
    'Europe/Copenhagen'))  # Converts timezones

printerCurrentData_collection = mongo.db.PrintersCurrentData.with_options(
    codec_options)
printer1_10min_collection = mongo.db.Printer1_10min.with_options(codec_options)
printer2_10min_collection = mongo.db.Printer2_10min.with_options(codec_options)
printer3_10min_collection = mongo.db.Printer3_10min.with_options(codec_options)
printer4_10min_collection = mongo.db.Printer4_10min.with_options(codec_options)

printer_10min_collection_dict = {
    '1': printer1_10min_collection,
    '2': printer2_10min_collection,
    '3': printer3_10min_collection,
    '4': printer4_10min_collection,
}

printer1_1min_collection = mongo.db.Printer1_1min.with_options(codec_options)
printer2_1min_collection = mongo.db.Printer2_1min.with_options(codec_options)
printer3_1min_collection = mongo.db.Printer3_1min.with_options(codec_options)
printer4_1min_collection = mongo.db.Printer4_1min.with_options(codec_options)

printer_1min_collection_dict = {
    '1': printer1_1min_collection,
    '2': printer2_1min_collection,
    '3': printer3_1min_collection,
    '4': printer4_1min_collection,
}


def get_all_printers_live_data():
    printer_data = printerCurrentData_collection.find()
    return printer_data


def get_printer_data(printer_id: str):
    return printerCurrentData_collection.find_one({'_id': printer_id})


# //TODO: Hardcoded to printer2¨
def get_all_10min_temperatures_data(start_date_as_ISO, end_date_as_ISO):
    result = []
    for _, printer_collection in printer_10min_collection_dict.items():
        temperature_data = find_temperature_in_date_range(
            printer_collection, start_date_as_ISO, end_date_as_ISO)
        result.append(temperature_data)
    return result


def get_10min_temperature_data(printer_id, start_date_as_ISO, end_date_as_ISO):
    printer_collection = printer_10min_collection_dict[printer_id]
    return find_temperature_in_date_range(printer_collection, start_date_as_ISO, end_date_as_ISO)
    # http://localhost:5000/api/printers/temperature/1?startdate=2022-11-23&enddate=2022-11-24


# //TODO: Hardcoded to printer2¨
def get_all_1min_temperatures_data(start_date_as_ISO, end_date_as_ISO):
    result = []
    for _, printer_collection in printer_1min_collection_dict.items():
        temperature_data = find_temperature_in_date_range(
            printer_collection, start_date_as_ISO, end_date_as_ISO)
        result.append(temperature_data)
    return result


def get_1min_temperature_data(printer_id, start_date_as_ISO, end_date_as_ISO):
    printer_collection = printer_1min_collection_dict[printer_id]
    return find_temperature_in_date_range(printer_collection, start_date_as_ISO, end_date_as_ISO)
    # http://localhost:5000/api/printers/temperature/1?startdate=2022-11-23&enddate=2022-11-24


def find_temperature_in_date_range(collection, start_date_as_ISO, end_date_as_ISO):
    timestamp_range_query = {}
    if start_date_as_ISO != "" and start_date_as_ISO != None and end_date_as_ISO != "" and end_date_as_ISO != None:
        start_date = datetime.datetime.fromisoformat(start_date_as_ISO)
        end_date = datetime.datetime.fromisoformat(end_date_as_ISO)
        timestamp_range_query = {'timestamp': {
            '$lt': end_date, '$gte': start_date}}
    return collection.find(
        timestamp_range_query,
        {'temp_nozzle': {'$ifNull': ['$temp_nozzle', 0]}, 'temp_bed': {
            '$ifNull': ['$temp_bed', 0]}, 'timestamp': 1, '_id': 0}
    ).sort("timestamp", 1)


def get_all_uptime_procent_data(start_date_as_ISO, end_date_as_ISO):
    result = []
    for _, printer_collection in printer_1min_collection_dict.items():
        temperature_data = find_uptime_procent_in_data_range(printer_collection, start_date_as_ISO, end_date_as_ISO)
        result.append(temperature_data)
    return result


def get_uptime_procent_data(printer_id, start_date_as_ISO, end_date_as_ISO):
    printer_collection = printer_1min_collection_dict[printer_id]
    return find_uptime_procent_in_data_range(printer_collection, start_date_as_ISO, end_date_as_ISO)


def find_uptime_procent_in_data_range(collection, start_date_as_ISO, end_date_as_ISO):
    timestamp_range_query = {}
    if start_date_as_ISO != "" and start_date_as_ISO != None and end_date_as_ISO != "" and end_date_as_ISO != None:
        start_date = datetime.datetime.fromisoformat(start_date_as_ISO)
        end_date = datetime.datetime.fromisoformat(end_date_as_ISO)
        timestamp_range_query = {'timestamp': {
            '$lt': end_date, '$gte': start_date}}
    no_printing_printers_array = list(collection.aggregate([
        {'$match':
            {'$and': [
                {'progress': {'$exists': True, '$ne': None}},
                timestamp_range_query
            ]
            }
         },
        {'$count': 'noPrintingPrinters'}
    ]))
    no_available_printers_array = list(collection.aggregate([
        {'$match':
            {'$and': [
                {'progress': None},
                timestamp_range_query
            ]
            }
         },
        {'$count': 'noAvailablePrinters'}
    ]))

    if len(no_printing_printers_array) == 0:
        zero_printing_printers = {"noPrintingPrinters": 0}
        no_printing_printers_array.append(zero_printing_printers)
    if len(no_available_printers_array) == 0:
        zero_available_printers = {"noAvailablePrinters": 0}
        no_available_printers_array.append(zero_available_printers)
    print(no_printing_printers_array[0])
    print(no_available_printers_array[0])
    sum_printer_data = no_printing_printers_array[0]['noPrintingPrinters'] + \
        no_available_printers_array[0]['noAvailablePrinters']
    try:
        uptime_procent = no_printing_printers_array[0]['noPrintingPrinters'] / \
            sum_printer_data*100
    except:
        uptime_procent = 0
    return uptime_procent


def get_material_usage_data():

    # const materialFakeData = [
    #     { name: "PLA", procent: 30 },
    #     { name: "PETG", procent: 55 },
    #     { name: "OTHER", procent: 15 },
    # ]
    total_no_PETG = 0
    total_no_PLA = 0
    total_no_ABS = 0
    total_no_printing_data = 0

    for _, printer_collection in printer_10min_collection_dict.items():
        no_PETG = list(printer_collection.aggregate([
            {'$match':
             {'$and': [
                 {'progress': {'$exists': True, '$ne': None}},
                 {'material': 'PETG'}
             ]
             }
             },
            {'$count': 'noPETG'}
        ]))
        if len(no_PETG) != 0:
            total_no_PETG += no_PETG[0]['noPETG']

        no_PLA = list(printer_collection.aggregate([
            {'$match':
             {'$and': [
                 {'progress': {'$exists': True, '$ne': None}},
                 {'material': 'PLA'}
             ]
             }
             },
            {'$count': 'noPLA'}
        ]))
        if len(no_PLA) != 0:
            total_no_PLA += no_PLA[0]['noPLA']

        no_ABS = list(printer_collection.aggregate([
            {'$match':
             {'$and': [
                 {'progress': {'$exists': True, '$ne': None}},
                 {'material': 'ABS'}
             ]
             }
             },
            {'$count': 'noABS'}
        ]))
        if len(no_ABS) != 0:
            total_no_ABS += no_ABS[0]['noABS']

        no_printing_data = list(printer_collection.aggregate([
            {'$match':
             {'$and': [
                 {'progress': {'$exists': True, '$ne': None}}
             ]
             }
             },
            {'$count': 'noPrintingData'}
        ]))
        if len(no_printing_data) != 0:
            total_no_printing_data += no_printing_data[0]['noPrintingData']

    PETG_procent = total_no_PETG/total_no_printing_data*100
    PLA_procent = total_no_PLA/total_no_printing_data*100
    ABS_procent = total_no_ABS/total_no_printing_data*100
    other_procent = (total_no_printing_data - (total_no_PETG+total_no_PLA+total_no_ABS))/total_no_printing_data*100

    result = [
        {"name": "PLA", "procent": round(PLA_procent)},
        {"name": "PETG", "procent": round(PETG_procent)},
        {"name": "ABS", "procent": round(ABS_procent)},
        {"name": "Other", "procent": round(other_procent)}
    ]

    return result


def update_printers_live_data(printer_id: str, data, timestamp):
    if data is None:
        printerCurrentData_collection.update_one({'_id': printer_id}, {'$set': {
            "temp_nozzle": None,
            "temp_bed": None,
            "material": None,
            "pos_z_mm": None,
            "printing_speed": None,
            "flow_factor": None,
            "progress": None,
            "print_dur": None,
            "time_est": None,
            "time_zone": None,
            "project_name": None,
            "timestamp": timestamp
        }},
            upsert=True
        )
    elif 'progress' not in data:
        data['timestamp'] = timestamp
        data['progress'] = None
        data['print_dur'] = None
        data['time_est'] = None
        data['time_zone'] = None
        data['project_name'] = None
        printerCurrentData_collection.update_one(
            {'_id': printer_id}, {'$set': data}, upsert=True)
    else:
        data['timestamp'] = timestamp
        printerCurrentData_collection.update_one(
            {'_id': printer_id}, {'$set': data}, upsert=True)


def insert_1min_printer_data(printer_id: str, data, timestamp):
    printer_collection = printer_1min_collection_dict[printer_id]
    if data != None:
        data['timestamp'] = timestamp
        printer_collection.insert_one(data)
    else:
        printer_collection.insert_one({
            "printer_name": f"Printer {printer_id}",
            "temp_nozzle": None,
            "temp_bed": None,
            "material": None,
            "pos_z_mm": None,
            "printing_speed": None,
            "flow_factor": None,
            "progress": None,
            "print_dur": None,
            "time_est": None,
            "time_zone": None,
            "project_name": None,
            "timestamp": timestamp
        })


def insert_10min_printer_data(printer_id: str, data, timestamp):
    printer_collection = printer_10min_collection_dict[printer_id]
    if data != None:
        data['timestamp'] = timestamp
        printer_collection.insert_one(data)
    else:
        printer_collection.insert_one({
            "printer_name": f"Printer {printer_id}",
            "temp_nozzle": None,
            "temp_bed": None,
            "material": None,
            "pos_z_mm": None,
            "printing_speed": None,
            "flow_factor": None,
            "progress": None,
            "print_dur": None,
            "time_est": None,
            "time_zone": None,
            "project_name": None,
            "timestamp": timestamp
        })

# def delete_all_collection_documents():
#     printer1_1min_collection.delete_many({ })
#     printer2_1min_collection.delete_many({ })
#     printer3_1min_collection.delete_many({ })
#     printer4_1min_collection.delete_many({ })
#     printer1_10min_collection.delete_many({ })
#     printer2_10min_collection.delete_many({ })
#     printer3_10min_collection.delete_many({ })
#     printer4_10min_collection.delete_many({ })
