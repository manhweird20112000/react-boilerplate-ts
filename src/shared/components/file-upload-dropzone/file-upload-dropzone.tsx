import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent
} from 'react'
import {
  Download,
  FileText,
  Trash2,
  Upload
  // ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/shared/components/ui/alert-dialog'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  FormDialogContent,
  DialogTitle
} from '@/shared/components/ui/dialog'
import { cn } from '@/shared/lib/utils'

/** `accept` attribute value for the hidden file input. */
const DEFAULT_FILE_INPUT_ACCEPT = 'image/*,video/*,application/pdf'

const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.bmp',
  '.ico',
  '.avif',
  '.heic'
])

const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.ogg', '.ogv', '.mov', '.m4v', '.mkv', '.avi'])

function getLowercaseExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex < 0) {
    return ''
  }
  return fileName.slice(dotIndex).toLowerCase()
}

type PreviewItem = {
  readonly url: string
  readonly name: string
  readonly kind: 'image' | 'video' | 'pdf' | 'file'
  readonly source: 'file' | 'url'
  readonly file?: File
  readonly isObjectUrl: boolean
}

function isImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) {
    return true
  }
  if (file.type !== '') {
    return false
  }
  return IMAGE_EXTENSIONS.has(getLowercaseExtension(file.name))
}

function isVideoFile(file: File): boolean {
  if (file.type.startsWith('video/')) {
    return true
  }
  if (file.type !== '') {
    return false
  }
  return VIDEO_EXTENSIONS.has(getLowercaseExtension(file.name))
}

function isPdfFile(file: File): boolean {
  if (file.type === 'application/pdf') {
    return true
  }
  if (file.type !== '') {
    return false
  }
  return getLowercaseExtension(file.name) === '.pdf'
}

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB'] as const

// const PREVIEW_ZOOM_MIN = 0.5
// const PREVIEW_ZOOM_MAX = 3
// const PREVIEW_ZOOM_STEP = 0.25

/** Vietnamese UI copy for this component (non-validation; hardcoded per product locale). */
const COPY = {
  uploadInputAria: 'Tải tệp lên',
  dragDropTitle: 'Kéo và thả tệp vào đây',
  browseFiles: 'Chọn tệp',
  formatsOnly: 'Ảnh · Video · PDF',
  multipleFiles: ' · Cho phép nhiều tệp',
  singleFile: ' · Chỉ một tệp',
  maxSizeSuffix: (size: string) => ` (tối đa ${size})`,
  openPreview: (name: string) => `Mở xem trước: ${name}`,
  uploading: (percent: number) => `Đang tải lên… ${percent}%`,
  download: 'Tải xuống',
  downloadAria: (name: string) => `Tải xuống «${name}»`,
  removeAria: (name: string) => `Xóa «${name}»`,
  previewImageControlsHint: 'Dùng thu phóng hoặc cuộn để xem vừa màn hình.',
  previewCloseHint: 'Nhấn Esc để đóng.',
  zoomOut: 'Thu nhỏ',
  zoomIn: 'Phóng to',
  resetZoom: 'Đặt lại chế độ xem',
  previewAlt: (name: string) => `Xem trước «${name}»`,
  previewIframeTitle: (name: string) => `Xem trước «${name}»`,
  previewUnavailable: 'Không thể xem trước tệp này.',
  removeConfirmTitle: 'Xóa tệp này?',
  removeConfirmDescription: (name: string) =>
    `«${name}» sẽ bị gỡ khỏi danh sách. Bạn có thể tải lên lại sau.`,
  removeConfirmFallback: 'Tệp này sẽ bị gỡ khỏi danh sách.',
  cancel: 'Hủy',
  remove: 'Xóa',
  kindImage: 'Ảnh',
  kindVideo: 'Video',
  kindPdf: 'PDF',
  kindFile: 'Tệp'
} as const

