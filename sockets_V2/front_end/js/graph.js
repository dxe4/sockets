/*var graph = 'data.json'
var w = document.getElementById('holder_container').offsetWidth,
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
var link_color = 'magenta';


function myGraph(el) {
    // Add and remove elements on the graph object
    this.addNode = function (id) {
        nodes.push({"id":id});
        update();
    }

    this.removeNode = function (id) {
        var i = 0;
        var n = findNode(id);
        while (i < links.length) {
            if ((links[i]['source'] === n)||(links[i]['target'] == n)) links.splice(i,1);
            else i++;
        }
        var index = findNodeIndex(id);
        if(index !== undefined) {
            nodes.splice(index, 1);
            update();
        }
    }

    this.addLink = function (sourceId, targetId) {
        var sourceNode = findNode(sourceId);
        var targetNode = findNode(targetId);

        if((sourceNode !== undefined) && (targetNode !== undefined)) {
            links.push({"source": sourceNode, "target": targetNode});
            update();
        }
    }

    var findNode = function (id) {
        for (var i=0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return nodes[i]
        };
    }

    var findNodeIndex = function (id) {
        for (var i=0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return i
        };
    }
    function redraw() {
        vis.attr("transform","translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"); } 

    var zoom = d3.behavior.zoom().on("zoom", redraw);

    // set up the D3 visualisation in the specified element
    var w = $(el).innerWidth(),
        h = $(el).innerHeight();

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

    var force = d3.layout.force()
        .gravity(0.01)
        .charge(-400)
        .size([w, h]);

    var svg = d3.select(".text")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var nodes = force.nodes(),
        links = force.links();

    var update = function () {

        var link = vis.selectAll("line.link")
            .data(links, function(d) { return d.source.id + "-" + d.target.id; });

        link.enter()
            .insert("line")
            .attr("stroke-opacity", function(d) { return d.score/10; })
            .attr("stroke-width", function(d) { return 6/d.score })
            .attr("class", "link")
            .style("stroke", link_color)
            .on("mouseover", function(){
                d3.select(this)
                .attr("stroke-opacity", "1.0")
                .attr("stroke-width", 5) 
            ;})

            .on("mouseout", function(){
                d3.select(this)
                .attr("stroke-opacity", function(d) { return d.score/10;})
                .attr("stroke-width", function(d) { return 6/d.score }) 
            });

        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes, function(d) { return d.id;});

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .append("svg:circle")
            .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 50; })
            .style("fill", 'magenta')
            .style("stroke", 'black')
            .style("stroke-width", "4")
            .call(force.drag);

/*        nodeEnter.append("image")
            .attr("class", "circle")
            .attr("xlink:href", "https://d3nwyuy0nl342s.cloudfront.net/images/icons/public.png")
            .attr("x", "-8px")
            .attr("y", "-8px")
            .attr("width", "16px")
            .attr("height", "16px");*/

        nodeEnter.append("text")
            .attr("class", "nodetext")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) {return d.name});

        node.exit().remove();

        force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

        // Restart the force layout.
        force.start();
    }

    this.zoom = function(direction){
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
        zoom.scale(scale).translate([x,y])
        vis.transition().duration(750).attr("transform","translate(" + x +',' + y + ")" + " scale(" + scale + ")");
    }
    this.translate = function(x, y){
        var scale = zoom.scale();
        zoom.translate([x,y]);
        vis.transition().duration(750).attr("transform","translate(" + x +',' + y + ")" + " scale(" + scale + ")");
    }

    // Make it all go
    update();
}

graph = new myGraph("#holder");

// You can do this from the console as much as you like...
graph.addNode("Cause");
graph.addNode("Effect");
graph.addLink("Cause", "Effect");
graph.addNode("A");
graph.addNode("B");
graph.addLink("A", "B");

$.get('/data.json', function(data){
    console.log(data)
})
