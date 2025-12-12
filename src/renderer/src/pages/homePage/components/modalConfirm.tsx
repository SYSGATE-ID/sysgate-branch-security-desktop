import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { Separator } from '@renderer/components/ui/separator'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { CheckCircle2, X, XCircle } from 'lucide-react'
import { IPayloadWSChecking } from '@renderer/interface/gate.interface'
import { Badge } from '@renderer/components/ui/badge'
import { ImageDefault } from '@renderer/components/core/imageDefault'
import {
  getLogGateName,
  getLogGateNoPlat,
  getLogGatePictureIn,
  getLogGatePictureOut,
  getLogGateTimeIn,
  getLogGateTimeOut,
  getLogGateTipe
} from '@renderer/utils/myFunctions'

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
  const pictureForCheck = data && data.image
  const pictureIn = data && getLogGatePictureIn(data)
  const pictureOut = data && getLogGatePictureOut(data)
  const timeIn = data && getLogGateTimeIn(data)
  const timeOut = data && getLogGateTimeOut(data)
  const nama = data && getLogGateName(data)
  const noPlat = data && getLogGateNoPlat(data)
  const tipe = data && getLogGateTipe(data)

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
                    <Badge
                      className="absolute ms-2 mt-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                      variant="default"
                    >
                      MASUK
                    </Badge>
                    <ImageDefault
                      url={pictureIn}
                      alt="Foto Masuk Kendaraan"
                      className={`w-full h-full object-cover ${pictureIn === pictureForCheck && 'border-3 border-red-500'}`}
                    />
                  </div>

                  {/* Foto Keluar */}
                  <div className="relative aspect-video pe-3">
                    <Badge
                      className="absolute ms-2 mt-2 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"
                      variant="default"
                    >
                      KELUAR
                    </Badge>
                    <ImageDefault
                      url={pictureOut}
                      alt="Foto Keluar Kendaraan"
                      className={`w-full h-full object-cover ${pictureOut === pictureForCheck && 'border-3 border-red-500'}`}
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
                          <p className="text-black font-bold">{nama}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">No. Plat Terdaftar</p>
                          <p className="text-black font-bold text-green-500">{noPlat || ''}</p>
                        </div>
                      </div>

                      <Separator className="bg-slate-200" />

                      <div className="grid grid-cols-2 my-3 mb-4 gap-6">
                        <div>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            Tipe
                          </p>
                          <p className="text-black font-bold flex">{tipe}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">No. Plat Terdeteksi</p>
                          <p className="text-black font-bold text-red-500">
                            {data.detected_plate || ''}
                          </p>
                        </div>
                      </div>

                      <Separator className="bg-slate-200" />

                      <div className="grid grid-cols-2 my-3 mb-4 gap-6">
                        <div>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            Waktu Masuk
                          </p>
                          <p className="font-bold text-green-600">{timeIn}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            Waktu Keluar
                          </p>
                          <p className="font-bold text-red-600">{timeOut}</p>
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
