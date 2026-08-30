export type UploadStatus = 'uploading' | 'success' | 'error'

export interface Attachment {
  id: string
  file: File
  name: string
  type: string
  size: number
  progress: number
  status: UploadStatus
  previewUrl: string | null
  tags: string[]
  note: string
}

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf']
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function isAcceptedFile(file: File): boolean {
  if (ACCEPTED_TYPES.includes(file.type)) return true
  const ext = file.name.toLowerCase().match(/\.([^.]+)$/)?.[1] ?? ''
  return ['jpg', 'jpeg', 'png', 'pdf'].includes(ext)
}

export function getFileIcon(type: string): 'image' | 'pdf' {
  if (type.startsWith('image/')) return 'image'
  return 'pdf'
}
