'use client'
import { useEffect, useState } from 'react'

export default function VocabPage() {
  const [vocabData, setVocabData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/vocabData.json')
      const data = await res.json()
      setVocabData(data)
      setFilteredData(data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = vocabData.filter(item =>
      item.word.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
    setFilteredData(filtered)
  }, [searchTerm, vocabData])

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Vocabulary List</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search words starting with..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-6 border text-blue-800 rounded"
      />

      {/* Vocabulary List */}
      {filteredData.length === 0 ? (
        <p>No words found starting with "{searchTerm}"</p>
      ) : (
        <ul className="space-y-4">
          {filteredData.map((item, index) => (
            <li key={index} className=" p-4 text-black rounded shadow-md">
              <h2 className="text-xl font-semibold text-black">{item.word}</h2>
              <p><strong>Meaning:</strong> {item.meaning}</p>
              <div>
                <strong>Synonyms:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.synonyms.map((synonym, i) => (
                    <div key={i} className="bg-green-400 text-white px-2 py-1 rounded">
                      {synonym}
                    </div>
                  ))}
                </div>
              </div><p><strong>Trick:</strong> {item.trick}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
