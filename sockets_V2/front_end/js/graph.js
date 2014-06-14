var graph = 'data.json'
var w = document.getElementById('holder_container').offsetWidth,
    h = 700,
    r = 10;
    link_color = 'magenta';
var zoom = d3.behavior.zoom().on("zoom", redraw);

var vis = d3.select("#holder")
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
        //.gravity(0.25)
        .charge(-400)
        .linkDistance( 120 )
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
                .attr("r", function(d) {
                if (d.size > 0) 
                { return 10+(d.size*2); } 
                else
                { return 10; }} )
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

