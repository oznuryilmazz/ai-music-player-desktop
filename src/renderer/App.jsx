import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { UserProvider } from './context/user'
import Layout from './layout'
import ComingSoonPage from './pages/Soon'
import { TimelineProvider } from './context/timeline'
import { LanguageProvider } from '@/context/language'

const App = () => {
  return (
    <Router>
      <LanguageProvider>
        <UserProvider>
          <TimelineProvider>
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
          </TimelineProvider>
        </UserProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App
