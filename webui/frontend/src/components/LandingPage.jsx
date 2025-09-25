import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const LandingPage = ({ onLogin, usageCount }) => {
  const [stats, setStats] = useState({
    totalSearches: 0,
    availableProvinces: 77,
    businessTypes: 15
  })

  useEffect(() => {
    // Load statistics from backend if available
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`)
      setStats(prev => ({ ...prev, ...response.data }))
    } catch (error) {
      console.log('Stats not available:', error.message)
    }
  }

  // Thailand outline SVG path
  const ThailandMapSVG = () => (
    <div className="absolute right-0 top-0 w-full h-full opacity-20">
      <svg viewBox="0 0 400 600" className="w-full h-full">
        {/* Thailand outline path */}
        <path
          d="M200 50 C180 60, 160 80, 150 110 C140 140, 145 170, 160 200 C170 230, 185 260, 195 290 C200 320, 205 350, 210 380 C215 410, 220 440, 225 470 C230 500, 220 530, 200 550 C180 540, 160 520, 150 490 C140 460, 145 430, 155 400 C165 370, 175 340, 180 310 C175 280, 170 250, 160 220 C150 190, 155 160, 170 130 C180 100, 190 70, 200 50 Z"
          fill="none"
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth="2"
        />

        {/* Location pins */}
        <g fill="#3b82f6" opacity="0.6">
          <circle cx="200" cy="120" r="4">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="180" cy="180" r="3">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="220" cy="160" r="3">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="195" cy="250" r="4">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="210" cy="320" r="3">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="175" cy="280" r="3">
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.1s" repeatCount="indefinite" />
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
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">How it Works</a>
              <a href="#stats" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Statistics</a>
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                GENERATE BUSINESS GROWTH FROM
                <span className="text-blue-600 block">GOOGLE MAPS</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AI-POWERED LEAD GENERATION PLATFORM
              </p>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                ระบบค้นหาร้านค้าและธุรกิจทั่วประเทศไทยด้วย Google Places API v1
                ครอบคลุมข้อมูล HORECA, Minimart, Modern Trade และอื่นๆ อีกมากมาย
              </p>
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Start Free Trial →
              </button>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <ThailandMapSVG />
                <div className="relative z-10">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-4">Real-time Business Discovery</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                        <span>7-Eleven Stores: 12,847 locations</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                        <span>HORECA Businesses: 45,230 found</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                        <span>Modern Trade: 8,945 locations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ค้นหาธุรกิจได้ง่ายๆ ในขั้นตอนไม่กี่คลิก
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1: Targeted Search */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Targeted Search</h3>
              <p className="text-gray-600">เลือกจังหวัด อำเภอ ตำบล และประเภทธุรกิจที่ต้องการค้นหา</p>
            </div>

            {/* Step 2: HORECA */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">💡 HORECA</h3>
              <p className="text-gray-600">ค้นหาร้านอาหาร โรงแรม คาเฟ่ และธุรกิจในกลุ่ม HORECA</p>
            </div>

            {/* Step 3: Diverse Business Types */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">📊 Diverse Business Types</h3>
              <p className="text-gray-600">รองรับธุรกิจหลากหลายประเภท รวมถึง Modern Trade</p>
            </div>

            {/* Step 4: Return on Einstellalge */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🚀 Return on Intelligence</h3>
              <p className="text-gray-600">ได้ข้อมูลครบถ้วน พร้อม Export เป็น CSV สำหรับใช้งานต่อ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">สถิติการใช้งาน</h2>
            <p className="text-xl text-blue-100">ข้อมูลประสิทธิภาพของระบบ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
              <div className="text-5xl font-bold text-yellow-300 mb-4">{usageCount || stats.totalSearches}</div>
              <div className="text-xl text-blue-100 font-medium">การค้นหาทั้งหมด</div>
              <div className="text-sm text-blue-200 mt-2">Total Searches</div>
            </div>

            <div className="text-center p-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
              <div className="text-5xl font-bold text-green-300 mb-4">{stats.availableProvinces}</div>
              <div className="text-xl text-blue-100 font-medium">จังหวัดที่ครอบคลุม</div>
              <div className="text-sm text-blue-200 mt-2">Provinces Covered</div>
            </div>

            <div className="text-center p-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
              <div className="text-5xl font-bold text-purple-300 mb-4">{stats.businessTypes}+</div>
              <div className="text-xl text-blue-100 font-medium">ประเภทธุรกิจ</div>
              <div className="text-sm text-blue-200 mt-2">Business Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">ประเภทธุรกิจที่รองรับ</h2>
            <p className="text-xl text-gray-600">ครอบคลุมธุรกิจหลากหลายประเภททั่วประเทศไทย</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              '🏪 HORECA', '🏪 Minimart', '🏬 ร้านของชำ', '🏥 โรงพยาบาล', '🍽️ ร้านอาหาร',
              '🏪 7-Eleven', '🛒 Lotus Go Fresh', '🏬 Big C Mini', '🛒 Lotus', '🏬 Makro',
              '🏬 Big C', '🏬 Central', '⚔️ ค่ายทหาร', '🏨 โรงแรม', '☕ ร้านกาแฟ'
            ].map((type, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <span className="font-medium text-gray-700">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            เข้าสู่ระบบเพื่อเริ่มค้นหาธุรกิจและร้านค้าต่างๆ ทั่วประเทศไทยได้เลย
            พร้อมข้อมูลครบถ้วนจาก Google Places API v1
          </p>
          <button
            onClick={onLogin}
            className="bg-blue-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
          >
            เข้าสู่ระบบ →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xl font-bold">Places Ingestor</span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                AI-powered lead generation platform for business growth in Thailand.
                ระบบค้นหาธุรกิจที่ขับเคลื่อนด้วย AI สำหรับการเติบโตของธุรกิจในประเทศไทย
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Google Places API v1</li>
                <li>77 จังหวัดทั่วไทย</li>
                <li>Real-time Data</li>
                <li>CSV Export</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Business Types</h4>
              <ul className="space-y-2 text-gray-400">
                <li>HORECA</li>
                <li>Modern Trade</li>
                <li>Minimart</li>
                <li>Healthcare</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Places Ingestor. Powered by <span className="font-semibold text-blue-400">Google Places API v1</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage