export function formatDeliveryMessage(params: {
  provider: string
  planLabel: string
  username: string
  maskedPassword: string
  revealUrl: string
  expiresAt: Date
}) {
  const { provider, planLabel, username, maskedPassword, revealUrl, expiresAt } = params
  const until = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(expiresAt)
  return [
    `✅ Aktif! ${provider} — ${planLabel}`,
    `Email/User: ${username}`,
    `Password: ${maskedPassword} (klik link untuk lihat penuh)`,
    ``,
    `🔒 Link rahasia (sekali lihat, berlaku singkat):`,
    revealUrl,
    ``,
    `Masa aktif s/d: ${until}`,
    `Catatan: jangan bagikan link ini ke siapapun.`
  ].join('\n')
}

export function maskPassword(pw: string) {
  if (pw.length <= 4) return '*'.repeat(pw.length)
  return pw.slice(0, 2) + '*'.repeat(pw.length - 4) + pw.slice(-2)
}
