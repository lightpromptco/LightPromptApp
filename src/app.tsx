import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import SoulMap from './pages/SoulMap'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/soul-map-explorer" element={<SoulMap />} />
      {/* add more routes as you enable them */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
