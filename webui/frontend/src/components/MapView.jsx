import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapView = ({ results, center }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersLayerRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([13.7563, 100.5018], 10)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)

      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersLayerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return

    // Clear existing markers
    markersLayerRef.current.clearLayers()

    if (results && results.length > 0) {
      const validResults = results.filter(result => result.lat && result.lng)

      if (validResults.length > 0) {
        // Add markers for each result
        validResults.forEach(result => {
          const marker = L.marker([result.lat, result.lng])

          const popupContent = `
            <div class="p-2">
              <h3 class="font-bold text-lg mb-2">${result.name || 'ไม่ระบุชื่อ'}</h3>
              <p class="text-sm text-gray-600 mb-2">${result.formatted_address || 'ไม่ระบุที่อยู่'}</p>
              ${result.phone_national ? `<p class="text-sm"><strong>โทร:</strong> ${result.phone_national}</p>` : ''}
              ${result.website ? `<p class="text-sm"><a href="${result.website}" target="_blank" class="text-blue-600 hover:underline">เว็บไซต์</a></p>` : ''}
              ${result.google_maps_uri ? `<p class="text-sm"><a href="${result.google_maps_uri}" target="_blank" class="text-blue-600 hover:underline">ดูใน Google Maps</a></p>` : ''}
            </div>
          `

          marker.bindPopup(popupContent)
          markersLayerRef.current.addLayer(marker)
        })

        // Fit map to show all markers
        const group = new L.featureGroup(validResults.map(result =>
          L.marker([result.lat, result.lng])
        ))
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
      }
    } else if (center && center.lat && center.lng) {
      // Show center point if no results
      mapInstanceRef.current.setView([center.lat, center.lng], 12)
      const centerMarker = L.marker([center.lat, center.lng])
        .bindPopup('พื้นที่ที่เลือก')
      markersLayerRef.current.addLayer(centerMarker)
    }
  }, [results, center])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">แผนที่</h3>
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg"
        style={{ minHeight: '400px' }}
      />
    </div>
  )
}

export default MapView