import requests
from pprint import pprint
import os
import pickle

key = os.environ["LASTFM_KEY"]
url = "http://ws.audioscrobbler.com/2.0"
img_order = ['large', 'medium', 'extralarge', 'mega', 'small']
cache = {}


class Artist:
    def __init__(self, url, mbid, name, img):
        self.url = url
        self.mbid = mbid
        self.img = img
        self.name = name

    def __repr__(self):
        return " ".join((self.name, self.mbid, self.url, self.img))


def get_image(img_list):
    '''
    get an image in preferred order, some sizes may not exist
    '''
    for size in img_order:
        try:
            elm = next(i for i in img_list if i["size"] == size)
            return elm["#text"]
        except (StopIteration, KeyError) as e:
            pass


def get_artist_info(artist):
    params = {
        "artist": artist,
        "method": "artist.getinfo",
        "api_key": key,
        "format": "json"
    }
    res = requests.get(url, params=params)
    res = res.json()
    return res["artist"]


def get_artist_related(artist):
    params = {
        "artist": artist,
        "method": "artist.getsimilar",
        "api_key": key,
        "format": "json"
    }
    res = requests.get(url, params=params)
    res = res.json()
    return res["similarartists"]["artist"]


def parse_artist(row, match=True):
    args = row["url"], row["mbid"], row["name"], get_image(row["image"])
    url, mbid, name, image = args
    artist = Artist(url, mbid, image, name)
    if match:
        return row["match"], artist
    else:
        return artist


def fetch(artist):
    if artist in cache:
        print("cached")
        return cache[artist]

    _artist = get_artist_info(artist)
    related = get_artist_related(artist)
    origin = parse_artist(_artist, match=False)
    related = [parse_artist(i) for i in related]

    cache[artist] = (origin, related)
    return origin, related


if __name__ == '__main__':
    # database !?
    with open("cache.pickle", "rb") as f:
        cache = pickle.load(f)

    result = fetch("j.j. cale")

    with open("cache.pickle", "wb") as f:
        pickle.dump(cache, f)

    pprint(cache)