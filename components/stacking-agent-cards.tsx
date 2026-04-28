"use client"

import { useEffect, useRef, useState } from "react"

const AGENTS = [
  {
    label: "STAFF AUTOMATION",
    title: "Smart task management",
    desc: "Auto-assigns tasks by role, shift, and priority. Tracks completion in real time. Escalates overdue work to managers via Slack and mobile.",
    stats: [{ v: "100%", l: "task accountability" }, { v: "-40%", l: "missed tasks" }],
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/researcher-CvhqOuV6irGwBOnJoTGFlXdbyYBRjb.png",
    dark: false,
  },
  {
    label: "SECURITY INTELLIGENCE",
    title: "AI-powered surveillance",
    desc: "AI-powered CCTV analysis. Detects suspicious behavior, unauthorized access, staff inactivity, and cash handling anomalies. Alerts sent to Slack in under 2 seconds.",
    stats: [{ v: "-78%", l: "theft incidents" }, { v: "<2sec", l: "alert time" }],
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coder-9bItvCegU6TXUqbX3tUXGBAtvkBkXp.png",
    dark: true,
  },
  {
    label: "REVENUE CONTROLLER",
    title: "Transaction tracking",
    desc: "Live POS integration. Matches every order to every payment. Flags discrepancies before shift ends. Auto-generates daily revenue reports.",
    stats: [{ v: "+34%", l: "revenue visibility" }, { v: "$0", l: "unexplained losses" }],
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/analyst-Ysxnqg7Fpy2cfA56PiIttv1KximMhT.png",
    dark: false,
  },
  {
    label: "GUEST EXPERIENCE",
    title: "Multilingual AI concierge",
    desc: "Multilingual AI responds to guest requests via WhatsApp in under 90 seconds. Sends post-stay review requests. Personalizes service from guest history.",
    stats: [{ v: "4.9", l: "satisfaction" }, { v: "90sec", l: "response" }],
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/executor-o1q6509qMLXMtpBIGo49vcgOu34sI1.png",
    dark: true,
  },
]

const STICKY_TOP   = 80   // matches top: 80px on first card
const STICKY_STEP  = 16   // each card stacks 16px lower
const SCALE_STEP   = 0.04 // scale reduction per card stacked on top
const OFFSET_STEP  = 8    // px pushed down per card stacked on top

function Tag({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans ${
      dark ? "text-white/50 bg-white/[0.08]" : "text-black/40 bg-black/[0.04]"
    }`}>
      {children}
    </span>
  )
}

export function StackingAgentCards() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  // depth[i] = 0..N how many cards are currently stacked on top of card i
  const [depth, setDepth] = useState<number[]>(AGENTS.map(() => 0))

  useEffect(() => {
    function onScroll() {
      const nextDepth = AGENTS.map((_, i) => {
        // Count how many cards j > i are currently in sticky position (i.e. have scrolled past card i)
        let count = 0
        for (let j = i + 1; j < AGENTS.length; j++) {
          const el = cardRefs.current[j]
          if (!el) continue
          const rect = el.getBoundingClientRect()
          const stickyTopJ = STICKY_TOP + j * STICKY_STEP
          // Card j is "on top of" card i when it has reached its sticky position
          if (rect.top <= stickyTopJ + 2) count++
        }
        return count
      })
      setDepth(nextDepth)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="flex flex-col" style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
      {AGENTS.map((agent, i) => {
        const d         = depth[i]
        const scale     = 1 - d * SCALE_STEP
        const translateY = d * OFFSET_STEP

        return (
          <div
            key={agent.label}
            ref={el => { cardRefs.current[i] = el }}
            className="sticky mb-4"
            style={{ top: `${STICKY_TOP + i * STICKY_STEP}px`, zIndex: 10 + i }}
          >
            <div
              style={{
                transform:      `scale(${scale}) translateY(${translateY}px)`,
                transformOrigin: "top center",
                transition:     "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                willChange:     "transform",
              }}
            >
              <div 
                className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                  agent.dark 
                    ? "border border-white/[0.08]" 
                    : "bg-[#faf9f7] border border-black/[0.07]"
                }`}
                style={agent.dark ? {
                  background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                } : undefined}
              >

                {/* ── MOBILE: image top, fades out at bottom ── */}
                {agent.img && (
                  <div className="relative w-full h-52 pointer-events-none md:hidden">
                    <img
                      src={agent.img}
                      alt={agent.label}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      style={{
                        maskImage: "linear-gradient(to bottom, black 0%, black 35%, transparent 85%)",
                        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 35%, transparent 85%)",
                      }}
                    />
                  </div>
                )}

                {/* ── DESKTOP: image right, fades out at left (absolute) ── */}
                {agent.img && (
                  <div className="hidden md:block absolute inset-y-0 right-0 w-1/2 pointer-events-none">
                    <img
                      src={agent.img}
                      alt={agent.label}
                      className="w-full h-full object-cover object-center"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: agent.dark 
                          ? "linear-gradient(to right, #0f172a 0%, transparent 55%)"
                          : "linear-gradient(to right, #faf9f7 0%, transparent 55%)",
                      }}
                    />
                  </div>
                )}

                {/* Text content */}
                <div
                  className="relative z-10 p-8"
                  style={{ maxWidth: agent.img ? undefined : "100%" }}
                  // On desktop limit to left 60% so text doesn't overlap image
                >
                  <div className="md:max-w-[60%]">
                    <div className="flex items-start justify-between mb-6">
                      <Tag dark={agent.dark}>{agent.label}</Tag>
                      {agent.dark && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] text-emerald-400/70 font-mono">active</span>
                        </div>
                      )}
                    </div>
                    <h3 className={`text-xl font-light mb-3 ${agent.dark ? "text-white/95" : ""}`}>{agent.title}</h3>
                    <p className={`text-sm leading-relaxed mb-8 ${agent.dark ? "text-white/50" : "text-black/45"}`}>{agent.desc}</p>
                  </div>
                  <div className={`flex gap-8 pt-6 border-t ${agent.dark ? "border-white/[0.08]" : "border-black/[0.06]"}`}>
                    {agent.stats.map(s => (
                      <div key={s.l}>
                        <div className={`text-2xl font-light ${agent.dark ? "text-white/90" : ""}`}>{s.v}</div>
                        <div className={`text-[11px] tracking-widest mt-0.5 ${agent.dark ? "text-white/35" : "text-black/35"}`}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
