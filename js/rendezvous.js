function test() {
    var canvas = d3.select('body')
            .append('svg')
            .attr('width', screen.width)
            .attr('height', screen.height);

    for (var x = 0; x < 100; x++) {
        var circle = canvas.append('circle')
            .attr('cx', Math.random()*screen.width)
            .attr('cy', Math.random()*screen.height)
            .attr('r', 5)
            .attr('fill', 'pink');
    }
}