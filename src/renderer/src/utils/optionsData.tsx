export const optionsStatus = [
  { value: '1', label: 'Aktif' },
  { value: '0', label: 'Tidak Aktif' }
]

export const optionsStatus2 = [
  { value: 'ACTIVE', label: 'Aktif' },
  { value: 'NONACTIVE', label: 'Tidak Aktif' }
]

export const optionsPrioritas = Array.from({ length: 20 }, (_, index) => ({
  value: (index + 1).toString(),
  label: (index + 1).toString()
}))

export const optionsSatuan = [
  { value: 'Unit', label: 'Unit' },
  { value: 'PCS', label: 'PCS' },
  { value: 'Karton', label: 'Karton' },
  { value: 'Paket', label: 'Paket' },
  { value: 'Gram', label: 'Gram' },
  { value: 'Kilogram', label: 'Kilogram' },
  { value: 'Meter', label: 'Meter' }
]

export const optionsTarif = [
  { value: 'SPD', label: 'Sepeda Motor' },
  { value: 'MOB', label: 'Mobil' }
]

export const optionsValidMember = [
  { value: '0', label: 'Tidak' },
  { value: '1', label: 'Ya' }
]

export const optionsPagination = [10, 25, 50, 100]
export const optionInitialLimit = 25
export const timeDebounce = 500

export const optionsTime30minute = (): string[] => {
  const times: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      times.push(`${hh}:${mm}`)
    }
  }
  return times
}
