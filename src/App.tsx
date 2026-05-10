import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

const leadership = [
  { role: 'Pengerusi', name: 'Rodzi Bin Muhammad' },
  { role: 'Naib Pengerusi', name: 'Rosli Bin Muhammad' },
  { role: 'Setiausaha', name: 'Mohamad Aiman Bin Rodzi' },
  { role: 'Bendahari', name: 'Rohana Binti Arifin' },
]

const boardMembers = [
  'Mohd Aliff Bin Rodzi',
  'Nor Farisha Binti Mohd Isa',
]

const auditors = ['Rohazien Bin Arifin', 'Zumri Bin Kassim']

function App() {
  const [formData, setFormData] = useState({
    name: '',
    ic: '',
    phone: '',
    address: '',
    purpose: '',
  })
  const [statusMessage, setStatusMessage] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminAuthed, setAdminAuthed] = useState(false)
  const [adminError, setAdminError] = useState('')
  const [visitorLog, setVisitorLog] = useState<
    { id: string; time: string; userAgent: string }[]
  >([])
  const [totalVisits, setTotalVisits] = useState<number | null>(null)
  const [visitStatus, setVisitStatus] = useState('')

  useEffect(() => {
    const storageKey = 'koperasi-rodziana-visit-log'
    const existing = localStorage.getItem(storageKey)
    const logs: { id: string; time: string; userAgent: string }[] = existing
      ? JSON.parse(existing)
      : []

    const newEntry = {
      id: `VIS-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      time: new Date().toLocaleString('ms-MY', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      userAgent: navigator.userAgent,
    }
    const updatedLogs = [newEntry, ...logs].slice(0, 50)
    localStorage.setItem(storageKey, JSON.stringify(updatedLogs))
    setVisitorLog(updatedLogs)
  }, [])

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await fetch(
          'https://api.countapi.xyz/hit/koperasi-rodziana-jeli/visits',
        )
        if (!response.ok) {
          throw new Error('Gagal mendapatkan jumlah lawatan')
        }
        const data = (await response.json()) as { value: number }
        setTotalVisits(data.value)
        setVisitStatus('Jumlah lawatan disegerakkan secara awan.')
      } catch (error) {
        setVisitStatus('Tidak dapat sambung ke rekod awan buat masa ini.')
      }
    }

    fetchVisits()
  }, [])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatusMessage('Menghantar permohonan...')

    const payload = {
      Nama_Penuh: formData.name,
      No_Kad_Pengenalan: formData.ic,
      No_Telefon_WhatsApp: formData.phone,
      Alamat_Kediaman: formData.address,
      Tujuan_Menyertai_Koperasi: formData.purpose,
    }

    try {
      const response = await fetch(
        'https://formsubmit.co/ajax/rodziana1498@gmail.com',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            ...payload,
            _subject: 'Permohonan Keahlian Koperasi',
            _template: 'table',
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Gagal menghantar permohonan')
      }

      setStatusMessage(
        'Permohonan berjaya dihantar. Terima kasih kerana berminat menyertai koperasi.',
      )
      setFormData({ name: '', ic: '', phone: '', address: '', purpose: '' })
    } catch (error) {
      setStatusMessage(
        'Maaf, permohonan tidak berjaya dihantar. Sila cuba lagi.',
      )
    }
  }

  const handleAdminLogin = (event: React.FormEvent) => {
    event.preventDefault()
    if (adminPassword === 'rodziana2026') {
      setAdminAuthed(true)
      setAdminError('')
    } else {
      setAdminAuthed(false)
      setAdminError('Kata laluan tidak sah. Sila cuba lagi.')
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              formData={formData}
              statusMessage={statusMessage}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPage
              adminPassword={adminPassword}
              adminAuthed={adminAuthed}
              adminError={adminError}
              visitorLog={visitorLog}
              totalVisits={totalVisits}
              visitStatus={visitStatus}
              onPasswordChange={setAdminPassword}
              onLogin={handleAdminLogin}
              onLogout={() => setAdminAuthed(false)}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

type HomePageProps = {
  formData: {
    name: string
    ic: string
    phone: string
    address: string
    purpose: string
  }
  statusMessage: string
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  handleSubmit: (event: React.FormEvent) => void
}

function HomePage({
  formData,
  statusMessage,
  handleChange,
  handleSubmit,
}: HomePageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/uploads/upload_1.png"
              alt="Logo Koperasi Keluarga Rodziana Jeli Berhad"
              className="h-12 w-12"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
                Koperasi Keluarga Rodziana Jeli Berhad
              </p>
              <p className="text-xs text-slate-500">
                Memperkasa ekonomi keluarga bersama
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a className="hover:text-red-700" href="#home">
              Halaman Utama
            </a>
            <a className="hover:text-red-700" href="#organisasi">
              Carta Organisasi
            </a>
            <a className="hover:text-red-700" href="#keahlian">
              Borang Keahlian
            </a>
          </nav>
          <a
            href="#keahlian"
            className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-800"
          >
            Sertai Kami
          </a>
        </div>
      </header>

      <main>
        <section id="home" className="bg-gradient-to-br from-red-50 via-white to-slate-50">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
                Selamat Datang
              </p>
              <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
                Selamat Datang ke Koperasi Keluarga Rodziana Jeli Berhad
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Memperkasa Ekonomi Keluarga, Membina Masa Depan Bersama.
              </p>
              <p className="mt-6 text-base leading-relaxed text-slate-600">
                Kami adalah koperasi keluarga yang berpusat di Jeli, Kelantan, komited
                untuk meningkatkan kebajikan dan peluang ekonomi bagi setiap ahli keluarga
                melalui kerjasama strategik dan pengurusan yang telus.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#keahlian"
                  className="rounded-lg bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-red-800"
                >
                  Mohon Keahlian
                </a>
                <a
                  href="#organisasi"
                  className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-red-300 hover:text-red-700"
                >
                  Kenali Kepimpinan
                </a>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <div className="flex items-center gap-4">
                <img
                  src="/uploads/upload_1.png"
                  alt="Logo Koperasi"
                  className="h-20 w-20"
                />
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Koperasi Keluarga Rodziana Jeli Berhad
                  </h2>
                  <p className="text-sm text-slate-500">
                    Berpusat di Jeli, Kelantan
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 text-sm text-slate-600">
                <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-center">
                  <div>
                    <p className="text-xs uppercase text-slate-500">Keahlian</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">20 Orang</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500">Status</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-600">Aktif</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500">Ditubuhkan</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">30 Jan 2026</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-red-50 px-4 py-3">
                  <p className="font-semibold text-red-700">Misi Kami</p>
                  <p>
                    Mengukuhkan daya ekonomi ahli keluarga dengan inisiatif koperasi yang
                    mampan dan inklusif.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-700">Nilai Teras</p>
                  <p>
                    Amanah, kerjasama, ketelusan, serta budaya saling membantu dalam
                    komuniti.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white">
                  <p className="font-semibold">Komitmen</p>
                  <p>
                    Menyediakan ruang pertumbuhan ekonomi keluarga menerusi peluang perniagaan,
                    simpanan, dan bantuan kebajikan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="organisasi" className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
              Struktur Organisasi
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
              Carta Organisasi Koperasi
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Kenali barisan kepimpinan yang menerajui Koperasi Keluarga Rodziana Jeli Berhad
              demi memastikan perkhidmatan terbaik untuk semua ahli.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800">Jawatankuasa Utama</h3>
              <div className="mt-4 space-y-4">
                {leadership.map((leader) => (
                  <div
                    key={leader.role}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <p className="font-medium text-slate-700">{leader.role}</p>
                    <p className="text-sm font-semibold text-slate-900">{leader.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
                <h3 className="text-lg font-semibold text-red-700">Ahli Lembaga Kuasa</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {boardMembers.map((member) => (
                    <li key={member} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-red-600"></span>
                      {member}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-800">Juru Audit Kuasa Dalaman</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {auditors.map((auditor) => (
                    <li key={auditor} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-slate-400"></span>
                      {auditor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="keahlian" className="bg-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
                Borang Permohonan Keahlian
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
                Mohon Menjadi Ahli Koperasi
              </h2>
              <p className="mt-4 text-base text-slate-600">
                Sila isi maklumat di bawah untuk memohon menjadi ahli. Semua permohonan
                akan dihantar terus ke unit pengurusan kami melalui emel.
              </p>
              <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Nota Penting</p>
                <ul className="mt-3 space-y-2">
                  <li>Pastikan maklumat diisi dengan lengkap dan tepat.</li>
                  <li>Permohonan akan diproses selepas semakan pengurusan.</li>
                  <li>Anda akan dihubungi melalui telefon atau WhatsApp.</li>
                </ul>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Nama Penuh
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="Isi nama penuh"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    No. Kad Pengenalan
                  </label>
                  <input
                    name="ic"
                    value={formData.ic}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="Contoh: 900101-01-1234"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    No. Telefon/WhatsApp
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="Contoh: 012-3456789"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Alamat Kediaman
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="Isi alamat penuh"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Tujuan Menyertai Koperasi
                  </label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="Contoh: Ingin menyertai aktiviti ekonomi keluarga"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-red-700 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-red-800"
                >
                  Hantar Permohonan
                </button>
                {statusMessage ? (
                  <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
                    {statusMessage}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-700">Maklumat Perhubungan</p>
            <div className="mt-3 space-y-2">
              <p>
                <span className="font-medium text-slate-600">WhatsApp:</span> 014212481
              </p>
              <p>
                <span className="font-medium text-slate-600">Email:</span>{' '}
                <a className="text-red-700 hover:underline" href="mailto:rodziana1498@gmail.com">
                  rodziana1498@gmail.com
                </a>
              </p>
              <p className="max-w-md">
                <span className="font-medium text-slate-600">Alamat Operasi:</span>{' '}
                Kampung Tengku Abdul Rahman, Kampung Kuala Balah, 17610 Jeli, Kelantan
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 md:text-right">
            <p>© 2024 Koperasi Keluarga Rodziana Jeli Berhad.</p>
            <p>Hak cipta terpelihara.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

type AdminPageProps = {
  adminPassword: string
  adminAuthed: boolean
  adminError: string
  visitorLog: { id: string; time: string; userAgent: string }[]
  totalVisits: number | null
  visitStatus: string
  onPasswordChange: (value: string) => void
  onLogin: (event: React.FormEvent) => void
  onLogout: () => void
}

function AdminPage({
  adminPassword,
  adminAuthed,
  adminError,
  visitorLog,
  totalVisits,
  visitStatus,
  onPasswordChange,
  onLogin,
  onLogout,
}: AdminPageProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-red-300">Admin Panel</p>
            <h1 className="text-lg font-semibold text-white">
              Koperasi Keluarga Rodziana Jeli Berhad
            </h1>
          </div>
          <Link
            to="/"
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:border-white/40"
          >
            Kembali ke Laman Utama
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-red-300">
              Pemantauan Pelawat
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              Dashboard Pemerhatian
            </h2>
            <p className="mt-4 text-sm text-slate-300">
              Halaman ini diasingkan dari laman utama. Gunakan pautan /admin untuk akses
              terus, dan pastikan kata laluan hanya dikongsi dengan pengurusan.
            </p>
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
              <p className="font-semibold text-white">Ringkasan Data</p>
              <ul className="mt-3 space-y-2">
                <li>Rekod pelawat lokal di setiap pelayar.</li>
                <li>Kiraan lawatan global (awan) untuk semua peranti.</li>
                <li>Maklumat ringkas peranti pelawat.</li>
              </ul>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            {!adminAuthed ? (
              <form className="space-y-4" onSubmit={onLogin}>
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Kata Laluan Admin
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(event) => onPasswordChange(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white shadow-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                    placeholder="Masukkan kata laluan"
                  />
                </div>
                {adminError ? (
                  <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs text-red-200">
                    {adminError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-red-500"
                >
                  Log Masuk Admin
                </button>
                <p className="text-xs text-slate-400">
                  Kata laluan demo: <span className="font-semibold">rodziana2026</span>
                </p>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Senarai Pelawat Terkini
                    </p>
                    <p className="text-xs text-emerald-300">Log masuk berjaya</p>
                  </div>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="text-xs font-semibold text-slate-300 hover:text-red-300"
                  >
                    Log keluar
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {visitorLog.length === 0 ? (
                    <p className="text-sm text-slate-400">Belum ada rekod pelawat.</p>
                  ) : (
                    visitorLog.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-xs text-slate-200"
                      >
                        <p className="font-semibold text-white">{log.id}</p>
                        <p>{log.time}</p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {log.userAgent}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-xs text-slate-200">
                  <p className="font-semibold text-white">Jumlah Lawatan Global</p>
                  <p className="mt-1 text-lg font-semibold text-red-300">
                    {totalVisits !== null ? totalVisits.toLocaleString('ms-MY') : '—'}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">{visitStatus}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
