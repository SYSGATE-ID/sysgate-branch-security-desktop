import React from 'react'
import { Dialog, DialogContent } from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { convertStatusVisitor, formatDate, formatDateTime } from '@utils/myFunctions'
import type { IVisitor } from '@interface/visitor.interface'
import { QRCode } from '@renderer/components/ui/shadcn-io/qr-code'

interface ModalProps {
  selectedData: IVisitor | null
  loading: { actionPermission: boolean }
  openDialog: boolean
  setOpenDialog: (val: boolean) => void
}

export const ModalDetailVisitor: React.FC<ModalProps> = ({
  selectedData,
  openDialog,
  setOpenDialog
}) => {
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
                  {selectedData.pictures && selectedData.pictures.length > 0 ? (
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
