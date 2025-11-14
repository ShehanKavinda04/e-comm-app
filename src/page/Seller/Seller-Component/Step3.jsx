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

const MAX_FILE_MB = 500
const MB = 1024 * 1024 * 500

const humanFileSize = (size) => {
  if (size < MB) return `${Math.round(size / 1024)} KB`
  return `${(size / MB).toFixed(2)} MB`
}

const Step3 = ({ formData = {}, setFormData = () => {}, uploadUrl = '/api/upload' }) => {
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
          maxFiles={2}
          formData={formData}
          setFormData={setFormData}
          uploadUrl={uploadUrl}
        />

        <Dropzone
          title="Proof of Address"
          description="Upload a recent utility bill (water, electricity) with your name and address."
          name="proofOfAddress"
          accept="image/*,application/pdf"
          maxFiles={2}
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
          try { p.cancelSource.cancel('User cancelled') } catch (err) {p.cancelSource.cancel(err)}
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
        {/* drop area */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="relative w-[90%] sm:w-[80%] md:w-[85%] lg:w-[90%] border-2 border-dashed rounded-lg border-amber-700 cursor-pointer transition-all duration-200 bg-white p-4"
          style={{ minHeight: 130 }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click() }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={accept}
            onChange={onBrowse}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            title="Click to upload"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-gray-700 text-sm font-medium px-3 py-1 rounded-md">Click to upload or drag and drop</p>
            <span className="text-gray-500 text-xs mt-1">.PDF, .JPG, .JPEG, .PNG up to {MAX_FILE_MB} MB</span>
            <div className="text-gray-500 text-xs mt-2">Allowed: {accept}</div>
          </div>

          {/* top-right controls overlay */}
          <div className="absolute top-3 right-3 flex gap-2 pointer-events-auto">
             <button
              type="button"
              onClick={uploadAll}
              disabled={files.filter(f => f.status === 'ready').length === 0}
              className="bg-green-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
            >
              Upload All
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="bg-red-500 text-white px-3 py-1 rounded text-xs"
            >
              Clear
            </button>
          </div>
        </div>

        {/* selected files list */}
        <div className="w-[90%] sm:w-[80%] md:w-[85%] lg:w-[90%] mt-4 grid gap-3">
          {files.length === 0 && (
            <div className="text-sm text-gray-500">No files selected</div>
          )}

          {files.map((f, idx) => (
            <div key={f.id} className="flex items-center gap-3 bg-white p-2 rounded shadow-sm border">
              {/* preview */}
              <div className="w-[72px] h-[52px] flex items-center justify-center bg-gray-50 border rounded overflow-hidden">
                {f.preview ? (
                  <img src={f.preview} alt={f.file.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-xs text-gray-500 px-2">{f.file.name.split('.').pop().toUpperCase()}</div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">{f.file.name}</div>
                    <div className="text-xs text-gray-500">{humanFileSize(f.file.size)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {f.status === 'done' && <div className="text-green-600 text-xs font-medium">Uploaded</div>}
                    {f.status === 'uploading' && <div className="text-orange-600 text-xs font-medium">Uploading {f.progress}%</div>}
                    {f.status === 'error' && <div className="text-red-600 text-xs font-medium">Error</div>}
                  </div>
                </div>

                {/* progress */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                    <div style={{ width: `${f.progress || 0}%` }} className={`h-2 ${f.status === 'done' ? 'bg-green-600' : 'bg-orange-600'} transition-all`} />
                  </div>
                  {f.error && <div className="text-xs text-red-600 mt-1">{f.error}</div>}
                </div>
              </div>

              {/* actions */}
              <div className="flex flex-col gap-2 items-end">
                {(f.status === 'ready' || f.status === 'error') && (
                  <button
                    onClick={() => {
                      if (f.status === 'error') retryFile(idx)
                      else uploadFile(f, idx)
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    {f.status === 'error' ? 'Retry' : 'Upload'}
                  </button>
                )}

                {f.status === 'uploading' && (
                  <button
                    onClick={() => {
                      // cancel the request
                      if (f.cancelSource) {
                        try { f.cancelSource.cancel('Cancelled by user') } catch (err) {f.cancelSource.cancel(err)}
                      }
                      removeFile(f.id)
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Cancel
                  </button>
                )}

                <button onClick={() => removeFile(f.id)} className="text-xs text-red-600 underline">
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* overall progress for this zone */}
          {files.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Overall progress: {overallProgress}%</div>
              <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                <div style={{ width: `${overallProgress}%` }} className="h-2 bg-gradient-to-r from-orange-500 to-orange-300 transition-all" />
              </div>
            </div>
          )}

          {/* uploaded files recorded in parent (links) */}
          <div className="mt-3">
            <div className="text-xs text-gray-600 mb-1">Uploaded files:</div>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(formData[name]) ? formData[name] : []).map((u) => (
                <a key={u.id || u.url || u.name} href={u.url || '#'} target="_blank" rel="noreferrer" className="px-2 py-1 bg-gray-100 rounded text-xs border">
                  {u.name || u.url}
                </a>
              ))}

              {(Array.isArray(formData[name]) && formData[name].length === 0) && <div className="text-xs text-gray-400">No uploaded files yet</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}