import { ImageDefault } from '@renderer/components/core/imageDefault'
import { MyContainer } from '@renderer/components/core/MyContainer'
import { TableComponent } from '@renderer/components/core/tableData'
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '@renderer/components/ui/item'
import {
  convertStatusLogGate,
  formatDateTime,
  getValueAppConfig
} from '@renderer/utils/myFunctions'
import { RefreshCcw, Ticket, User } from 'lucide-react'
import React from 'react'
import { ModalDetailVisitor } from './modalDetailVisitor'
import { ModalDetailLogGate } from './modalDetailLogGate'
import { ModalConfirm } from './modalConfirm'
import { useIndex } from '../hook/useIndex'

export const DashboardParking: React.FC = () => {
  const {
    columns,
    data,
    table,
    totalRows,
    selectedData,
    loading,
    openDialog,
    closeDialogHandler,
    // statistic,
    // stats,
    handleGetDetailLogGate,
    logGates,
    selectedlogGate,
    handleActionConfirm,
    dataFromWS,
    fetchLogGate,
    connectWebSocket
  } = useIndex()

  return (
    <>
      <div className="flex gap-5 h-[89vh]">
        {/* LEFT SIDEBAR - Activity Log */}
        <div className="w-[380px] flex-shrink-0">
          <MyContainer className="rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-between">
              <h2 className="text-base font-bold text-blue-900 dark:text-white">
                Log Keluar/Masuk Gate
              </h2>
              <Button
                onClick={() => fetchLogGate()}
                variant="outline"
                size="icon"
                className="h-7 w-7 ml-2"
              >
                <RefreshCcw />
              </Button>
            </div>

            {/* Activity List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {!loading.fetchLogGate ? (
                  logGates.length > 0 ? (
                    logGates.map((item, index) => (
                      <Item
                        key={index}
                        onClick={() => handleGetDetailLogGate(item)}
                        variant="outline"
                        asChild
                        role="listitem"
                      >
                        <a href="#">
                          <ItemMedia variant="image">
                            <ImageDefault url={item.picture && item.picture.image_url} />
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle className="line-clamp-1">
                              <span className="text-muted-foreground">
                                {item.tariff && item.tariff.code}{' '}
                                {(item.vehicle_plat && '-' + item.vehicle_plat) || ''}
                              </span>
                            </ItemTitle>
                            <ItemDescription>
                              <div className="flex items-center gap-2">
                                {item.access_type === 'MEMBER' ? (
                                  <>
                                    <User className="h-4 w-4" />
                                    <span className="text-sm">{item.access_type}</span>
                                  </>
                                ) : item.access_type === 'TICKET' ? (
                                  <>
                                    <Ticket className="h-4 w-4" />
                                    <span className="text-sm">{item.access_type}</span>
                                  </>
                                ) : (
                                  <span className="text-sm text-gray-500">Unknown</span>
                                )}
                              </div>
                              {/* <div className="text-xs">{item.description}</div> */}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDateTime(item.created_at.toString())}
                              </span>
                            </ItemDescription>
                          </ItemContent>
                          <Badge className={`${convertStatusLogGate[item.action].className}`}>
                            {convertStatusLogGate[item.action].label}
                          </Badge>
                        </a>
                      </Item>
                    ))
                  ) : (
                    <div className="h-100 flex justify-center items-center">
                      <h2 className="text-center font-medium">Data masih kosong</h2>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </MyContainer>
        </div>

        {/* RIGHT SIDE - Main Content */}
        <div className="flex-1 flex flex-col gap-5 overflow-hidden">
          {/* Dashboard Stats */}
          <MyContainer className="rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-between">
              <h2 className="text-base font-bold text-blue-900 dark:text-white">
                Data Statistik Hari Ini
              </h2>
              {getValueAppConfig('CAN-MANUAL-APPROVAL') && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-40 ml-2"
                  onClick={() => connectWebSocket()}
                >
                  Re-Connect Gate
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 p-5 gap-6">
              {/* Status Di Dalam */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700/50 hover:-translate-y-1">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                      Status Di Dalam
                    </div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                      24
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Kendaraan aktif di area parkir
                    </div>
                  </div>
                  <div className="bg-green-200/50 dark:bg-green-700/30 p-4 rounded-xl">
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status Di Luar */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700/50 hover:-translate-y-1">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                      Status Di Luar
                    </div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                      156
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Total kendaraan keluar hari ini
                    </div>
                  </div>
                  <div className="bg-red-200/50 dark:bg-red-700/30 p-4 rounded-xl">
                    <svg
                      className="w-8 h-8 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </MyContainer>

          {/* Visitor Table */}
          <MyContainer className="rounded-lg border border-gray-200 dark:border-gray-700 flex-1 flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-base font-bold text-blue-900 dark:text-white">
                Daftar Pengunjung Terbaru
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <TableComponent
                loading={loading}
                table={table}
                data={data}
                columns={columns}
                totalRows={totalRows}
                // pagination={null}
                handlePageChange={() => null}
                handleLimitChange={() => null}
                // totalPages={totalPages}
                withPagiantion={false}
              />

              <ModalDetailVisitor
                loading={loading}
                selectedData={selectedData}
                openDialog={openDialog === 'detailVisitor'}
                setOpenDialog={closeDialogHandler}
              />

              <ModalDetailLogGate
                data={selectedlogGate || null}
                loading={loading}
                openDialog={openDialog === 'detailLogGate'}
                setOpenDialog={closeDialogHandler}
              />

              <ModalConfirm
                handleActionConfirm={handleActionConfirm}
                openDialog={openDialog === 'confirmData'}
                setOpenDialog={closeDialogHandler}
                data={dataFromWS}
                loading={loading.wsAction}
              />
            </div>
          </MyContainer>
        </div>
      </div>
    </>
  )
}
