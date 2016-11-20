class Org {
	constructor(_width, _height) {
		this.width = _width;
		this.height = _height;
	}
}

var orgs = d3.range(100).map(function() {
	return new Org(Math.random() * screen.width, Math.random() * screen.height);
});

var canvas = d3.select('body')
		.append('svg')
		.attr('width', screen.width)
		.attr('height', screen.height);

var circles = canvas.selectAll("circle")
		.data(orgs)
		.enter().append('circle')
		.attr('cx', d => d.width )
		.attr('cy', d => d.height )
		.attr('r', 5)
		.attr('fill', 'rgb(255, 0, 213)');

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

circles.transition().attr('cx', 0);
