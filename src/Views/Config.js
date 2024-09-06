import loadBtnHandler from '../functions/loadBtnHandler'
import saveBtnHandler from '../functions/saveBtnHandler'
import configDirSet from '../functions/configDirSet'
import { useRef, useState, createRef, useEffect, useCallback } from 'react'
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
                        playing:false
                    });
                    tempElementsContext[index].track.connect(baseContext.destination);
            })
            setElementsContext([...tempElementsContext]);
        }
    }, [elementsRef, mediaArray, elementsContext]);

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
                    <div key={`${index}audioWrapper`}>
                        <div >
                            <button onClick={(e)=>{playhandler(e, index)}}>
                                {buttonTitle.split(".mp3")[0]}
                            </button>
                            <audio style={{display:'none'}}ref={elementsRef.current[index]} id={`audioPlayer${index}`} key={`${index}audioElement`} src={element} controls />    
                        </div>
                        {(element.split('/')[element.split('/').length - 1]).split('.mp3')[0]}
                    </div>
                    );
            })}
        </div>
    </>
    )
}

export default Config