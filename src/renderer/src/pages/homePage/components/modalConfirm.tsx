import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { Separator } from '@renderer/components/ui/separator'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { CheckCircle2, X, XCircle } from 'lucide-react'
import { IPayloadWSChecking } from '@renderer/interface/gate.interface'
import { useConfigStore } from '@renderer/store/configProvider'

interface ModalConfirmProps {
  openDialog: boolean
  setOpenDialog: (open: boolean) => void
  handleActionConfirm: (type: 'APPROVE' | 'REJECT', data: IPayloadWSChecking) => void
  data?: IPayloadWSChecking
  loading?: boolean
}

export const ModalConfirm: React.FC<ModalConfirmProps> = ({
  openDialog,
  setOpenDialog,
  data,
  handleActionConfirm,
  loading = false
}) => {
  const { assetsPathConfig } = useConfigStore()

  const defaultImage = `${assetsPathConfig}\\images\\no_img.jpg`

  const pictureIn = data && (data?.ticket?.picture_in?.image_url || data?.image || defaultImage)
  const pictureOut = data && (data?.ticket?.picture_out?.image_url || defaultImage)
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="min-w-full h-[95vh] p-0 rounded-2xl shadow-2xl">
        {data && (
          <>
            <Button
              onClick={() => setOpenDialog(false)}
              className="
            absolute top-2 right-2 z-99 
            bg-slate-700 hover:bg-slate-800 
            text-white 
            w-10 h-10 
            rounded-lg
            flex items-center justify-center 
            shadow-lg hover:shadow-xl 
            transition-all duration-200 
            hover:scale-105
          "
            >
              <X className="w-6 h-6" />
            </Button>

            <DialogHeader className="h-[60px] px-8 bg-blue-500 rounded-t-xl flex justify-center">
              <DialogTitle className="font-[15px] font-bold text-white flex items-center gap-3">
                Verifikasi Kendaraan Keluar
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleActionConfirm('REJECT', data)}
                    disabled={loading || !data}
                    size="lg"
                    className="h-10 w-60 bg-red-600 hover:bg-red-700 text-white font-semibold font-[22px] rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 mr-2" />
                        Tolak
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleActionConfirm('APPROVE', data)}
                    disabled={loading || !data}
                    size="lg"
                    className="h-10 w-100 bg-green-600 hover:bg-green-700 text-white font-semibold font-[22px] rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-6 h-6 mr-2" />
                        Setujui
                      </>
                    )}
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-[calc(95vh-80px)]">
              <div className="p space-y-8">
                {/* Status info jika tidak ada data */}
                {/* {!wsData && (
              <div className="mx-8 mt-4 p-4 bg-blue-100 border border-blue-400 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Info:</strong> Menunggu data dari sistem gatekeeper...
                </p>
              </div>
            )} */}

                <div className="grid grid-cols-2 gap-5 mb-1">
                  {/* Foto Masuk */}
                  <div className="relative aspect-video ps-3">
                    <img
                      src={pictureIn}
                      alt="Foto Masuk Kendaraan"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Foto Keluar */}
                  <div className="relative aspect-video pe-3">
                    <img
                      src={pictureOut}
                      alt="Foto Keluar Kendaraan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {/* Visitor info below photos */}
                  <div className="rounded-xl">
                    <div className="px-6 pt-3 space-y-6">
                      <div className="grid grid-cols-2 my-3 mb-4 gap-6">
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Nama Lengkap</p>
                          <p className="text-black font-bold">
                            {data?.ticket && data?.ticket.full_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Nomor Kendaraan</p>
                          <p className="text-black font-bold font-mono bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                            {data?.ticket && data?.ticket.vehicle_plate}
                          </p>
                        </div>
                      </div>

                      <Separator className="bg-slate-200" />

                      <div className="grid grid-cols-2 my-3 mb-4 gap-6">
                        <div>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            Tanggal
                          </p>
                          <p className="text-black font-bold">belum</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Keperluan</p>
                          <p className="text-black font-bold">belum</p>
                        </div>
                      </div>

                      <Separator className="bg-slate-200" />

                      <div className="grid grid-cols-2 my-3 mb-4 gap-6">
                        <div>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            Waktu Masuk
                          </p>
                          <p className="font-bold text-green-600">belum</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            Waktu Keluar
                          </p>
                          <p className="font-bold text-orange-600">belum</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-200 my-6" />
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
