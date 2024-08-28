import {useState, useEffect} from 'react'
import CanvasJSReact from '@canvasjs/react-charts';
//var CanvasJSReact = require('@canvasjs/react-charts');
 
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
const SampleGraph = (props)=>{
	console.log(props.slider)
	const [speed, setSpeed] = useState(1)
	const [timer, setTimer] = useState();
	const [graphData, setGraphData] = useState({
		animationEnabled: true,
		theme: "light2", // "light1", "dark1", "dark2"
		data: [{
			type: "line",
			toolTipContent: "Week {x}: {y}%",
			dataPoints: [
				{ x: 1, y: 64 },
				{ x: 2, y: 61 },
				{ x: 3, y: 64 },
				{ x: 4, y: 62 },
				{ x: 5, y: 64 },
				{ x: 6, y: 60 },
				{ x: 7, y: 58 },
				{ x: 8, y: 59 },
				{ x: 9, y: 53 },
				{ x: 10, y: 54 },
				{ x: 11, y: 61 },
				{ x: 12, y: 60 },
				{ x: 13, y: 55 },
				{ x: 14, y: 60 },
				{ x: 15, y: 56 },
				{ x: 16, y: 60 },
				{ x: 17, y: 59.5 },
				{ x: 18, y: 63 },
				{ x: 19, y: 58 },
				{ x: 20, y: 54 },
				{ x: 21, y: 59 },
				{ x: 22, y: 64 },
				{ x: 23, y: 59 }
			]
		}]
	})
	useEffect(()=>{
		clearInterval(timer)
		console.log(props.slider, "slider", 1000*(props.slider/50))
		let tempTimer = setInterval(()=>{
			let tempDatapoints = graphData && graphData.data[0].dataPoints.slice();
			tempDatapoints.push(tempDatapoints.shift());
			let tempData = graphData.data.slice()
			tempData[0].dataPoints = tempDatapoints
			setGraphData({
				animationEnabled:true,
				theme:"light2",
				data: tempData
			})
		}, (1000*(props.slider/50)))
		setTimer(tempTimer);
	},[props.slider])

		return (
		<div>
			<CanvasJSChart options = {graphData}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
export default SampleGraph;   