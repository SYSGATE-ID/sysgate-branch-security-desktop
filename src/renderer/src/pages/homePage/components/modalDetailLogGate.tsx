import React from 'react'
import { Dialog, DialogContent } from '@renderer/components/ui/dialog'
import { ILogGate } from '@renderer/interface/gate.interface'
import { convertStatusLogGate, formatDateTime, getNoPlatLogGate } from '@renderer/utils/myFunctions'
import { Button } from '@renderer/components/ui/button'
import { Badge } from '@renderer/components/ui/badge'
import { ChevronRight, Ticket, User } from 'lucide-react'
import { ImageDefault } from '@renderer/components/core/imageDefault'

interface ModalProps {
  data: ILogGate | null
  loading: { actionPermission: boolean }
  openDialog: boolean
  setOpenDialog: (val: boolean) => void
}

export const ModalDetailLogGate: React.FC<ModalProps> = ({ openDialog, setOpenDialog, data }) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="min-w-[900px] rounded-2xl p-0 overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-slate-100 transition-colors">
        {data ? (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {data.tariff && data.tariff.code} - {getNoPlatLogGate(data)}
                </h2>
                <div className="text-blue-100 fw-medium text-sm flex items-center gap-4">
                  {formatDateTime(data.created_at.toString()) || ''}
                  <ChevronRight size={12} />
                  <span className="flex items-center gap-2">
                    {data.access_type === 'MEMBER' ? (
                      <>
                        <User className="h-4 w-4 text-white" />
                        <span className="text-sm">{data.access_type}</span>
                      </>
                    ) : data.access_type === 'TICKET' ? (
                      <>
                        <Ticket className="h-4 w-4 text-white" />
                        <span className="text-sm">{data.access_type}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Unknown</span>
                    )}
                  </span>
                  <ChevronRight size={12} />
                  <Badge className={`${convertStatusLogGate[data.action].className}`}>
                    {convertStatusLogGate[data.action].label}
                  </Badge>
                </div>
              </div>
            </div>
            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4 pt-0 dark:bg-neutral-900">
              <div className="mb-5">
                <h1 className="text-[16px] text-sm font-semibold mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                  Keterangan
                </h1>
                <p>{data.description}</p>
              </div>
              <h1 className="mb-4 text-[16px] text-sm font-semibold mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                Foto Masuk
              </h1>
              <ImageDefault width="100%" height="300px" url={data.picture.image_url} />
            </div>
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
