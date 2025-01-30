import { createContext, useContext, useState } from 'react'

import az from '@/locales/az.json'
import en from '@/locales/en.json'
import tr from '@/locales/tr.json'

const translations = {
  en,
  tr,
  az
}

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  const t = (key) => {
    return translations[language][key] || key
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
