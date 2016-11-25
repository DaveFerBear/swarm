function test() {
	console.log('test');
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
			return Math.random() * screen.width;
			update();
		})
		.attr('cy', function(d, i) {
			return Math.random() * screen.height;
		})
		.attr('r', 5)
		.attr('fill', 'rgb(255, 0, 213)');

update();

function update() {
	circles
		.data(orgs)
		.enter().append('circle')
		.attr('cx', function(d, i) {
			return Math.random() * screen.width;
			update();
		})
		.attr('cy', function(d, i) {
			return Math.random() * screen.height;
		})
		.attr('r', 5)
		.attr('fill', 'rgb(255, 0, 213)');
}