function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }
  let value = bytes
  let unitIndex = 0
  while (value >= 1024 && unitIndex < FILE_SIZE_UNITS.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  const decimals = unitIndex === 0 ? 0 : 1
  return `${value.toFixed(decimals)} ${FILE_SIZE_UNITS[unitIndex]}`
}

function getFileKindLabel(file: File): string {
  if (isImageFile(file)) {
    return COPY.kindImage
  }
  if (isVideoFile(file)) {
    return COPY.kindVideo
  }
  if (isPdfFile(file)) {
    return COPY.kindPdf
  }
  return COPY.kindFile
}

function getExtensionBadgeLabel(file: File): string {
  const ext = getLowercaseExtension(file.name)
  if (ext !== '') {
    return ext.slice(1).toUpperCase()
  }
  if (file.type === 'application/pdf') {
    return 'PDF'
  }
  if (file.type.startsWith('image/')) {
    const subtype = file.type.slice('image/'.length)
    if (subtype !== '') {
      return subtype.toUpperCase()
    }
    return 'IMG'
  }
  if (file.type.startsWith('video/')) {
    const subtype = file.type.slice('video/'.length)
    if (subtype !== '') {
      return subtype.toUpperCase()
    }
    return 'VID'
  }
  return getFileKindLabel(file).slice(0, 4).toUpperCase()
}

function buildSecondaryHint(
  maxBytesPerFile?: number,
  allowedExtensions?: readonly string[]
): string {
  const formats =
    allowedExtensions && allowedExtensions.length > 0
      ? allowedExtensions.map((ext) => ext.slice(1).toUpperCase()).join(' · ')
      : COPY.formatsOnly
  if (maxBytesPerFile === undefined) {
    return formats
  }
  return `${formats}${COPY.maxSizeSuffix(formatFileSize(maxBytesPerFile))}`
}

