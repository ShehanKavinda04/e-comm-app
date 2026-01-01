import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { SellerInput } from './Step1'

/**
 * Step3 - Identity Verification with drag & drop multiple file upload and per-file progress.
 *
 * Props:
 * - formData: object containing fields like nicNumber, nicDocument, proofOfAddress, sellerPhoto
 * - setFormData: setter to update parent formData
 * - uploadUrl: backend endpoint to upload files (default '/api/upload')
 *
 * Notes:
 * - Each Dropzone supports multiple files. Uploaded file URLs returned from the backend are stored in
 *   formData under the provided field key as an array of { name, url } objects.
 * - Install axios: npm install axios
 */

const MAX_FILE_MB = 900
const MB = 1024 * 1024

const humanFileSize = (size) => {
  if (size < MB) return `${Math.round(size / 1024)} KB`
  return `${(size / MB).toFixed(2)} MB`
}

const Step3 = ({ formData = {}, setFormData = () => { }, uploadUrl = '/api/upload' }) => {
  return (
    <div>
      <div className="flex flex-col items-center">
        <p className="text-black text-2xl font-medium mt-5">Identity Verification</p>
        <p className="text-gray-800">Upload required documents to verify your identity</p>
      </div>

      <div className="w-[90%] border-2 border-orange-500 flex gap-3 sm:mx-9 md:mx-12 lg:mx-15 rounded-xl px-7 py-2 bg-orange-200 my-5">
        <div className="border-2 flex justify-center items-center border-orange-500 w-[40px] h-[40px] rounded-full p-1">
          <p className="text-orange-500 text-3xl">!</p>
        </div>
        <div>
          <p className="text-orange-500 font-medium text-sm">Important Note </p>
          <p className="text-orange-500 font-normal text-xs">Only one seller account is allowed per NIC. Make sure all documents are clear and readable. </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-10">
        {/* NIC Number input (controlled) */}
        <div className="w-[90%]">
          <SellerInput textLabel="NIC Number:" type="text" name="nicNumber" value={formData.nicNumber || ''} onChange={(e) => setFormData(prev => ({ ...prev, nicNumber: e.target.value }))} />
        </div>

        {/* Dropzone: NIC Document (front/back), Proof of Address, Seller Photo */}
        <Dropzone
          title="NIC Document"
          description="Upload clear scans/photos of your NIC (front and back)."
          name="nicDocument"
          accept="image/*,application/pdf"
          maxFiles={6}
          formData={formData}
          setFormData={setFormData}
          uploadUrl={uploadUrl}
        />

        <Dropzone
          title="Proof of Address"
          description="Upload a recent utility bill (water, electricity) with your name and address."
          name="proofOfAddress"
          accept="image/*,application/pdf"
          maxFiles={6}
          formData={formData}
          setFormData={setFormData}
          uploadUrl={uploadUrl}
        />

        <Dropzone
          title="Seller Photo"
          description="Upload a headset photo for your seller profile."
          name="sellerPhoto"
          accept="image/*"
          maxFiles={1}
          formData={formData}
          setFormData={setFormData}
          uploadUrl={uploadUrl}
        />
      </div>
    </div>
  )
}

export default Step3

