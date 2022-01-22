# Some saved Mongo DB Queries

## Get AQI for a business by device

```
db.business.find({"devices.deviceid": "b27fb2a5-89ce-4613-9239-356f0fe7ddf3"}, {"businessname": 1, "devices.devicelabel":1, "devices.AQI": 1, "devices.updateDate": 1})
```
