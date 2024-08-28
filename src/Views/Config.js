import loadBtnHandler from '../functions/loadBtnHandler'
import saveBtnHandler from '../functions/saveBtnHandler'
import configDirSet from '../functions/configDirSet'

const Config = ({setView, setConfig, config})=>{

    return(
    <>
        <button key='loadbutton' onClick={loadBtnHandler}>Load</button>
        <button key='savebutton' onClick={saveBtnHandler}>Save</button>
        <button key='dirpathbutton' onClick={configDirSet}>Configure Directory Path</button>
        <button key='defaultbutton'>Restore Default</button>
        <button key='backbutton' onClick={()=>{setConfig(!config)}}>Back</button>
    </>
    )
}

export default Config