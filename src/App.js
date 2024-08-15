import './App.css';
import { channels } from './shared/constants';
const { ipcRenderer } = require('electron');
function App() {
  const getData = () => {
    ipcRenderer.send(channels.GET_DATA, { product: 'notebook' });
  };
  return (
    <div className="App">
      <button>Start  </button>
      <button onClick={getData}>Stop </button>
      <button>Pause </button>
      <button>Configuration </button>
    </div>
  );
}

export default App;
