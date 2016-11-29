function play() {
	run = !run;
}

var run = false;

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
		vx: 0,
		vy: 0
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

circles.attr("transform", function(d) {
			return "translate(" + x(d.x) + "," + y(d.y) + ")";
		});

d3.timer(function() {
	//Update FPS
	var now = Date.now(), duration = now - start;
	text.text(~~(++frames * 1000 / duration));
	if (duration >= 1000) frames = 0, start = now;

	if (run) {
		data.sort();
		data.forEach(function(d) {
			d.vx += (Math.random()-0.5)*0.001;
			d.vy += (Math.random()-0.5)*0.001;

			d.x += d.vx;
			d.y += d.vy;
		})
		circles.attr("transform", function(d) {
			return "translate(" + x(d.x) + "," + y(d.y) + ")";
		});
	}
});
