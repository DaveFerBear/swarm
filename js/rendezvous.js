function test() {

    class Org {
        constructor(_width, _height) {
            this.width = _width;
            this.height = _height;
        }
    }
    var orgs = [];
    var canvas = d3.select('body')
            .append('svg')
            .attr('width', screen.width)
            .attr('height', screen.height);

    for (var x = 0; x < 100; x++) {
        var circle = new Org(Math.random()*screen.width, Math.random()*screen.height);
        orgs.push(circle);
        canvas.append('circle')
            .attr('id', Org.name + x)
            .attr('cx', circle.width)
            .attr('cy', circle.height)
            .attr('r', 5)
            .attr('fill', 'pink');
        console.log(Org.name + x);
    }

    for (var b = 0; b < orgs.length; b++) {
        d3.select('#' + Org.name + b).transition().attr('cx', 0).duration(1000);
    }
}