import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

const LocationSelector = ({ onLocationChange, onTermChange, onRadiusChange }) => {
  const [provinces, setProvinces] = useState([])
  const [amphoes, setAmphoes] = useState([])
  const [tambons, setTambons] = useState([])
  const [terms, setTerms] = useState([])

  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedAmphoe, setSelectedAmphoe] = useState('')
  const [selectedTambon, setSelectedTambon] = useState('')
  const [selectedTerm, setSelectedTerm] = useState('')
  const [freetext, setFreetext] = useState('')
  const [radius, setRadius] = useState('')

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [provincesRes, termsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/meta/areas/provinces`),
          axios.get(`${API_BASE_URL}/meta/terms`)
        ])
        setProvinces(provincesRes.data)
        setTerms(termsRes.data)
      } catch (error) {
        console.error('Failed to load initial data:', error)
      }
    }
    loadInitialData()
  }, [])

  // Load amphoes when province changes
  useEffect(() => {
    const loadAmphoes = async () => {
      if (selectedProvince) {
        try {
          const response = await axios.get(`${API_BASE_URL}/meta/areas/amphoes?province_id=${selectedProvince}`)
          setAmphoes(response.data)
          setTambons([])
          setSelectedAmphoe('')
          setSelectedTambon('')
        } catch (error) {
          console.error('Failed to load amphoes:', error)
        }
      } else {
        setAmphoes([])
        setTambons([])
        setSelectedAmphoe('')
        setSelectedTambon('')
      }
    }
    loadAmphoes()
  }, [selectedProvince])

  // Load tambons when amphoe changes
  useEffect(() => {
    const loadTambons = async () => {
      if (selectedAmphoe) {
        try {
          const response = await axios.get(`${API_BASE_URL}/meta/areas/tambons?amphoe_id=${selectedAmphoe}`)
          setTambons(response.data)
          setSelectedTambon('')
        } catch (error) {
          console.error('Failed to load tambons:', error)
        }
      } else {
        setTambons([])
        setSelectedTambon('')
      }
    }
    loadTambons()
  }, [selectedAmphoe])

  // Notify parent component of changes
  useEffect(() => {
    onLocationChange({
      province_id: selectedProvince,
      amphoe_id: selectedAmphoe,
      tambon_id: selectedTambon
    })
  }, [selectedProvince, selectedAmphoe, selectedTambon, onLocationChange])

  useEffect(() => {
    onTermChange({
      term: selectedTerm,
      freetext: freetext || null
    })
  }, [selectedTerm, freetext, onTermChange])

  useEffect(() => {
    onRadiusChange(radius ? parseFloat(radius) : null)
  }, [radius, onRadiusChange])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">ค้นหาร้านค้า</h2>

      {/* Location Selection */}
      <div className="mb-2">
        <p className="text-sm text-gray-600">
          เลือกพื้นที่: จังหวัด (ค้นหาทั้งจังหวัด) → อำเภอ (ค้นหาเฉพาะอำเภอ) → ตำบล (ค้นหาเฉพาะตำบล)
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">จังหวัด</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="">เลือกจังหวัด</option>
            {provinces.map(province => (
              <option key={province.id} value={province.id}>{province.name_th}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">อำเภอ</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            value={selectedAmphoe}
            onChange={(e) => setSelectedAmphoe(e.target.value)}
            disabled={!selectedProvince}
          >
            <option value="">เลือกอำเภอ</option>
            {amphoes.map(amphoe => (
              <option key={amphoe.id} value={amphoe.id}>{amphoe.name_th}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ตำบล</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            value={selectedTambon}
            onChange={(e) => setSelectedTambon(e.target.value)}
            disabled={!selectedAmphoe}
          >
            <option value="">เลือกตำบล</option>
            {tambons.map(tambon => (
              <option key={tambon.id} value={tambon.id}>{tambon.name_th}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Business Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทร้าน</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            <option value="">เลือกประเภทร้าน</option>
            {terms.map(term => (
              <option key={term.key} value={term.key}>{term.label_th}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">หรือพิมพ์เอง</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="เช่น ร้านกาแฟ, คาเฟ่"
            value={freetext}
            onChange={(e) => setFreetext(e.target.value)}
          />
        </div>
      </div>


      {/* Radius Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          รัศมี (กิโลเมตร) - ไม่บังคับ
        </label>
        <input
          type="number"
          className="w-full md:w-48 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="เช่น 1, 5, 10"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          step="0.1"
          min="0"
        />
      </div>
    </div>
  )
}

export default LocationSelector