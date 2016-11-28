function test() {
	setInterval(function() {
		update();
	}, 0);
}

var numBodies = 100;

var canvas = d3.select('body')
		.append('svg')
		.attr('width', screen.width)
		.attr('height', screen.height);

var text = canvas.append("svg:text")
        .attr("x", screen.width - 100)
        .attr("y", 20);
    
var start = Date.now(),
	frames = 0;

d3.timer(function() {
	//Update FPS
	var now = Date.now(), duration = now - start;
	text.text(~~(++frames * 1000 / duration));
	if (duration >= 1000) frames = 0, start = now;
});

var orgs = [];

for (var x = 0; x < numBodies; x++) {
	orgs.push([Math.random() * screen.width, Math.random() * screen.height]);
}

var circles = canvas.selectAll("circle")
		.data(orgs)
		.enter().append('circle')
		.attr('cx', function(d, i) {
			d = orgs[i][0];
			return d;
		})
		.attr('cy', function(d, i) {
			d = orgs[i][1];
			return d;
		})
		.attr('r', 5)
		.attr('fill', 'rgb(255, 0, 213)');

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

		orgs[i][0]+= (dx-orgs[i][0])/100;
		orgs[i][1]+= (dy-orgs[i][1])/100;
	}	
	circles.transition()
			.duration(200)
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


