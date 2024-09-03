import './App.css';
import { useState, useEffect } from 'react';
import Config from './Views/Config'
import DemoMode from './Views/DemoMode';

function App() {
  const [config, setConfig] = useState(false)
  const [mediaArray, setMediaArray] = useState([process.env.PUBLIC_URL+ 'test.mp3'])
  const [buttonState, setButtonState] = useState({})


  const audioVisibilityHandler =(prop)=>{
    let newButton = {...buttonState}
    newButton[prop] = !buttonState[prop]
    setButtonState(newButton);
  }

  useEffect(()=>{
    window.api.mediaArrayReceive((data)=>{
      // console.log(`recieved data: ${data}`)
      setMediaArray(data);
    })
    window.api.requestAudio();
  },[])

  useEffect(()=>{
    let tempButtonState = {}
      mediaArray.forEach((element, index) => {
        tempButtonState[index] = false
      });
    setButtonState(tempButtonState)
  },[mediaArray])

  // console.log(buttonState)
  return (
    
    <div className="App">
      {config ?
      <Config mediaArray={mediaArray} config={config} setConfig={setConfig}/>
      :
      <DemoMode mediaArray={mediaArray} setConfig={setConfig} config={config} buttonState={buttonState} audioVisibilityHandler={audioVisibilityHandler}/>
      }
    </div>
  );
}

export default App;
