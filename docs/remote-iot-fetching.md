# Fetching Data from AWS

## Command line

First things first. Install the [AWS CLI](https://aws.amazon.com/cli/) onto your system. Ideally you are using a Mac or Linux based system.

Then configure a ```developpa``` profile and then use ```iot-data``` to call ```get-thing-shadow```.

We are using a thing called ```AirDeveloppaTestThing1``` where the device is pushing the data.

```bash
aws --region ap-southeast-1 --profile=developpa iot-data get-thing-shadow --thing-name AirDeveloppaTestThing1 iottest.txt
```

## Todo

- [ ] Create a polling service (or even just tmux script :P) which generates the json file every 10 minutes
- [ ] Create another polling service which fetches the json file and puts into into a database

