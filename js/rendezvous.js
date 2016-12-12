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
		(Math.random()-0.5)*5,
		(Math.random()-0.5)*5,
		0,
		0,
		'rgb(255, 0, 213)');
});

var lineData = [];
for (var a = 0; a < data.length; a++) {
	lineData.push([]);
	for (var b = 0; b < data.length; b++) {
		lineData[a].push(new line(data[a].x, data[a].y, data[b].x, data[b].y));
	}
}

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
			return x(d.x);
		})
		.attr('cy', function(d) {
			return y(d.y);
		})
		.attr('r', 5)
		.attr('fill', function(d) {
			return d.color;
		});

var skirts = canvas.selectAll('skirt')
		.data(data)
		.enter().append('circle')
		.attr('cx', function(d) {
			return x(d.x);
		})
		.attr('cy', function(d) {
			return y(d.y);
		})
		.attr('r', 20)
		.attr('fill', function(d) {
			return 'rgba(255, 221, 0, 0.15)';
		});

var lines = canvas.selectAll('line')
		.data(lineData)
		.enter().append('line')
		.attr('x1', function(d) {
			return x(d.x1);
		})
		.attr('y1', function(d) {
			return y(d.y1);
		})
		.attr('x2', function(d) {
			return x(d.x2);
		})
		.attr('y2', function(d) {
			return y(d.y2);
		})
		.attr('stroke', 'white')
		.attr('stroke-width', 1);

//initializes circles at center to begin
render();

d3.timer(function() {
	//Update FPS
	var now = Date.now(), duration = now - start;
	text.text(~~(++frames * 1000 / duration));
	if (duration >= 1000) frames = 0, start = now;

	if (run) {
		moveRandom();
		//moveRendezvous();
		render();
	}
});

function render() {
	circles.attr('transform', function(d) {
		return 'translate(' + d.x + ',' + d.y + ')';
	}).attr('fill', function(d) {
		return d.color;
	});

	skirts.attr('transform', function(d) {
		return 'translate(' + d.x + ',' + d.y + ')';
	});

	// lines.attr('x1', function(d) {
	// 		return +(d3.select(this).attr('x1')) + d.vx;
	// }).attr('y1', function(d) {
	// 		return +(d3.select(this).attr('y1')) + d.vy;
	// });
}

function dist(a, b) {
	return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function moveRendezvous() {
	for (var a = 0; a < data.length; a++) {
		var x_component = 0;
		var y_component = 0;
		for (var b = 0; b < data.length; b++) {
			x_component += (data[b].x - data[a].x)*dist(data[a], data[b])*.01;
			x_component += (data[b].y - data[a].y)*dist(data[a], data[b])*.01;
		}
		// console.log(x_component);
		// console.log(y_component);
		x_component /= data.length;
		y_component /= data.length;
		data[a].vx += x_component;
		data[a].vy += y_component;
		data[a].x += data[a].vx;
		data[a].y += data[a].vy;
	}
}

function moveRandom() {
	data.forEach(function(d) {
		d.vx += (Math.random()-0.5)*0.5;
		d.vy += (Math.random()-0.5)*0.5;
		d.x += d.vx;
		d.y += d.vy;

		// d.lines[0].x1 = d.x;
		// d.lines[0].y1 = d.y;
		// d.lines[0].x2 = 0;
		// d.lines[0].y2 = 0;
	});
}
