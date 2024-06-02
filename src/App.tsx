import "./App.css";
import BasicMain from "./components/BasicMain";
import Main from "./components/Main";
import NewMain from "./components/NewMain";
import TestMain from "./components/TestMain";
import { CoreProvider } from "./stores/CoreProvider";

function App() {
  return (
    <div className="App">
      <CoreProvider>
        {/* <Main /> */}
        <BasicMain />
        {/* <NewMain/> */}
        {/* <TestMain /> */}
      </CoreProvider>
    </div>
  );
}

export default App;
