export const FormatWaktuSekarang = (): string => {
  const waktuSekarang = new Date()
  const hari = waktuSekarang.toLocaleDateString('id-ID', { weekday: 'long' })
  const tanggal = waktuSekarang.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const jam = waktuSekarang.getHours().toString().padStart(2, '0')
  const menit = waktuSekarang.getMinutes().toString().padStart(2, '0')
  const detik = waktuSekarang.getSeconds().toString().padStart(2, '0')

  return `${hari}, ${tanggal} ${jam}:${menit}:${detik}`
}
