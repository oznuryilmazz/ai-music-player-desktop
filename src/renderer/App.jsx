import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { UserProvider } from './context/user'
import Layout from './layout'
import ComingSoonPage from './pages/Soon'

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <Layout>
                <ComingSoonPage />
              </Layout>
            }
          />
        </Routes>
      </UserProvider>
    </Router>
  )
}

export default App
