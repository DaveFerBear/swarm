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

var data = d3.range(3).map(function() {
	return new agent(
		0,
		0,
		(Math.random()-0.5)*.05,
		(Math.random()-0.5)*.05,
		'rgb(255, 0, 213)');
});

data.forEach(function(d) {
	d.lines.push(new line(100*Math.random(), 100*Math.random(), 100*Math.random(), 100*Math.random()));
});

var x = d3.scaleLinear()
	.domain([-5, 5])
	.range([0, screen.width]);

var y = d3.scaleLinear()
	.domain([-5, 5])
	.range([0, screen.height]);

var circles = canvas.selectAll('circle')
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

var lines = canvas.selectAll('line')
		.data(data)
		.enter().append('line')
		.attr('x1', function(d) {
			return d.lines[0].x1;
		})
		.attr('y1', function(d) {
			return d.lines[0].y1;
		})
		.attr('x2', function(d) {
			return d.lines[0].x2;
		})
		.attr('y2', function(d) {
			return d.lines[0].y2;
		})
		.attr('stroke', 'white')
		.attr('stroke-width', 1);

//initializes circles at center to begin
renderCircles();

d3.timer(function() {
	//Update FPS
	var now = Date.now(), duration = now - start;
	text.text(~~(++frames * 1000 / duration));
	if (duration >= 1000) frames = 0, start = now;

	if (run) {
		rendezvous();
		renderCircles();
	}
});

function renderCircles() {
	circles.attr('transform', function(d) {
		return 'translate(' + x(d.x) + ',' + y(d.y) + ')';
	}).attr('fill', function(d) {
		return d.color;
	});
}


function rendezvous() {
	// data.sort(function(a, b) {
	// 	return (a.x - b.x);
	// });

	data.forEach(function(d) {
		d.vx += (Math.random()-0.5)*0.005;
		d.vy += (Math.random()-0.5)*0.005;
		d.x += d.vx;
		d.y += d.vy;
	});
	updateLines();
}

function updateLines() {
	data.forEach(function(d) {
		d.lines[0].x1 = 100*Math.random();
		d.lines[0].y1 = 100*Math.random();
		d.lines[0].x2 = -100*Math.random();
		d.lines[0].y2 = -100*Math.random();
	});
	//d3.select('.line').transition();
}
