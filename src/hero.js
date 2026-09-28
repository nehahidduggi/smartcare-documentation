import { WebGLRenderer, Scene, PerspectiveCamera, Mesh, IcosahedronGeometry, SphereGeometry, MeshStandardMaterial, MeshBasicMaterial, PointLight, AmbientLight, BufferGeometry, Float32BufferAttribute, LineSegments, LineBasicMaterial, Points, PointsMaterial, Group } from 'three'

export function initHero(canvas) {
  const wrap = canvas.parentElement
  let r
  try { r = new WebGLRenderer({ canvas, antialias: true, alpha: true }) } catch { wrap.classList.add('no-webgl'); return () => {} }
  const small = matchMedia('(max-width:700px)').matches
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  const scene = new Scene(), cam = new PerspectiveCamera(45, 1, 0.1, 50); cam.position.z = 7
  scene.add(new AmbientLight(0x88aacc, 0.7)); const pl = new PointLight(0x27c5b4, 60, 20); pl.position.set(3, 3, 5); scene.add(pl)
  const g = new Group(); scene.add(g)
  const core = new Mesh(new SphereGeometry(0.9, small ? 20 : 40, small ? 20 : 40), new MeshStandardMaterial({ color: 0x27c5b4, emissive: 0x0e5f57, roughness: 0.35 })); g.add(core)
  const shell = new Mesh(new IcosahedronGeometry(1.35, 1), new MeshBasicMaterial({ color: 0x27c5b4, wireframe: true, transparent: true, opacity: 0.25 })); g.add(shell)
  const nodes = [0, 1, 2, 3, 4].map(i => ({ m: new Mesh(new SphereGeometry(0.16, 16, 16), new MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x4c3a8a })), a: (i / 5) * Math.PI * 2, tilt: (i - 2) * 0.35, sp: 0.25 + i * 0.03 }))
  nodes.forEach(n => g.add(n.m))
  const lg = new BufferGeometry(); const pos = new Float32Array(20 * 3); lg.setAttribute('position', new Float32BufferAttribute(pos, 3))
  g.add(new LineSegments(lg, new LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.45 })))
  const pn = small ? 50 : 140, pp = new Float32Array(pn * 3)
  for (let i = 0; i < pn * 3; i++) pp[i] = (Math.random() - 0.5) * 12
  const pg = new BufferGeometry(); pg.setAttribute('position', new Float32BufferAttribute(pp, 3))
  const pts = new Points(pg, new PointsMaterial({ color: 0x94a3b8, size: 0.03, transparent: true, opacity: 0.6 })); scene.add(pts)
  let px = 0, py = 0, tx = 0, ty = 0, t = 0, raf = 0, on = false
  const move = e => { const b = wrap.getBoundingClientRect(); tx = ((e.clientX - b.left) / b.width - 0.5) * 0.6; ty = ((e.clientY - b.top) / b.height - 0.5) * 0.4 }
  const frame = () => {
    t += 0.01
    nodes.forEach((n, i) => { const a = n.a + t * n.sp * 6; n.m.position.set(Math.cos(a) * 2.4, Math.sin(a) * 2.4 * Math.sin(n.tilt + 0.6), Math.sin(a) * 1.4) })
    for (let i = 0; i < 5; i++) { const a = nodes[i].m.position, b = nodes[(i + 1) % 5].m.position
      pos.set([0, 0, 0, a.x, a.y, a.z], i * 6); pos.set([a.x, a.y, a.z, b.x, b.y, b.z], 30 + i * 6) }
    lg.attributes.position.needsUpdate = true
    shell.rotation.y = t * 0.6; pts.rotation.y = t * 0.05
    px += (tx - px) * 0.05; py += (ty - py) * 0.05; g.rotation.y = px; g.rotation.x = py
    r.render(scene, cam)
    if (on && !still) raf = requestAnimationFrame(frame)
  }
  const size = () => { const w = wrap.clientWidth, h = wrap.clientHeight; r.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2)); r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); if (still || !on) frame() }
  const ro = new ResizeObserver(size); ro.observe(wrap)
  const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; cancelAnimationFrame(raf); if (on) frame() }); io.observe(wrap)
  if (!still) wrap.addEventListener('pointermove', move)
  size()
  return () => { on = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); wrap.removeEventListener('pointermove', move); scene.traverse(o => { o.geometry?.dispose(); o.material?.dispose() }); r.dispose() }
}
