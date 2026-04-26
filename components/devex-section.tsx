"use client"

import { useState, useEffect } from "react"

const STEPS = [
  {
    num: "01",
    title: "Connect",
    desc: "Plug into existing systems",
    file: "slack-integration",
    lang: "bash",
    code: [
      { type: "comment", text: "# Connect Zuri to your property" },
      { type: "command", text: "zuri connect --cameras --pos --slack" },
      { type: "gap" },
      { type: "output", text: "✓ 12 cameras connected" },
      { type: "output", text: "✓ POS system linked" },
      { type: "output", text: "✓ Slack workspace authorized" },
      { type: "gap" },
      { type: "success", text: "✓ Setup complete in 48 hours" },
    ],
  },
  {
    num: "02",
    title: "Configure",
    desc: "Set your rules & alerts",
    file: "config/rules.ts",
    lang: "typescript",
    code: [
      { type: "comment", text: "// Define your property rules" },
      { type: "keyword", text: "const", after: " rules ", keyword2: "=", keyword3: " new ", fn: "ZuriRules", args: "({" },
      { type: "prop", key: "  restricted_areas", val: "['pool-after-10pm', 'kitchen']" },
      { type: "prop", key: "  task_escalation", val: "'30min'" },
      { type: "prop", key: "  alert_channels", val: "['slack', 'mobile']" },
      { type: "prop", key: "  shift_hours", val: "{ day: '6am-2pm', night: '2pm-10pm' }" },
      { type: "plain", text: "});" },
    ],
  },
  {
    num: "03",
    title: "Monitor",
    desc: "24/7 intelligent oversight",
    file: "dashboard/live",
    lang: "typescript",
    code: [
      { type: "comment", text: "// Zuri watches everything" },
      { type: "keyword", text: "const", after: " dashboard ", keyword2: "=", keyword3: " new ", fn: "LiveView", args: "({" },
      { type: "prop", key: "  tasks", val: "realtime" },
      { type: "prop", key: "  cameras", val: "ai_analysis" },
      { type: "prop", key: "  transactions", val: "auto_reconcile" },
      { type: "prop", key: "  inventory", val: "predictive" },
      { type: "plain", text: "})" },
    ],
  },
  {
    num: "04",
    title: "Optimize",
    desc: "Get smarter every week",
    file: "reports/daily",
    lang: "bash",
    code: [
      { type: "comment", text: "# Daily intelligence report" },
      { type: "output", text: "  Tasks completed: 147" },
      { type: "output", text: "  Security alerts: 3 (all resolved)" },
      { type: "output", text: "  Revenue tracked: $3,842" },
      { type: "output", text: "  Stock alerts: 2 items low" },
      { type: "gap" },
      { type: "success", text: "✓ Pattern detected: Tuesday understaffed" },
      { type: "url", text: "  → Recommendation: Add 1 housekeeper" },
    ],
  },
]

function CodeLine({ line }: { line: (typeof STEPS)[0]["code"][0] }) {
  if (line.type === "gap") return <div className="h-3" />
  if (line.type === "comment") return <div className="text-[#6b7280]">{line.text}</div>
  if (line.type === "output") return <div className="text-[#9ca3af]">{line.text}</div>
  if (line.type === "success") return <div className="text-[#4ade80]">{line.text}</div>
  if (line.type === "url") return <div className="text-[#60a5fa] underline">{line.text}</div>
  if (line.type === "command") return (
    <div>
      <span className="text-[#4ade80]">$ </span>
      <span className="text-[#e5e7eb]">{line.text}</span>
    </div>
  )
  if (line.type === "plain") return <div className="text-[#e5e7eb]">{line.text}</div>
  if (line.type === "prop") return (
    <div>
      <span className="text-[#60a5fa]">{line.key}</span>
      <span className="text-[#9ca3af]">: </span>
      <span className="text-[#4ade80]">{line.val}</span>
      <span className="text-[#9ca3af]">,</span>
    </div>
  )
  if (line.type === "keyword") return (
    <div>
      <span className="text-[#c084fc]">{line.text}</span>
      <span className="text-[#e5e7eb]">{line.after}</span>
      <span className="text-[#c084fc]">{line.keyword2}</span>
      {line.keyword3 && <span className="text-[#c084fc]">{line.keyword3}</span>}
      {line.fn && <span className="text-[#fbbf24]">{line.fn}</span>}
      {line.args && <span className="text-[#e5e7eb]">{line.args}</span>}
      {line.string && <span className="text-[#4ade80]">{line.string}</span>}
    </div>
  )
  return null
}

export function DevExSection() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(true)

  function selectStep(i: number) {
    if (i === active) return
    setVisible(false)
    setTimeout(() => {
      setActive(i)
      setVisible(true)
    }, 180)
  }

  // Auto-advance every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setActive(prev => (prev + 1) % STEPS.length)
        setVisible(true)
      }, 180)
    }, 3200)
    return () => clearInterval(t)
  }, [])

  const step = STEPS[active]

  return (
    <section id="devex" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.05] border border-black/[0.06] text-[10px] tracking-widest text-black/40 uppercase">
            INTEGRATIONS
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            Connects to what<br />you already use.
          </h2>
          <p className="mt-4 text-sm text-black/45 leading-relaxed max-w-md">
            Slack for alerts. WhatsApp for guest communication. Your existing cameras. Your POS system. Zuri plugs in — no rip-and-replace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
          {/* Left — 4 clickable step cards, equal height, no flex stretch */}
          <div className="flex flex-col gap-3">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                onClick={() => selectStep(i)}
                className="flex-1 text-left rounded-2xl border transition-all duration-200 p-6 group"
                style={{
                  background: active === i ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.7)",
                  borderColor: active === i ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.06)",
                  boxShadow: active === i
                    ? "0 1px 3px rgba(0,0,0,0.06)"
                    : "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <div className="flex gap-4 items-start">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-light shrink-0 transition-colors duration-200"
                    style={{
                      background: active === i ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.04)",
                      color: active === i ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.35)",
                    }}
                  >
                    {s.num}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-light transition-colors duration-200"
                      style={{ color: active === i ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)" }}
                    >
                      {s.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.28)" }}>{s.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right — fixed-size code panel (dark IDE theme) */}
          <div
            className="lg:col-span-2 rounded-2xl border border-white/[0.08] p-8 flex flex-col"
            style={{
              background: "#0d1117",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
              minHeight: "360px",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5 shrink-0">
              <div
                className="text-[10px] tracking-widest uppercase transition-all duration-200"
                style={{
                  opacity: visible ? 1 : 0,
                  filter: visible ? "blur(0px)" : "blur(4px)",
                  transition: "opacity 200ms ease, filter 200ms ease",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {step.file}
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(d => (
                  <div
                    key={d}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      background: d === active % 3 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Code block — fixed height, content doesn't affect layout */}
            <div className="flex-1 rounded-xl p-6 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div
                className="font-mono text-[12px] leading-6"
                style={{
                  opacity: visible ? 1 : 0,
                  filter: visible ? "blur(0px)" : "blur(6px)",
                  transform: visible ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 220ms cubic-bezier(0.16,1,0.3,1), filter 220ms cubic-bezier(0.16,1,0.3,1), transform 220ms cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {step.code.map((line, i) => (
                  <CodeLine key={i} line={line} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
