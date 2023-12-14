import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from './pages/main/index.jsx'
import Process from './pages/process/index.jsx'
import Statistics from './pages/statistics/index.jsx'
import { InventoryProvider } from './contexts/InventoryContext.jsx'

function App() {
  return (
    <InventoryProvider>
      <Router>
          <Routes>
            <Route path='/' element={<Navigate to='/main' />} />
            <Route path='/main' element={<Main />} />
            <Route path='/process' element={<Process />} />
            <Route path='/statistics' element={<Statistics />} />
          </Routes>
        </Router>
      </InventoryProvider>
  )
}

export default App
