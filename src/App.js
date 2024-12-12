import './App.css';
import { useState, useEffect } from 'react';
import Config from './Views/Config'
import MainPage from './Views/MainPage';

function App() {
  const [config, setConfig] = useState(false)
  const [mediaArray, setMediaArray] = useState([process.env.PUBLIC_URL+ 'test.mp3'])
  const [buttonState, setButtonState] = useState({})
  const [rulesArray, setRulesArray]= useState([])
  const [pollingSpeed, setPollingSpeed] = useState(1000)
  const [pollingSpeedSource, setPollingSpeedSource] = useState('numerical');
  const baseContext = new AudioContext()

  const audioVisibilityHandler =(prop)=>{
    let newButton = {...buttonState}
    newButton[prop] = !buttonState[prop]
    setButtonState(newButton);
  }

  useEffect(()=>{
    window.api ? (
      window.api.mediaArrayReceive((data)=>{
        setMediaArray(data);
      })
     ) : ( console.log('electron not loaded'))

     window.api ? 
      (window.api.requestAudio()) : 
      (console.log('electron not loaded'))
  },[])

  useEffect(()=>{
    let tempButtonState = {}
      mediaArray.forEach((element, index) => {
        tempButtonState[index] = false
      });
    setButtonState(tempButtonState)
  },[mediaArray])

  return (
    <div className="App" style={{position:'absolute', width:'100%'}}>
      {config ?
      <Config pollingSpeedSource={pollingSpeedSource} setPollingSpeedSource={setPollingSpeedSource} setPollingSpeed={setPollingSpeed} pollingSpeed={pollingSpeed} rulesArray={rulesArray} setRulesArray={setRulesArray} mediaArray={mediaArray} setMediaArray={setMediaArray} config={config} setConfig={setConfig}/>
      :
      <MainPage setPollingSpeed={setPollingSpeed} pollingSpeed={pollingSpeed} pollingSpeedSource={pollingSpeedSource} baseContext={baseContext} mediaArray={mediaArray} rulesArray={rulesArray} setConfig={setConfig} config={config} buttonState={buttonState}/>
      }
    </div>
  );
}

export default App;
