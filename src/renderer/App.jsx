import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { UserProvider } from './context/user'
import Layout from './layout'

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<h2>404 - Not Found</h2>} />
          </Routes>
        </Layout>
      </UserProvider>
    </Router>
  )
}

export default App
