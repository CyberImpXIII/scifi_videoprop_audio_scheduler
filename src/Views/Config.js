import loadBtnHandler from '../functions/loadBtnHandler'
import saveBtnHandler from '../functions/saveBtnHandler'
import configDirSet from '../functions/configDirSet'
import { useRef, useState, createRef, useEffect } from 'react'
import '../styles/config.css'


const Config = ({setView, setConfig, config, mediaArray})=>{

    const [elementsRef, setElementsRef] = useState(useRef(mediaArray.map(() => createRef())));
    const [elementsContext, setElementsContext] = useState([])
    const baseContext = new AudioContext()


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
    }, [elementsRef, mediaArray, elementsContext, baseContext]);

    const changeHandler  =()=>{
        console.log('test')
    }

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
    return(
    <>
        <button key='loadbutton' onClick={loadBtnHandler}>Load</button>
        <button key='savebutton' onClick={saveBtnHandler}>Save</button>
        <button key='dirpathbutton' onClick={configDirSet}>Configure Directory Path</button>
        <button key='defaultbutton'>Restore Default</button>
        <button key='backbutton' onClick={()=>{setConfig(!config)}}>Back</button>
        <div>
            {mediaArray.map((element, index, array)=>{
                let buttonTitle = element.split('/')[element.split('/').length - 1]
                return(
                    <div key={`${index}audioWrapper`} className='audioRow'>
                            <button className="rowOne audioRow" onClick={(e)=>{playhandler(e, index)}}>
                                {buttonTitle.split(".mp3")[0]}
                            </button>
                            <div className='dropdown functionalityCategory'>
                            <select onChange={changeHandler} name="functionSelect" className="functionSelect">
                                <option value="none" selected>nothing happens</option>
                                <option value="once">Play once on play button start</option>
                                <option value="timer">Play on timer</option>
                                <option value="delayOnce">Play on ms delay on play button start</option>
                                <option value="delayTimer">Play on timer after delay</option>
                                <option value="sliderDecrease">Play on slider value decrease</option>
                                <option value="sliderIncrease">Play on slider value increase</option>
                                <option value="sliderDecreaseDelay">Play on slider value decrease after delay</option>
                                <option value="sliderIncreaseDelay">Play on slider value increase after delay</option>
                                <option value="sliderDecreaseTimer">Play on slider value decrease on timer</option>
                                <option value="sliderIncreaseTimer">Play on slider value increase on timer</option>
                            </select>
                            </div>
                            <audio style={{display:'none'}}ref={elementsRef.current[index]} id={`audioPlayer${index}`} key={`${index}audioElement`} src={element} controls />   
                    </div>
                    );
            })}
        </div>
    </>
    )
}

export default Config