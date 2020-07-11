import React, { useState } from 'react'
import axios from 'axios'

import { SERVER_URL } from '../constants'

const UpdateDatabase = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState('')

  const handleFileChange = (file?: File) => {
    if (file) {
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
      .post(`${SERVER_URL}/update-songs`, data)
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

export default UpdateDatabase
