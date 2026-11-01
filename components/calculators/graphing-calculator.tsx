'use client'

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Eye, EyeOff, Maximize2, Minus, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { Card, InputField, PrimaryButton } from '@/components/site/form'
import { compile, type Scope } from '@/lib/expression'
import { formatNumber, toNum } from '@/lib/format'
import { cn } from '@/lib/utils'

const COLORS = ['#2563EB', '#C2410C', '#0F766E', '#7C3AED', '#BE185D', '#172B4D']

type Equation = { id: number; src: string; color: string; visible: boolean }
type Point = { id: number; x: number; y: number }
type Tab = 'functions' | 'points' | 'sliders' | 'analyze'

const DEFAULT_VIEW = { cx: 0, cy: 0, scale: 40 }

function niceStep(raw: number) {
  const pow = 10 ** Math.floor(Math.log10(raw))
  const n = raw / pow
  return (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * pow
}

function compileEquation(src: string) {
  const cleaned = src.trim()
  const vertical = /^x\s*=\s*(.+)$/i.exec(cleaned)
  if (vertical) return { kind: 'vertical' as const, ...compile(vertical[1]) }
  const rhs = cleaned.replace(/^(y|f\s*\(\s*x\s*\))\s*=\s*/i, '')
  return { kind: 'function' as const, ...compile(rhs) }
}

const features: { tab: Tab; label: string }[] = [
  { tab: 'functions', label: 'Plot Functions' },
  { tab: 'functions', label: 'Graph Equations' },
  { tab: 'points', label: 'Plot Points' },
  { tab: 'sliders', label: 'Visualize Algebra' },
  { tab: 'sliders', label: 'Interactive Sliders' },
  { tab: 'points', label: 'Explore Geometry' },
  { tab: 'analyze', label: 'Analyze Graphs' },
]

export function GraphingCalculator() {
  const [equations, setEquations] = useState<Equation[]>([
    { id: 1, src: 'y = a*x^2 - 2', color: COLORS[0], visible: true },
    { id: 2, src: 'y = sin(x) * b', color: COLORS[1], visible: true },
  ])
  const [draft, setDraft] = useState('')
  const [draftError, setDraftError] = useState('')
  const [points, setPoints] = useState<Point[]>([])
  const [px, setPx] = useState('')
  const [py, setPy] = useState('')
  const [connect, setConnect] = useState(false)
  const [sliders, setSliders] = useState<Scope>({ a: 0.5, b: 2 })
  const [feature, setFeature] = useState(features[0].label)
  const tab = features.find((f) => f.label === feature)!.tab
  const [analyzeId, setAnalyzeId] = useState(1)
  const [view, setView] = useState(DEFAULT_VIEW)
  const [size, setSize] = useState({ w: 800, h: 560 })
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null)
  const nextId = useRef(3)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      setSize({ w, h: Math.max(360, Math.min(620, w * 0.75)) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const compiled = useMemo(
    () =>
      equations.map((eq) => {
        try {
          return { eq, c: compileEquation(eq.src), error: '' }
        } catch (e) {
          return { eq, c: null, error: e instanceof Error ? e.message : 'Invalid' }
        }
      }),
    [equations],
  )

  const sliderVars = useMemo(() => {
    const vars = new Set<string>()
    compiled.forEach(({ c }) => c?.vars.forEach((v) => v !== 'x' && v !== 'y' && vars.add(v)))
    return [...vars].sort()
  }, [compiled])

  const { w, h } = size
  const { cx, cy, scale } = view
  const toSx = (x: number) => w / 2 + (x - cx) * scale
  const toSy = (y: number) => h / 2 - (y - cy) * scale
  const xMin = cx - w / 2 / scale
  const xMax = cx + w / 2 / scale
  const yMin = cy - h / 2 / scale
  const yMax = cy + h / 2 / scale
  const step = niceStep(80 / scale)

  const scope = (x: number): Scope => {
    const s: Scope = { x }
    sliderVars.forEach((v) => (s[v] = sliders[v] ?? 1))
    return s
  }

  const paths = compiled.map(({ eq, c }) => {
    if (!c || !eq.visible) return null
    try {
      if (c.kind === 'vertical') {
        const x = c.fn(scope(0))
        return { eq, d: `M${toSx(x)},0 L${toSx(x)},${h}` }
      }
      const samples = Math.ceil(w)
      let d = ''
      let penDown = false
      let prevY = 0
      for (let i = 0; i <= samples; i++) {
        const x = xMin + ((xMax - xMin) * i) / samples
        const y = c.fn(scope(x))
        const sy = toSy(y)
        if (!Number.isFinite(y) || Math.abs(sy) > h * 20 || (penDown && Math.abs(sy - prevY) > h * 2)) {
          penDown = false
          continue
        }
        d += `${penDown ? 'L' : 'M'}${toSx(x).toFixed(1)},${sy.toFixed(1)}`
        penDown = true
        prevY = sy
      }
      return { eq, d }
    } catch {
      return null
    }
  })

  const gridX: number[] = []
  for (let x = Math.ceil(xMin / step) * step; x <= xMax; x += step) gridX.push(+x.toFixed(10))
  const gridY: number[] = []
  for (let y = Math.ceil(yMin / step) * step; y <= yMax; y += step) gridY.push(+y.toFixed(10))

  const zoom = (factor: number) => setView((v) => ({ ...v, scale: Math.min(4000, Math.max(2, v.scale * factor)) }))

  const addEquation = () => {
    if (!draft.trim()) return
    try {
      compileEquation(draft)
      setEquations((eqs) => [
        ...eqs,
        { id: nextId.current, src: draft.trim(), color: COLORS[(nextId.current - 1) % COLORS.length], visible: true },
      ])
      nextId.current++
      setDraft('')
      setDraftError('')
    } catch (e) {
      setDraftError(e instanceof Error ? e.message : 'Invalid equation')
    }
  }

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { x: e.clientX, y: e.clientY, cx, cy }
  }
  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    setHover({ x: cx + (mx - w / 2) / scale, y: cy - (my - h / 2) / scale })
    const drag = dragRef.current
    if (drag) {
      setView((v) => ({
        ...v,
        cx: drag.cx - (e.clientX - drag.x) / v.scale,
        cy: drag.cy + (e.clientY - drag.y) / v.scale,
      }))
    }
  }

  const analysis = useMemo(() => {
    const target = compiled.find(({ eq }) => eq.id === analyzeId)
    if (!target?.c || target.c.kind !== 'function') return null
    const f = (x: number) => target.c!.fn(scope(x))
    const roots: number[] = []
    const extrema: { x: number; y: number; type: string }[] = []
    const n = 2000
    const dx = (xMax - xMin) / n
    let prev = f(xMin)
    let prevSlope = NaN
    for (let i = 1; i <= n; i++) {
      const x = xMin + i * dx
      const y = f(x)
      if (Number.isFinite(prev) && Number.isFinite(y)) {
        if (prev === 0 || Math.sign(prev) !== Math.sign(y)) {
          let lo = x - dx
          let hi = x
          for (let k = 0; k < 40; k++) {
            const mid = (lo + hi) / 2
            if (Math.sign(f(mid)) === Math.sign(f(lo))) lo = mid
            else hi = mid
          }
          if (Math.abs(f((lo + hi) / 2)) < 1e-3 && roots.length < 8) roots.push((lo + hi) / 2)
        }
        const slope = y - prev
        if (Number.isFinite(prevSlope) && Math.sign(slope) !== Math.sign(prevSlope) && slope !== 0 && extrema.length < 8) {
          extrema.push({ x: x - dx, y: prev, type: prevSlope > 0 ? 'Max' : 'Min' })
        }
        prevSlope = slope
      }
      prev = y
    }
    let yInt: number | null = null
    try {
      const v = f(0)
      yInt = Number.isFinite(v) ? v : null
    } catch {}
    return { roots, extrema, yInt }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compiled, analyzeId, sliders, view, size])

  const polygon = connect && points.length >= 3 ? points : null
  const polyArea = polygon
    ? Math.abs(polygon.reduce((s, p, i) => s + p.x * polygon[(i + 1) % polygon.length].y - polygon[(i + 1) % polygon.length].x * p.y, 0)) / 2
    : 0
  const polyPerimeter = polygon
    ? polygon.reduce((s, p, i) => {
        const q = polygon[(i + 1) % polygon.length]
        return s + Math.hypot(q.x - p.x, q.y - p.y)
      }, 0)
    : 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Graphing tools">
        {features.map((f) => (
          <button
            key={f.label}
            type="button"
            aria-pressed={feature === f.label}
            onClick={() => setFeature(f.label)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              feature === f.label ? 'border-navy bg-navy text-white' : 'border-border bg-white text-navy hover:bg-sky',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card className="flex flex-col p-5">
          {tab === 'functions' && (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  addEquation()
                }}
                className="space-y-3"
              >
                <InputField
                  label="Equation"
                  placeholder="y = 2x + 1"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  hint="Examples: y = x^2, sin(x), x = 3, sqrt(x)"

                />
                {draftError && <p className="text-sm text-destructive">{draftError}</p>}
                <div className="grid grid-cols-2 gap-2">
                  <PrimaryButton type="submit" variant="secondary" className="whitespace-nowrap px-3">
                    <Plus className="size-4" aria-hidden="true" />
                    Add Equation
                  </PrimaryButton>
                  <PrimaryButton onClick={addEquation} className="whitespace-nowrap px-3">Plot Graph</PrimaryButton>
                </div>
              </form>
              <h3 className="mt-6 text-sm font-semibold text-navy">Equations</h3>
              <ul className="mt-2 space-y-2">
                {compiled.map(({ eq, error }) => (
                  <li key={eq.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                    <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: eq.color }} aria-hidden="true" />
                    <span className={cn('flex-1 truncate font-mono text-sm', !eq.visible && 'text-muted-foreground line-through')}>
                      {eq.src}
                    </span>
                    {error && <span className="text-xs text-destructive">{error}</span>}
                    <button
                      type="button"
                      onClick={() => setEquations((es) => es.map((x) => (x.id === eq.id ? { ...x, visible: !x.visible } : x)))}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-sky hover:text-navy"
                      aria-label={eq.visible ? `Hide ${eq.src}` : `Show ${eq.src}`}
                    >
                      {eq.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEquations((es) => es.filter((x) => x.id !== eq.id))}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-sky hover:text-destructive"
                      aria-label={`Remove ${eq.src}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
                {equations.length === 0 && <li className="text-sm text-muted-foreground">No equations yet.</li>}
              </ul>
            </>
          )}

          {tab === 'points' && (
            <>
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  const x = toNum(px)
                  const y = toNum(py)
                  if (!Number.isFinite(x) || !Number.isFinite(y)) return
                  setPoints((ps) => [...ps, { id: Date.now(), x, y }])
                  setPx('')
                  setPy('')
                }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="X" type="number" step="any" value={px} onChange={(e) => setPx(e.target.value)} placeholder="0" />
                  <InputField label="Y" type="number" step="any" value={py} onChange={(e) => setPy(e.target.value)} placeholder="0" />
                </div>
                <PrimaryButton type="submit" className="w-full">
                  <Plus className="size-4" aria-hidden="true" />
                  Plot Point
                </PrimaryButton>
              </form>
              <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={connect} onChange={(e) => setConnect(e.target.checked)} className="size-4 accent-navy" />
                Connect points as a shape (geometry)
              </label>
              {polygon && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-sky p-3">
                    <p className="text-xs text-muted-foreground">Area</p>
                    <p className="font-semibold text-navy">{formatNumber(polyArea)}</p>
                  </div>
                  <div className="rounded-lg bg-sky p-3">
                    <p className="text-xs text-muted-foreground">Perimeter</p>
                    <p className="font-semibold text-navy">{formatNumber(polyPerimeter)}</p>
                  </div>
                </div>
              )}
              <ul className="mt-4 space-y-2">
                {points.map((p) => (
                  <li key={p.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 font-mono text-sm">
                    ({formatNumber(p.x)}, {formatNumber(p.y)})
                    <button
                      type="button"
                      onClick={() => setPoints((ps) => ps.filter((q) => q.id !== p.id))}
                      className="rounded-md p-1 text-muted-foreground hover:text-destructive"
                      aria-label="Remove point"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
                {points.length === 0 && <li className="text-sm text-muted-foreground">No points plotted.</li>}
              </ul>
            </>
          )}

          {tab === 'sliders' && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Use letters like a, b or c in your equations to create sliders and see how they change the graph.
              </p>
              {sliderVars.length === 0 && <p className="text-sm text-muted-foreground">No slider variables in your equations.</p>}
              {sliderVars.map((v) => (
                <div key={v}>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`slider-${v}`} className="font-mono text-sm font-semibold text-navy">
                      {v}
                    </label>
                    <span className="rounded-md bg-sky px-2 py-0.5 font-mono text-sm tabular-nums text-navy">
                      {formatNumber(sliders[v] ?? 1, 2)}
                    </span>
                  </div>
                  <input
                    id={`slider-${v}`}
                    type="range"
                    min={-10}
                    max={10}
                    step={0.1}
                    value={sliders[v] ?? 1}
                    onChange={(e) => setSliders((s) => ({ ...s, [v]: Number(e.target.value) }))}
                    className="mt-2 w-full accent-navy"
                  />
                </div>
              ))}
            </div>
          )}

          {tab === 'analyze' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="analyze-eq" className="text-sm font-medium">
                  Equation to analyze
                </label>
                <select
                  id="analyze-eq"
                  value={analyzeId}
                  onChange={(e) => setAnalyzeId(Number(e.target.value))}
                  className="h-11 rounded-lg border border-border bg-white px-3 font-mono text-sm"
                >
                  {equations.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.src}
                    </option>
                  ))}
                </select>
              </div>
              {analysis ? (
                <dl className="space-y-3 text-sm">
                  <div className="rounded-lg bg-sky p-3">
                    <dt className="text-xs text-muted-foreground">Y-intercept</dt>
                    <dd className="font-mono font-semibold text-navy">
                      {analysis.yInt === null ? 'None' : `(0, ${formatNumber(analysis.yInt)})`}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-sky p-3">
                    <dt className="text-xs text-muted-foreground">X-intercepts (visible range)</dt>
                    <dd className="font-mono font-semibold text-navy">
                      {analysis.roots.length ? analysis.roots.map((r) => `(${formatNumber(r, 3)}, 0)`).join(', ') : 'None'}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-sky p-3">
                    <dt className="text-xs text-muted-foreground">Turning points (visible range)</dt>
                    <dd className="font-mono font-semibold text-navy">
                      {analysis.extrema.length
                        ? analysis.extrema.map((p) => `${p.type} (${formatNumber(p.x, 2)}, ${formatNumber(p.y, 2)})`).join(', ')
                        : 'None'}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">Select a y = f(x) equation to analyze.</p>
              )}
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="font-mono text-xs tabular-nums text-muted-foreground" aria-live="off">
              {hover ? `x: ${formatNumber(hover.x, 2)}  y: ${formatNumber(hover.y, 2)}` : 'Drag to pan'}
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => zoom(1.4)} className="rounded-md p-2 text-navy hover:bg-sky" aria-label="Zoom in">
                <Plus className="size-4" />
              </button>
              <button type="button" onClick={() => zoom(1 / 1.4)} className="rounded-md p-2 text-navy hover:bg-sky" aria-label="Zoom out">
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setView((v) => ({ ...v, cx: 0, cy: 0 }))}
                className="rounded-md p-2 text-navy hover:bg-sky"
                aria-label="Center on origin"
              >
                <Maximize2 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setView(DEFAULT_VIEW)}
                className="ml-1 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-navy hover:bg-sky"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>
          <div ref={wrapRef} className="w-full">
            <svg
              width={w}
              height={h}
              role="img"
              aria-label="Coordinate plane graph"
              className="block cursor-grab touch-none select-none bg-white active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={() => (dragRef.current = null)}
              onPointerLeave={() => {
                dragRef.current = null
                setHover(null)
              }}
              onWheel={(e) => zoom(e.deltaY < 0 ? 1.1 : 1 / 1.1)}
            >
              <g stroke="#EEF2F7" strokeWidth={1}>
                {gridX.map((x) => (
                  <line key={`gx${x}`} x1={toSx(x)} x2={toSx(x)} y1={0} y2={h} />
                ))}
                {gridY.map((y) => (
                  <line key={`gy${y}`} y1={toSy(y)} y2={toSy(y)} x1={0} x2={w} />
                ))}
              </g>
              <g stroke="#172B4D" strokeWidth={1.25}>
                <line x1={0} x2={w} y1={toSy(0)} y2={toSy(0)} />
                <line y1={0} y2={h} x1={toSx(0)} x2={toSx(0)} />
              </g>
              <g fontSize={11} fill="#667085" fontFamily="var(--font-inter)">
                {gridX
                  .filter((x) => x !== 0)
                  .map((x) => (
                    <text key={`lx${x}`} x={toSx(x)} y={Math.min(h - 6, Math.max(14, toSy(0) + 15))} textAnchor="middle">
                      {formatNumber(x, 3)}
                    </text>
                  ))}
                {gridY
                  .filter((y) => y !== 0)
                  .map((y) => (
                    <text key={`ly${y}`} x={Math.min(w - 6, Math.max(6, toSx(0) - 6))} y={toSy(y) + 4} textAnchor="end">
                      {formatNumber(y, 3)}
                    </text>
                  ))}
                <text x={toSx(0) - 6} y={toSy(0) + 15} textAnchor="end">
                  0
                </text>
              </g>
              {paths.map((p) => p && <path key={p.eq.id} d={p.d} fill="none" stroke={p.eq.color} strokeWidth={2.25} strokeLinejoin="round" />)}
              {polygon && (
                <polygon
                  points={polygon.map((p) => `${toSx(p.x)},${toSy(p.y)}`).join(' ')}
                  fill="#2563EB1A"
                  stroke="#101D38"
                  strokeWidth={1.5}
                />
              )}
              {points.map((p) => (
                <g key={p.id}>
                  <circle cx={toSx(p.x)} cy={toSy(p.y)} r={5} fill="#101D38" stroke="#fff" strokeWidth={2} />
                  <text x={toSx(p.x) + 8} y={toSy(p.y) - 8} fontSize={11} fill="#101D38" fontWeight={600}>
                    ({formatNumber(p.x, 2)}, {formatNumber(p.y, 2)})
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </Card>
      </div>
    </div>
  )
}
