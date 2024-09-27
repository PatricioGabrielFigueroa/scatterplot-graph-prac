import './App.css';
import * as d3 from 'd3';
import { useRef, useEffect, useState } from 'react';

function Scatterplotb() {

  const svgdivRef = useRef(null);
  const [ datas, setDatas ] = useState();
  const [ fetched, setFetched ] = useState(false);

  let svg;
  let xScale;
  let yScale;

 
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => {
      setDatas(data);
      setFetched(true);
    })
    .catch(error => {
      console.log(`Something went wrong! Description of the error: ${error}.`)
    });



    if (datas) {

      const h = 500;
      const w = 900;
      const padd = 50;
      

      // console.log(datas[0].Time);


      // const parsedTime = d3.timeParse('%H:%M');
      // datas.map(d => { d.Time = parsedTime(d.Time).getTime() });

      // console.log(datas[0].Time)
      // console.log(datas[1].Time)

      // console.log(datas[0].Time)
      // console.log(datas[0].Year)

      xScale = d3.scaleLinear()
      .domain([d3.min(datas, d => d.Year), d3.max(datas, d => d.Year)])
      .range([padd, w - padd])
      
      const parsedDatas = datas.map(d => {
        const parsedTime = d3.timeParse('%H:%M');
        return { ...d, Time: parsedTime(d.Time).getTime() };
      });
      
      var formatTimeS = d3.timeFormat('%M:%S'); // Was definitely useful for the axis (y)

      const formatData = datas.map(d => {
        var formatTime = d3.timeParse('%M:%S');
        return {...d, Time: formatTime(d.Time).getTime() };
      });

      const yyScale = d3.scaleTime()
      .domain([d3.min(formatData, d => d.Time), d3.max(formatData, d => d.Time)])
      .range([padd, h - padd])

      const yyAxis = d3.axisLeft(yyScale).tickFormat(formatTimeS);


      yScale = d3.scaleLinear()
        .domain([d3.min(parsedDatas, d => d.Time), d3.max(parsedDatas, d => d.Time)])
        .range([padd, h - padd])

      // console.log(d3.min(datas, d => d.Time))
      // console.log(d3.max(datas, d => d.Time))
      // console.log(yScale);
      
      // console.log(datas);

      svg = d3.select(svgdivRef.current).append('svg')
      .attr('height', h)
      .attr('width', w)
      .style('border', '2px solid red')

      svg.selectAll('circle')
      .data(datas)
      .enter()
      .append('circle')
      .attr('fill', 'red')
      .attr('r', 5)
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => {
        const parsedTime = d3.timeParse('%H:%M');
        var parsedTimeValue = parsedTime(d.Time).getTime();
        return yScale(parsedTimeValue);
      })
      .append('title')
      .text((d) => {
        return `Name: ${d.Name}
Nationality: ${d.Nationality}
Year: ${d.Year}, Time: ${d.Time}
Doping: ${d.Doping}.`
      })

      const xAxis = d3.axisBottom(xScale);
      // const yAxis = d3.axisLeft(yScale);

      // X-AXIS
      svg.append('g')
      .attr('transform', 'translate(0, ' + (h - padd) + ')')
      .call(xAxis)
      // X-AXIS

      // Y-AXIS
      svg.append('g')
      .attr('transform', 'translate(35, 0)')
      .call(yyAxis)
      // Y-AXIS

    }

    return () => { // Cleanup 
      d3.select(svgdivRef.current).select('svg').remove()
    }
  },[svgdivRef, fetched])

  return (
    <div className="App">
      <h1>Doping in Professional Bicycle Racing (Scatterplot Graph)</h1>
      <div ref={svgdivRef} id='svgId'></div>
    </div>
  );
}

export default Scatterplotb;
