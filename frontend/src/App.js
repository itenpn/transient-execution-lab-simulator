import { HashRouter, Routes, Route } from "react-router-dom";

import SelectPrograms from "./components/pages/SelectPrograms";
import Simulation from "./components/pages/Simulation";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<SelectPrograms />} />
          <Route path="simulate" element={<Simulation />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
