import React from 'react'
import CameraTable from './components/CameraTable';
import "./App.css"

const App = () => {
  return (
    <div className='container'>
      <h1>Welcome to the Camera Management App</h1>
      <CameraTable />
    </div>
  )
}

export default App