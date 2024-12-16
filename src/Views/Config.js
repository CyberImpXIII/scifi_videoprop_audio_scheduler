import loadBtnHandler from '../functions/loadBtnHandler'
import saveBtnHandler from '../functions/saveBtnHandler'
import configDirSet from '../functions/configDirSet'
import '../styles/config.css'
import { useState } from 'react'


const Config = ({setConfig, config, mediaArray, rulesArray, setRulesArray, pollingSpeedSource, setPollingSpeedSource, pollingSpeed, setPollingSpeed})=>{
    const functionArray = [{value:'none', description: 'nothing happens'},
        {value:'once', description:'Play once on play button start'},
        {value:'timer', description:'Play on timer'},
        {value:'delayOnce', description:'Play on ms delay on play button start'},
        {value:'delayTimer', description:'Play on timer after delay'},
        {value:'sliderDecrease', description:'Play on slider value decrease'},
        {value:'sliderIncrease', description:'Play on slider value increase'},
        {value:'sliderDecreaseDelay', description:'Play on slider value decrease after delay'},
        {value:'sliderIncreaseDelay', description:'Play on slider value increase after delay'},
        {value:'sliderDecreaseTimer', description:'Play on slider value decrease on timer'},
        {value:'sliderIncreaseTimer', description:'Play on slider value increase on timer'},
        {value:'none', description:'----------------------'},
    ]

    const counterFunctionArray = [
        {value:'counterRate', description:'Set the amount per time that the counter increases by (how much per refresh)'},
        {value:'setMax', description:'Set the amount per time that the counter increases by (how much per refresh)'},
        {value:'setMin', description:'Set the amount per time that the counter increases by (how much per refresh)'},
        {value:'setMin', description:'Set the amount per time that the counter increases by (how much per refresh)'},
        {value:'none', description:'----------------------'}
    ]

    const addRule = ()=>{
        let temp = rulesArray.slice()
        temp.push({file:'none', function:'none'});
        setRulesArray([...temp])
    }

    const removeRule = (index)=>{
        let temp = rulesArray.slice()   
        temp.splice(index, 1)
        setRulesArray([...temp])
    }

    const changeFile = (index, mediaIndex)=>{
        let temp = rulesArray.slice()
        temp[index].file = mediaArray[mediaIndex]
        setRulesArray([...temp])    
    }

    const changeFunction = (index, functionIndex)=>{
        let temp = rulesArray.slice()
        temp[index].function = functionArray[functionIndex]['value']
        setRulesArray([...temp])   
    }

    const changeValueOne = (index, value)=>{
        let temp = rulesArray.slice()

        temp[index].valueOne = value
        setRulesArray([...temp])   
    }

    const changeValueTwo = (index, value)=>{
        let temp = rulesArray.slice()
        temp[index].valueTwo = value
        setRulesArray([...temp])   
    }



    return(
    <>
        <button key='loadbutton' onClick={loadBtnHandler}>Load</button>
        <button key='savebutton' onClick={()=>{saveBtnHandler([['rulesArray',rulesArray]])}}>Save</button>
        <button key='dirpathbutton' onClick={configDirSet}>Configure Directory Path</button>
        <button key='defaultbutton'>Restore Default</button>
        <button key='backbutton' onClick={()=>{setConfig(!config)}}>Back</button>
        <div>
            <div >Here we can change settings for the counter</div>
            <div className='audioRow'> Polling Speed Source: 
                <select onChange={(e)=>{setPollingSpeedSource(e.target.value)}}>
                    <option value='numerical'> Numerical </option>
                    <option value='slider'> Slider</option>
                </select>  
                {pollingSpeedSource === 'numerical' && <input type='number' onChange={(e)=>{setPollingSpeed(e.target.value)}}></input>}
            </div>
            <div className='audioRow'> X increase per poll source: 
                <select onChange={(e)=>{setPollingSpeedSource(e.target.value)}}>
                    <option value='numerical'> Numerical </option>
                    <option value='slider'> Slider</option>
                </select> 
                {pollingSpeedSource === 'numerical' && <input type='number' onChange={(e)=>{setPollingSpeed(e.target.value)}}></input>}
            </div>
            <div className='audioRow'> Y increase per poll source: 
                <select onChange={(e)=>{setPollingSpeedSource(e.target.value)}}>
                    <option value='numerical'> Numerical </option>
                    <option value='slider'> Slider</option>
                </select> 
                {pollingSpeedSource === 'numerical' && <input type='number' onChange={(e)=>{setPollingSpeed(e.target.value)}}></input>}
            </div>
                {rulesArray.map((element, index, array)=>{
                    return (<div className='audioRow'>
                        <select onChange={(e)=>{changeFile(index, e.target.value)}}>
                            <option value={-1}>none</option>
                            {console.log(element)}
                            {mediaArray.map((mediaArrayFile, index, array)=>{
                                let selectedCheck = (()=>{
                                    let mediaArrayFileTemp = mediaArrayFile.split('/')[mediaArrayFile.split('/').length - 1].split('.mp3')[0]
                                    let rulesFileTemp = element.file.split('/')[mediaArrayFile.split('/').length - 1].split('.mp3')[0]
                                    return rulesFileTemp === mediaArrayFileTemp;
                                })()
                                return(
                                    <option selected={selectedCheck} value={index}>
                                        {mediaArrayFile.split('/')[mediaArrayFile.split('/').length - 1].split('.mp3')[0]}
                                    </option>)})}
                        </select>
                        <select onChange={(e)=>{changeFunction(index, e.target.value)}}>
                            {functionArray.map((functionArrayFunction, index, array)=>{
                                return(
                                    <option value={index}>
                                        {functionArrayFunction.description}
                                    </option>
                                )
                            })}
                        </select>
                        <>
                        { rulesArray[index].function !== 'once' &&
                            rulesArray[index].function !== 'sliderDecrease' &&
                            rulesArray[index].function !== 'sliderIncrease' &&
                        <>
                            <input onInput={(e)=>{changeValueOne(index, e.target.value)}}></input>
                            { !rulesArray[index].function === 'timer' &&
                                !rulesArray[index].function === 'delayOnce' &&
                                !rulesArray[index].function === 'delayTimer' &&
                                !rulesArray[index].function === 'sliderDecreaseTimer' &&
                                !rulesArray[index].function === 'sliderIncreaseTimer' &&
                                <input onInput={(e)=>{changeValueTwo(index, e.target.value)}}></input>
                            }
                        </>
                        }
                        </>
                        <button onClick={()=>{removeRule(index)}}>
                            -
                        </button>
                    </div>)
                })}
            <button className='addRule' onClick={addRule}>+</button>
        </div>
    </>
    )
}

export default Config