'use client'

import { useState } from 'react'
import { Heart, Star, Coffee, Code, Server, Zap } from 'lucide-react'

// Example React component - Counter
function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">React Counter</h2>
      <p className="text-4xl font-bold mb-4 text-indigo-600">{count}</p>
      <div className="flex gap-3">
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-md"
        >
          +1
        </button>
        <button 
          onClick={() => setCount(count - 1)}
          className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transform hover:scale-105 transition-all duration-200 shadow-md"
        >
          -1
        </button>
        <button 
          onClick={() => setCount(0)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-md"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

// Another React component - Icon Buttons
function IconButtons() {
  const [liked, setLiked] = useState(false)
  const [starred, setStarred] = useState(false)
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Interactive Icons</h2>
      <div className="flex gap-6">
        <button 
          onClick={() => setLiked(!liked)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Heart className={`w-6 h-6 transition-all duration-300 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          <span className={`font-semibold ${liked ? 'text-red-500' : 'text-gray-700'}`}>
            {liked ? 'Liked!' : 'Like'}
          </span>
        </button>
        <button 
          onClick={() => setStarred(!starred)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Star className={`w-6 h-6 transition-all duration-300 ${starred ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'}`} />
          <span className={`font-semibold ${starred ? 'text-yellow-500' : 'text-gray-700'}`}>
            {starred ? 'Starred!' : 'Star'}
          </span>
        </button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md">
          <Coffee className="w-6 h-6 text-amber-600" />
          <span className="font-semibold text-amber-700">Coffee Time</span>
        </div>
      </div>
    </div>
  )
}

// Main page component
export default function Home() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showComponents, setShowComponents] = useState(true)

  const fetchMessage = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/hello/')
      const data = await response.json()
      setMessage(data.message)
    } catch (error) {
      setMessage('Error connecting to backend')
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white p-10 rounded-2xl shadow-xl mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex gap-2">
              <Code className="w-8 h-8 text-blue-600" />
              <Zap className="w-8 h-8 text-yellow-500" />
              <Server className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Next.js + Django Demo
            </h1>
          </div>
          
          <p className="text-gray-600 mb-8 text-lg">
            A modern fullstack application showcasing React components with a Django backend
          </p>
          
          <div className="flex gap-4 mb-8">
            <button
              onClick={fetchMessage}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
            >
              <Server className="w-5 h-5" />
              {loading ? 'Loading...' : 'Fetch from Django'}
            </button>
            
            <button
              onClick={() => setShowComponents(!showComponents)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {showComponents ? 'Hide' : 'Show'} Components
            </button>
          </div>
          
          {message && (
            <div className={`mt-6 p-6 rounded-xl transition-all duration-500 ${
              message.includes('Error') 
                ? 'bg-red-50 border-2 border-red-200' 
                : 'bg-green-50 border-2 border-green-200'
            }`}>
              <p className={`text-lg font-medium ${
                message.includes('Error') ? 'text-red-800' : 'text-green-800'
              }`}>
                {message}
              </p>
            </div>
          )}
        </div>
        
        {showComponents && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <Counter />
            <IconButtons />
          </div>
        )}
      </div>
    </div>
  )
}