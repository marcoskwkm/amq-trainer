import React, { useState } from 'react'
import axios from 'axios'

const App = () => {
  const [uploadedFile, setUploadedFile] = useState()
  const [uploadResult, setUploadResult] = useState('')

  const handleFileChange = (file?: File) => {
    if (file) {
      console.log(file)
      setUploadedFile(file)
    }
  }

  const handleSubmit = () => {
    if (!uploadedFile) {
      return
    }

    const data = new FormData()
    data.append('songlist', uploadedFile)
    axios
      .post('http://localhost:3001/updateSongs', data)
      .then((res) => setUploadResult(res.data))
  }

  return (
    <div>
      <input
        type="file"
        accept=".json"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
      />
      <button type="button" onClick={handleSubmit}>
        Upload
      </button>
      <div>{uploadResult}</div>
    </div>
  )
}

export default App
