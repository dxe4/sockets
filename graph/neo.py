from py2neo import neo4j
graph_db = neo4j.GraphDatabaseService("http://localhost:7474/db/data/")
graph_db.clear()

# from py2neo import neo4j
# query = neo4j.CypherQuery(graph_db, """
#     START root=node:Artists("*:*")
#     RETURN root
# """)
#
# for i in query.execute():
#     print(i[0].get_properties())

# # create a node and obtain a reference to the "People" node index
# alice, = graph_db.create({"name": "Alice Smith"})
# people = graph_db.get_or_create_index(neo4j.Node, "People")
#
# # add the node to the index
# indexed_node = graph_db.get_or_create_indexed_node('People', 'id', '10', {"name": "Alice Smith 2"})
# # people.create('id', '10', {"name": "Alice Smith 2"})
#
#
#
# x = people.get("id", "10")
#
# print(x[0].get_properties())