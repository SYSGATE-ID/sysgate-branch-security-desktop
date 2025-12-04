// @renderer/utils/queue.ts
export interface QueueItem {
  id: string
  data: any
  timestamp: number
  status: 'pending' | 'processing' | 'completed'
}

export class DataQueue {
  private queue: QueueItem[] = []
  private isProcessing = false
  private currentItem: QueueItem | null = null

  // Generate unique ID untuk setiap item
  private generateId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Tambah data ke antrian
  enqueue(data: any): string {
    const id = this.generateId()
    const item: QueueItem = {
      id,
      data,
      timestamp: Date.now(),
      status: 'pending'
    }

    this.queue.push(item)
    this.processQueue()

    return id
  }

  // Hapus item dari antrian
  dequeue(id: string): void {
    this.queue = this.queue.filter((item) => item.id !== id)
    this.currentItem = null
    this.isProcessing = false
    this.processQueue()
  }

  // Ambil item saat ini
  getCurrentItem(): QueueItem | null {
    return this.currentItem
  }

  // Ambil semua item dalam antrian
  getQueue(): QueueItem[] {
    return [...this.queue]
  }

  // Cek apakah ada item dalam antrian
  hasItems(): boolean {
    return this.queue.length > 0
  }

  // Proses antrian
  private processQueue(): void {
    if (this.isProcessing || this.queue.length === 0) {
      return
    }

    const nextItem = this.queue.find((item) => item.status === 'pending')
    if (!nextItem) {
      return
    }

    this.isProcessing = true
    this.currentItem = nextItem
    nextItem.status = 'processing'

    // Trigger callback atau event untuk memproses item
    this.onProcessStart(nextItem)
  }

  // Selesaikan item saat ini
  completeCurrentItem(): void {
    if (this.currentItem) {
      this.dequeue(this.currentItem.id)
    }
  }

  // Lewati item saat ini (skip)
  skipCurrentItem(): void {
    if (this.currentItem) {
      this.dequeue(this.currentItem.id)
      // Optional: bisa tambahkan ke history skipped items
    }
  }

  // Callback ketika item mulai diproses
  onProcessStart: (item: QueueItem) => void = () => {}

  // Clean up antrian
  clear(): void {
    this.queue = []
    this.currentItem = null
    this.isProcessing = false
  }
}
