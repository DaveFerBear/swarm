

	class Org {
		constructor(_width, _height) {
			this.width = _width;
			this.height = _height;
		}
	}

	var orgs = d3.range(10).map(function() {
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
			.attr('fill', 'pink');

	circles.transition().attr('cx', 0);

	console.log('eg');
