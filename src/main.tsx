import React from 'react'
import ReactDOM from 'react-dom/client'
import { LocalizeProvider, initLocalize } from '@101-lu/compo-shared-localize'
import App from './App.tsx'
import './index.css'

initLocalize({
  defaultLanguage: 'en',
  languages: ['en'],
  debug: false,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocalizeProvider>
      <App />
    </LocalizeProvider>
  </React.StrictMode>,
)