/* -------------------- Dropzone component -------------------- */
/*
  Behavior & features:
  - Drag & drop or click to choose files
  - Accepts multiple files up to maxFiles
  - Validates max file size (MAX_FILE_MB) and type (accept)
  - Shows thumbnails for images, name, size
  - Per-file progress bars and status (ready / uploading / done / error)
  - Upload All button uploads files in this dropzone individually with per-file progress and cancel support
  - On successful upload, the returned file URL (or identifier) is appended to parent formData[name] as {name, url}
*/
const Dropzone = ({ title, description, name, accept = '*', maxFiles = 3, formData, setFormData, uploadUrl }) => {
  const [files, setFiles] = useState([]) // {file, id, preview, progress, status, error, cancelToken}
  const inputRef = useRef(null)
  const idSeq = useRef(0)

  useEffect(() => {
    return () => {
      // revoke previews on unmount
      files.forEach(f => f.preview && URL.revokeObjectURL(f.preview))
    }
  }, [files])

  const addFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList)
    const toAdd = []

    for (let f of incoming) {
      if (files.length + toAdd.length >= maxFiles) break

      if (f.size > MAX_FILE_MB * MB) {
        // optionally: show a toast / inline error
        toAdd.push({
          file: f,
          id: `err-${idSeq.current++}`,
          preview: null,
          progress: 0,
          status: 'error',
          error: `File too large (max ${MAX_FILE_MB} MB)`
        })
        continue
      }

      // simple type check if accept isn't wildcard
      if (accept && accept !== '*' && accept !== '' && !matchesAccept(f, accept)) {
        toAdd.push({
          file: f,
          id: `err-${idSeq.current++}`,
          preview: null,
          progress: 0,
          status: 'error',
          error: `Invalid file type`
        })
        continue
      }

      toAdd.push({
        file: f,
        id: `f-${idSeq.current++}`,
        preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
        progress: 0,
        status: 'ready',
        error: null,
        cancelSource: null
      })
    }

    setFiles(prev => [...prev, ...toAdd])
  }, [files.length, maxFiles, accept])

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const dtFiles = e.dataTransfer?.files
    if (!dtFiles || dtFiles.length === 0) return
    addFiles(dtFiles)
  }

  const onBrowse = (e) => {
    const f = e.target.files
    if (!f || f.length === 0) return
    addFiles(f)
    // clear input to allow selecting same file again
    e.target.value = ''
  }

  const removeFile = (id) => {
    setFiles(prev => {
      const next = prev.filter(p => {
        if (p.id === id && p.preview) URL.revokeObjectURL(p.preview)
        // cancel an in-flight request if any
        if (p.id === id && p.cancelSource && p.status === 'uploading') {
          try { p.cancelSource.cancel('User cancelled') } catch (err) { p.cancelSource.cancel(err) }
        }
        return p.id !== id
      })
      return next
    })
    // also remove from parent formData if it was already uploaded with a url
    setFormData(prev => {
      const arr = Array.isArray(prev[name]) ? prev[name].filter(x => x.id !== id) : prev[name]
      return { ...prev, [name]: Array.isArray(arr) ? arr : [] }
    })
  }

  const clearAll = () => {
    files.forEach(p => p.preview && URL.revokeObjectURL(p.preview))
    setFiles([])
    // clear parent field too
    setFormData(prev => ({ ...prev, [name]: [] }))
  }

  const uploadFile = async (fileObj, idx) => {
    if (!fileObj || fileObj.status === 'uploading' || fileObj.status === 'done') return

    const source = axios.CancelToken.source()
    setFiles(prev => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], status: 'uploading', progress: 0, cancelSource: source }
      return copy
    })

    const fd = new FormData()
    fd.append('file', fileObj.file)
    // include nicNumber so the server can associate files with user (if available)
    if (formData?.nicNumber) fd.append('nicNumber', formData.nicNumber)

    try {
      const res = await axios.post(uploadUrl, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        cancelToken: source.token,
        onUploadProgress: (evt) => {
          if (!evt.total) return
          const percent = Math.round((evt.loaded * 100) / evt.total)
          setFiles(prev => {
            const copy = [...prev]
            copy[idx] = { ...copy[idx], progress: percent }
            return copy
          })
        },
        timeout: 5 * 60 * 1000
      })

      const returned = res?.data || {}
      // expected: returned.url or returned.fileUrl or returned.filename
      const url = returned.url || returned.fileUrl || returned.filename || null

      // mark done and save into parent formData as an array of uploaded files
      setFiles(prev => {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], progress: 100, status: 'done', cancelSource: null, response: returned }
        return copy
      })

      setFormData(prev => {
        const previous = Array.isArray(prev[name]) ? [...prev[name]] : []
        const fileRecord = { id: fileObj.id, name: fileObj.file.name, size: fileObj.file.size, url }
        return { ...prev, [name]: [...previous, fileRecord] }
      })
    } catch (err) {
      const message = axios.isCancel(err) ? 'Upload cancelled' : (err?.response?.data?.message || err.message || 'Upload failed')
      setFiles(prev => {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], status: 'error', error: message, cancelSource: null }
        return copy
      })
    }
  }

  const uploadAll = async () => {
    const readyIndexes = files.map((f, i) => ({ f, i })).filter(x => x.f.status === 'ready')
    if (readyIndexes.length === 0) return

    for (const { f, i } of readyIndexes) {
      // sequential uploads to keep memory small; change to parallel if desired
      // eslint-disable-next-line no-await-in-loop
      await uploadFile(f, i)
    }
  }

  const retryFile = (idx) => {
    setFiles(prev => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], status: 'ready', error: null, progress: 0 }
      return copy
    })
    // start upload
    uploadFile(files[idx], idx)
  }

  // small helper to determine if accept matches file
  function matchesAccept(file, acceptStr) {
    if (!acceptStr) return true
    const parts = acceptStr.split(',').map(s => s.trim())
    if (parts.includes('*')) return true
    for (let p of parts) {
      if (p.startsWith('.')) {
        if (file.name.toLowerCase().endsWith(p.toLowerCase())) return true
      } else if (p.endsWith('/*')) {
        const base = p.split('/')[0]
        if (file.type.startsWith(base + '/')) return true
      } else {
        if (file.type === p) return true
      }
    }
    return false
  }

  // derived overall progress for this zone
  const overallProgress = files.length === 0 ? 0 : Math.round(files.reduce((s, f) => s + (f.progress || 0), 0) / files.length)

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col text-center sm:text-left mb-2 w-full sm:w-[90%] px-4">
        <p className="text-black font-medium text-base sm:text-lg">{title}</p>
        <p className="text-gray-600 text-sm sm:text-[15px]">{description}</p>
      </div>

      <div className="w-full flex flex-col items-center">
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="relative w-[90%] sm:w-[80%] md:w-[85%] lg:w-[90%] border-2 border-dashed rounded-lg border-amber-700 bg-white p-4"
          style={{ minHeight: 250 }}
        >
          {/* Top Controls (Upload All / Clear) - Only if files exist */}
          {files.length > 0 && (
            <div className="absolute top-3 right-3 z-20 flex gap-2">
              <button
                type="button"
                onClick={uploadAll}
                disabled={files.filter(f => f.status === 'ready').length === 0}
                className="bg-green-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50 hover:bg-green-700 transition"
              >
                Upload All
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
              >
                Clear
              </button>
            </div>
          )}

          {/* If no files, show the large click/drag prompt (clickable) */}
          {files.length === 0 && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
              onClick={() => inputRef.current?.click()}
            >
              <p className="text-gray-700 text-sm font-medium px-3 py-1 rounded-md">Click to upload or drag and drop</p>
              <span className="text-gray-500 text-xs mt-1">.PDF, .JPG, .JPEG, .PNG up to {MAX_FILE_MB} MB</span>
              <div className="text-gray-500 text-xs mt-2">Allowed: {accept}</div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            multiple
            accept={accept}
            onChange={onBrowse}
            className="hidden" // Hidden input, controlled by custom clicks
          />

          {/* Grid Layout for Files */}
          <div className="grid grid-cols-3 gap-4 mt-10 mb-4 z-10 relative">
            {/* If files exist, render them */}
            {files.map((f, idx) => (
              <div key={f.id} className="relative group border rounded-lg overflow-hidden h-32 bg-gray-50 shadow-sm">

                {/* Image Preview */}
                {f.preview ? (
                  <img src={f.preview} alt={f.file.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 uppercase p-2 text-center bg-gray-100">
                    {f.file.name.split('.').pop() || 'FILE'}
                  </div>
                )}

                {/* Status Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                      className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex justify-center gap-2">
                    {(f.status === 'ready' || f.status === 'error') && (
                      <button
                        onClick={(e) => { e.stopPropagation(); f.status === 'error' ? retryFile(idx) : uploadFile(f, idx); }}
                        className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded"
                      >
                        {f.status === 'error' ? 'Retry' : 'Upload'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Error Banner */}
                {f.status === 'error' && (
                  <div className="absolute bottom-0 left-0 w-full bg-red-600 bg-opacity-90 text-white text-[10px] p-1 truncate text-center z-10" title={f.error}>
                    {f.error || 'Error'}
                  </div>
                )}

                {/* Progress Bar (Only if uploading or done, NOT error) */}
                {(f.status === 'uploading' || f.status === 'done') && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
                    <div
                      style={{ width: `${f.progress}%` }}
                      className={`h-full ${f.status === 'done' ? 'bg-green-500' : 'bg-orange-500'}`}
                    />
                  </div>
                )}

              </div>
            ))}

            {/* Add More Button (as a grid item) if files < maxFiles and files.length > 0 */}
            {files.length > 0 && files.length < maxFiles && (
              <div
                onClick={() => inputRef.current?.click()}
                className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition"
              >
                <span className="text-2xl">+</span>
                <span className="text-xs">Add</span>
              </div>
            )}

          </div>

        </div>

        {/* uploaded files links (optional, kept for record) */}
        {files.length > 0 && overallProgress > 0 && overallProgress < 100 && (
          <div className="w-[90%] sm:w-[80%] md:w-[85%] lg:w-[90%] mt-2">
            <div className="text-xs text-black mb-1">Total Progress: {overallProgress}%</div>
            <div className="w-full bg-gray-200 h-1.5 rounded overflow-hidden">
              <div style={{ width: `${overallProgress}%` }} className="h-full bg-orange-500 transition-all" />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}