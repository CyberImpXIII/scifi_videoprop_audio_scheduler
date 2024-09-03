import loadBtnHandler from '../functions/loadBtnHandler'
import saveBtnHandler from '../functions/saveBtnHandler'
import configDirSet from '../functions/configDirSet'
import { useRef, createRef, useEffect, useCallback } from 'react'
const Config = ({setView, setConfig, config, mediaArray = []})=>{

    const elementsRef = useRef(mediaArray.map(() => createRef()));
    const elementsContext = []
    useCallback(()=>{
        elementsContext = []
        mediaArray.map((element, index, array)=>{
                elementsContext.push(new AudioContext());
                elementsContext[index].createMediaElementSource(elementsRef.current[index])
        })
    },[...elementsRef.current, mediaArray])
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
                            <button>{buttonTitle.split(".mp3")[0]}</button>
                            <audio ref={elementsRef.current[index]} id={`audioPlayer${index}`} key={`${index}audioElement`} src={element} controls />    
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