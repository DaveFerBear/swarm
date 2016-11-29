function test() {
	setInterval(function() {
		update();
	}, 0);
}

var canvas = d3.select('body')
		.append('svg')
		.attr('width', screen.width)
		.attr('height', screen.height);

var text = canvas.append("svg:text")
        .attr("x", screen.width - 100)
        .attr("y", 20);
    
var start = Date.now(),
	frames = 0;

var data = d3.range(200).map(function() {
	return {
		x: 0,
		y: 0,
		vx: 0.001,
		vy: 0.001
	}
});

var x = d3.scaleLinear()
    .domain([-5, 5])
    .range([0, screen.width]);

var y = d3.scaleLinear()
    .domain([-5, 5])
    .range([0, screen.height]);


var circles = canvas.selectAll("circle")
		.data(data)
		.enter().append('circle')
		.attr('cx', function(d) {
			return d.x;
		})
		.attr('cy', function(d) {
			return d.y;
		})
		.attr('r', 5)
		.attr('fill', 'rgb(255, 0, 213)');

d3.timer(function() {
	//Update FPS
	var now = Date.now(), duration = now - start;
	text.text(~~(++frames * 1000 / duration));
	if (duration >= 1000) frames = 0, start = now;

	data.forEach(function(d) {
		d.x += d.vx;
		d.y += d.vy;
	})

	circles.attr("transform", function(d) {
			return "translate(" + x(d.x) + "," + y(d.y) + ")";
		}).attr("r", function(d) {
			return Math.min(1 + 1000 * Math.abs(d.vx * d.vy), 10);
	});
});

function update() {
	for (var i = 0; i < numBodies; i++) {
		var dx = 0;
		var dy = 0;
		for (var j = 0; j < numBodies; j++) {
			if (i!=j) {
				dx += orgs[j][0];
				dy += orgs[j][1];
			}
		}
		dx = dx/(numBodies - 1);
		dy = dy/(numBodies - 1);

		orgs[i][0]+= (dx-orgs[i][0])/(numBodies*2);
		orgs[i][1]+= (dy-orgs[i][1])/(numBodies*2);
	}	
	circles.transition()
			.duration(100)
			.ease(d3.easeLinear)
			.attr('cx', function(d, i) {
				d = orgs[i][0];
				return d;
			})
			.attr('cy', function(d, i) {
				d = orgs[i][1]
				return d;
			});
}


