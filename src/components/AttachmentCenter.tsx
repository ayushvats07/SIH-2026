import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertCircle, CheckCircle2, FileText, Image as ImageIcon, Loader2, Paperclip,
  Pencil, Plus, RefreshCw, Tag, Trash2, UploadCloud, X,
} from 'lucide-react'
import {
  type Attachment, type UploadStatus,
  formatFileSize, getFileIcon, isAcceptedFile,
  ACCEPTED_EXTENSIONS, MAX_FILE_SIZE,
} from '../data/attachments'

type LoadState = 'loading' | 'success' | 'error'

export default function AttachmentCenter() {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [invalidWarning, setInvalidWarning] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const progressTimers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map())

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setLoadState('success'), 800)
    return () => clearTimeout(timer)
  }, [])

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      progressTimers.current.forEach((t) => clearInterval(t))
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const showToast = (msg: string, type: 'success' | 'error') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, type })
    toastTimer.current = setTimeout(() => setToast(null), 2800)
  }

  const simulateUpload = useCallback((id: string) => {
    let progress = 0
    const timer = setInterval(() => {
      progress += Math.random() * 18 + 7
      if (progress >= 100) {
        progress = 100
        clearInterval(timer)
        progressTimers.current.delete(id)
        // Simulate ~85% success rate
        const success = Math.random() > 0.15
        setAttachments((prev) =>
          prev.map((a) =>
            a.id === id
              ? { ...a, progress: 100, status: (success ? 'success' : 'error') as UploadStatus }
              : a,
          ),
        )
        if (success) {
          showToast('File uploaded successfully', 'success')
        } else {
          showToast('Upload failed — tap retry to try again', 'error')
        }
      } else {
        setAttachments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, progress: Math.round(progress) } : a)),
        )
      }
    }, 200)
    progressTimers.current.set(id, timer)
  }, [])

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList)
      const valid: File[] = []
      const invalid: string[] = []

      for (const file of files) {
        if (!isAcceptedFile(file)) {
          invalid.push(file.name)
          continue
        }
        if (file.size > MAX_FILE_SIZE) {
          invalid.push(`${file.name} (exceeds 10 MB)`)
          continue
        }
        valid.push(file)
      }

      if (invalid.length > 0) {
        setInvalidWarning(
          invalid.length === 1
            ? `"${invalid[0]}" is not a supported file type. Only JPG, PNG, and PDF files are allowed.`
            : `${invalid.length} files were rejected. Only JPG, PNG, and PDF files up to 10 MB are allowed.`,
        )
      } else {
        setInvalidWarning(null)
      }

      if (valid.length === 0) return

      const newAttachments: Attachment[] = valid.map((file) => {
        const id = `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const isImage = file.type.startsWith('image/')
        return {
          id,
          file,
          name: file.name,
          type: file.type,
          size: file.size,
          progress: 0,
          status: 'uploading' as UploadStatus,
          previewUrl: isImage ? URL.createObjectURL(file) : null,
          tags: [],
          note: '',
        }
      })

      setAttachments((prev) => [...newAttachments, ...prev])

      newAttachments.forEach((att) => {
        simulateUpload(att.id)
      })
    },
    [simulateUpload],
  )

  const handleRetry = (id: string) => {
    setAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, progress: 0, status: 'uploading' as UploadStatus } : a)),
    )
    simulateUpload(id)
  }

  const handleDelete = (id: string) => {
    const timer = progressTimers.current.get(id)
    if (timer) {
      clearInterval(timer)
      progressTimers.current.delete(id)
    }
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((a) => a.id !== id)
    })
    showToast('File removed', 'success')
  }

  const handleRename = (id: string, newName: string) => {
    if (!newName.trim()) return
    setAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, name: newName.trim() } : a)))
  }

  const handleAddTag = (id: string, tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed) return
    setAttachments((prev) =>
      prev.map((a) =>
        a.id === id && !a.tags.includes(trimmed) ? { ...a, tags: [...a.tags, trimmed] } : a,
      ),
    )
  }

  const handleRemoveTag = (id: string, tag: string) => {
    setAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, tags: a.tags.filter((t) => t !== tag) } : a)),
    )
  }

  const handleNoteChange = (id: string, note: string) => {
    setAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, note } : a)))
  }

  // Drag handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loadState === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <p className="text-sm text-navy-400">Loading attachment center...</p>
        </div>
      </div>
    )
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (loadState === 'error') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="h-16 w-16 rounded-full bg-error-bg flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-error" />
          </div>
          <h2 className="text-xl font-semibold text-navy-900">Something went wrong</h2>
          <p className="text-sm text-navy-400">
            We couldn't load the attachment center. Please try again.
          </p>
          <button
            type="button"
            onClick={() => setLoadState('success')}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    )
  }

  const totalFiles = attachments.length
  const uploadedCount = attachments.filter((a) => a.status === 'success').length
  const errorCount = attachments.filter((a) => a.status === 'error').length

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Attachment Center</h1>
          <p className="text-sm text-navy-400 mt-0.5">
            Upload patient records, lab reports, and case photos
          </p>
        </div>
        {totalFiles > 0 && (
          <div className="flex gap-2">
            <div className="rounded-lg bg-navy-50 px-3 py-1.5 text-center">
              <p className="text-lg font-bold text-navy-800">{uploadedCount}</p>
              <p className="text-[10px] text-navy-400">Uploaded</p>
            </div>
            {errorCount > 0 && (
              <div className="rounded-lg bg-error-bg px-3 py-1.5 text-center">
                <p className="text-lg font-bold text-error">{errorCount}</p>
                <p className="text-[10px] text-error">Failed</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
          isDragging
            ? 'border-teal-500 bg-mint-50 scale-[1.01]'
            : 'border-navy-200 bg-white hover:border-teal-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files)
            e.target.value = ''
          }}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-3 w-full"
        >
          <div
            className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${
              isDragging ? 'bg-teal-500 text-white' : 'bg-mint-100 text-teal-600'
            }`}
          >
            <UploadCloud className="h-8 w-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-navy-800">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-navy-400 mt-1">
              or <span className="text-teal-600 font-medium underline">browse from device</span>
            </p>
          </div>
          <p className="text-xs text-navy-300 mt-1">
            JPG, PNG, and PDF files up to 10 MB each
          </p>
        </button>
      </div>

      {/* Invalid file warning */}
      {invalidWarning && (
        <div className="flex items-start gap-3 rounded-xl border border-error/30 bg-error-bg px-4 py-3">
          <AlertCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-error">Unsupported file type</p>
            <p className="text-sm text-error/80 mt-0.5">{invalidWarning}</p>
          </div>
          <button
            type="button"
            onClick={() => setInvalidWarning(null)}
            aria-label="Dismiss warning"
            className="rounded-lg p-1 text-error hover:bg-red-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* File list */}
      {totalFiles === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="h-14 w-14 rounded-full bg-navy-50 flex items-center justify-center">
            <Paperclip className="h-7 w-7 text-navy-200" />
          </div>
          <p className="text-sm text-navy-400">No files uploaded yet. Drop files above to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attachments.map((att) => (
            <AttachmentCard
              key={att.id}
              attachment={att}
              onRetry={() => handleRetry(att.id)}
              onDelete={() => handleDelete(att.id)}
              onRename={(newName) => handleRename(att.id, newName)}
              onAddTag={(tag) => handleAddTag(att.id, tag)}
              onRemoveTag={(tag) => handleRemoveTag(att.id, tag)}
              onNoteChange={(note) => handleNoteChange(att.id, note)}
            />
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in">
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === 'success' ? 'bg-navy-900' : 'bg-error'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-mint-400" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Attachment Card ──────────────────────────────────────────────────────────

interface AttachmentCardProps {
  attachment: Attachment
  onRetry: () => void
  onDelete: () => void
  onRename: (newName: string) => void
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  onNoteChange: (note: string) => void
}

function AttachmentCard({
  attachment: att,
  onRetry,
  onDelete,
  onRename,
  onAddTag,
  onRemoveTag,
  onNoteChange,
}: AttachmentCardProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(att.name)
  const [tagInput, setTagInput] = useState('')
  const [showNoteField, setShowNoteField] = useState(att.note !== '')
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus()
  }, [isEditingName])

  const iconType = getFileIcon(att.type)

  const handleNameSubmit = () => {
    onRename(nameInput)
    setIsEditingName(false)
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      onAddTag(tagInput)
      setTagInput('')
    }
  }

  return (
    <div
      className={`rounded-xl border bg-white overflow-hidden transition-all ${
        att.status === 'error' ? 'border-error/40' : 'border-navy-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Preview thumbnail */}
        <div className="shrink-0 sm:w-32 sm:h-32 h-28 bg-navy-50 flex items-center justify-center overflow-hidden">
          {att.previewUrl ? (
            <img src={att.previewUrl} alt={att.name} className="h-full w-full object-cover" />
          ) : iconType === 'pdf' ? (
            <div className="flex flex-col items-center gap-1 text-error">
              <FileText className="h-10 w-10" strokeWidth={1.5} />
              <span className="text-[10px] font-medium">PDF</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-navy-300">
              <ImageIcon className="h-10 w-10" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-4 space-y-3">
          {/* Name + actions row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameSubmit()
                      if (e.key === 'Escape') {
                        setNameInput(att.name)
                        setIsEditingName(false)
                      }
                    }}
                    onBlur={handleNameSubmit}
                    className="flex-1 rounded-md border border-navy-200 px-2 py-1 text-sm font-medium text-navy-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-300"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(att.name)
                    setIsEditingName(true)
                  }}
                  className="group flex items-center gap-1.5 text-left"
                >
                  <span className="text-sm font-semibold text-navy-900 truncate max-w-[200px] sm:max-w-xs">
                    {att.name}
                  </span>
                  <Pencil className="h-3.5 w-3.5 text-navy-300 group-hover:text-teal-500 shrink-0" />
                </button>
              )}
              <p className="text-xs text-navy-400 mt-0.5">{formatFileSize(att.size)}</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {att.status === 'error' && (
                <button
                  type="button"
                  onClick={onRetry}
                  aria-label="Retry upload"
                  className="rounded-lg p-1.5 text-teal-600 hover:bg-mint-50"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onDelete}
                aria-label="Delete file"
                className="rounded-lg p-1.5 text-navy-400 hover:bg-error-bg hover:text-error"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress / status bar */}
          {att.status === 'uploading' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-navy-400 flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Uploading...
                </span>
                <span className="text-xs font-medium text-navy-500">{att.progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-navy-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all duration-200 ease-out"
                  style={{ width: `${att.progress}%` }}
                />
              </div>
            </div>
          )}

          {att.status === 'success' && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-success">
              <CheckCircle2 className="h-4 w-4" />
              Uploaded successfully
            </div>
          )}

          {att.status === 'error' && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-error">
                <AlertCircle className="h-4 w-4" />
                Upload failed
              </div>
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-teal-600 active:scale-95"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            </div>
          )}

          {/* Tags */}
          {att.status === 'success' && (
            <div>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {att.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-mint-100 text-mint-800 px-2.5 py-1 text-xs font-medium"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => onRemoveTag(tag)}
                      aria-label={`Remove tag ${tag}`}
                      className="hover:bg-mint-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <div className="inline-flex items-center">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={() => tagInput && (onAddTag(tagInput), setTagInput(''))}
                    placeholder="Add tag..."
                    aria-label="Add tag"
                    className="w-24 rounded-full border border-navy-200 bg-navy-50 px-2.5 py-1 text-xs text-navy-700 placeholder:text-navy-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-300"
                  />
                </div>
              </div>

              {/* Note */}
              {showNoteField ? (
                <textarea
                  value={att.note}
                  onChange={(e) => onNoteChange(e.target.value)}
                  rows={2}
                  placeholder="Add a note about this file..."
                  className="w-full rounded-lg border border-navy-200 bg-navy-50 px-3 py-2 text-xs text-navy-700 placeholder:text-navy-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-300 resize-y"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNoteField(true)}
                  className="inline-flex items-center gap-1 text-xs text-navy-400 hover:text-teal-600"
                >
                  <Plus className="h-3 w-3" />
                  Add note
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
