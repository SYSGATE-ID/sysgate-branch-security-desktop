import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { Separator } from '@renderer/components/ui/separator'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react'

interface ModalConfirmProps {
  isOpenModalConfirm: boolean
  setIsOpenModalConfirm: (open: boolean) => void
  handleReject: (id: string) => void
  handleApprove: (id: string) => void
}

export const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isOpenModalConfirm,
  setIsOpenModalConfirm,
  handleReject,
  handleApprove
}) => {
  const visitorData = {
    photoIn: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    photoOut: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    name: 'Ahmad Rizki',
    plateNumber: 'B 1234 XYZ',
    entryTime: '08:30 WIB',
    exitTime: '17:45 WIB',
    entryDate: '13 November 2025',
    purpose: 'Kunjungan Bisnis'
  }

  return (
    <Dialog open={isOpenModalConfirm} onOpenChange={setIsOpenModalConfirm}>
      <DialogContent className="min-w-full h-[95vh] p-0 rounded-2xl shadow-2xl">
        <DialogHeader className="h-[60px] px-8 bg-blue-500 rounded-t-xl flex justify-center">
          <DialogTitle className="font-[15px] font-bold text-white flex items-center gap-3">
            Verifikasi Kendaraan Keluar
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleReject('1')}
                size="lg"
                className="h-10 bg-red-600 hover:bg-red-700 text-white font-semibold font-[22px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <XCircle className="w-6 h-6 mr-2" />
                Tolak
              </Button>
              <Button
                onClick={() => handleApprove('1')}
                size="lg"
                className="h-10 bg-green-600 hover:bg-green-700 text-white font-semibold font-[22px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <CheckCircle2 className="w-6 h-6 mr-2" />
                Setujui
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-80px)]">
          <div className="p pb-8 space-y-8">
            {/* Photos side-by-side on top */}
            <div className="grid grid-cols-2 gap-5 mb-1">
              {/* Foto Masuk */}
              <div className="relative aspect-video bg-slate-100 ps-3">
                <img
                  src={visitorData.photoIn}
                  alt="Foto Masuk Kendaraan"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Foto Keluar */}
              <div className="relative aspect-video bg-slate-100 pe-3">
                <img
                  src={visitorData.photoOut}
                  alt="Foto Keluar Kendaraan"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="p-5 pt-0">
              {/* Visitor info below photos */}
              <div className="rounded-xl">
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Nama Lengkap</p>
                      <p className="text-base font-semibold text-slate-800">{visitorData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Nomor Kendaraan</p>
                      <p className="text-base font-semibold text-slate-800 font-mono bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                        {visitorData.plateNumber}
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-slate-200" />

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Tanggal
                      </p>
                      <p className="text-base text-slate-700">{visitorData.entryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Keperluan</p>
                      <p className="text-base text-slate-700">{visitorData.purpose}</p>
                    </div>
                  </div>

                  <Separator className="bg-slate-200" />

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Waktu Masuk
                      </p>
                      <p className="text-base font-semibold text-green-600">
                        {visitorData.entryTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Waktu Keluar
                      </p>
                      <p className="text-base font-semibold text-orange-600">
                        {visitorData.exitTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200 my-6" />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
