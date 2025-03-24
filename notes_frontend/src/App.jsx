import { useState } from 'react'
import './App.css'


import { Routes, Route } from 'react-router-dom';
import Login from './Auth/Login.jsx';
import Notes from './Pages/Notes.jsx';
import PrivateRoute from './Auth/PrivateRoute.jsx';

function App() {
  

  return (
    <>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/notes' element={<PrivateRoute element={<Notes/>}/> }/>
      
    </Routes>
    </>
  )
}

export default App
