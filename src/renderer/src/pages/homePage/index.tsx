import { MyContainer } from '@renderer/components/core/MyContainer'
import React from 'react'
import { useIndex } from './hook/useIndex'
import { TableComponent } from '@renderer/components/core/tableData'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '@renderer/components/ui/item'
import { ModalConfirm } from './components/modalConfirm'
import {
  convertStatusLogGate,
  formatDateTime,
  getNoPlatLogGate,
  getPictureLogGate,
  getTariffLogGate,
  getUserTypeLogGate
} from '@renderer/utils/myFunctions'
import { Badge } from '@renderer/components/ui/badge'
import { RefreshCcw, Ticket, User } from 'lucide-react'
import { ModalDetailVisitor } from './components/modalDetailVisitor'
import { ModalDetailLogGate } from './components/modalDetailLogGate'
import { Button } from '@renderer/components/ui/button'
import { ImageDefault } from '@renderer/components/core/imageDefault'

export const HomePage: React.FC = () => {
  const {
    columns,
    data,
    table,
    totalRows,
    selectedData,
    loading,
    openDialog,
    closeDialogHandler,
    statistic,
    stats,
    handleGetDetailLogGate,
    logGates,
    selectedlogGate,
    handleActionConfirm,
    dataFromWS,
    fetchLogGate,
    connectWebSocket
  } = useIndex()

  return (
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
                      onClick={() => handleGetDetailLogGate(item.id)}
                      variant="outline"
                      asChild
                      role="listitem"
                    >
                      <a href="#">
                        <ItemMedia variant="image">
                          <ImageDefault
                            url={`${convertStatusLogGate[item.action].label === 'IN' ? getPictureLogGate(item, 1) : getPictureLogGate(item, 0)}`}
                          />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="line-clamp-1">
                            <span className="text-muted-foreground">
                              {getTariffLogGate(item)} - {getNoPlatLogGate(item)}
                            </span>
                          </ItemTitle>
                          <ItemDescription>
                            <div className="flex items-center gap-2">
                              {getUserTypeLogGate(item) === 'member' ? (
                                <>
                                  <User className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">Member</span>
                                </>
                              ) : getUserTypeLogGate(item) === 'ticket' ? (
                                <>
                                  <Ticket className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">Umum</span>
                                </>
                              ) : (
                                <span className="text-sm text-gray-500">Unknown</span>
                              )}
                            </div>
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
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-40 ml-2"
              onClick={() => connectWebSocket()}
            >
              Re-Connect Gate
            </Button>
          </div>

          {statistic ? (
            <div className="grid grid-cols-1 p-5 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className={`${stat.bgLight} ${stat.bgDark} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700/50 hover:-translate-y-1`}
                  >
                    {/* Baris utama: label, angka, icon */}
                    <div className="flex items-center justify-between w-full">
                      {/* Label dan angka */}
                      <div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                          {stat.label}
                        </div>
                        <div className={`text-2xl font-bold ${stat.textLight} ${stat.textDark}`}>
                          {stat.value.toLocaleString()}
                        </div>
                      </div>

                      {/* Icon di kanan */}
                      <div className={`${stat.iconBg} p-3 rounded-xl`}>
                        <Icon className={`w-6 h-6 ${stat.textLight} ${stat.textDark}`} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Memuat statistik dashboard...
                </p>
              </div>
            </div>
          )}
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
  )
}
