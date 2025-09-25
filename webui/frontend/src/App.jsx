import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import LocationSelector from './components/LocationSelector'
import SearchResults from './components/SearchResults'
import MapView from './components/MapView'
import LoginPage from './components/LoginPage'
import LandingPage from './components/LandingPage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function App() {
  const [currentPage, setCurrentPage] = useState('landing') // 'landing', 'login', 'main'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [usageCount, setUsageCount] = useState(0)
  const [location, setLocation] = useState({})
  const [term, setTerm] = useState({})
  const [radius, setRadius] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState(null)

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (token && savedUser) {
      setIsAuthenticated(true)
      setUser(savedUser)
      setCurrentPage('main')
    }

    // Load usage count
    loadUsageCount()
  }, [])

  const loadUsageCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/usage-count`)
      setUsageCount(response.data.usage_count)
    } catch (error) {
      console.error('Failed to load usage count:', error)
    }
  }

  const handleLogin = (loginData) => {
    setIsAuthenticated(true)
    setUser(loginData.username || 'Admin')
    setUsageCount(loginData.usage_count)
    setCurrentPage('main')
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setIsAuthenticated(false)
    setUser(null)
    setSearchResults(null)
    setCurrentPage('landing')
  }

  const goToLogin = () => {
    setCurrentPage('login')
  }

  const goToLanding = () => {
    setCurrentPage('landing')
  }

  const handleLocationChange = useCallback((newLocation) => {
    setLocation(newLocation)
  }, [])

  const handleTermChange = useCallback((newTerm) => {
    setTerm(newTerm)
  }, [])

  const handleRadiusChange = useCallback((newRadius) => {
    setRadius(newRadius)
  }, [])

  const handleSearch = async () => {
    if (!location.province_id) {
      alert('กรุณาเลือกจังหวัดอย่างน้อย')
      return
    }

    if (!term.term && !term.freetext) {
      alert('กรุณาเลือกประเภทร้านหรือพิมพ์คำค้นหา')
      return
    }

    setIsLoading(true)
    setSearchResults(null)

    try {
      const searchRequest = {
        province_id: location.province_id,
        amphoe_id: location.amphoe_id,
        tambon_id: location.tambon_id,
        term: term.term || null,
        freetext: term.freetext || null,
        language: 'th',
        region: 'TH',
        radius_km: radius
      }

      console.log('Search request:', searchRequest)

      const response = await axios.post(`${API_BASE_URL}/search`, searchRequest)
      setSearchResults(response.data)

      // Set map center (you might want to get this from tambon data)
      if (response.data.length > 0) {
        const firstResult = response.data[0]
        if (firstResult.lat && firstResult.lng) {
          setMapCenter({ lat: firstResult.lat, lng: firstResult.lng })
        }
      }

    } catch (error) {
      console.error('Search failed:', error)
      alert('การค้นหาล้มเหลว: ' + (error.response?.data?.detail || error.message))
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const canSearch = location.province_id && (term.term || term.freetext)

  // Page routing
  if (currentPage === 'landing') {
    return <LandingPage onLogin={goToLogin} usageCount={usageCount} />
  }

  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} usageCount={usageCount} />
  }

  // Main application page (after login)
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Places Ingestor</h1>
              <p className="text-gray-600">ค้นหาร้านค้าและธุรกิจต่างๆ จาก Google Places API</p>
            </div>
            <div className="flex-1 text-right">
              <div className="text-sm text-gray-600 mb-2">
                ยินดีต้อนรับ <span className="font-semibold text-blue-600">{user}</span>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                การเข้าใช้งาน: <span className="font-semibold">{usageCount}</span> ครั้ง
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {/* Location Selector */}
          <LocationSelector
            onLocationChange={handleLocationChange}
            onTermChange={handleTermChange}
            onRadiusChange={handleRadiusChange}
          />

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              disabled={!canSearch || isLoading}
              className={`px-8 py-3 rounded-lg font-medium text-white ${
                canSearch && !isLoading
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
            </button>
          </div>

          {/* Results Layout */}
          {(searchResults || isLoading) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Search Results Table */}
              <div className="order-2 lg:order-1">
                <SearchResults results={searchResults} isLoading={isLoading} />
              </div>

              {/* Map */}
              <div className="order-1 lg:order-2">
                <MapView results={searchResults} center={mapCenter} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
