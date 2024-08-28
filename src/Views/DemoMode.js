import { useState } from "react"
import quitBtnHandler from "../functions/quitBtnHandler"
import Slider from "../components/Slider"
import SampleGraph from "../components/SampleGraph"
import clipEndHandler from "../functions/clipEndHandler"
import sliderHandle from "../functions/sliderHandle"

const DemoMode = ({setConfig, config, buttonState, audioVisibilityHandler, mediaArray})=>{
    const [clipMode, setClipMode] = useState('Sequential')
    const [sliderVal, setSliderVal] = useState(50)
    return(
        <>
            <button key='startbutton'>Start  </button>
            <button key='stopbutton' onClick={quitBtnHandler}>Stop </button>
            <button key='pausebutton'>Pause </button>
            <button key='configmenubutton' onClick={()=>{setConfig(!config)}}>Configuration </button>
            {mediaArray.map((element, index, array)=>{
            let buttonTitle = element.split('/')[element.split('/').length - 1]
            return(
            <div key={`${index}audioWrapper`}>
                <button onClick={()=>{audioVisibilityHandler(index)}}>{buttonTitle.split(".mp3")[0]}</button>
                <audio id={`audioPlayer${index}`} onEnded={()=>{clipEndHandler(index, audioVisibilityHandler)}} style={buttonState[index]?{display:'block'}:{display:'none'}} key={`${index}audioElement`} src= {element} controls />    
            </div>
            )})}
            <Slider sliderVal={sliderVal} sliderHandle={(e)=>{sliderHandle(e, setSliderVal)}}/>
            <SampleGraph slider={sliderVal}/>  
        </>
    )
}

export default DemoMode