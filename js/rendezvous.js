//Pause, Play animation
$(".play-button").click(function() {
  $(this).toggleClass("paused");
  run = !run;
});

//Swarm Demo
function apply() {
	NUM_AGENTS = document.getElementById("num_agents").value;
	canvas.selectAll('circle').remove();
	canvas.selectAll('skirt').remove();
	canvas.selectAll('line').remove();
	data = d3.range(NUM_AGENTS).map(function() {
	return new agent(
		(Math.random()-0.5)*5,
		(Math.random()-0.5)*5,
		0,
		0,
		'rgb(255, 0, 213)');
	});
	createLineData();
	circles = canvas.selectAll('circle')
		.data(data)
		.enter().append('circle')
		.attr('r', 5)
		.attr('fill', function(d) {
			return d.color;
		});
	skirts = canvas.selectAll('skirt')
		.data(data)
		.enter().append('circle')
		.attr('r', SKIRT_RADIUS)
		.attr('fill', function(d) {
			return 'rgba(255, 140, 0, 0.02)';
		});
	lines = canvas.selectAll('line')
		.data(lineData)
		.enter().append('line')
		.attr('stroke-width', .1);
	updateLineData();
	render();
}

var run = false;
var NUM_AGENTS = 20;
var SKIRT_RADIUS = 140;
var canvas = d3.select('html')
		.append('svg')
		.attr('width', screen.width)
		.attr('height', screen.height);

var text = canvas.append("svg:text")
		.attr("x", screen.width - 100)
		.attr("y", 100)
		.attr('id', 'fps');
	
var start = Date.now(), frames = 0;

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
	this.show = false; //hide by default
}

var data = d3.range(NUM_AGENTS).map(function() {
	return new agent(
		(Math.random()-0.5)*5,
		(Math.random()-0.5)*5,
		0,
		0,
		'rgb(255, 0, 213)');
});

var lineData = [];
createLineData();

var x = d3.scaleLinear()
	.domain([-5, 5])
	.range([0, screen.width]);

var y = d3.scaleLinear()
	.domain([-5, 5])
	.range([0, screen.height]);


//static attributes
var circles = canvas.selectAll('circle')
		.data(data)
		.enter().append('circle')
		.attr('r', 5)
		.attr('fill', function(d) {
			return d.color;
		});
var skirts = canvas.selectAll('skirt')
		.data(data)
		.enter().append('circle')
		.attr('r', SKIRT_RADIUS)
		.attr('fill', function(d) {
			return 'rgba(255, 140, 0, 0.02)';
		});
var lines = canvas.selectAll('line')
		.data(lineData)
		.enter().append('line')
		.attr('stroke-width', .1);

updateLineData();
render();

d3.timer(function() {
	//Update FPS
	var now = Date.now(), duration = now - start;
	text.text(~~(++frames * 1000 / duration));
	if (duration >= 1000) frames = 0, start = now;

	if (run) {
		//moveRandom();
		moveRendezvous(true, false);
		updateLineData();
		render();
	}
});

function render() {
	circles.attr('transform', function(d) {
		return 'translate(' + x(d.x) + ',' + y(d.y) + ')';
	}).attr('fill', function(d) {
		return d.color;
	});

	skirts.attr('transform', function(d) {
		return 'translate(' + x(d.x) + ',' + y(d.y) + ')';
	});

	lines.attr('x1', function(d, i) {
		return x(d.x1);
	}).attr('y1', function(d, i) {
		return y(d.y1);
	}).attr('x2', function(d, i) {
		return x(d.x2);
	}).attr('y2', function(d, i) {
		return y(d.y2);
	}).attr('stroke', function(d) {
		if (d.show)
			return 'white';
		else
			return '#00ffffff'; //transparent
	});
}

function createLineData() {
	for (var a = 0; a < data.length; a++) {
		for (var b = 0; b < data.length; b++) {
			lineData.push(new line(data[a].x, data[a].y, data[b].x, data[b].y));
		}
	}
}

function updateLineData() {
	var x = 0;
	for (var a = 0; a < data.length; a++) {
		for (var b = 0; b < data.length; b++) {
			if (dist(data[a], data[b]) < SKIRT_RADIUS*2) {
				lineData[x].show = true;
				//Only bother to update positions if visible
				lineData[x].x1 = data[a].x;
				lineData[x].y1 = data[a].y;
				lineData[x].x2 = data[b].x;
				lineData[x].y2 = data[b].y;
			} else {
				lineData[x].show = false;
			}			
			x++;
		}
	}
}

function dist(a, b) {
	return Math.sqrt(Math.pow(x(a.x) - x(b.x), 2) + Math.pow(y(a.y) - y(b.y), 2));
}

function moveRendezvous(swarm, gravity) {
	for (var a = 0; a < data.length; a++) {
		var x_component = 0;
		var y_component = 0;
		for (var b = 0; b < data.length; b++) {
			var d = dist(data[a], data[b]);
			if (d > 100) { //edge case for the agent finding itself
				if (swarm) {
					if (d < SKIRT_RADIUS*2) {
						if (Math.sqrt(Math.pow(x_component, 2), Math.pow(y_component,2)) < .01) { //set max velocity
							x_component += (data[b].x - data[a].x)/d;
							y_component += (data[b].y - data[a].y)/d;
						}
					}
				} else { //Compute gravity normally
					x_component += (data[b].x - data[a].x)/d;
					y_component += (data[b].y - data[a].y)/d;
				}
			}
		}
		if (gravity) {
			data[a].vx += x_component;
			data[a].vy += y_component;
			data[a].x += data[a].vx;
			data[a].y += data[a].vy;
		} else {
			data[a].x += x_component*.5;
			data[a].y += y_component*.5;
		}
	}
}

function moveRandom() {
	data.forEach(function(d) {
		d.vx += (Math.random()-0.5)*0.01;
		d.vy += (Math.random()-0.5)*0.01;
		d.x += d.vx;
		d.y += d.vy;
	});
}
