import * as d3 from 'd3';
import * as geo from 'd3-geo';

export default class d3Map {
    constructor(id) {
        this.width = 960;
        this.height = 480;
        this.scale = 80000;
        this.svg = d3.select(id)
            .append('svg')
            .attr("width", this.width)
            .attr("height", this.height);
        this.mapContainer = this.svg.append("g");
        this.projection = geo.geoMercator()
            .center([114.1095, 22.3964])
            .translate([this.width/2, this.height/2])
            .scale([this.scale]);
        this.path = geo.geoPath()
            .projection(this.projection);


        this.baseColor = '#eee';
        this.overColor = '#f99';
        this.selectedColor = '#00f';
    }
    
    mouseover(d) {
        d3.select(this).style('fill', this.overColor);
    }

    mouseout(d) {
        d3.select(this).style('fill', this.baseColor);
    }

    clicked(item) {
        this.mapContainer.selectAll('path')
            .style('fill', function(d){ return d === item ? this.selectedColor : this.baseColor});
    }

    drawMap() {
        d3.json("json/world-highres.geo.json", (error, json) => {
            this.mapContainer
                .append("g")
                .selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", this.path)
                .attr("fill", (d, i) => '#eee')
                .attr("stroke", "#FFF")
                .attr("stroke-width", 0.5)
                /*
                .attr("stroke", "blue")
                .attr("stroke-width", 2)
                .on('mouseover', this.mouseover)
                .on('mouseout', this.mouseout)
                .on('click', this.clicked);
                */
        });
    }

}