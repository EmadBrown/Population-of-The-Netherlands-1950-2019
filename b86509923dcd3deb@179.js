// nl-population-1950-2019
import define1 from "./450051d7f1174df8@201.js";
import define2 from "./a33468b95d0b15b0@692.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["population.csv",new URL("./files/data",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# The Netherlands Population, 1950–2019

Blue represents surplus male population and red surplus female population. Data: [Open Data Statline CBS.nl](https://opendata.cbs.nl/portal.html?_la=en&_catalog=CBS&tableId=37296eng&_theme=1056)`
)});
  main.variable(observer("viewof year")).define("viewof year", ["Scrubber","d3","data","delay"], function(Scrubber,d3,data,delay){return(
Scrubber(d3.groups(data, d => d.year).map(([key]) => key).sort(d3.ascending), {delay, loop: false})
)});
  main.variable(observer("year")).define("year", ["Generators", "viewof year"], (G, _) => G.input(_));
  main.variable(observer()).define(["swatches","color"], function(swatches,color){return(
swatches({color, format: x => ({M: "Male", F: "Female"}[x])})
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","xAxis","yAxis","x","data","delay","color","y"], function(d3,width,height,xAxis,yAxis,x,data,delay,color,y)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  let group = svg.append("g");

  let rect = group.selectAll("rect");

  return Object.assign(svg.node(), {
    update(year) {
      const dx = x.step() * (year - d3.min(data, d => d.year)) / 5;

      const t = svg.transition()
          .duration(delay);

      rect = rect
        .data(data.filter(d => d.year === year), d => `${d.sex}:${d.year - d.age}`)
        .join(
          enter => enter.append("rect")
            .style("mix-blend-mode", "darken")
            .attr("fill", d => color(d.sex))
            .attr("x", d => x(d.age) + dx)
            .attr("y", d => y(0))
            .attr("width", x.bandwidth() - 1)
            .attr("height", 0),
          update => update,
          exit => exit.call(rect => rect.transition(t).remove()
            .attr("y", y(0))
            .attr("height", 0))
        );

      rect.transition(t)
          .attr("y", d => y(d.people))
          .attr("height", d => y(0) - y(d.people));

      group.transition(t)
          .attr("transform", `translate(${-dx},0)`);
    }
  });
}
);
  main.variable(observer()).define(["chart","year"], function(chart,year){return(
chart.update(year)
)});
  main.variable(observer("delay")).define("delay", function(){return(
750
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
Object.assign(d3.csvParse(await FileAttachment("population.csv").text(), d3.autoType), {x: null, y: "Population ↑"})
)});
  main.variable(observer("x")).define("x", ["d3","width","margin"], function(d3,width,margin){return(
d3.scaleBand()
    .domain(d3.range(0, 3))
    .rangeRound([width - margin.right, margin.left])
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(data, d => d.people)])
    .rangeRound([height - margin.bottom, margin.top])
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3.scaleOrdinal(["M", "F"], ["#4e79a7", "#e15759"])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width","data"], function(height,margin,d3,x,width,data){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.append("text")
        .attr("x", margin.right)
        .attr("y", margin.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(data.x))
)});
  main.variable(observer("yAxis")).define("yAxis", ["width","margin","d3","y","data"], function(width,margin,d3,y,data){return(
g => g
    .attr("transform", `translate(${width - margin.right},0)`)
    .call(d3.axisRight(y).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", margin.right)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(data.y))
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 30, bottom: 34, left: 0}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-array@2")
)});
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("swatches", child2);
  return main;
}
