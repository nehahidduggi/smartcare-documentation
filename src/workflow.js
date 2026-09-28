import Two from 'two.js'

const NAMES = ['Maternal risk', 'Base risk', 'Escalation', 'Confidence (DCI)', 'Differential']
export function initWorkflow(host, onSelect) {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  let two, boxes = [], lines = [], active = 0
  try { two = new Two({ type: Two.Types.svg, autostart: false }).appendTo(host) } catch { return null }
  const css = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim()
  function build() {
    two.clear(); boxes = []; lines = []
    const w = host.clientWidth, vertical = w < 640, h = vertical ? 5 * 64 + 10 : 150
    two.width = w; two.height = h
    const bw = vertical ? w - 24 : (w - 40) / 5 - 14, bh = vertical ? 48 : 64
    const pts = NAMES.map((_, i) => vertical ? [w / 2, 30 + i * 64] : [20 + bw / 2 + i * (bw + 14), h / 2])
    pts.slice(1).forEach((p, i) => {
      const q = pts[i], l = two.makeLine(vertical ? q[0] : q[0] + bw / 2, vertical ? q[1] + bh / 2 : q[1], vertical ? p[0] : p[0] - bw / 2, vertical ? p[1] - bh / 2 : p[1])
      l.stroke = css('--teal'); l.linewidth = 2; l.dashes = [6, 6]; lines.push(l)
    })
    pts.forEach((p, i) => {
      const r = two.makeRoundedRectangle(p[0], p[1], bw, bh, 12); r.linewidth = 2
      const t = two.makeText(NAMES[i], p[0], p[1]); t.fill = css('--text'); t.size = vertical ? 15 : Math.max(11, Math.min(15, bw / 9)); t.family = 'system-ui, sans-serif'
      boxes.push(r)
    })
    paint(); two.update()
    boxes.forEach((b, i) => { const el = b._renderer.elem; el.style.cursor = 'pointer'; el.addEventListener('click', () => select(i, true)) })
  }
  function paint() { boxes.forEach((b, i) => { b.fill = i === active ? css('--teal-dim') : css('--bg2'); b.stroke = i === active ? css('--teal') : css('--line') }) }
  function select(i, notify) { active = i; paint(); two.update(); if (notify) onSelect(i) }
  build()
  const ro = new ResizeObserver(build); ro.observe(host)
  if (!still) { two.bind('update', () => lines.forEach(l => { l.dashes.offset = (l.dashes.offset || 0) - 0.4 })); two.play() }
  return { select: i => select(i, false), destroy: () => { ro.disconnect(); two.pause(); two.clear() } }
}
