import requests
from pprint import pprint
import os
import pickle
from py2neo import neo4j
from py2neo import cypher
import json
import py2neo
import time
from flask import Flask, jsonify, request, Response

from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

graph_db = neo4j.GraphDatabaseService("http://127.0.0.1:7474/db/data/")

artists = graph_db.get_or_create_index(neo4j.Node, "Artists")

key = os.environ["LASTFM_KEY"]
url = "http://ws.audioscrobbler.com/2.0"
img_order = ['large', 'medium', 'extralarge', 'mega', 'small']

timeout_cache = {}  # because py2neo has a bug and reconnects all the time...

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, str):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, str):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator



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

    def to_dict(self):
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
                                     self.to_dict())

    def __repr__(self):
        return " ".join((self.name, self.mbid, self.url, self.image))


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


def fetch(artist, cache):
    if artist in cache:
        print("cached {}".format(artist))
        return cache[artist]

    _artist = get_artist_info(artist)
    related = get_artist_related(artist)
    origin = parse_artist(_artist, match=False)
    related = [parse_artist(i) for i in related]

    res = (origin.to_dict(), [(i[0], i[1].to_dict()) for i in related])
    cache[artist] = (origin.to_dict(), [(i[0], i[1].to_dict()) for i in related])
    return res


def load_cache():
    try:
        cache = {}
        with open("cache.pickle", "rb") as f:
            cache = pickle.load(f)
        return cache
    except:  # Do not bother for now
        return {}


def save_cache(cache):
    with open("cache.pickle", "wb") as f:
        pickle.dump(cache, f)


def to_json(data):
    with open('data.json', 'w') as outfile:
        json.dump(data, outfile)


def make_cache(artist, current_cache, clear=False):
    # cache = load_cache()
    # if clear:
    #     cache = {}
    origin, related = fetch(artist, current_cache)

    for i in related:
        score, artist = i
        print("process {} ".format(artist["name"]))
        origin2, result2 = fetch(artist["name"], current_cache)

    return current_cache


def _iter(iterable, cache):
    next_iteration = set()
    for i in iterable:
        time.sleep(0.2)
        cache = make_cache(i, cache, False)
        for k, v in cache.items():
            print(k)
            artist, related_artists = v

            artist = artists.get_or_create("mbid", artist["mbid"], artist)
            batch = neo4j.WriteBatch(graph_db)
            for i in related_artists:
                score, r_artist = i
                next_iteration.add(r_artist['name'])
                related = artists.get_or_create("mbid", r_artist["mbid"], r_artist)
                r = py2neo.rel(artist, ("RELATED", {"score": score}), related)
                batch.get_or_create(r)
            batch.submit()
    return next_iteration.difference(iterable)

def run():
    to_search = {
        "tom waits", "j.j. cale", "muddy waters", "iron maiden",
        "black sabbath", "bob marley", "john lee hooker",
        "deep purple", "Four Tet", "Bonobo",
        "Jefferson Airplane", "Teebs", "Flying Lotus", "Bibio",
        "peter green", "fleetwood mac", "Marvin Gaye", "Otis Redding",
        "Barry White", "Percy Sledge", "James Brown", "Curtis Mayfield",
        "Ray Charles"
    }
    cache = {}
    next_iteration = _iter(to_search, cache)
    next_iteration = _iter(next_iteration, cache)
    next_iteration = _iter(next_iteration, cache)
    next_iteration = _iter(next_iteration, cache)



app = Flask(__name__)

@app.route('/get_related', methods=["GET"])
@crossdomain(origin="*")
def get_related():
    artist = request.form['artist']
    try:
        return json.dumps(timeout_cache[artist])
    except KeyError:
        pass
    cypher = """
        START artist=node:node_auto_index(name="{}")
        MATCH (artist)<-[r:RELATED]-(artist2)
        RETURN artist, r.score, artist2
        ORDER BY r.score DESC
        limit 20
    """.format(artist)
    query = neo4j.CypherQuery(graph_db, cypher)
    result = query.execute()

    result = list(result)
    origin = result[0][0].get_properties()
    related = [(i[1], i[2].get_properties()) for i in result]
    res = [origin, related]
    timeout_cache[artist] = res
    return json.dumps(res)

if __name__ == "__main__":
    app.run()

# if __name__ == '__main__':
#     # make_cache(True)
#     run()

