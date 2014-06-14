import requests
from pprint import pprint
import os

key = os.environ["LASTFM_KEY"]

url = "http://ws.audioscrobbler.com/2.0"
params = {
    "artist": "j.j. cale",
    "method": "artist.getsimilar",
    "api_key": key,
    "format": "json"

}
res = requests.get(url, params=params)

res = res.json()
pprint(res["similarartists"]["artist"])
