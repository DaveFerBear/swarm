var dataset = [],
i = 0;

for(i=0; i<5; i++){

    dataset.push(Math.round(Math.random()*100));

    }

    var sampleSVG = d3.select("#viz")
        .append("svg")
        .attr("width", 400)
        .attr("height", 400);    

    sampleSVG.selectAll("circle")
        .data(dataset)
        .enter().append("circle")
        .style("stroke", "gray")
        .style("fill", "black")
        .attr("r", 40)
        .attr("cx", 50)
        .attr("cy", 20);
