import React from 'react'
import About from './components/About'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import Contact from './components/Contactus'
import Navbar from './Navbar'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  
} from "react-router-dom";


const App = () => {
  return (
    <Router>
           <Navbar/>

      <div>

        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<About/>} />

        <Route path='/contact' element={<Contact/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />


        </Routes>
      </div>
    </Router>
  )
}

export default App
