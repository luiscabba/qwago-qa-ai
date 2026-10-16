var self = { cv: document.getElementById("owl") };
function initOwl(tries) {
const T = window.THREE;
if (self._dead || self._r || !self.cv) return;
if (!T) { if (tries < 80) setTimeout(() => initOwl(tries + 1), 150); return; }
const cv = self.cv;
let r;
try { r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch (e) { return; }
self._r = r;
r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
r.setSize(340, 340, false);
r.outputEncoding = T.sRGBEncoding;
r.toneMapping = T.ACESFilmicToneMapping;
r.toneMappingExposure = 1.0;
const scene = new T.Scene();
const cam = new T.PerspectiveCamera(28, 1, 0.1, 50);
cam.position.set(0, 0.2, 5.4);
cam.lookAt(0, 0, 0);

// soft studio environment
const es = new T.Scene();
const sg = new T.SphereGeometry(10, 32, 16);
const pos = sg.attributes.position, cols = [];
const top = new T.Color('#ffffff'), bot = new T.Color('#b9addf'), tmp = new T.Color();
for (let i = 0; i < pos.count; i++) { const t = (pos.getY(i) / 10 + 1) / 2; tmp.copy(bot).lerp(top, Math.pow(t, 1.4)); cols.push(tmp.r, tmp.g, tmp.b); }
sg.setAttribute('color', new T.Float32BufferAttribute(cols, 3));
es.add(new T.Mesh(sg, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide })));
const sb = new T.Mesh(new T.PlaneGeometry(6, 3), new T.MeshBasicMaterial({ color: '#ffffff', side: T.DoubleSide }));
sb.position.set(-2, 7, 4); sb.lookAt(0, 0, 0); es.add(sb);
const rb = new T.Mesh(new T.PlaneGeometry(3, 6), new T.MeshBasicMaterial({ color: new T.Color('#5fd3c4').multiplyScalar(1.2), side: T.DoubleSide }));
rb.position.set(6, 1, -5); rb.lookAt(0, 0, 0); es.add(rb);
const pm = new T.PMREMGenerator(r);
scene.environment = pm.fromScene(es, 0.04).texture;
pm.dispose();

// fine sandblasted grain
const N = 256, gc = document.createElement('canvas'); gc.width = gc.height = N;
const gx = gc.getContext('2d'), img = gx.createImageData(N, N), dd = img.data;
const hsh = (x, y, s) => { const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); };
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const v = Math.round((0.55 + (hsh(x, y, 1) - 0.5) * 0.5 + (hsh(x >> 2, y >> 2, 2) - 0.5) * 0.25) * 255); const i = (y * N + x) * 4; dd[i] = dd[i + 1] = dd[i + 2] = v; dd[i + 3] = 255; }
gx.putImageData(img, 0, 0);
const grain = new T.CanvasTexture(gc); grain.wrapS = grain.wrapT = T.RepeatWrapping; grain.repeat.set(3, 3);

