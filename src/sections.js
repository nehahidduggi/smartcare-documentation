const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)]

export function initSections() {
  // generic tab groups (journey, firewall, scenarios, architecture)
  $$('[data-tabs]').forEach(g => $$('[data-t]', g).forEach(b => b.addEventListener('click', () => {
    $$('[data-t]', g).forEach(x => x.classList.toggle('on', x === b))
    $$('[data-p]', g).forEach(p => p.classList.toggle('on', p.dataset.p === b.dataset.t))
  })))

  $('#qbtn')?.addEventListener('click', () => { $('#qrout').classList.add('flash') })
  $('#qrbtn')?.addEventListener('click', () => { const o = $('#qrout'); o.classList.remove('flash'); void o.offsetWidth; o.classList.add('flash') })

  // minimum-group simulator (mock data)
  const seed = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7)
  const sim = () => {
    const r = $('#sr').value, a = $('#sa').value, c = $('#sc').value, th = +$('#st').value
    $('#tv').textContent = th
    const n = Math.round(seed(r + a + c) % 60 / (a === '0–17' ? 4 : 1))
    const out = $('#simout'), ok = n >= th
    out.className = 'result ' + (ok ? 'pass' : 'block')
    out.innerHTML = `<small>Matching population: ${n} · Minimum threshold: ${th}</small><br>` + (ok
      ? `<b>Aggregate shown</b>: ${c}, ${r}, ${a}: ${n} cases (illustrative)`
      : `<b>RESULT SUPPRESSED</b><br>The population size is below the configured privacy threshold.`)
  }
  $$('#sr,#sa,#sc,#st').forEach(e => e.addEventListener('input', sim)); sim()

  // inference-risk query sequence
  const qs = $('#qs'), Q = [427, 83, 21, 11]
  qs.innerHTML = Q.map((q, i) => `<div class="q" style="--w:${Math.max(4, q / 427 * 100)}%"><span>Query ${i + 1}</span><i></i><b>${q} patients</b></div>`).join('')
  $('#qbtn').addEventListener('click', () => {
    const rows = $$('.q', qs), al = $('#qalert'); al.hidden = true; rows.forEach(r => r.classList.remove('on'))
    rows.forEach((r, i) => setTimeout(() => { r.classList.add('on'); if (i === 3) al.hidden = false }, i * 450))
  })

  // illustrative trend chart
  const D = { dengue: [21, 24, 29, 47, 63], diab: [58, 57, 59, 60, 61], htn: [72, 70, 74, 73, 75] }
  const draw = () => {
    const k = $('#dc').value, d = D[k], mx = Math.max(...d) * 1.1, base = d.slice(0, 3).reduce((a, b) => a + b) / 3
    $('#chart').innerHTML = d.map((v, i) => { const h = v / mx * 140; return `<g><rect class="bar" x="${25 + i * 72}" y="${160 - h}" width="44" height="${h}" rx="5" style="animation-delay:${i * 80}ms"/><text x="${47 + i * 72}" y="${154 - h}" text-anchor="middle">${v}</text><text x="${47 + i * 72}" y="176" text-anchor="middle" class="ax">Wk ${i + 1}</text></g>` }).join('')
    const ch = Math.round((d[4] - base) / base * 100)
    $('#anom').innerHTML = ch >= 50 ? `<b>Significant increase detected in the sample trend.</b><br>${$('#dc').selectedOptions[0].text} · Pune East (sample) · Week 5 is +${ch}% versus the mean of weeks 1–3 (illustrative)` : `No unusual change in this sample trend (${ch >= 0 ? '+' : ''}${ch}% vs weeks 1–3).`
    $('#anom').classList.toggle('alert', ch >= 50)
  }
  $('#dc').addEventListener('input', draw); draw()

  // reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 })
  $$('.card,.tabs,.evo').forEach(e => { e.classList.add('rv'); io.observe(e) })
}
