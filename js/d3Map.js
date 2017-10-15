import * as d3 from 'd3';
import * as topojson from 'topojson';

export default class d3Map {
    constructor(id) {
        this.width = 960;
        this.height = 500;
        this.scale = 80000;
        this.svg = d3.select(id)
            .append('svg')
            .attr("width", this.width)
            .attr("height", this.height);
        this.mapContainer = this.svg.append("g");
        this.projection = d3.geoEquirectangular()
          .center([0, 15]) // set centre to further North as we are cropping more off bottom of map
          .scale([this.width / (2 * Math.PI)]) // scale to fit group width
          .translate([this.width / 2, this.height / 2]) // ensure centred in group
        this.path = d3.geoPath()
            .projection(this.projection);


        this.baseColor = '#eee';
        this.overColor = '#f99';
        this.selectedColor = '#00f';
        this.strokeColor = '#000';
        this.strokeWidth = 0.5;
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
        const context = this;
        d3.json("json/custom.geo.json", (error, json) => {
            //var us = topojson.feature(topojsonData, topojsonData.objects.states);
            this.mapContainer.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", this.path)
              .attr("class","country")
              .style("fill", this.baseColor)
              .style("stroke", this.strokeColor)
              .style("stroke-width", this.strokeWidth)
              .on("mouseover", function(d,i) {
                d3.select(this)
                  .transition().duration(300)
                  .style("fill", context.overColor);
                })
              .on("mouseout", function(d,i) {
                d3.select(this)
                  .transition().duration(300)
                  .style("fill", context.baseColor);
                });
        });
    }

}