/*var graph = 'data.json'
 h = 700,
 r = 10;
 link_color = 'magenta';
 var zoom = d3.behavior.zoom().on("zoom", redraw);

 var vis = this.vis = d3.select("#holder")
 .append("svg:svg")
 .attr("width", w)
 .attr("height", h)
 .attr("pointer-events", "all")
 .append('svg:g')
 .call(zoom)
 .append('svg:g');

 vis.append('svg:rect')
 .attr('width', w)
 .attr('height', h)
 .attr('fill', 'rgba(1,1,1,0)')

 function redraw() {
 vis.attr("transform","translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"); }

 var force = d3.layout.force()
 .gravity(0.01)
 .charge(-400)
 .size([w, h]);

 var svg = d3.select(".text").append("svg")
 .attr("width", w)
 .attr("height", h);

 d3.json(graph, function(json) {
 var link = vis.selectAll("line")
 .data(json.links)
 .enter().append("line")
 .attr("stroke-opacity", function(d) { return d.score/10; })
 .attr("stroke-width", function(d) { return 6/d.score })
 .style("stroke", link_color)
 .on("mouseover", function(){d3.select(this).attr("stroke-opacity", "1.0");})
 .on("mouseout", function(){
 d3.select(this).attr("stroke-opacity",
 function(d) { return d.score/10;})
 .attr("stroke-width", function(d) { return 6/d.score })
 });

 link.append("title")
 .text(function(d) { return d.score } );

 var node = vis.selectAll("g.node")
 .data(json.nodes)
 .enter().append("svg:g")
 .attr("class","node")
 .call(force.drag);

 node.append("svg:circle")
 .attr("r", 50)
 .style("fill", function(d) { if(d.style == 'filled') { return d.color;}; })
 .style("stroke", function(d) { if(d.style !== 'filled') { return d.color;}; })
 .style("stroke-width", "4")
 .on("mouseover", function(){d3.select(this).style("fill", "#999");})
 .on("mouseout", function(d) {
 if (d.style == 'filled') { d3.select(this).style("fill",d.color); }
 else {
 d3.select(this).style("stroke",d.color);
 d3.select(this).style("fill","black");
 } } );

 node.append("svg:text")
 .attr("text-anchor", "middle")
 .attr("fill","#fff")
 .style("pointer-events", "none")
 .attr("font-size", '16px' )
 .text( function(d) { return d.name; } ) ;

 node.append("title")
 .text(function(d) { return d.URI } );

 force
 .nodes(json.nodes)
 .links(json.links)
 .on("tick", tick)
 .start();

 function tick() {
 node.attr("cx", function(d) { return d.x; })
 .attr("cy", function(d) { return d.y; })
 .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});

 link.attr("x1", function(d) { return d.source.x; })
 .attr("y1", function(d) { return d.source.y; })
 .attr("x2", function(d) { return d.target.x; })
 .attr("y2", function(d) { return d.target.y; });
 }
 });
 */

var w = document.getElementById('holder_container').offsetWidth;
var h = document.getElementById('holder_container').offsetHeight;
var store = [];
var link_color = 'magenta';


