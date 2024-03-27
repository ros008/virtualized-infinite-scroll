import "./App.css";
import Main from "./components/Main";
import { CoreProvider } from "./stores/CoreProvider";

function App() {
  return (
    <div className="App">
      <CoreProvider>
        <Main />
      </CoreProvider>
    </div>
  );
}

export default App;
