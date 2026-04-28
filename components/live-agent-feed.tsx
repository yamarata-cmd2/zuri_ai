"use client"

import { useEffect, useState, useRef } from "react"

const AGENT_NAMES = [
  "housekeeping", "front-desk", "security-ai", "revenue-ctrl",
  "inventory", "guest-ai", "maintenance", "manager-alert",
  "pos-monitor", "cctv-watch",
]

const TASKS = [
  "Cleaning Room 204 — assigned to Maria",
  "Guest check-in request via WhatsApp",
  "CCTV flagged loitering at lobby entrance",
  "Daily revenue report generated",
  "Bar stock running low — ordering supplies",
  "Maintenance request: AC unit Room 112",
  "Post-stay review request sent to guest",
  "POS discrepancy flagged — $45 gap",
  "Front desk inactivity alert triggered",
  "Kitchen inventory sync completed",
  "Guest message: towel request Room 305",
  "Security alert: unauthorized pool access",
  "Shift handover report generated",
  "Escalating overdue task to manager",
]

const REGIONS = ["villa-a", "pool-bar", "lobby", "kitchen", "rooms"]
const STATUSES = [
  { label: "running",  color: "#4ade80" },
  { label: "running",  color: "#4ade80" },
  { label: "running",  color: "#4ade80" },
  { label: "queued",   color: "#facc15" },
  { label: "complete", color: "#60a5fa" },
]

type AgentRow = {
  id: string
  name: string
  task: string
  region: string
  status: typeof STATUSES[number]
  progress: number
  elapsed: string
  key: number
}

function randomRow(key: number): AgentRow {
  return {
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    name: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
    task: TASKS[Math.floor(Math.random() * TASKS.length)],
    region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    progress: Math.floor(Math.random() * 85 + 10),
    elapsed: `${Math.floor(Math.random() * 14 + 1)}m ${Math.floor(Math.random() * 59)}s`,
    key,
  }
}

// Animated progress bar that slowly ticks forward
function ProgressBar({ initial }: { initial: number }) {
  const [pct, setPct] = useState(initial)
  const rafRef = useRef<number>(0)
  const pctRef = useRef(initial)

  useEffect(() => {
    const tick = () => {
      pctRef.current = Math.min(99, pctRef.current + 0.015)
      setPct(Math.round(pctRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div style={{ width: "100%", height: 2, background: "rgba(100,116,139,0.3)", borderRadius: 9 }}>
      <div style={{
        height: "100%", borderRadius: 9,
        width: `${pct}%`,
        background: "linear-gradient(90deg, #4ade80 0%, #22d3ee 100%)",
        transition: "width 0.5s linear",
        boxShadow: "0 0 6px rgba(74,222,128,0.4)",
      }} />
    </div>
  )
}

// Stable seed rows — same on server and client, no random values
const SEED_ROWS: AgentRow[] = [
  { id: "A1B2C3", name: "housekeeping",    task: "Cleaning Room 204 — assigned to Maria",  region: "rooms",    status: STATUSES[0], progress: 42, elapsed: "3m 12s", key: 0 },
  { id: "D4E5F6", name: "security-ai",     task: "CCTV flagged loitering at lobby",        region: "lobby",    status: STATUSES[0], progress: 67, elapsed: "7m 48s", key: 1 },
  { id: "G7H8I9", name: "revenue-ctrl",    task: "POS discrepancy flagged — $45 gap",      region: "pool-bar", status: STATUSES[3], progress: 18, elapsed: "1m 05s", key: 2 },
  { id: "J0K1L2", name: "guest-ai",        task: "Guest message: towel request Room 305",  region: "rooms",    status: STATUSES[0], progress: 55, elapsed: "5m 30s", key: 3 },
  { id: "M3N4O5", name: "maintenance",     task: "Maintenance request: AC unit Room 112",  region: "villa-a",  status: STATUSES[0], progress: 80, elapsed: "11m 22s", key: 4 },
  { id: "P6Q7R8", name: "inventory",       task: "Kitchen inventory sync completed",       region: "kitchen",  status: STATUSES[4], progress: 99, elapsed: "14m 01s", key: 5 },
]

export function LiveAgentFeed() {
  const [rows, setRows] = useState<AgentRow[]>(SEED_ROWS)
  const [mounted, setMounted] = useState(false)
  const keyRef = useRef(100)

  useEffect(() => {
    // Hydrate with random data only after client mount
    setMounted(true)
    setRows(Array.from({ length: 6 }, (_, i) => randomRow(i)))

    const t = setInterval(() => {
      keyRef.current++
      setRows(prev => [...prev.slice(1), randomRow(keyRef.current)])
    }, 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16,
      overflow: "hidden",
      background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
    }}>
      {/* Table header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr 80px 70px",
        padding: "8px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}>
        {["AGENT", "TASK", "REGION", "STATUS"].map(h => (
          <span key={h} style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div style={{ overflow: "hidden" }}>
        {rows.map((row, i) => (
          <div
            key={row.key}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 80px 70px",
              padding: "10px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              gap: 8,
              alignItems: "center",
              animation: i === rows.length - 1 ? "rowSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) both" : "none",
              background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
            }}
          >
            {/* Agent */}
            <div>
              <div style={{ fontSize: 9, fontFamily: "monospace", color: "#e2e8f0", marginBottom: 1 }}>{row.name}</div>
              <div style={{ fontSize: 7.5, fontFamily: "monospace", color: "#64748b" }}>#{row.id}</div>
            </div>

            {/* Task + progress */}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 9, color: "#94a3b8", lineHeight: 1.35, marginBottom: 5,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{row.task}</div>
              <ProgressBar initial={row.progress} />
            </div>

            {/* Region */}
            <div style={{ fontSize: 8, fontFamily: "monospace", color: "#64748b" }}>{row.region}</div>

            {/* Status */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: row.status.color,
                boxShadow: row.status.label === "running" ? `0 0 10px ${row.status.color}` : "none",
                animation: row.status.label === "running" ? "statusPulse 2s ease-in-out infinite" : "none",
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 8, fontFamily: "monospace", color: "#94a3b8" }}>{row.status.label}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export function LiveAgentCounter({ dark = false }: { dark?: boolean }) {
  const [count, setCount] = useState(3847)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => {
      setCount(v => v + Math.floor(Math.random() * 3 - 1))
    }, 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <span style={{
      fontFamily: "monospace",
      fontSize: "clamp(3rem, 6vw, 5rem)",
      fontWeight: 300,
      color: dark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)",
      lineHeight: 1,
      letterSpacing: "-0.02em",
      transition: "color 0.3s ease",
    }}>
      {mounted ? count.toLocaleString("en-US") : "3,847"}
    </span>
  )
}