function myGraph(el) {
    // Add and remove elements on the graph object
    this.addNode = function (obj) {
        nodes.push(obj);
        update();
    };

    this.removeNode = function (id) {
        var i = 0;
        var n = findNode(id);
        while (i < links.length) {
            if ((links[i]['source'] === n) || (links[i]['target'] == n)) links.splice(i, 1);
            else i++;
        }
        var index = this.findNodeIndex(id);
        if (index !== undefined) {
            nodes.splice(index, 1);
            update();
        }
    };

    this.addLink = function (sourceId, targetId, score) {
        var sourceNode = findNode(sourceId);
        var targetNode = findNode(targetId);

        if ((sourceNode !== undefined) && (targetNode !== undefined)) {
            links.push({"source": sourceNode, "target": targetNode, 'score': score});
            update();
        }
    };

    var findNode = function (id) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) {
                return nodes[i]
            }
        }

    };

    this.findNodeIndex = function (id) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) {
                return i;
            }
        }

    };

    function redraw() {
        vis.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
    }

    var zoom = d3.behavior.zoom().on("zoom", redraw);

    // set up the D3 visualisation in the specified element
    var w = document.getElementById('holder').offsetWidth,
        h = document.getElementById('holder').offsetWidth;

    var vis = this.vis = d3.select("#holder")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("pointer-events", "all")
        .append('svg:g')
        .call(d3.behavior.zoom().on("zoom", redraw))

    vis.append('svg:rect')
        .attr('width', w)
        .attr('height', h)
        .attr('fill', 'rgba(1,1,1,0)');

    var force = d3.layout.force();
    
    var svg = d3.select(".text").append("svg")
        .attr("width", w)
        .attr("height", h);

    var nodes = force.nodes(),
        links = force.links();

    var update = function () {

        var link = vis.selectAll("line.link")
            .data(links, function (d) {
                return d.source.id + "-" + d.target.id;
            });

        link.enter()
           .insert("line")
           .style("stroke-opacity", function (d) {
               return d.score;
           })
           .style("stroke-width", function (d) {
               return d.score * 10;
           })
           .attr("class", "link")
           .on("mouseover", function () {
               d3.select(this)
                   .style("stroke-opacity", "1.0")
                   .style("stroke-width", 5)
               ;
           })

           .on("mouseout", function () {
               d3.select(this)
                   .attr("stroke-opacity", function (d) {
                       return d.score;
                   })
                   .attr("stroke-width", function (d) {
                       return d.score * 5;
                   })
           });

        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id;
            });


        var nodeEnter = node.enter()
            .append("g")
            .attr("class", "node")
            .attr("width", 50)
            .attr("height", 50)
            .call(force.drag);

        nodeEnter
            .append("text")
            .style('font-size', 13)
            .style('color', 'white')
            .style('fill', 'white')
            .style('z-index', 500)
            .style('stroke-width', function(d){ return d.score})
            .attr("class", "nodetext")
            .attr("dx", -8)
            .attr("dy", -8)
            .text(function (d) {
                return d.name;
            });


        nodeEnter.append("image")
            .attr("xlink:href", function (d) {
                return d.image
            })
            .attr("width", 50)
            .attr("height", 50)
            .on("mouseover", function () {
               d3.select(this)
                   .attr("width", 80)
                   .attr("height", 80)
               ;
            })

           .on("mouseout", function () {
               d3.select(this)
                .attr("width", 50)
                .attr("height", 50)
            });



        node.exit().remove();

        force.on("tick", function () {

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

            link.attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });
        });

        // Restart the force layout.
        force
                .gravity(.01)
                .charge(-80000)
                .friction(0)
                .linkDistance( function(d) { return 70/d.score } )
                .size([w, h])
                .start();
    };

    this.zoom = function (direction) {
        if (direction == "in") {
            var scale = zoom.scale() * 1.5;
            var x = ((zoom.translate()[0] - (w / 2)) * 1.5) + w / 2;
            var y = ((zoom.translate()[1] - (h / 2)) * 1.5) + h / 2;
        } else {
            var scale = zoom.scale() * .75;
            var x = ((zoom.translate()[0] - (w / 2)) * .75) + w / 2;
            var y = ((zoom.translate()[1] - (h / 2)) * .75) + h / 2;
        }
        this.scale = scale;
        zoom.scale(scale).translate([x, y]);
        vis.transition().duration(50).attr("transform", "translate(" + x + ',' + y + ")" + " scale(" + scale + ")");
    };
    this.pan = function (x, y) {
        var scale = zoom.scale();
        zoom.translate([x, y]);
        vis.transition().duration(50).attr("transform", "translate(" + x + ',' + y + ")" + " scale(" + scale + ")");
    };

    this.nodes = nodes;

    // Make it all go
    update();
}

graph = new myGraph("#holder");

// You can do this from the console as much as you like...

function filterJSONandAddToGraph(JSONResponse) {
//    console.log(typeof(JSONResponse));
    JSONResponse = $.parseJSON(JSONResponse);
   console.log(JSONResponse);
    var mbid = JSONResponse[0].id;
    graph.addNode(JSONResponse[0]);

    for (var i = 1; i < JSONResponse[1].length; i++) {

//        console.log(JSONResponse[1][i]);
        JSONResponse[1][i][1].id = JSONResponse[1][i][1].name;
        JSONResponse[1][i][3].id = JSONResponse[1][i][3].name;
        graph.addNode(JSONResponse[1][i][1]);
//        console.log(JSONResponse[1][i]);
        if(i < 10){
            graph.addLink(JSONResponse[0].id, JSONResponse[1][i][1].id, JSONResponse[1][i][0]);    
        }
        
        var index_to_check = graph.findNodeIndex(JSONResponse[1][i][3].id);
        if(index_to_check > -1 && index_to_check !== undefined){
            graph.addNode(JSONResponse[1][i][3].id);
            graph.addLink(JSONResponse[1][i][1].id ,JSONResponse[1][i][3].id, JSONResponse[1][i][2]);
        }


    }

}

// You can do this from the console as much as you like...

$.get('http://54.76.152.118:1234/get_related_2', {
        artist: "'Bonobo'",
    }, filterJSONandAddToGraph 
);