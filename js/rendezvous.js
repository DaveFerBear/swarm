function test() {

    class Org {
        constructor(_height, _width) {
            this.height = _height;
            this.width = _width;
        }
    }

    var canvas = d3.select('body')
            .append('svg')
            .attr('width', screen.width)
            .attr('height', screen.height);

    for (var x = 0; x < 100; x++) {
        var circle = new Org(Math.random()*screen.width, Math.random()*screen.height);

        canvas.append('circle')
            .attr('cx', circle.width)
            .attr('cy', circle.height)
            .attr('r', 5)
            .attr('fill', 'pink');
    }
}