// owl silhouette
const s = new T.Shape();
s.moveTo(-0.6, 0.38);
s.lineTo(-0.63, 0.71);
s.quadraticCurveTo(-0.64, 0.81, -0.55, 0.76);
s.lineTo(-0.26, 0.53);
s.quadraticCurveTo(0, 0.6, 0.26, 0.53);
s.lineTo(0.55, 0.76);
s.quadraticCurveTo(0.64, 0.81, 0.63, 0.71);
s.lineTo(0.6, 0.38);
s.quadraticCurveTo(0.78, 0.08, 0.72, -0.3);
s.quadraticCurveTo(0.6, -0.86, 0, -0.88);
s.quadraticCurveTo(-0.6, -0.86, -0.72, -0.3);
s.quadraticCurveTo(-0.78, 0.08, -0.6, 0.38);
const D = 0.32, BT = 0.08;
const geo = new T.ExtrudeGeometry(s, { depth: D, bevelEnabled: true, bevelThickness: BT, bevelSize: 0.07, bevelSegments: 10, curveSegments: 40 });
geo.translate(0, 0, -D / 2);
const FZ = D / 2 + BT;
const body = new T.MeshStandardMaterial({ color: '#3f24a0', roughness: 0.86, metalness: 0, envMapIntensity: 0.65, bumpMap: grain, bumpScale: 0.0035, roughnessMap: grain });
const white = new T.MeshStandardMaterial({ color: '#f5f2fc', roughness: 0.72, metalness: 0, envMapIntensity: 0.55, bumpMap: grain, bumpScale: 0.002 });
const dark = new T.MeshStandardMaterial({ color: '#21145c', roughness: 0.45, metalness: 0, envMapIntensity: 0.8 });
[body, white, dark].forEach((m) => m.color.convertSRGBToLinear());
const owl = new T.Group();
owl.add(new T.Mesh(geo, body));
[-1, 1].forEach((side) => {
const ring = new T.Mesh(new T.TorusGeometry(0.2, 0.052, 32, 96), white);
ring.position.set(side * 0.26, 0.04, FZ - 0.01);
owl.add(ring);
});
const bs = new T.Shape();
bs.moveTo(-0.075, 0); bs.lineTo(0.075, 0); bs.lineTo(0, -0.13); bs.lineTo(-0.075, 0);
const bg = new T.ExtrudeGeometry(bs, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 4 });
const beak = new T.Mesh(bg, white);
beak.position.set(0, -0.13, FZ - 0.012);
owl.add(beak);
const line = new T.Mesh(new T.CylinderGeometry(0.024, 0.024, 0.3, 20), white);
line.position.set(0.15, -0.6, FZ - 0.008);
owl.add(line);
[-0.45, -0.75].forEach((y) => { const cap = new T.Mesh(new T.SphereGeometry(0.024, 20, 10), white); cap.position.set(0.15, y, FZ - 0.008); owl.add(cap); });
const holder = new T.Group();
holder.add(owl);
scene.add(holder);
owl.rotation.x = -0.06;

// lighting
const key = new T.DirectionalLight('#ffffff', 1.5); key.position.set(-2.5, 3.5, 4); scene.add(key);
const fill = new T.DirectionalLight('#b8a8ff', 0.5); fill.position.set(3, -1.5, 2.5); scene.add(fill);
const rimA = new T.DirectionalLight('#5fd3c4', 1.6); rimA.position.set(3.5, 1.5, -3); scene.add(rimA);
const rimB = new T.DirectionalLight('#9a85ff', 1.4); rimB.position.set(-3.5, 1, -3); scene.add(rimB);
scene.add(new T.AmbientLight('#e6e0ff', 0.3));

// motion
const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const spin = reduce ? 0 : 0.0042;
let drag = null, vy = 0, vx = 0;
holder.rotation.y = -0.5;
cv.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY }; try { cv.setPointerCapture(e.pointerId); } catch (er) {} cv.style.cursor = 'grabbing'; });
cv.addEventListener('pointermove', (e) => { if (!drag) return; vy = (e.clientX - drag.x) * 0.008; vx = (e.clientY - drag.y) * 0.008; drag.x = e.clientX; drag.y = e.clientY; holder.rotation.y += vy; holder.rotation.x = Math.max(-0.7, Math.min(0.7, holder.rotation.x + vx)); });
const up = () => { drag = null; cv.style.cursor = 'grab'; };
cv.addEventListener('pointerup', up);
cv.addEventListener('pointercancel', up);
const t0 = performance.now();
const frame = (now) => {
if (self._dead) return;
self._raf = requestAnimationFrame(frame);
const t = (now - t0) / 1000;
if (!drag) { holder.rotation.y += spin + vy; vy *= 0.94; holder.rotation.x *= 0.985; }
holder.position.y = reduce ? 0 : 0.07 * (1 - Math.cos(t * Math.PI / 3));
r.render(scene, cam);
};
self._raf = requestAnimationFrame(frame);
}
initOwl(0);
