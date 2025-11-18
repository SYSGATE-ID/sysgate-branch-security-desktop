import { MyContainer } from '@renderer/components/core/MyContainer'
import React from 'react'
import { useIndex } from './hook/useIndex'
import { TableComponent } from '@renderer/components/core/tableData'
import { ModalDetail } from './components/modalDetail'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '@renderer/components/ui/item'
import { Button } from '@renderer/components/ui/button'
import { ModalConfirm } from './components/modalConfirm'

export const HomePage: React.FC = () => {
  const {
    columns,
    data,
    table,
    totalRows,
    pagination,
    handlePageChange,
    handleLimitChange,
    totalPages,
    selectedData,
    loading,
    openDialog,
    setOpenDialog,
    handleApprove,
    handleReject,
    handleReSendTicket,
    statistic,
    stats,
    isOpenModalConfirm,
    setIsOpenModalConfirm
  } = useIndex()

  const dataLog = [
    {
      name: 'Mini Bus',
      tipe: 'Member',
      plat: '',
      gate: 'IN',
      time: '10:30'
    },

    {
      name: 'Truk',
      tipe: 'Umum',
      plat: 'B4432DGA',
      gate: 'OUT',
      time: '10:25'
    },
    {
      name: 'Mini Bus',
      tipe: 'Umum',
      plat: 'B1342GFD',
      gate: 'IN',
      time: '10:20'
    },
    {
      name: 'Mini Bus',
      tipe: 'Member',
      plat: '',
      gate: 'IN',
      time: '10:30'
    },
    {
      name: 'Mini Bus',
      tipe: 'Member',
      plat: '',
      gate: 'IN',
      time: '10:30'
    },

    {
      name: 'Truk',
      tipe: 'Umum',
      plat: 'B4432DGA',
      gate: 'OUT',
      time: '10:25'
    },
    {
      name: 'Mini Bus',
      tipe: 'Umum',
      plat: 'B1342GFD',
      gate: 'IN',
      time: '10:20'
    },
    {
      name: 'Mini Bus',
      tipe: 'Member',
      plat: '',
      gate: 'IN',
      time: '10:30'
    },
    {
      name: 'Truk',
      tipe: 'Umum',
      plat: 'B4432DGA',
      gate: 'OUT',
      time: '10:25'
    },
    {
      name: 'Mini Bus',
      tipe: 'Umum',
      plat: 'B1342GFD',
      gate: 'IN',
      time: '10:20'
    }
  ]

  return (
    <div className="flex gap-5 h-[89vh]">
      {/* LEFT SIDEBAR - Activity Log */}
      <div className="w-[380px] flex-shrink-0">
        <MyContainer className="rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-base font-bold text-blue-900 dark:text-white">
              Log Keluar/Masuk Gate
            </h2>
          </div>

          {/* Activity List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {dataLog.map((item, index) => (
                <Item key={index} variant="outline" asChild role="listitem">
                  <a href="#">
                    <ItemMedia variant="image">
                      <img
                        src={`https://avatar.vercel.sh/${item.name}`}
                        alt={item.name}
                        width={32}
                        height={32}
                        className="object-cover grayscale"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="line-clamp-1">
                        {item.name}{' '}
                        {item.plat && <span className="text-muted-foreground">- {item.plat}</span>}
                      </ItemTitle>
                      <ItemDescription>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {item.tipe}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.time}
                          </span>
                        </div>
                      </ItemDescription>
                    </ItemContent>
                    <ItemContent className="flex-none text-center">
                      <ItemDescription>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.gate === 'IN'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}
                        >
                          {item.gate}
                        </span>
                      </ItemDescription>
                    </ItemContent>
                  </a>
                </Item>
              ))}
            </div>
          </div>
        </MyContainer>
      </div>

      {/* RIGHT SIDE - Main Content */}
      <div className="flex-1 flex flex-col gap-5 overflow-hidden">
        {/* Dashboard Stats */}
        <MyContainer className="rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-base font-bold text-blue-900 dark:text-white">
              Data Statistik Hari Ini
            </h2>
          </div>

          {statistic ? (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((item, index) => {
                // const Icon = stat.icon
                return (
                  <div key={index} className={`${item.bgLight} ${item.bgDark} rounded-lg p-4`}>
                    <div
                      className={`${item.textLight} ${item.textDark} text-3xl font-semibold mb-1`}
                    >
                      {item.value}
                    </div>
                    <div className={`text-sm text-gray-600 dark:text-gray-400`}>{item.label}</div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400 font-medium"></p>
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
            <Button
              onClick={() => setIsOpenModalConfirm(true)}
              className="bg-blue-600 hover:bg-blue-700 w-50"
            >
              Buka Modal Approval
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <TableComponent
              loading={loading}
              table={table}
              data={data}
              columns={columns}
              totalRows={totalRows}
              pagination={pagination}
              handlePageChange={handlePageChange}
              handleLimitChange={handleLimitChange}
              totalPages={totalPages}
              withPagiantion={false}
            />

            <ModalDetail
              loading={loading}
              selectedData={selectedData}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              onApprove={handleApprove}
              onReject={handleReject}
              handleReSendTicket={handleReSendTicket}
            />

            <ModalConfirm
              handleApprove={handleApprove}
              handleReject={handleReject}
              isOpenModalConfirm={isOpenModalConfirm}
              setIsOpenModalConfirm={setIsOpenModalConfirm}
            />
          </div>
        </MyContainer>
      </div>
    </div>
  )
}
