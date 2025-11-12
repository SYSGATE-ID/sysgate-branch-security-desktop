import { MyContainer } from '@renderer/components/core/MyContainer'
import React from 'react'
import { useIndex } from './hook/useIndex'

export const HomePage: React.FC = () => {
  const { statistic, stats } = useIndex()

  return (
    <div className="flex gap-5 h-[91vh]">
      {/* LEFT SIDE - Fixed height dengan scroll internal */}
      <div className="w-[400px] flex-shrink-0">
        <MyContainer className="border border-gray-200 h-full flex flex-col">
          <div className="text-[18px] font-medium mb-5 flex-shrink-0">Log Keluar/Masuk Gate</div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-3">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio eligendi unde
                corrupti deserunt eos quisquam quam nam porro eaque recusandae repudiandae sapiente,
                aut atque id illo fuga sunt! Aliquid, saepe.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio eligendi unde
                corrupti deserunt eos quisquam quam nam porro eaque recusandae repudiandae sapiente,
                aut atque id illo fuga sunt! Aliquid, saepe.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio eligendi unde
                corrupti deserunt eos quisquam quam nam porro eaque recusandae repudiandae sapiente,
                aut atque id illo fuga sunt! Aliquid, saepe.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio eligendi unde
                corrupti deserunt eos quisquam quam nam porro eaque recusandae repudiandae sapiente,
                aut atque id illo fuga sunt! Aliquid, saepe.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio eligendi unde
                corrupti deserunt eos quisquam quam nam porro eaque recusandae repudiandae sapiente,
                aut atque id illo fuga sunt! Aliquid, saepe.
              </p>
            </div>
          </div>
        </MyContainer>
      </div>

      {/* RIGHT SIDE - Fixed height dengan scroll internal */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Top Section - Fixed height, no scroll */}
        <MyContainer className="border border-gray-200 flex-shrink-0">
          <div className="text-[18px] font-medium mb-4">Monitoring Dashboard Hari Ini</div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-sm">
            <div className="md:col-span-9">
              <MyContainer className="border border-gray-100 flex-1">
                <div className="text-[35px] font-medium">10</div>
                <div className="text-[16px]">Total</div>
              </MyContainer>
            </div>
            <MyContainer className="border border-gray-100 flex-1">
              <div className="text-[35px] font-medium">8</div>
              <div className="text-[16px]">Menunggu</div>
            </MyContainer>
            <MyContainer className="border border-gray-100 flex-1">
              <div className="text-[35px] font-medium">2</div>
              <div className="text-[16px]">Disetujui</div>
            </MyContainer>
            <MyContainer className="border border-gray-100 flex-1">
              <div className="text-[35px] font-medium">15</div>
              <div className="text-[16px]">Sedang Digunakan</div>
            </MyContainer>
            <MyContainer className="border border-gray-100 flex-1">
              <div className="text-[35px] font-medium">5</div>
              <div className="text-[16px]">Ditolak</div>
            </MyContainer>
            <MyContainer className="border border-gray-100 flex-1">
              <div className="text-[35px] font-medium">3</div>
              <div className="text-[16px]">Selesai</div>
            </MyContainer>
          </div>
        </MyContainer>

        {/* Bottom Section - Flexible height dengan scroll internal */}
        <MyContainer className="border border-gray-200 flex-1 flex flex-col overflow-hidden">
          <div className="text-[18px] font-medium mb-4 flex-shrink-0">
            Daftar Pengunjung Terbaru
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {/* Simulasi data list */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <div
                  key={item}
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-gray-100"
                >
                  <div className="font-medium">Pengunjung #{item}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Nomor Kendaraan: B {1000 + item} ABC
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Waktu Masuk: 12 Nov 2025, {8 + item}:30 AM
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MyContainer>
      </div>
    </div>
  )
}
