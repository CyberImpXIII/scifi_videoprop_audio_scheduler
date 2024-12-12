import { useState, useEffect, useRef, createRef } from "react"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const MainPage = ({setConfig, config, rulesArray, mediaArray, baseContext, pollingSpeed, pollingSpeedSource})=>{
    const [sliderVal, setSliderVal] = useState(50);
    const [elementsContext, setElementsContext] = useState([]);
    const [elementsRef, setElementsRef] = useState(useRef(mediaArray.map(() => createRef())));
    const [amount, setAmount] = useState(0);
    const [positionArray, setPositionArray] = useState([[0,0]])
    const [stopArray, setStopArray] = useState([])

    const pollingHandler = ()=>{
        setPositionArray((prevPositionArray)=>[...prevPositionArray, [prevPositionArray.length, prevPositionArray.length]])
        setAmount((prevAmount)=> prevAmount + 1)
    }

    const speedHandler = ()=>{
        if(pollingSpeedSource === 'numerical'){
            return pollingSpeed
        } else if(pollingSpeedSource === 'slider'){
            return sliderVal
        }
    }

    useEffect(()=>{
        const myInterval = setInterval(pollingHandler, speedHandler());
        return ()=>clearInterval(myInterval);
    },[pollingSpeedSource, sliderVal])

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
                    setInterval(()=>{
                        playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                    }, element.valueOne)
                    break;
                case 'delayOnce':
                    setTimeout(()=>{
                        playhandler('', mediaArray.findIndex((string)=>{return (string === element.file)}));
                    }, element.valueOne)
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
            <button key='configmenubutton' onClick={()=>{setConfig(!config)}}>Configuration </button>
            <div style={{paddingTop:'35px', width:'50vw', position:'absolute', left:'25vw'}}>
                <Slider defaultValue={50} onChange={(value)=>{setSliderVal(value)}} />
            </div>

            <div style={{paddingTop:'65px', position:'absolute', width:'100%'}}>
                <svg style={{fill:'black', stroke:'black'}}>
                    {positionArray.map((element, position, fullArray)=>{
                        return(position === 0 ? 
                        <path style={{fill:'black', stroke:'black'}} d='M0 0'/> :
                        <path style={{fill:'black', stroke:'black'}} d={`M${fullArray[position-1][0]} ${fullArray[position-1][1]} L${element[0]} ${element[1]}`}/>)
                    })}
                </svg>
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