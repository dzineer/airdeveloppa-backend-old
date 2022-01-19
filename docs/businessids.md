# Identifiers to use for businesses

The rule is that all devices must match the business id.

## Businesses

* `b45ac5dc-4832-4779-9410-34bed7c321c2` (Yellow coworking)
* `70c59c79-66f9-4c1f-938d-91c5dc2fd208` (Corner Bistro & Burrito Squad)

## Devices

* `b27fb2a5-89ce-4613-9239-356f0fe7ddf3` (Corner bistro device)
* `ce50ec48-c346-4d85-9e1b-aade0efed781` (Yellow coworking)


# Development Identifiers

## To trigger certain events

### Create a new business record

```bash
curl "http://localhost:8000/1/business" \
-H "Content-type: application/json" \
-d '{"businessname": "Lightning Network Chiang Mai", "businessaddress": "8, 8 Ratchaphuek Alley", "businesscity": "Chiang Mai", "businessregion": "Chiang Mai", "businesscountry": "TH", "lat": 18.798644321294745, "lng": 98.9752684788364, "token": ""}'
```

### Create a new device record

```bash
curl "http://localhost:8000/1/deviceregister" \
-H "Content-type: application/json" \
-d '{"businessid": "c8be9040-43ca-4e1e-a029-61bccf0fa546", "devicebounty": 1, "devicelabel": "Device Label", "devicelocation": "Wherever", "token": ""}'
```

### Create a new AQI entry

```bash
curl "http://localhost:8000/1/device_push" \   
-H "Content-type: application/json" \
-d '{"businessid": "c8be9040-43ca-4e1e-a029-61bccf0fa546", "deviceid": "c65d3c6d-4f05-4054-9929-c6aafe9996be", "AQI": 69}'
```

## Businesses

* `c8be9040-43ca-4e1e-a029-61bccf0fa546` (Lightning network Chiang Mai)

## Devices

* `c65d3c6d-4f05-4054-9929-c6aafe9996be` (Device to use)
