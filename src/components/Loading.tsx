'use client'
import React from 'react'
import './Loading.css'

const Loading: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>
    </div>
  )
}

export default Loading