"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { IntroAnimation, INTRO_DURATION_MS, HERO_REVEAL_MS } from "@/components/intro-animation"
import { AgentInterface } from "@/components/agent-interface"
import { PixelIcon } from "@/components/pixel-icon"
import { LiveAgentFeed, LiveAgentCounter } from "@/components/live-agent-feed"
import { RevealText } from "@/components/reveal-text"
import { StackingAgentCards } from "@/components/stacking-agent-cards"
import { MobileNav } from "@/components/mobile-nav"

// ─── Intersection Observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = end / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Bento card ──────────────────────────────────────────────────────────────
function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border border-black/[0.07] bg-white overflow-hidden transition-all duration-700 hover:border-black/[0.15] hover:bg-[#fafaf8] ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, border-color 0.3s ease, background-color 0.3s ease`,
      }}
    >
      {/* Hover glow spot */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.03), transparent 60%)" }}
      />
      {children}
    </div>
  )
}

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04]">
      {children}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AgenticPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const handleIntroDone = useCallback(() => {
    setHeroReady(true)
  }, [])

  // Start video zoom slightly before hero content reveals, for seamless overlap
  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), HERO_REVEAL_MS)
    return () => clearTimeout(t)
  }, [])

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased">

      {/* ── INTRO ANIMATION ───────────────────────────────────────────────── */}
      <IntroAnimation onDone={handleIntroDone} />

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <MobileNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Video background — zooms in once intro is done */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agentic-hero-9yW3wnTNMfn2U6lsVhTTZSJFEvAoSj.mp4"
          style={{
            transform: videoReady ? "scale(1.05)" : "scale(0.85)",
            transition: "transform 2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />



        {/* Progressive blur + light gradient rising from bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "65%", background: "linear-gradient(to top, #F5F4F0 0%, #F5F4F0 18%, rgba(245,244,240,0.85) 35%, rgba(245,244,240,0.5) 55%, rgba(245,244,240,0.15) 75%, transparent 100%)" }} />
        {/* Backdrop blur layers — progressively lighter toward top */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "20%", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "38%", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "55%", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />

        {/* Spacer so hero content doesn't sit under the fixed nav */}
        <div className="h-20" />

        {/* Title + metrics — anchored to bottom left */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col px-6 md:px-12 pb-12 max-w-3xl">
          {/* Title */}
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-light text-[#111] leading-[1.0] tracking-tight mb-10"
            style={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              opacity: heroReady ? 1 : 0,
              filter: heroReady ? "blur(0px)" : "blur(24px)",
              transform: heroReady ? "translateY(0px)" : "translateY(32px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0ms, filter 1s cubic-bezier(0.16,1,0.3,1) 0ms, transform 1s cubic-bezier(0.16,1,0.3,1) 0ms",
            }}
          >
            Full control.<br />Zero chaos.<br />Real-time hotel<br />intelligence.
          </h1>

          {/* 3 metrics — staggered after title */}
          <div className="flex gap-8 sm:gap-12">
            {[
              { value: "-30%", label: "Operational Losses" },
              { value: "100%", label: "Visibility" },
              { value: "<2sec", label: "Alerts" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  opacity: heroReady ? 1 : 0,
                  filter: heroReady ? "blur(0px)" : "blur(16px)",
                  transform: heroReady ? "translateY(0px)" : "translateY(20px)",
                  transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms, filter 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms`,
                }}
              >
                <div className="text-3xl sm:text-4xl text-[#111] font-light tracking-tight" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.value}</div>
                <div className="text-xs text-black/40 tracking-widest uppercase mt-1" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM OVERVIEW (bento) ──────────────────────────────────────── */}
      <section id="platform" className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>PLATFORM</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
              {"Everything you need\nto run a hotel. Automatically."}
            </RevealText>
          </div>

          <div className="grid grid-cols-12 grid-rows-auto gap-4" onMouseMove={handleMouse}>
            {/* Top row: Large dark card left, white card right */}
            <div 
              className="col-span-12 md:col-span-8 p-8 min-h-[220px] rounded-2xl border border-white/[0.06] overflow-hidden relative"
              style={{
                background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center mb-6">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="m4.93 4.93 2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>
                </div>
                <h3 className="text-xl font-medium mb-3 text-white/95">Smart Task Engine</h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-md">
                  Auto-assigns, tracks, and escalates tasks across housekeeping, maintenance, and front desk. Staff confirm via mobile. Delays flagged instantly on Slack.
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: "0 0 8px rgba(74,222,128,0.4)" }} />
                  <span className="text-xs text-emerald-400/80 font-mono tracking-wide">active</span>
                </div>
              </div>
            </div>

            {/* White card - top right */}
            <div className="col-span-12 md:col-span-4 p-7 min-h-[220px] rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="w-10 h-10 rounded-xl border border-black/[0.06] bg-slate-50 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/50"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-black/85">AI Camera Surveillance</h3>
              <p className="text-sm text-black/45 leading-relaxed">Detects theft, loitering, unauthorized access, and staff inactivity in real time.</p>
            </div>

            {/* Bottom row - 3 cards */}
            <div className="col-span-12 md:col-span-4 p-7 min-h-[200px] rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="w-10 h-10 rounded-xl border border-black/[0.06] bg-slate-50 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/50"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10h8M8 14h5"/></svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-black/85">Revenue & POS Control</h3>
              <p className="text-sm text-black/45 leading-relaxed">Every transaction tracked. Gaps caught automatically. Daily revenue reports.</p>
            </div>

            <div className="col-span-12 md:col-span-4 p-7 min-h-[200px] rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="w-10 h-10 rounded-xl border border-black/[0.06] bg-slate-50 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-black/85">Inventory Intelligence</h3>
              <p className="text-sm text-black/45 leading-relaxed">Real-time stock levels across bar, kitchen, supplies. Predicts shortages days ahead.</p>
            </div>

            {/* Dark card - bottom right */}
            <div 
              className="col-span-12 md:col-span-4 p-7 min-h-[200px] rounded-2xl border border-white/[0.06] overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-white/95">Guest Messaging</h3>
              <p className="text-sm text-white/50 leading-relaxed">AI responds to guest requests via WhatsApp in under 90 seconds. Multilingual support.</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ boxShadow: "0 0 8px rgba(34,211,238,0.4)" }} />
                <span className="text-xs text-cyan-400/80 font-mono tracking-wide">listening</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUILD YOUR AGENTS (4 cards) ───────────────────────────────────── */}
      <section id="agents" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>ZURI FEATURES</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Six intelligent modules.\nOne unified system."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 leading-relaxed max-w-xs">
              {"Every feature is live, tested, and proven in real hotel environments. No demos, no mockups — real results."}
            </p>
          </div>

          <StackingAgentCards />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="workflow" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="workflow" size={40} />
            <div className="mt-4"><Tag>HOW IT WORKS</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"From chaos to control\nin four steps."}
            </RevealText>
          </div>

          {/* Split layout: White step cards left, Dark reports terminal right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: White numbered step cards - matching reference image style */}
            <div className="space-y-4">
              {[
                { n: "01", title: "Connect", desc: "Plug into existing systems", accent: false },
                { n: "02", title: "Configure", desc: "Set your rules & alerts", accent: false },
                { n: "03", title: "Monitor", desc: "24/7 intelligent oversight", accent: false },
                { n: "04", title: "Optimize", desc: "Get smarter every week", accent: true },
              ].map((step) => (
                <div 
                  key={step.n} 
                  className={`p-5 rounded-2xl flex items-center gap-5 transition-all duration-300 ${
                    step.accent 
                      ? "bg-slate-50 border border-slate-200/80 shadow-sm" 
                      : "bg-white border border-black/[0.06]"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    step.accent 
                      ? "border border-emerald-200 bg-emerald-50" 
                      : "border border-black/[0.06] bg-white"
                  }`}>
                    <span className={`font-mono text-sm ${step.accent ? "text-emerald-600/70" : "text-black/25"}`}>{step.n}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-medium mb-0.5 text-black/85">{step.title}</h3>
                    <p className="text-sm text-black/40">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Dark terminal showing daily report */}
            <div 
              className="rounded-2xl border border-white/[0.06] p-6 overflow-hidden self-start"
              style={{
                background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-xs text-white/40 tracking-widest uppercase font-mono">REPORTS/DAILY</div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                </div>
              </div>
              
              <div className="font-mono text-[13px] leading-relaxed space-y-5">
                <div>
                  <span className="text-white/30"># </span>
                  <span className="text-white/60">Daily intelligence report</span>
                </div>
                
                <div className="space-y-2.5 text-white/55">
                  <div>Tasks completed: <span className="text-white/75">147</span></div>
                  <div>Security alerts: <span className="text-white/75">3 (all resolved)</span></div>
                  <div>Revenue tracked: <span className="text-white/75">$3,842</span></div>
                  <div>Stock alerts: <span className="text-white/75">2 items low</span></div>
                </div>
                
                <div className="pt-5 border-t border-white/[0.06] space-y-2.5">
                  <div className="text-emerald-400/90">{">"} Pattern detected: Tuesday understaffed</div>
                  <div className="text-cyan-400/70 underline underline-offset-2 cursor-pointer">{">"} Recommendation: Add 1 housekeeper</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ──────────────────────────────────────────────────── */}
      <section id="integrations" className="border-t border-black/[0.06]">
        {/* Top: White section with scrolling integration tags */}
        <div className="py-16 px-6 md:px-12 lg:px-20 bg-white">
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <PixelIcon type="integrations" size={40} />
                <div className="mt-4"><Tag>INTEGRATIONS</Tag></div>
                <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                  {"Connects to what\nyou already use."}
                </RevealText>
              </div>
              <p className="text-sm text-black/45 leading-relaxed max-w-xs">
                Slack for alerts. WhatsApp for guest communication. Your existing cameras. Your POS system.
              </p>
            </div>
          </div>
          
          {/* Scrolling integration marquee */}
          <div className="overflow-hidden select-none -mx-6 md:-mx-12 lg:-mx-20">
            <div className="flex border-y border-black/[0.06]" style={{ animation: "marqueeLeft 28s linear infinite" }}>
              {[...Array(3)].map((_, rep) => (
                <div key={rep} className="flex shrink-0">
                  {["Task Automation", "CCTV Analysis", "Revenue Tracking", "Inventory Control", "Guest Messaging", "Staff Management"].map((cap) => (
                    <div key={cap} className="flex items-center gap-4 px-8 py-4 border-r border-black/[0.06] shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-sm text-black/60 whitespace-nowrap tracking-wide">{cap}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex" style={{ animation: "marqueeRight 22s linear infinite" }}>
              {[...Array(3)].map((_, rep) => (
                <div key={rep} className="flex shrink-0">
                  {["Maintenance", "Front Desk", "Pool Bar", "Kitchen Stock", "Theft Detection", "Access Control", "WhatsApp"].map((cap) => (
                    <div key={cap} className="flex items-center gap-4 px-8 py-4 border-r border-black/[0.06] shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-black/20 shrink-0" />
                      <span className="text-sm text-black/40 whitespace-nowrap tracking-wide">{cap}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Dark section with Live Agent feed */}
        <div 
          className="py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a1f2e 0%, #0f1319 50%, #111827 100%)",
          }}
        >
          {/* Subtle gradient orbs for depth */}
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)" }} />
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Text content */}
              <div>
                <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center mb-6">
                  <div className="grid grid-cols-3 gap-0.5">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans border border-emerald-500/20 bg-emerald-500/10 text-emerald-400/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE RIGHT NOW
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] text-white/95 mb-6">
                  Zuri AI working<br />24/7, always on.
                </h2>
                <p className="text-base text-slate-400 leading-relaxed max-w-sm">
                  Real-time automation across your entire property. Tasks assigned, security monitored, revenue tracked — all without human intervention.
                </p>
              </div>

              {/* Right: Live Agent Feed table */}
              <div>
                <LiveAgentFeed />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY & OBSERVABILITY ──────────────────────────────────��──── */}
      <section id="security" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>TRUST & SECURITY</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"Enterprise-grade,\nbuilt for hospitality."}
            </RevealText>
          </div>

          {/* Asymmetric grid: left text + title, right interactive audit log */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side — descriptions in white card style */}
            <div className="space-y-4">
              {[
                { label: "Full Audit Trail", desc: "Every task, alert, and transaction logged with timestamp and staff ID. Complete traceability." },
                { label: "Real-time Observability", desc: "Monitor your entire property from a single dashboard. Live camera feeds, task status, revenue flow." },
                { label: "Privacy Protected", desc: "Guest data encrypted. Staff monitoring restricted to operational areas only. GDPR-compliant." },
              ].map((item, i) => (
                <div 
                  key={item.label} 
                  className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-1 h-12 rounded-full shrink-0 ${i === 0 ? "bg-emerald-400" : "bg-black/10"}`} />
                    <div>
                      <h3 className="text-base font-medium mb-1.5 text-black/85">{item.label}</h3>
                      <p className="text-sm text-black/45 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Compliance badges */}
              <div className="pt-2 flex flex-wrap gap-2">
                {["GDPR Compliant", "End-to-end Encryption", "Audit Logs", "Staff Privacy"].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-black/[0.04] text-xs text-black/40">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side — live audit log visualization (dark terminal theme) */}
            <div 
              className="rounded-2xl border border-white/[0.06] p-6 lg:row-span-1 overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="text-xs text-white/40 tracking-widest uppercase font-mono">AUDIT/LIVE</div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: "0 0 8px rgba(74,222,128,0.5)" }} />
                  <span className="text-[10px] text-emerald-400/80 font-mono tracking-wide">LIVE</span>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { time: "12:34:21", action: "task_executed", status: "success" },
                  { time: "12:34:18", action: "alert_sent", status: "success" },
                  { time: "12:34:15", action: "camera_flagged", status: "warning" },
                  { time: "12:34:12", action: "report_generated", status: "success" },
                  { time: "12:34:09", action: "revenue_tracked", status: "success" },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-white/[0.04] group cursor-pointer"
                    style={{
                      animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
                    }}
                  >
                    <span className="text-[10px] text-white/30 font-mono min-w-[60px]">{log.time}</span>
                    <span className="text-[11px] text-white/55 font-light flex-1 font-mono">{log.action}</span>
                    <span 
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        log.status === "warning" 
                          ? "bg-amber-500/70 group-hover:bg-amber-400" 
                          : "bg-emerald-500/70 group-hover:bg-emerald-400"
                      }`} 
                      style={{
                        boxShadow: log.status === "warning" 
                          ? "0 0 6px rgba(251,191,36,0.4)" 
                          : "0 0 6px rgba(52,211,153,0.4)"
                      }}
                    />
                  </div>
                ))}
              </div>
              <style>{`
                @keyframes fadeInUp {
                  from { opacity: 0; transform: translateY(8px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <PixelIcon type="pricing" size={40} />
            <div className="mt-4"><Tag>PRICING</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"One price.\nEverything included."}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto" onMouseMove={handleMouse}>
            {/* Standard Plan */}
            <BentoCard
              className="p-8 flex flex-col border-black/20 bg-[#F0EEE8]"
              delay={0}
            >
              <div className="mb-8">
                <div className="font-pixel text-[11px] tracking-widest text-black/40 mb-4">ZURI AI FULL SYSTEM</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-light">$400</span>
                  <span className="text-black/40 text-sm">/mo</span>
                </div>
                <p className="text-xs text-black/35 tracking-wide">vs. Hiring an Operations Manager: $2,000+/month</p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {["All six modules included", "Unlimited tasks", "Unlimited camera feeds", "Slack & WhatsApp integration", "Daily reports", "Dedicated setup support", "No contract, cancel anytime"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-black/55">
                    <div className="w-1 h-1 rounded-full bg-black/25 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl text-sm tracking-widest transition-all duration-200 bg-[#111] text-white hover:bg-[#333]">
                GET STARTED
              </button>
            </BentoCard>

            {/* Enterprise Plan — Dark Theme */}
            <div 
              className="rounded-2xl border border-white/[0.1] p-8 flex flex-col overflow-hidden"
              style={{
                background: "#0f0f0f",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-pixel text-[11px] tracking-widest text-white/45">ENTERPRISE</div>
                  <span className="text-[9px] tracking-widest text-amber-400/80 bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/20">PREMIUM</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-light text-white/90">Custom</span>
                </div>
                <p className="text-xs text-white/40 tracking-wide">For hotel groups & chains</p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {["Multiple properties", "Custom integrations", "Priority support", "SLA guarantees", "On-site training", "Dedicated account manager"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                    <div className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl text-sm tracking-widest transition-all duration-200 border border-white/15 text-white/80 hover:border-white/30 hover:text-white hover:bg-white/[0.05]">
                CONTACT SALES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden">
        {/* Glass panels image — anchored to bottom center */}
        <img
          src="/images/footer.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full object-cover object-bottom pointer-events-none select-none"
          style={{ opacity: 0.85 }}
        />
        {/* Progressive blur from bottom — blends into site bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        />
        {/* Colour fade from bottom to site bg #f5f4f0 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgb(245,244,240) 0%, rgba(245,244,240,0.92) 18%, rgba(245,244,240,0.55) 35%, transparent 55%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-6">
            Start building your<br />autonomous hotel operation.
          </h2>
          <p className="text-sm text-black/45 leading-relaxed mb-10">
            {"Join forward-thinking hotels running on Zuri AI — 24/7, no human needed in the loop."}
          </p>
          {!submitted ? (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="flex-1 bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/25 focus:outline-none focus:border-black/25 transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium"
              >
                REQUEST A LIVE DEMO
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-600/20 bg-emerald-50 text-emerald-700 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {"You're on the list. We'll be in touch."}
            </div>
          )}
        </div>
      </section>


      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <span className="font-pixel text-xs tracking-[0.25em] text-black/50">ZURI AI</span>

          {/* Nav sections */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {[
              { label: "Platform",     href: "#platform" },
              { label: "Features",     href: "#agents" },
              { label: "How It Works", href: "#workflow" },
              { label: "Integrations", href: "#integrations" },
              { label: "Pricing",      href: "#pricing" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-xs text-black/35 hover:text-black/70 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy", href: "#" },
              { label: "Terms",   href: "#" },
              { label: "Docs",    href: "#" },
              { label: "GitHub",  href: "#" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-xs text-black/25 hover:text-black/55 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-black/[0.04]">
          <span className="text-xs text-black/20">ZURI AI · Powered by Claude · Built in Zanzibar, Tanzania</span>
        </div>
      </footer>
    </div>
  )
}
