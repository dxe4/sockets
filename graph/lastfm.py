import requests
from pprint import pprint
import os
import pickle
from py2neo import neo4j
from py2neo import cypher

graph_db = neo4j.GraphDatabaseService("http://localhost:7474/db/data/")

artists = graph_db.get_or_create_index(neo4j.Node, "Artists")

key = os.environ["LASTFM_KEY"]
url = "http://ws.audioscrobbler.com/2.0"
img_order = ['large', 'medium', 'extralarge', 'mega', 'small']
cache = {}

# people.create('id', '10', {"name": "Alice Smith 2"})
# artist = artists.get("id", "10")[0]
# artist.get_properties()

def get_all_artists():
    cypher = """
        START root=node:Artists("*:*")
        RETURN root
    """
    query = neo4j.CypherQuery(graph_db, cypher)
    return [i[0].get_properties() for i in query.execute()]


class Artist:
    def __init__(self, url, mbid, name, image, visited):
        self.url = url
        self.mbid = mbid
        self.image = image
        self.name = name
        self.visited = visited

    def _args(self):
        return {
            "name": self.name,
            "mbid": self.mbid,
            "image": self.image,
            "visited": self.visited,
            "url": self.url
        }

    def get_or_create(self):
        return artists.get_or_create('mbid',
                                     self.mbid,
                                     self._args())

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
    if match:
        artist = Artist(url, mbid, name, image, False)
        return row["match"], artist
    else:
        artist = Artist(url, mbid, name, image, True)
        return artist


def fetch(artist):
    if artist in cache:
        print("cached {}".format(artist))
        return cache[artist]

    _artist = get_artist_info(artist)
    related = get_artist_related(artist)
    origin = parse_artist(_artist, match=False)
    origin = origin.get_or_create()
    related = [parse_artist(i) for i in related]

    cache[artist] = (origin, related)
    return origin, related


def load_cache():
    cache = {}
    with open("cache.pickle", "rb") as f:
        cache = pickle.load(f)
    return cache


def save_cache():
    with open("cache.pickle", "wb") as f:
        pickle.dump(cache, f)


if __name__ == '__main__':
    cache = load_cache()
    origin, related = fetch("j.j. cale")

    for i in related:
        score, artist = i
        artist = artist.get_or_create()
        artist_props = artist.get_properties()
        origin2, result2 = fetch(artist["name"])

    save_cache()
