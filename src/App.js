import './App.css';
import { useState } from 'react';

function App() {
  const [config, setConfig] = useState(false)

  const configDirSet = ()=>{
    window.api.configDirSet();
  }

  const quitBtnHandler = ()=>{
    window.api.quitApp();
  }

  const loadBtnHandler = ()=>{
    window.api.loadConfig()
  }
  const saveBtnHandler = ()=>{
    window.api.saveConfig()
  }

  return (
    <div className="App">
      {config ?
      <>
        <button onClick={loadBtnHandler}>Load</button>
        <button onClick={saveBtnHandler}>Save</button>
        <button onClick={configDirSet}>Configure Directory Path</button>
        <button>Restore Default</button>
        <button onClick={()=>{setConfig(!config)}}>Back</button>
      </>
      :
      <>
        <button>Start  </button>
        <button onClick={quitBtnHandler}>Stop </button>
        <button>Pause </button>
        <button onClick={()=>{setConfig(!config)}}>Configuration </button>
      </>
      }
    </div>
  );
}

export default App;
