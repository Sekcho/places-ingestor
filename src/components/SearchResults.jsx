import { useState } from 'react'

const SearchResults = ({ results, isLoading }) => {
  const [sortBy, setSortBy] = useState('name')

  const handleExportCSV = () => {
    if (!results || results.length === 0) return

    const headers = ['ชื่อร้าน', 'ที่อยู่', 'ละติจูด', 'ลองจิจูด', 'เว็บไซต์', 'เบอร์โทร', 'ประเภท', 'Google Maps', 'คำค้น']
    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        `"${result.name || ''}"`,
        `"${result.formatted_address || ''}"`,
        result.lat || '',
        result.lng || '',
        `"${result.website || ''}"`,
        `"${result.phone_national || ''}"`,
        `"${result.types || ''}"`,
        `"${result.google_maps_uri || ''}"`,
        `"${result.source_term || ''}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `places_search_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sortedResults = results ? [...results].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '', 'th')
      case 'province':
        return (a.province || '').localeCompare(b.province || '', 'th')
      default:
        return 0
    }
  }) : []

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">กำลังค้นหา...</span>
        </div>
      </div>
    )
  }

  if (!results) {
    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          ผลการค้นหา ({results.length} รายการ)
        </h3>

        <div className="flex gap-2">
          <select
            className="p-2 border border-gray-300 rounded-md text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">เรียงตามชื่อ</option>
            <option value="province">เรียงตามจังหวัด</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
            disabled={results.length === 0}
          >
            Export CSV
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          ไม่พบผลการค้นหา
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ชื่อร้าน</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ที่อยู่</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ประเภท</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">เบอร์โทร</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">เว็บไซต์</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">แผนที่</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {result.name || 'ไม่ระบุชื่อ'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {result.formatted_address || 'ไม่ระบุที่อยู่'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {result.types ? result.types.split('|').slice(0, 2).join(', ') : 'ไม่ระบุ'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {result.phone_national ? (
                      <a href={`tel:${result.phone_national}`} className="text-blue-600 hover:underline">
                        {result.phone_national}
                      </a>
                    ) : 'ไม่ระบุ'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {result.website ? (
                      <a
                        href={result.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        เว็บไซต์
                      </a>
                    ) : 'ไม่มี'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {result.google_maps_uri ? (
                      <a
                        href={result.google_maps_uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        ดูแผนที่
                      </a>
                    ) : 'ไม่มี'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SearchResults