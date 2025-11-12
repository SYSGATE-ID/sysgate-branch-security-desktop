import React, { useState } from 'react'
import { Dialog, DialogContent } from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { Textarea } from '@renderer/components/ui/textarea'
import { convertStatusVisitor, formatDate, formatDateTime } from '@utils/myFunctions'
import type { IVisitor } from '@interface/visitor.interface'
import { QRCode } from '@renderer/components/ui/shadcn-io/qr-code'
import { Mail, Phone } from 'lucide-react'

interface ModalProps {
  selectedData: IVisitor | null
  loading: { actionPermission: boolean }
  openDialog: boolean
  setOpenDialog: (val: boolean) => void
  onApprove?: (id: string, reason: string) => void
  onReject?: (id: string, reason: string) => void
  handleReSendTicket: (data: IVisitor, tipe: string) => void
}

export const ModalDetail: React.FC<ModalProps> = ({
  selectedData,
  loading,
  openDialog,
  setOpenDialog,
  onApprove,
  onReject,
  handleReSendTicket
}) => {
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [reason, setReason] = useState('')

  const handleApprove = (): void => {
    if (selectedData && onApprove) onApprove(selectedData.code, '')
  }

  const handleReject = (): void => {
    if (selectedData && onReject && reason.trim() !== '') {
      onReject(selectedData.code, reason)
      setReason('')
      setShowRejectReason(false)
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-3xl rounded-2xl p-0 overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-slate-100 transition-colors">
        {selectedData ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedData.full_name}</h2>
                <p className="text-blue-100 fw-medium text-sm">
                  {formatDateTime(selectedData.reservation_at) || ''}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4 pt-0 dark:bg-neutral-900">
              {!showRejectReason && selectedData.status === 'PENDING' && (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="bg-red-500 h-10 w-30 hover:bg-red-600 text-white"
                    onClick={() => setShowRejectReason(true)}
                    disabled={loading.actionPermission}
                  >
                    {loading.actionPermission ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      'Tolak'
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-green-500 h-10 w-80 hover:bg-green-600 text-white"
                    onClick={handleApprove}
                    disabled={loading.actionPermission}
                  >
                    {loading.actionPermission ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      'Setujui'
                    )}
                  </Button>
                </div>
              )}
              {showRejectReason && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
                    Alasan Penolakan
                  </h4>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tuliskan alasan penolakan di sini..."
                    className="min-h-[80px] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectReason(false)
                        setReason('')
                      }}
                    >
                      Batal
                    </Button>
                    <Button variant="destructive" disabled={!reason.trim()} onClick={handleReject}>
                      {loading.actionPermission ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        'Kirim Penolakan'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* QR Code */}
              {(selectedData.status === 'ACTIVE' || selectedData.status === 'USED') && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    Barcode Akses
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <QRCode data={selectedData.code} className="h-[200px]" />
                  </div>
                </div>
              )}

              {(selectedData.status === 'ACTIVE' || selectedData.status === 'USED') && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    Kirim Tiket Ulang
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-start gap-3 pt-2">
                      <Button
                        variant="secondary"
                        className="bg-green-500 hover:bg-green-600 text-white w-full md:w-auto"
                        onClick={() => handleReSendTicket(selectedData, 'whatsapp')}
                      >
                        <Phone />
                        Kirim via WhatsApp
                      </Button>

                      <Button
                        variant="secondary"
                        className="bg-blue-500 hover:bg-blue-600 text-white w-full md:w-auto"
                        onClick={() => handleReSendTicket(selectedData, 'gmail')}
                      >
                        <Mail />
                        Kirim via Gmail
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Informasi Pengunjung */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                  Informasi Pengunjung
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                  <div className="md:col-span-12">
                    <span className="text-slate-500 dark:text-slate-400">Jadwal Kedatangan:</span>
                    <p className="font-medium">
                      {formatDateTime(selectedData.reservation_at) || '-'}
                    </p>
                  </div>

                  <div className="md:col-span-12 h-px bg-slate-200 dark:bg-slate-700" />

                  <div className="md:col-span-6">
                    <span className="text-slate-500 dark:text-slate-400">Nama:</span>
                    <p className="font-medium">{selectedData.full_name || '-'}</p>
                  </div>
                  <div className="md:col-span-6">
                    <span className="text-slate-500 dark:text-slate-400">Email:</span>
                    <p className="font-medium">{selectedData.email || '-'}</p>
                  </div>

                  <div className="md:col-span-12 h-px bg-slate-200 dark:bg-slate-700" />

                  <div className="md:col-span-6">
                    <span className="text-slate-500 dark:text-slate-400">Nomor Telepon:</span>
                    <p className="font-medium">{selectedData.phone || '-'}</p>
                  </div>
                  <div className="md:col-span-6">
                    <span className="text-slate-500 dark:text-slate-400">Plat Kendaraan:</span>
                    <p className="font-medium">{selectedData.vehicle_plate || '-'}</p>
                  </div>

                  <div className="md:col-span-12 h-px bg-slate-200 dark:bg-slate-700" />

                  <div className="md:col-span-6">
                    <span className="text-slate-500 dark:text-slate-400">Jumlah Penumpang:</span>
                    <p className="font-medium">{selectedData.occupants}</p>
                  </div>
                  <div className="md:col-span-6">
                    <span className="text-slate-500 dark:text-slate-400">Status:</span>
                    <div>{convertStatusVisitor(selectedData.status)}</div>
                  </div>

                  {selectedData.judge_reason && (
                    <>
                      <div className="md:col-span-12 h-px bg-slate-200 dark:bg-slate-700" />
                      <div className="md:col-span-6">
                        <span className="text-slate-500 dark:text-slate-400">Alasan:</span>
                        <div>{selectedData.judge_reason}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Informasi Kendaraan */}
              {selectedData.tariff && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    Informasi Kendaraan
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                    <div className="md:col-span-6">
                      <span className="text-slate-500 dark:text-slate-400">Nama Tarif:</span>
                      <p className="font-medium">{selectedData.tariff.name}</p>
                    </div>
                    <div className="md:col-span-6">
                      <span className="text-slate-500 dark:text-slate-400">Kode:</span>
                      <p className="font-medium">{selectedData.tariff.code}</p>
                    </div>
                    <div className="md:col-span-12 h-px bg-slate-200 dark:bg-slate-700" />
                    <div className="md:col-span-6">
                      <span className="text-slate-500 dark:text-slate-400">Deskripsi:</span>
                      <p className="font-medium">{selectedData.tariff.description || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dokumen */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                  Dokumen
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  {selectedData.pictures.length > 0 ? (
                    selectedData.pictures.map((item, index) => (
                      <img
                        key={index}
                        src={item.image_url}
                        alt=""
                        className="my-4 rounded-md border border-slate-200 dark:border-slate-700"
                      />
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">-</p>
                  )}
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                  Deskripsi
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-sm leading-relaxed">{selectedData.description || '-'}</p>
                </div>
              </div>

              {/* Informasi Sistem */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                  Informasi Sistem
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-sm space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-slate-500 dark:text-slate-400 min-w-[120px]">
                      Dibuat pada
                    </span>
                    <span className="font-medium">{formatDate(selectedData.created_at)}</span>
                  </div>

                  <div className="h-px bg-slate-200 dark:bg-slate-700" />

                  <div className="flex items-start gap-3">
                    <span className="text-slate-500 dark:text-slate-400 min-w-[120px]">
                      Terakhir diubah
                    </span>
                    <span className="font-medium">{formatDate(selectedData.updated_at)}</span>
                  </div>

                  {selectedData.judge_by && (
                    <>
                      <div className="h-px bg-slate-200 dark:bg-slate-700" />
                      <div className="flex items-start gap-3">
                        <span className="text-slate-500 dark:text-slate-400 min-w-[120px]">
                          Diubah oleh
                        </span>
                        <span className="font-medium">{selectedData.judge_by}</span>
                      </div>
                    </>
                  )}

                  {selectedData.deleted_at && (
                    <>
                      <div className="h-px bg-slate-200 dark:bg-slate-700" />
                      <div className="flex items-start gap-3">
                        <span className="text-slate-500 dark:text-slate-400 min-w-[120px]">
                          Dihapus pada
                        </span>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {formatDate(selectedData.deleted_at)}
                        </span>
                      </div>
                    </>
                  )}

                  {selectedData.delete_by && (
                    <>
                      <div className="h-px bg-slate-200 dark:bg-slate-700" />
                      <div className="flex items-start gap-3">
                        <span className="text-slate-500 dark:text-slate-400 min-w-[120px]">
                          Dihapus oleh
                        </span>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {selectedData.delete_by}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-end">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Tutup
              </Button>
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400 italic">
            Tidak ada data pengunjung.
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
