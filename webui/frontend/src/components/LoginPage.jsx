import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const LoginPage = ({ onLogin, usageCount }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      })

      if (response.data.success) {
        // Store authentication token/session
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('auth_user', username)
        onLogin(response.data)
      }
    } catch (error) {
      console.error('Login failed:', error)
      setError(error.response?.data?.detail || 'การเข้าสู่ระบบล้มเหลว')
    } finally {
      setIsLoading(false)
    }
  }

  // Thailand outline SVG for background
  const ThailandMapSVG = () => (
    <div className="absolute right-0 top-0 w-full h-full opacity-10">
      <svg viewBox="0 0 400 600" className="w-full h-full">
        <path
          d="M200 50 C180 60, 160 80, 150 110 C140 140, 145 170, 160 200 C170 230, 185 260, 195 290 C200 320, 205 350, 210 380 C215 410, 220 440, 225 470 C230 500, 220 530, 200 550 C180 540, 160 520, 150 490 C140 460, 145 430, 155 400 C165 370, 175 340, 180 310 C175 280, 170 250, 160 220 C150 190, 155 160, 170 130 C180 100, 190 70, 200 50 Z"
          fill="none"
          stroke="rgba(59, 130, 246, 0.2)"
          strokeWidth="3"
        />

        {/* Location pins */}
        <g fill="#3b82f6" opacity="0.3">
          <circle cx="200" cy="120" r="6">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="180" cy="180" r="4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="220" cy="160" r="5">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="195" cy="250" r="6">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="210" cy="320" r="4">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.8s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xl font-bold text-gray-900">Places Ingestor</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <span className="text-gray-600 font-medium">Login to Places Ingestor</span>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
        {/* Background Map */}
        <ThailandMapSVG />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Info Section */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Login to Places Ingestor
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                เข้าสู่ระบบเพื่อเริ่มค้นหาธุรกิจทั่วประเทศไทย
              </p>

              {/* Usage Statistics */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลการใช้งาน</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{usageCount || 0}</div>
                    <div className="text-sm text-gray-500">Total Searches</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">77</div>
                    <div className="text-sm text-gray-500">Provinces</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">15+</div>
                    <div className="text-sm text-gray-500">Categories</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 text-left">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Google Places API v1 Integration</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Real-time Business Discovery</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">CSV Export & Analytics</span>
                </div>
              </div>
            </div>

            {/* Right Content - Login Form */}
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Small background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="20" r="3" fill="white">
                      <animate attributeName="opacity" values="0.1;0.5;0.1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="70" cy="30" r="2" fill="white">
                      <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="60" cy="50" r="4" fill="white">
                      <animate attributeName="opacity" values="0.1;0.7;0.1" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบ</h2>
                    <p className="text-blue-100">Access your business intelligence platform</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        ชื่อผู้ใช้ / Username
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-white bg-opacity-90 border border-white border-opacity-30 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent backdrop-blur-sm transition-all"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        รหัสผ่าน / Password
                      </label>
                      <input
                        type="password"
                        required
                        className="w-full px-4 py-3 bg-white bg-opacity-90 border border-white border-opacity-30 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent backdrop-blur-sm transition-all"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    {error && (
                      <div className="bg-red-500 bg-opacity-20 border border-red-300 text-red-100 px-4 py-3 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {error}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        isLoading
                          ? 'bg-gray-500 cursor-not-allowed text-white'
                          : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-blue-700 focus:ring-4 focus:ring-blue-300 transform hover:scale-105 backdrop-blur-sm border border-white border-opacity-30'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          กำลังเข้าสู่ระบบ...
                        </div>
                      ) : (
                        <>
                          <span>เข้าสู่ระบบ</span>
                          <svg className="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </>
                      )}
                    </button>

                  </form>
                </div>
              </div>

              {/* Bottom Note */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Powered by <span className="font-semibold text-blue-600">Google Places API v1</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Secure authentication & encrypted data transmission
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage