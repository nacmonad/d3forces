
    var WIDTH = 800;
	var HEIGHT = 600;
	var c10 = d3.scale.category10();
	//var data = genNodes();
	 var data = [{id: 01,
		name: "herb",
		amount:"220"},
		{id: 02,
		name: "derp",
		amount:"330"},
		{id: 03,
		name: "foo",
		amount:"490"},
		{id: 04,
		name: "bar",
		amount:"290"},
		{id: 05,
		name: "blip",
		amount:"490"},
		{id: 06,
		name: "asdflk",
		amount:"390"}]; 
	
	var force = d3.layout.force()
		.nodes(data)
		.size([WIDTH, HEIGHT])
		.charge(-300)
		.gravity(0.1)
		.alpha(0.1)
		.on("tick", tick)
		.start();

 	var vis = d3.select('.vis').append('g');
 		vis.attr('class','svggroup');

 	var svgs = vis.append('svg')
 		.attr('class','svgs')
 		.attr('height', HEIGHT)
 		.attr('width', WIDTH);

 	var groups = svgs.selectAll("g")
    	.data(force.nodes())
    	.enter()
    	.append("g")
    	.attr("class","nodegroup");

 	//enter
 	var node = groups
 		.append("circle")
 		.style("fill", function(d,i) { return c10(i);})
 		.attr("r", function(d) { return Math.sqrt(d.amount)})
 		.attr("class", "node")
 		.call(force.drag);

 		node
 		.on("mouseover", function(selected) {
 			//force.stop();
 			d3.select(this).transition()
		    .duration(500)
		    .attr("r", 75); 

 			//bring node to front
	         d3.selectAll('.nodegroup')
		        .sort(function(a, b) {
				          if (a.id === selected.id) {
				            return 1;
				          } else {
				            if (b.id === selected.id) {
				              return -1;
					            } else {
					              return 0;
					            }
		          			}
		        	});
		       //force.resume();

		    //append text to parent group, not the circle

			d3.select(this.parentNode).append("text")
				.attr("class", "innerText")
     			.attr("text-anchor", "middle")
     			.attr("fill", "black")
     			.text(function(d) {
     				  return d.name;
     			 })
     			.attr("pointer-events","none")  // this eliminates the loss of :hover when directly over the text
     			.attr("transform", function(d) { 
    				return 'translate(' + [d.x, d.y] + ')';
    			});
		      
     	 })
 		.on("mouseout", function(){
 			d3.select(this).transition()
		    .duration(500)
		    .attr("r", function(d) { return Math.sqrt(d.amount)});

		     //remove text   console.log(this.getBBox());
			d3.select(this.parentNode).select("text").remove();

 		});

 	//setup inputs
 	
 	d3.selectAll("input").on("input", function() {
 		update(this.id, this.value);
 	});

 	function update(property, value) {
 		d3.select("#"+property+"-value").text(value);
 		//force.stop();  //is this neccessary?
 		if(property == "charge") {
 			force.charge(value);
 			force.start();
 			console.log("changing force.charge(" +value+")");
 		}
 		else if (property == "gravity") {
 			force.gravity(value);
 			force.start();
 			console.log("changing force.gravity(" +value+")");
 		}
 	}
	 
	 //tick
	function tick () {
	 		//here be the magic
	 		node.attr("cx", function(d) {return d.x})
	 			.attr("cy", function(d) {return d.y});

	 		d3.selectAll('text').attr("transform", function(d) { 
    				return 'translate(' + [d.x, d.y] + ')';
    			})

	 	}

	 function charge(d) {
	 	return d.amount * d.amount * -0.25;
	 }

 	//generate random nodes

 	function genNode() {
 		var maxAmt = 400;
 		var amt = Math.floor(Math.random()*maxAmt+1);
 		return {amount:amt};
 	}

 	function genNodes() {
 		var newNodes = [];
 		var maxNodes = 10;
 		var n = Math.floor(Math.random()*maxNodes+4);
 		for (var i =0; i< n; i++) {
 			newNodes.push(genNode());
 		}
 		return newNodes;
 	}

 	function getNewNodes() { location.reload();}
