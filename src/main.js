import './style.css'
import { initHero } from './hero.js'
import { initWorkflow } from './workflow.js'
import { initSections } from './sections.js'

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)]
$('#yr').textContent = new Date().getFullYear()

// nav
const nav = $('#nav'), burger = $('.burger'), links = $('#links')
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true })
burger.addEventListener('click', () => { const o = links.classList.toggle('open'); burger.setAttribute('aria-expanded', o) })
links.addEventListener('click', e => { if (e.target.tagName === 'A') { links.classList.remove('open'); burger.setAttribute('aria-expanded', false) } })
const navLinks = $$('#links a[href^="#"]')
const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)) }), { rootMargin: '-45% 0px -50% 0px' })
$$('main section[id]').forEach(s => spy.observe(s))

initSections()

// workflow (Two.js) + step cards
const steps = $$('.step')
const setStep = i => steps.forEach((s, j) => s.classList.toggle('on', i === j))
const wf = initWorkflow($('#two-flow'), i => { setStep(i) })
setStep(0)
steps.forEach((s, i) => { const go = () => { setStep(i); wf?.select(i) }; s.addEventListener('click', go); s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go() } }) })

// DCI animation (runs once when visible)
const dci = $('.dci'), R = 2 * Math.PI * 52
const rf = $('#ringf'); rf.style.strokeDasharray = R; rf.style.strokeDashoffset = R
const dio = new IntersectionObserver(([e]) => {
  if (!e.isIntersecting) return; dio.disconnect()
  rf.style.strokeDashoffset = R * (1 - rf.dataset.v / 100)
  $$('#bars i').forEach(b => { b.style.width = b.dataset.v + '%' })
}); dio.observe(dci)

// file tree
const FILES = {
  index: ['smartcare/index.js', 'Runs the pipeline in order and exports assess(), label() and CONDITIONS_DB.'],
  risk: ['smartcare/engines/riskEngine.js', 'Pipeline stages 2 and 5: base risk score, vital analysis, condition matching, differential.'],
  esc: ['smartcare/engines/escalationEngine.js', 'Pipeline stage 3: priority rules, score bands and the stability guard.'],
  conf: ['smartcare/engines/confidenceEngine.js', 'Pipeline stage 4: computes the Diagnostic Certainty Index.'],
  mat: ['smartcare/engines/maternalRiskEngine.js', 'Pipeline stage 1 uses evaluateMaternalRisk(); calculateMaternalRiskScore() is exported but unused by the pipeline.'],
  lab: ['smartcare/labels.en.json', 'English text for message keys such as action.* and escalation.reason.*.'],
  src: ['smartcare/SOURCE.md', 'Provenance of the engines, the one-line patch, and known limits.'],
  ad: ['backend/src/smartcare/adapter.js', 'Translates Carecrypt data (ICD-10 codes, medication codes, severity, vitals, BP format) into SmartCare input and turns keys into readable text.'],
  doc: ['docs/SMARTCARE.md', 'Module documentation in the Carecrypt repository.']
}
const fd = $('#fdetail'), show = k => { fd.innerHTML = `<h3><code>${FILES[k][0]}</code></h3><p>${FILES[k][1]}</p>`; $$('.tree button').forEach(b => b.classList.toggle('on', b.dataset.f === k)) }
$$('.tree button').forEach(b => b.addEventListener('click', () => show(b.dataset.f))); show('index')

// hero (Three.js), started lazily
let stop = () => {}; requestAnimationFrame(() => { stop = initHero($('#hero-canvas')) })
addEventListener('pagehide', () => stop())
