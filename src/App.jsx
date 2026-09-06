import React from 'react'
import Galaxy from './components/Galaxy'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>DevOps Galaxy</h1>
        <p>Interactive DevOps Pipeline Visualization</p>
      </header>

      <main className="main">
        <Galaxy />
      </main>

      <footer className="footer">
        <p>Powered by GalaxyJS</p>
      </footer>
    </div>
  )
}
