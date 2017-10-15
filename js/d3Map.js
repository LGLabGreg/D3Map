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
        this.projection = d3.geoAlbersUsa();
        this.path = d3.geoPath()
            .projection(this.projection);


        this.baseColor = '#eee';
        this.overColor = '#f99';
        this.selectedColor = '#00f';
        this.strokeColor = '#000';
        this.strokeWidth = 0.5;

        this.transition = d3.transition()
          .on("interrupt", function(d,i){
            console.info(i);
          });
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
        d3.json("json/us.json", (error, topojsonData) => {
            var us = topojson.feature(topojsonData, topojsonData.objects.states);
            this.svg.selectAll(".region")
              .data(us.features)
              .enter()
              .append("path")
              .attr("d", this.path)
              .attr("class","region")
              .style("fill", this.baseColor)
              .style("stroke", this.strokeColor)
              .style("stroke-width", this.strokeWidth)
              .on("mouseover", function(d,i) {
                d3.select(this)
                  .transition(context.transition)
                  .style("fill", context.overColor);
                })
              .on("mouseout", function(d,i) {
                d3.select(this).interrupt();
                d3.select(this)
                  .transition(context.transition)
                  .style("fill", context.baseColor);
                });
        });
    }

}