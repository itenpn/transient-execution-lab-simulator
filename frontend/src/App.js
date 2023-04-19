import { BrowserRouter, Routes, Route } from "react-router-dom";

import SelectPrograms from "./components/pages/SelectPrograms";
import Simulation from "./components/pages/Simulation";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SelectPrograms />} />
          <Route path="simulate" element={<Simulation />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
