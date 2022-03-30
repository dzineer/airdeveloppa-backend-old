# Queries Executed against the database

Just to keep track of any direct database updates (incase of corrections) since 20 March 2022

```
# Peony House Cafe
db.business.update({"businessid": "93c3494c-9a40-4f62-843d-8e95fcaab664"}, {"$set": {"purifiers": 1, "links": ["https://www.facebook.com/Peonyhousecafe/","fb://page/554915082102146","https://goo.gl/maps/jqBAYYab9H9obDDm9"], "categories": ["cafe"]}})

# Wooden Door cafe 
db.business.update({"businessid": "f0cc5324-4780-4d4c-97f5-faf064047700"}, {"$set": {"purifiers": 2, "links": ["fb://page/2098478060470964","https://maps.app.goo.gl/hmC7oEUYaqgRwgGf7"], "categories": ["cafe"]}})

# Graph Quarter (cb2658d0-3edc-4968-9369-eec7d1ace02a)
db.business.update({"businessid": "cb2658d0-3edc-4968-9369-eec7d1ace02a"}, {"$set": {"purifiers": 1, "links": ["fb://page/107378704477542","https://goo.gl/maps/4oZWSrE3nHdAjRLd7"], "categories": ["cafe"]}})

db.business.update({"businessid": "9cd69f5d-8734-4cc8-ab10-639d364dbf41"}, {"$set": {"purifiers": 2, "links": ["fb://page/414504148999773","https://goo.gl/maps/wcr4LsZxQpMGH9KA9"], "categories": ["fitness"]}})

# Yellow b45ac5dc-4832-4779-9410-34bed7c321c2
db.business.update({"businessid": "b45ac5dc-4832-4779-9410-34bed7c321c2"}, {"$set": {"purifiers": 3, "links": ["https://www.facebook.com/yellowcoworking","b://page/108086234258336","https://goo.gl/maps/TAuH2cfJ5TLmwBtt8"], "categories": ["coworking"]}})

```
