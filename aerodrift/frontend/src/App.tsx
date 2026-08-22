import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { FleetOverview } from './pages/FleetOverview';
import { Telemetry } from './pages/Telemetry';
import { DriftCenter } from './pages/DriftCenter';
import { ModelCenter } from './pages/ModelCenter';
import { EventAudit } from './pages/EventAudit';
import { MachineDetail } from './pages/MachineDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FleetOverview />} />
          <Route path="telemetry" element={<Telemetry />} />
          <Route path="drift" element={<DriftCenter />} />
          <Route path="models" element={<ModelCenter />} />
          <Route path="events" element={<EventAudit />} />
          <Route path="machine/:id" element={<MachineDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
