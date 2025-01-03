import { useState, useEffect, useRef, createRef } from "react"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/mainPage.css'
import Chart from "react-apexcharts";
import options from '../shared/options'

const MainPage = ({Xincrease, setXincrease, XincreaseSource, setXincreaseSource, Yincrease, setYincrease, YincreaseSource, setYincreaseSource, setConfig, config, rulesArray, mediaArray, baseContext, pollingSpeed, pollingSpeedSource, buttonTextOne, buttonTextTwo})=>{
    const [sliderVal, setSliderVal] = useState(50);
    const [elementsContext, setElementsContext] = useState([]);
    const [elementsRef, setElementsRef] = useState(useRef(mediaArray.map(() => createRef())));
    const [positionArray, setPositionArray] = useState([[0,0]])
    const [stopArray, setStopArray] = useState([])
    const [lineGraphWidth, setLineGraphWidth] = useState(0)
    const [lineGraphHeight, setLineGraphHeight] = useState(0)
    const [radialGraphWidth, setRadialGraphWidth] = useState(0)
    const [radialGraphHeight, setRadialGraphHeight] = useState(0)
    const [lineGraphPercent, setLineGraphPercent] = useState(0)
    const [over95, setOver95] = useState(false)
    const [over90, setOver90] = useState(false)
    const [over70, setOver70] = useState(false)
    const [over50, setOver50] = useState(false)

    useEffect(()=>{
        setLineGraphPercent(Math.round((positionArray[positionArray.length - 1][1] / lineGraphHeight) * 100))
    },[positionArray])

    const speedHandler = ()=>{
        if(pollingSpeedSource === 'numerical'){
            return pollingSpeed
        } else if(pollingSpeedSource === 'slider'){
            return sliderVal
        }
    }

   

    useEffect(()=>{
        if(!over50){
            const myInterval = setInterval(()=>{
                setPositionArray((prevPositionArray)=>[...prevPositionArray, [prevPositionArray.length, prevPositionArray.length]])
            }, speedHandler());
            return ()=>clearInterval(myInterval);
        }else if(over50 && !over70){
            const myInterval = setInterval(()=>{

            }, speedHandler());
            return ()=>clearInterval(myInterval);
        }else if (over70 && !over90){
            const myInterval = setInterval(()=>{

            }, speedHandler());
            return ()=>clearInterval(myInterval);
        }else if (over90 && !over95){
            console.log('over90')
            const myInterval = setInterval(()=>{
                setPositionArray((prevPositionArray)=>[...prevPositionArray, [prevPositionArray[prevPositionArray.length - 1][0], prevPositionArray[prevPositionArray.length - 1][1]]]) 
            }, speedHandler());
            return ()=>clearInterval(myInterval);
        }else if (over95){
            const myInterval = setInterval(()=>{
                
            }, speedHandler());
            return ()=>clearInterval(myInterval);
        }
    },[pollingSpeedSource, sliderVal, over90, over50, over70, over95])

    useEffect(()=>{
        if(lineGraphPercent > 50){
            setOver50(true)
        }
        if(lineGraphPercent > 70){
            setOver70(true)
        }
        if(lineGraphPercent > 90){
            setOver90(true)
        }
        if(lineGraphPercent > 95){
            setOver95(true)
        }
    },[lineGraphPercent])
    
    useEffect(() => {
        if (Array.isArray(elementsRef.current) && elementsRef.current[0] && elementsRef.current[0].current !== null && elementsContext.length === 0) {
            let tempElementsContext = []
            mediaArray.map((element, index, array)=>{
                    tempElementsContext.push({
                        track: baseContext.createMediaElementSource(elementsRef.current[index].current),
                        playing:false,
                        function:'none'
                    });
                    tempElementsContext[index].track.connect(baseContext.destination);
            })
            setElementsContext([...tempElementsContext]);
        }
        return ()=>{}
    }, [elementsRef, mediaArray, elementsContext, baseContext, config]);


    const playhandler = (e, index)=>{
        // Check if context is in suspended state (autoplay policy)
        if (baseContext.state === "suspended") {
            baseContext.resume();
        }
        let tempElementsContext = elementsContext.slice()
        // Play or pause track depending on state
        if (elementsContext[index].playing === false) {
            elementsRef.current[index].current.play();
            tempElementsContext[index].playing = !tempElementsContext[index].playing
            setElementsContext(tempElementsContext)
        } else if (elementsContext[index].playing === true) {
            elementsRef.current[index].current.pause();
            tempElementsContext[index].playing = !tempElementsContext[index].playing
            setElementsContext(tempElementsContext)
        }
    }

    const stopHandler = (stop)=>{
        stop.forEach((stopID)=>{
            clearInterval(stopID);
        })
    }

    const playButtonHandler = ()=>{
        rulesArray.forEach(element => {
            switch(element.function){
                case 'once':
                    playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                    break;
                case 'timer':
                    setStopArray([...stopArray, setInterval(()=>{
                        playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                    }, element.valueOne)]);
                    break;
                case 'delayOnce':
                    setStopArray([...stopArray, setTimeout(()=>{
                        playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                    }, element.valueOne)])
                    break;
                case 'delayTimer':
                    setTimeout(()=>{
                        playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                        setStopArray([...stopArray, setInterval(()=>{
                            playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                        }, element.valueTwo)]);
                    }, element.valueOne)
                    break;
                case 'sliderDecrease':
                    //add onSlide functionality
                        playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));    
                    break;
                case 'sliderIncrease':
                    //add onSlide functionality
                        playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                    break;
                case 'sliderDecreaseDelay':
                    setStopArray([...stopArray, setTimeout(()=>{
                        playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                    }, element.valueOne)]);
                    break;
                case 'sliderIncreaseDelay':
                    setStopArray([...stopArray, setTimeout(()=>{
                        playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                    }, element.valueOne)]);
                    break;
                case 'sliderDecreaseTimer':
                    setStopArray([...stopArray, setTimeout(()=>{
                        playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                    }, element.valueOne)]);
                    break;
                case 'sliderIncreaseTimer':
                    setStopArray([...stopArray, setTimeout(()=>{
                        playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                    }, element.valueOne)]);
                    break;
                default:
                    console.log('This function has not be made yet');
            }
        });
    }


    return(
        <>
            <button onClick={playButtonHandler} key='startbutton'>Start  </button>
            <button key='stopbutton' onClick={()=>{stopHandler(stopArray)}}>Stop </button>
            <button key='pausebutton'>Pause </button>
            <button key='configmenubutton' onClick={()=>{stopHandler(stopArray); setConfig(!config);}}>Configuration </button>
            <div id="UIParent">
                <div key={'sliderparent'} className='sliderContainer'>
                    <Slider id='sliderOne' vertical={true} defaultValue={50} onChange={(value)=>{setSliderVal(value)}} />
                    <Slider id='sliderTwo' vertical={true} defaultValue={50} onChange={(value)=>{setSliderVal(value)}} />
                    <Slider id='sliderThree' vertical={true} defaultValue={50} onChange={(value)=>{setSliderVal(value)}} />
                </div>

                <div key='svgparent' style={{display:'flex', flexDirection:'column', width:'30vw', border:'solid black 1px', marginTop:'35px'}}>
                    <div id='radialGraph' ref={(node)=>{setRadialGraphWidth(node?.offsetWidth); setRadialGraphHeight(node?.offsetHeight)}} style={{width:'100%', height:'50%', display:'flex', flexDirection:'column', justifyContent:'space-around'}}>
                        <Chart width={radialGraphWidth} height={radialGraphHeight} style={{marginTop:'-35px'}} options={options(lineGraphPercent)} series={[lineGraphPercent]} type="radialBar" />
                    </div>
                    <div id='lineGraph' ref={(node)=>{setLineGraphWidth(node?.offsetWidth); setLineGraphHeight(node?.offsetHeight)}}>
                        <svg style={{fill:'blue', stroke:'blue', position:'absolute', left:'0', width:'100%', height:'100%' }}>
                            {positionArray.map((element, position, fullArray)=>{
                                return(position === 0 ? 
                                <path key={`startpath`} style={{fill:'black', stroke:'black'}} d='M0 0'/> :
                                <path key={`${position}path`} style={{fill:'blue', stroke:'blue'}} d={`M${fullArray[position-1][0]} ${fullArray[position-1][1]} L${element[0]} ${element[1]}`}/>)
                            })}
                        </svg>
                    </div>

                </div>
                <div id='buttonParent' style={{display:'flex', flexDirection:'column', width:'30vw', marginTop:'35px', marginRight:'5vw', position:'relative'}}>
                    <div className='top' style={{width:'100%', height:'50%'}}></div>
                    <div className="bottom" style={{width:'100%', height:'50%'}}>
                        <div className='buttonContainer'>
                            {buttonTextOne}
                            <button className='button'></button>
                        </div>
                        <div className='buttonContainer' style={{position:'absolute', right:'0'}}>
                            {buttonTextTwo}
                            <button className='button'></button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style={{display:'none'}}>
                {mediaArray.map((element, index, array)=>{
                    let buttonTitle = element.split('/')[element.split('/').length - 1]
                    return(
                        <div key={`${index}audioWrapper`} className='audioRow'>
                                <button className="rowOne audioRow" onClick={(e)=>{playhandler(e, index)}}>
                                    {buttonTitle.split(".mp3")[0]}
                                </button>
                                {(()=>{
                                    if(true){
                                        return
                                    }
                                })()}
                                <audio style={{display:'none'}}ref={elementsRef.current[index]} id={`audioPlayer${index}`} key={`${index}audioElement`} src={element} controls />   
                        </div>
                        );
                })}
            </div>
        </>
    )
}

export default MainPage