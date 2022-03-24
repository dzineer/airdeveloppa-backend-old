# Queries Executed against the database

Just to keep track of any direct database updates (incase of corrections) since 20 March 2022

```
# Peony House Cafe
db.business.update({"businessid": "93c3494c-9a40-4f62-843d-8e95fcaab664"}, {"$set": {"purifiers": 1, "links": ["https://www.facebook.com/Peonyhousecafe/","fb://page/554915082102146","https://goo.gl/maps/jqBAYYab9H9obDDm9"], "categories": ["cafe"]}})

# Wooden Door cafe 
db.business.update({"businessid": "f0cc5324-4780-4d4c-97f5-faf064047700"}, {"$set": {"purifiers": 2, "links": ["fb://page/2098478060470964","https://maps.app.goo.gl/hmC7oEUYaqgRwgGf7"], "categories": ["cafe"]}})
```
