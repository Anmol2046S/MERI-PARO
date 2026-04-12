import { useEffect, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { HiOutlineCloudUpload, HiOutlineDocumentText } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import useResumeStore from '../store/resumeStore'
import toast from 'react-hot-toast'
import ResumeCard from '../components/ResumeCard'

export default function ResumePage() {
  const { resumes, uploading, loading, fetchResumes, uploadResume, deleteResume, deleteMultipleResumes } = useResumeStore()
  const [selectedIds, setSelectedIds] = useState(new Set())

  useEffect(() => { fetchResumes() }, [])

  const onDrop = useCallback(async (files) => {
    if (files.length > 0) {
      const result = await uploadResume(files[0])
      if (result) toast.success('Resume uploaded! AI analysis started.')
      else toast.error('Upload failed')
    }
  }, [uploadResume])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 10 * 1024 * 1024,
  })

  const toggleSelect = (id) => setSelectedIds(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const handleSingleDelete = async (id) => {
    const success = await deleteResume(id)
    if (success) {
      toast.success('Resume deleted')
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; })
    }
  }

  const handleDeleteSelected = async () => {
    if(selectedIds.size === 0) return
    const success = await deleteMultipleResumes(Array.from(selectedIds))
    if (success) {
      toast.success(`Deleted ${selectedIds.size} resumes`)
      setSelectedIds(new Set())
    }
  }

  return (
    <div>
      <div className="section-header animate-fade-in-up">
        <h1>Resume Intelligence</h1>
        <p>Drop your resume below. Let Paro analyze formatting, extracted skills, and ATS readability.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        {...getRootProps()}
        style={{
          cursor: 'pointer', textAlign: 'center', padding: 64, marginBottom: 40, borderRadius: 16,
          border: `2px dashed ${isDragActive ? '#4f46e5' : '#cbd5e1'}`,
          background: isDragActive ? '#eef2ff' : '#fff',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)'
        }}
      >
        <input {...getInputProps()} />
        <HiOutlineCloudUpload size={48} style={{ color: isDragActive ? '#4f46e5' : '#94a3b8', margin: '0 auto 16px' }} />
        {uploading ? (
          <p style={{ fontSize: 16, fontWeight: 600, color: '#4f46e5' }}>Processing with AI...</p>
        ) : (
          <>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              {isDragActive ? 'Drop to upload' : 'Click or drop your PDF here'}
            </p>
            <p style={{ color: '#64748b', fontSize: 14 }}>Maximum file size: 10MB</p>
          </>
        )}
      </motion.div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Analyzed Documents</h3>
          {resumes.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button 
                onClick={() => setSelectedIds(selectedIds.size === resumes.length ? new Set() : new Set(resumes.map(r => r.id)))}
                className="btn-ghost"
                style={{ fontSize: 13, padding: '6px 12px' }}
              >
                {selectedIds.size === resumes.length ? 'Deselect All' : 'Select All'}
              </button>
              <AnimatePresence>
                {selectedIds.size > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={handleDeleteSelected}
                    className="btn-primary"
                    style={{ background: '#ef4444', fontSize: 13, padding: '6px 16px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
                  >
                    Delete Selected ({selectedIds.size})
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        {loading ? (
           <div className="skeleton" style={{ height: 120 }} />
        ) : resumes.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            {resumes.map((resume, i) => (
              <ResumeCard 
                key={resume.id} 
                resume={resume} 
                selectable={true}
                selected={selectedIds.has(resume.id)}
                onSelect={toggleSelect}
                onDelete={handleSingleDelete}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 60, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16 }}>
            <HiOutlineDocumentText size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: '#475569' }}>No resumes processed yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
