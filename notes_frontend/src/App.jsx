import { useState } from 'react'
import './App.css'

import Login from './Login/Login.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {
  

  return (
    <>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/notes' element={<Notes/>}/>
      
    </Routes>
    </>
  )
}

export default App
