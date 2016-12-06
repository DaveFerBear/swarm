function play() {
	run = !run;
}

var run = false;

var canvas = d3.select('html')
		.append('svg')
		.attr('width', screen.width)
		.attr('height', screen.height);

var text = canvas.append("svg:text")
		.attr("x", screen.width - 100)
		.attr("y", 100)
		.attr('id', 'fps');
	
var start = Date.now(),
	frames = 0;

function agent(_x, _y, _vx, _vy, _color) {
	this.x = _x;
	this.y = _y;
	this.vx = _vx;
	this.vy = _vy;
	this.color = _color;
	this.lines = [];
}

function line(_x1, _y1, _x2, _y2) {
	this.x1 = _x1;
	this.y1 = _y1;
	this.x2 = _x2;
	this.y2 = _y2;
}

var data = d3.range(100).map(function() {
	return new agent(
		0,
		0,
		(Math.random()-0.5)*.05,
		(Math.random()-0.5)*.05,
		'rgb(255, 0, 213)');
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
		.attr('fill', function(d) {
			return d.color;
		});

var lines;

circles.attr("transform", function(d) {
			return "translate(" + x(d.x) + "," + y(d.y) + ")";
		});

d3.timer(function() {
	//Update FPS
	var now = Date.now(), duration = now - start;
	text.text(~~(++frames * 1000 / duration));
	if (duration >= 1000) frames = 0, start = now;

	if (run) {
		rendezvous();
		circles.attr('transform', function(d) {
			return "translate(" + x(d.x) + "," + y(d.y) + ")";
		}).attr('fill', function(d) {
			return d.color;
		});
		// lines.attr('transform', function(d) {
		// 	return "translate(" + x(d.x) + "," + y(d.y) + ")";
		// });

	}
});

function rendezvous() {
	data.sort(function(a, b) { //sort based on x position
		return (a.x - b.x);
	});

	var j = data.length/2;
	for (var i = 0; i < j; i++) {
		data[i].color = 'rgb(100, 0, 100)';
	}
	for (; j < data.length; j++) {
		data[j].color = 'rgb(255, 0, 213)';
	}

	for (var k = 0; k < data.length; k++) {
		connect(data[0], data[k]);
	}

	data.forEach(function(d) {
		d.vx += (Math.random()-0.5)*0.005;
		d.vy += (Math.random()-0.5)*0.005;
		d.x += d.vx;
		d.y += d.vy;
	})
}

function connect(a, b) {
	// lines = canvas.append('line')
	// 		.attr('x1', function() { return x(a.x) })
	// 		.attr('y1', function() { return y(a.y) })
	// 		.attr('x2', function() { return x(b.x) })
	// 		.attr('y2', function() { return y(b.y) })
	// 		.attr('stroke-width', 1)
	// 		.attr('stroke', 'white');
	lines = d3.line()
	    .x(50)
	    .y(10);
}
