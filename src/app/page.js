'use client'
import { useEffect, useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'

export default function VocabPage() {
  const [vocabData, setVocabData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [starredIndices, setStarredIndices] = useState([])
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'starred'

  // Load vocab and starred indices
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/vocabData.json')
      const data = await res.json()
      setVocabData(data)
      setFilteredData(data)
    }

    const savedStars = JSON.parse(localStorage.getItem('starredIndices')) || []
    setStarredIndices(savedStars)

    fetchData()
  }, [])

  // Filter words based on search term
  useEffect(() => {
    const filtered = vocabData.filter(item =>
      item.word.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
    setFilteredData(filtered)
  }, [searchTerm, vocabData])

  // Handle star toggle
  const toggleStar = (index) => {
    let updatedStars = [...starredIndices]
    if (updatedStars.includes(index)) {
      updatedStars = updatedStars.filter(i => i !== index)
    } else {
      updatedStars.push(index)
    }
    setStarredIndices(updatedStars)
    localStorage.setItem('starredIndices', JSON.stringify(updatedStars))
  }

  const isStarred = (index) => starredIndices.includes(index)

  // Get vocab list based on active tab
  const getVisibleData = () => {
    const baseData = filteredData
    if (activeTab === 'starred') {
      return baseData.filter((_, index) => {
        const originalIndex = vocabData.findIndex(v => v.word === baseData[index].word)
        return starredIndices.includes(originalIndex)
      })
    }
    return baseData
  }

  const visibleData = getVisibleData()

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Vocabulary List</h1>

      {/* Tabs */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All Words
        </button>
        <button
          onClick={() => setActiveTab('starred')}
          className={`px-4 py-2 rounded ${activeTab === 'starred' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
        >
          Starred⭐️
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search words starting with..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-6 border text-blue-800 rounded"
      />

      {/* Vocabulary List */}
      {visibleData.length === 0 ? (
        <p>No words found{searchTerm && ` starting with "${searchTerm}"`}.</p>
      ) : (
        <ul className="space-y-4">
          {visibleData.map((item, filteredIndex) => {
            // Get the actual index from vocabData
            const realIndex = vocabData.findIndex(v => v.word === item.word)

            return (
              <li
                key={filteredIndex}
                className="p-4 text-black rounded shadow-md relative bg-white"
              >
                {/* Star Icon */}
                <button
                  onClick={() => toggleStar(realIndex)}
                  className="absolute top-2 right-2 text-xl text-yellow-500"
                >
                  {isStarred(realIndex) ? <FaStar /> : <FaRegStar />}
                </button>

                <h2 className="text-xl font-semibold">{item.word}</h2>
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
                </div>
                <p><strong>Trick:</strong> {item.trick}</p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
