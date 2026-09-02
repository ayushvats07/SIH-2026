import { CalendarDays, FileText, LayoutDashboard, ClipboardList, ArrowRight } from 'lucide-react'

type DashboardProps = {
  onOpenCaseTaking: () => void
}

const pages = [
  {
    name: 'Patient Timeline',
    description: 'View the complete history of patient visits and clinical events.',
    href: '/pages/timeline.html',
    icon: CalendarDays,
  },
  {
    name: 'Patient Report',
    description: 'Open the detailed clinical summary and visit report.',
    href: '/pages/report.html',
    icon: FileText,
  },
]

export default function Dashboard({ onOpenCaseTaking }: DashboardProps) {
  return (
    <div className="min-h-screen bg-[#f4f7f7] text-[#17212b]">
      <aside className="fixed inset-y-0 left-0 hidden w-60 bg-[#102b2a] p-5 text-white lg:block">
        <div className="flex items-center gap-3 border-b border-[#31504e] pb-6">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#d7f1ed] text-xl font-bold text-[#0f766e]">A</div>
          <div>
            <div className="font-bold">AYUSH Care</div>
            <div className="mt-1 text-[10px] text-[#8da7a4]">Clinical Workspace</div>
          </div>
        </div>

        <div className="mt-7 text-[10px] font-bold uppercase tracking-[1px] text-[#76918d]">Main Menu</div>
        <button className="mt-2 flex w-full items-center gap-3 rounded-lg bg-[#1b4542] px-3 py-3 text-left text-sm font-medium text-white">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </button>
        <button onClick={onOpenCaseTaking} className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-[#b8ccca] hover:bg-[#1b4542] hover:text-white">
          <ClipboardList className="h-4 w-4" /> Case Taking
        </button>

        <div className="absolute bottom-5 left-5 right-5 border-t border-[#31504e] pt-4 text-[11px] leading-6 text-[#8fa9a6]">
          <strong className="text-white">Dr. Sharma</strong><br />AYUSH Practitioner
        </div>
      </aside>

      <main className="lg:ml-60">
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#0f766e]">AYUSH CARE</div>
              <h1 className="mt-1 text-3xl font-bold">Clinical Dashboard</h1>
              <p className="mt-1 text-sm text-[#71808c]">Your clinical workspace and patient records at a glance.</p>
            </div>
            <button onClick={onOpenCaseTaking} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f766e] px-4 py-3 text-sm font-bold text-white hover:bg-[#115e59]">
              Start New Case <ArrowRight className="h-4 w-4" />
            </button>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Active Cases', '24', '+8% this week'],
              ['Patients', '128', '+12 this month'],
              ['Follow-ups', '09', '3 due today'],
              ['Reports', '47', '5 pending review'],
            ].map(([label, value, info]) => (
              <div key={label} className="rounded-2xl border border-[#e2e8e8] bg-white p-5 shadow-sm">
                <div className="text-[11px] font-bold text-[#71808c]">{label}</div>
                <div className="mt-2 text-3xl font-bold">{value}</div>
                <div className="mt-1 text-[10px] text-[#18784e]">{info}</div>
              </div>
            ))}
          </section>

          <section className="mt-5 rounded-2xl border border-[#e2e8e8] bg-white p-5 shadow-sm">
            <div className="mb-5">
              <div className="text-lg font-bold">Available Pages</div>
              <div className="mt-1 text-xs text-[#71808c]">Pages from the original project have been brought inside the React project.</div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <button onClick={onOpenCaseTaking} className="group rounded-xl border border-[#e2e8e8] p-5 text-left transition hover:border-[#0f766e] hover:shadow-md">
                <ClipboardList className="h-6 w-6 text-[#0f766e]" />
                <div className="mt-4 font-bold">Clinical Case Taking</div>
                <p className="mt-1 text-xs leading-5 text-[#71808c]">Open the existing React case-taking workflow.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0f766e]">Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" /></span>
              </button>

              {pages.map(({ name, description, href, icon: Icon }) => (
                <a key={name} href={href} className="group rounded-xl border border-[#e2e8e8] p-5 transition hover:border-[#0f766e] hover:shadow-md">
                  <Icon className="h-6 w-6 text-[#0f766e]" />
                  <div className="mt-4 font-bold">{name}</div>
                  <p className="mt-1 text-xs leading-5 text-[#71808c]">{description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0f766e]">Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" /></span>
                </a>
              ))}
            </div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl border border-[#e2e8e8] bg-white p-5 shadow-sm">
              <div className="mb-4 text-lg font-bold">Recent Patients</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#edf0f0] text-[9px] uppercase text-[#8a969d]">
                    <tr><th className="px-2 py-3">Patient</th><th className="px-2 py-3">Last Visit</th><th className="px-2 py-3">Status</th></tr>
                  </thead>
                  <tbody>
                    {[
                      ['Aarav Mehta', '30 Aug 2026', 'Follow-up'],
                      ['Ananya Sharma', '29 Aug 2026', 'Assessment'],
                      ['Riya Verma', '28 Aug 2026', 'Stable'],
                    ].map(([name, date, status]) => (
                      <tr key={name} className="border-b border-[#edf0f0] last:border-0">
                        <td className="px-2 py-4 font-semibold">{name}</td><td className="px-2 py-4 text-[#71808c]">{date}</td><td className="px-2 py-4 text-[#0f766e]">{status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e2e8e8] bg-white p-5 shadow-sm">
              <div className="text-lg font-bold">Quick Actions</div>
              <div className="mt-4 grid gap-2">
                <button onClick={onOpenCaseTaking} className="rounded-lg border border-[#dfe6e6] px-4 py-3 text-left text-sm font-semibold hover:bg-[#f0f4f4]">➕ Start New Case</button>
                <a href="/pages/timeline.html" className="rounded-lg border border-[#dfe6e6] px-4 py-3 text-left text-sm font-semibold hover:bg-[#f0f4f4]">🕒 Patient Timeline</a>
                <a href="/pages/report.html" className="rounded-lg border border-[#dfe6e6] px-4 py-3 text-left text-sm font-semibold hover:bg-[#f0f4f4]">📄 View Patient Report</a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