function triggerObjectUrlDownload(file: File, objectUrl: string): void {
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = file.name
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

function triggerUrlDownload(url: string, fileName: string): void {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  anchor.target = '_blank'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

// function clampPreviewZoom(value: number): number {
//   const stepped = Math.round(value / PREVIEW_ZOOM_STEP) * PREVIEW_ZOOM_STEP
//   return Math.min(PREVIEW_ZOOM_MAX, Math.max(PREVIEW_ZOOM_MIN, stepped))
// }

function isFileAllowed(file: File, allowedExtensions?: readonly string[]): boolean {
  if (allowedExtensions && allowedExtensions.length > 0) {
    const ext = getLowercaseExtension(file.name)
    return allowedExtensions.some((allowed) => allowed.toLowerCase() === ext)
  }

  if (file.type.startsWith('image/')) {
    return true
  }
  if (file.type.startsWith('video/')) {
    return true
  }
  if (file.type === 'application/pdf') {
    return true
  }
  if (file.type !== '') {
    return false
  }
  const ext = getLowercaseExtension(file.name)
  return IMAGE_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext) || ext === '.pdf'
}

function getFileNameFromUrl(url: string): string {
  const trimmed = url.split('?')[0]?.split('#')[0] ?? url
  const parts = trimmed.split('/')
  const last = parts.at(-1)
  if (last === undefined || last.trim() === '') {
    return 'file'
  }
  return decodeURIComponent(last)
}

function getKindFromUrl(url: string): PreviewItem['kind'] {
  const fileName = getFileNameFromUrl(url)
  const ext = getLowercaseExtension(fileName)
  if (IMAGE_EXTENSIONS.has(ext)) {
    return 'image'
  }
  if (VIDEO_EXTENSIONS.has(ext)) {
    return 'video'
  }
  if (ext === '.pdf') {
    return 'pdf'
  }
  return 'file'
}

function getKindLabelFromPreviewItem(item: PreviewItem): string {
  if (item.source === 'file' && item.file !== undefined) {
    return getFileKindLabel(item.file)
  }
  if (item.kind === 'image') {
    return COPY.kindImage
  }
  if (item.kind === 'video') {
    return COPY.kindVideo
  }
  if (item.kind === 'pdf') {
    return COPY.kindPdf
  }
  return COPY.kindFile
}

function getExtensionBadgeLabelFromItem(item: PreviewItem): string {
  if (item.source === 'file' && item.file !== undefined) {
    return getExtensionBadgeLabel(item.file)
  }
  const ext = getLowercaseExtension(item.name)
  if (ext !== '') {
    return ext.slice(1).toUpperCase()
  }
  if (item.kind === 'pdf') {
    return 'PDF'
  }
  if (item.kind === 'image') {
    return 'IMG'
  }
  if (item.kind === 'video') {
    return 'VID'
  }
  return COPY.kindFile.slice(0, 4).toUpperCase()
}

function getKindFromFile(file: File): PreviewItem['kind'] {
  if (isImageFile(file)) {
    return 'image'
  }
  if (isVideoFile(file)) {
    return 'video'
  }
  if (isPdfFile(file)) {
    return 'pdf'
  }
  return 'file'
}

export type FileUploadDropzoneProps = {
  /**
   * Existing uploaded file URL(s) to show as already-attached items.
   * Accepts a single string or an array of strings.
   */
  readonly data?: string | readonly string[]
  /** Called with files that passed type (and optional size) checks. */
  readonly onFilesAccepted: (files: readonly File[]) => void
  /** Called when some dropped or selected files were not allowed. */
  readonly onFilesRejected?: (files: readonly File[]) => void
  /** Optional heading shown above the dropzone (e.g. section title). */
  readonly label?: string
  /**
   * Return upload progress 0–100 for a file to show the uploading row layout.
   * Omit or return `undefined` for a completed file; values below 100 show progress UI.
   */
  readonly getUploadProgress?: (file: File) => number | undefined
  readonly multiple?: boolean
  readonly disabled?: boolean
  /** Maximum number of files per selection or drop (default: unlimited). */
  readonly maxFiles?: number
  /** Maximum size per file in bytes (default: unlimited). */
  readonly maxBytesPerFile?: number
  /** When true, show inline preview for the last accepted selection (images, video, PDF). */
  readonly showPreview?: boolean
  /** Optional comma-separated string of allowed MIME types or extensions (e.g. ".png, .jpg"). */
  readonly accept?: string
  /** Optional list of allowed file extensions (e.g. [".png"]). */
  readonly allowedExtensions?: readonly string[]
  readonly className?: string
}

/**
 * Drag-and-drop and click-to-browse zone for images, videos, and PDF files only.
 */
export function FileUploadDropzone({
  data,
  onFilesAccepted,
  onFilesRejected,
  label,
  getUploadProgress,
  multiple = false,
  disabled = false,
  maxFiles,
  maxBytesPerFile,
  showPreview = true,
  accept,
  allowedExtensions,
  className
}: FileUploadDropzoneProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepthRef = useRef(0)
  const previewItemsRef = useRef<readonly PreviewItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [filePreviewItems, setFilePreviewItems] = useState<readonly PreviewItem[]>([])
  const [hiddenRemoteUrls, setHiddenRemoteUrls] = useState<ReadonlySet<string>>(() => new Set())
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null)
  const [previewZoom, setPreviewZoom] = useState(1)
  const [pendingRemoveUrl, setPendingRemoveUrl] = useState<string | null>(null)

  const remotePreviewItems = useMemo((): readonly PreviewItem[] => {
    if (!showPreview) {
      return []
    }
    const urls: readonly string[] =
      data === undefined ? [] : Array.isArray(data) ? data : data === '' ? [] : [data]
    return urls
      .filter((url) => !hiddenRemoteUrls.has(url))
      .map((url) => {
        const name = getFileNameFromUrl(url)
        return {
          url,
          name,
          kind: getKindFromUrl(url),
          source: 'url',
          isObjectUrl: false
        }
      })
  }, [data, hiddenRemoteUrls, showPreview])

  const previewItems = useMemo((): readonly PreviewItem[] => {
    if (!showPreview) {
      return []
    }
    const merged = multiple ? [...remotePreviewItems, ...filePreviewItems] : []
    const base = multiple
      ? merged
      : filePreviewItems.length > 0
        ? filePreviewItems
        : remotePreviewItems
    if (maxFiles !== undefined && base.length > maxFiles) {
      return base.slice(-maxFiles)
    }
    return base
  }, [filePreviewItems, maxFiles, multiple, remotePreviewItems, showPreview])

  const activePreviewItem =
    activePreviewUrl === null
      ? undefined
      : previewItems.find((entry) => entry.url === activePreviewUrl)

  const pendingRemoveItem =
    pendingRemoveUrl === null
      ? undefined
      : previewItems.find((entry) => entry.url === pendingRemoveUrl)

  useEffect(() => {
    previewItemsRef.current = previewItems
  }, [previewItems])

  useEffect(() => {
    return () => {
      previewItemsRef.current.forEach((item) => {
        if (item.isObjectUrl) {
          URL.revokeObjectURL(item.url)
        }
      })
    }
  }, [])

  const partitionFiles = useCallback(
    (fileList: FileList | File[]) => {
      const all = Array.from(fileList)
      const accepted: File[] = []
      const rejected: File[] = []
      for (const file of all) {
        if (!isFileAllowed(file, allowedExtensions)) {
          rejected.push(file)
          continue
        }
        if (maxBytesPerFile !== undefined && file.size > maxBytesPerFile) {
          rejected.push(file)
          continue
        }
        accepted.push(file)
      }
      let trimmed = accepted
      if (maxFiles !== undefined && accepted.length > maxFiles) {
        const overflow = accepted.slice(maxFiles)
        trimmed = accepted.slice(0, maxFiles)
        rejected.push(...overflow)
      }
      if (!multiple && trimmed.length > 1) {
        rejected.push(...trimmed.slice(1))
        trimmed = trimmed.slice(0, 1)
      }
      return { accepted: trimmed, rejected }
    },
    [maxBytesPerFile, maxFiles, multiple, allowedExtensions]
  )

  const mergePreviewItems = useCallback(
    (accepted: readonly File[]) => {
      if (!showPreview || accepted.length === 0) {
        return
      }
      if (!multiple) {
        setActivePreviewUrl(null)
        setPendingRemoveUrl(null)
      }
      setFilePreviewItems((previous) => {
        if (!multiple) {
          previous.forEach((item) => {
            if (item.isObjectUrl) {
              URL.revokeObjectURL(item.url)
            }
          })
          return accepted.map((file) => ({
            url: URL.createObjectURL(file),
            name: file.name,
            kind: getKindFromFile(file),
            source: 'file' as const,
            file,
            isObjectUrl: true
          }))
        }
        const appended = accepted.map((file) => ({
          url: URL.createObjectURL(file),
          name: file.name,
          kind: getKindFromFile(file),
          source: 'file' as const,
          file,
          isObjectUrl: true
        }))
        let next: PreviewItem[] = [...previous, ...appended]
        if (maxFiles !== undefined && next.length > maxFiles) {
          const dropped = next.slice(0, next.length - maxFiles)
          dropped.forEach((item) => {
            if (item.isObjectUrl) {
              URL.revokeObjectURL(item.url)
            }
          })
          next = next.slice(-maxFiles)
        }
        const urls = new Set(next.map((entry) => entry.url))
        queueMicrotask(() => {
          setActivePreviewUrl((current) =>
            current !== null && !urls.has(current) ? null : current
          )
          setPendingRemoveUrl((current) =>
            current !== null && !urls.has(current) ? null : current
          )
        })
        return next
      })
    },
    [maxFiles, multiple, showPreview]
  )

  const emitPartition = useCallback(
    (fileList: FileList | File[]) => {
      const { accepted, rejected } = partitionFiles(fileList)
      if (rejected.length > 0) {
        onFilesRejected?.(rejected)
      }
      if (accepted.length > 0) {
        mergePreviewItems(accepted)
        onFilesAccepted(accepted)
      }
    },
    [mergePreviewItems, onFilesAccepted, onFilesRejected, partitionFiles]
  )

  const removePreviewByUrl = useCallback((url: string) => {
    const item = previewItemsRef.current.find((entry) => entry.url === url)
    if (item?.source === 'url') {
      setHiddenRemoteUrls((previous) => {
        const next = new Set(previous)
        next.add(url)
        return next
      })
    }
    if (item?.source === 'file') {
      setFilePreviewItems((previous) => {
        const found = previous.find((entry) => entry.url === url)
        if (found?.isObjectUrl) {
          URL.revokeObjectURL(found.url)
        }
        return previous.filter((entry) => entry.url !== url)
      })
    }
    setActivePreviewUrl((current) => (current === url ? null : current))
  }, [])

  const handleConfirmRemove = useCallback(() => {
    if (pendingRemoveUrl === null) {
      return
    }
    removePreviewByUrl(pendingRemoveUrl)
    setPendingRemoveUrl(null)
  }, [pendingRemoveUrl, removePreviewByUrl])

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target
      if (files && files.length > 0) {
        emitPartition(files)
      }
      event.target.value = ''
    },
    [emitPartition]
  )

  const handleDragEnter = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (disabled) {
        return
      }
      dragDepthRef.current += 1
      setIsDragging(true)
    },
    [disabled]
  )

  const handleDragLeave = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (disabled) {
        return
      }
      dragDepthRef.current -= 1
      if (dragDepthRef.current <= 0) {
        dragDepthRef.current = 0
        setIsDragging(false)
      }
    },
    [disabled]
  )

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
      dragDepthRef.current = 0
      setIsDragging(false)
      if (disabled) {
        return
      }
      const { files } = event.dataTransfer
      if (files && files.length > 0) {
        emitPartition(files)
      }
    },
    [disabled, emitPartition]
  )

  const openFileDialog = useCallback(() => {
    if (disabled) {
      return
    }
    inputRef.current?.click()
  }, [disabled])

  const openPreviewForUrl = useCallback((url: string) => {
    setPreviewZoom(1)
    setActivePreviewUrl(url)
  }, [])

  return (
    <div
      data-slot="file-upload-dropzone"
      className={cn('w-full space-y-3', className)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept ?? DEFAULT_FILE_INPUT_ACCEPT}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={handleInputChange}
        aria-label={COPY.uploadInputAria}
      />
      {label !== undefined && label !== '' ? (
        <p className="font-semibold text-foreground text-sm">{label}</p>
      ) : null}
      <div
        role="presentation"
        onClick={() => {
          if (!disabled) {
            openFileDialog()
          }
        }}
        className={cn(
          'flex min-h-36 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors',
          !disabled && 'cursor-pointer',
          disabled
            ? 'cursor-not-allowed border-muted-foreground/25 bg-muted/30 text-muted-foreground'
            : isDragging
              ? 'border-primary bg-primary/5 text-foreground'
              : 'border-muted-foreground/40 bg-muted/20 hover:border-muted-foreground/60 hover:bg-muted/30'
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-lg bg-muted">
          <Upload className="size-7 text-muted-foreground" aria-hidden />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground text-sm">{COPY.dragDropTitle}</p>
          <p className="text-muted-foreground text-xs">
            {buildSecondaryHint(maxBytesPerFile, allowedExtensions)}
            {multiple ? COPY.multipleFiles : COPY.singleFile}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="default"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation()
            openFileDialog()
          }}
        >
          {COPY.browseFiles}
        </Button>
      </div>
      {showPreview && previewItems.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-3 p-0" role="list">
          {previewItems.map((item) => {
            const uploadProgress = item.file ? getUploadProgress?.(item.file) : undefined
            const isUploading = uploadProgress !== undefined && uploadProgress < 100
            const progressPercent = isUploading
              ? Math.min(100, Math.max(0, Math.round(uploadProgress)))
              : 0
            return (
              <li
                key={item.url}
                className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="flex items-center gap-3 p-3">
                  <div
                    role={isUploading || disabled ? undefined : 'button'}
                    tabIndex={isUploading || disabled ? undefined : 0}
                    aria-label={isUploading || disabled ? undefined : COPY.openPreview(item.name)}
                    className={cn(
                      'flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-start outline-none',
                      !isUploading &&
                        !disabled &&
                        'rounded-md hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      (isUploading || disabled) && 'cursor-default'
                    )}
                    onClick={() => {
                      if (!disabled && !isUploading) {
                        openPreviewForUrl(item.url)
                      }
                    }}
                    onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                      if (disabled || isUploading) {
                        return
                      }
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openPreviewForUrl(item.url)
                      }
                    }}
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.kind === 'image' ? (
                        <img
                          src={item.url}
                          alt={COPY.previewAlt(item.name)}
                          className="size-full object-cover"
                        />
                      ) : null}
                      {item.kind === 'video' ? (
                        <video
                          src={item.url}
                          className="size-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : null}
                      {item.kind !== 'image' && item.kind !== 'video' ? (
                        <div className="flex size-full items-center justify-center">
                          <FileText className="size-6 text-muted-foreground" aria-hidden />
                        </div>
                      ) : null}
                      <span className="absolute right-0 bottom-0 left-0 truncate bg-background/90 px-0.5 py-px text-center text-[0.625rem] font-medium text-muted-foreground leading-none backdrop-blur-sm">
                        {getExtensionBadgeLabelFromItem(item)}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="truncate font-semibold text-foreground text-sm">{item.name}</p>
                      {isUploading ? (
                        <p className="text-muted-foreground text-xs">
                          {COPY.uploading(progressPercent)}
                        </p>
                      ) : (
                        <p className="text-muted-foreground text-xs">
                          {item.file ? formatFileSize(item.file.size) : '-'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    {!isUploading ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={disabled}
                        aria-label={COPY.downloadAria(item.name)}
                        onClick={() => {
                          if (item.file) {
                            triggerObjectUrlDownload(item.file, item.url)
                            return
                          }
                          triggerUrlDownload(item.url, item.name)
                        }}
                      >
                        <Download aria-hidden />
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      disabled={disabled}
                      aria-label={COPY.removeAria(item.name)}
                      onClick={() => {
                        setPendingRemoveUrl(item.url)
                      }}
                    >
                      <Trash2 aria-hidden />
                    </Button>
                  </div>
                </div>
                {isUploading ? (
                  <div
                    className="h-1 w-full bg-muted"
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full bg-primary transition-[width] duration-150"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : null}
      <Dialog
        open={activePreviewItem !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setActivePreviewUrl(null)
          }
        }}
      >
        {activePreviewItem !== undefined ? (
          <FormDialogContent className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[calc(100%-1.5rem)] flex-col gap-3 overflow-hidden sm:max-w-5xl">
            <DialogHeader className="shrink-0 space-y-1 pr-10 text-left">
              <DialogTitle className="line-clamp-2 sm:line-clamp-1">
                {activePreviewItem.name}
              </DialogTitle>
              <DialogDescription>
                {activePreviewItem.file ? formatFileSize(activePreviewItem.file.size) : '-'}
                <span aria-hidden> · </span>
                {getKindLabelFromPreviewItem(activePreviewItem)}
              </DialogDescription>
            </DialogHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-2">
              {/* {activePreviewItem.kind === 'image' ? (
                <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 sm:justify-between">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={previewZoom <= PREVIEW_ZOOM_MIN}
                      onClick={() => {
                        setPreviewZoom((current) => clampPreviewZoom(current - PREVIEW_ZOOM_STEP))
                      }}
                    >
                      <ZoomOut aria-hidden className="size-4" />
                      {COPY.zoomOut}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={previewZoom >= PREVIEW_ZOOM_MAX}
                      onClick={() => {
                        setPreviewZoom((current) => clampPreviewZoom(current + PREVIEW_ZOOM_STEP))
                      }}
                    >
                      <ZoomIn aria-hidden className="size-4" />
                      {COPY.zoomIn}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={Math.abs(previewZoom - 1) < PREVIEW_ZOOM_STEP / 4}
                      onClick={() => {
                        setPreviewZoom(1)
                      }}
                    >
                      <RotateCcw aria-hidden className="size-4" />
                      {COPY.resetZoom}
                    </Button>
                  </div>
                  <p className="max-w-[16rem] text-right text-muted-foreground text-xs leading-snug sm:max-w-xs">
                    {COPY.previewImageControlsHint}
                    <span className="mt-0.5 block tabular-nums">
                      {Math.round(previewZoom * 100)}%
                    </span>
                  </p>
                </div>
              ) : null} */}
              <div
                className={cn(
                  'min-h-0 w-full flex-1 overflow-auto rounded-lg border border-border bg-muted/30',
                  activePreviewItem.kind === 'image'
                    ? 'max-h-[min(78dvh,820px)] min-h-48 touch-pan-y'
                    : 'max-h-[min(78dvh,820px)] min-h-48'
                )}
              >
                {activePreviewItem.kind === 'image' ? (
                  <div className="inline-block min-w-full p-3 sm:p-4">
                    <div className="flex justify-center">
                      <img
                        src={activePreviewItem.url}
                        alt={COPY.previewAlt(activePreviewItem.name)}
                        className="h-auto max-h-[min(72dvh,760px)] object-contain transition-[width] duration-200 ease-out"
                        style={{
                          width: `${previewZoom * 100}%`,
                          maxWidth: previewZoom <= 1 ? '100%' : undefined
                        }}
                        decoding="async"
                      />
                    </div>
                  </div>
                ) : null}
                {activePreviewItem.kind === 'video' ? (
                  <div className="flex min-h-[min(40dvh,320px)] items-center justify-center p-2 sm:p-3">
                    <video
                      src={activePreviewItem.url}
                      controls
                      playsInline
                      className="max-h-[min(72dvh,720px)] w-full max-w-full rounded-md bg-black object-contain"
                      preload="metadata"
                    />
                  </div>
                ) : null}
                {activePreviewItem.kind === 'pdf' ? (
                  <iframe
                    src={activePreviewItem.url}
                    title={COPY.previewIframeTitle(activePreviewItem.name)}
                    className="h-[min(72dvh,720px)] min-h-[min(50dvh,420px)] w-full rounded-md border-0 bg-background"
                  />
                ) : null}
                {activePreviewItem.kind !== 'image' &&
                activePreviewItem.kind !== 'video' &&
                activePreviewItem.kind !== 'pdf' ? (
                  <p className="p-8 text-center text-muted-foreground text-sm leading-relaxed">
                    {COPY.previewUnavailable}
                  </p>
                ) : null}
              </div>
            </div>
            <DialogFooter className="mx-0 mb-0 shrink-0 gap-3 border-0 bg-transparent p-0 pt-1 sm:flex-row sm:justify-between">
              <p className="text-muted-foreground text-xs leading-relaxed sm:min-w-0 sm:flex-1">
                {COPY.previewCloseHint}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (activePreviewItem.file) {
                    triggerObjectUrlDownload(activePreviewItem.file, activePreviewItem.url)
                    return
                  }
                  triggerUrlDownload(activePreviewItem.url, activePreviewItem.name)
                }}
              >
                <Download aria-hidden className="size-4" />
                {COPY.download}
              </Button>
            </DialogFooter>
          </FormDialogContent>
        ) : null}
      </Dialog>
      <AlertDialog
        open={pendingRemoveUrl !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRemoveUrl(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{COPY.removeConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRemoveItem !== undefined
                ? COPY.removeConfirmDescription(pendingRemoveItem.name)
                : COPY.removeConfirmFallback}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{COPY.cancel}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmRemove}>
              {COPY.remove}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
