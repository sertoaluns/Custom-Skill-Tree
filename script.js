/* =========================================================
   SKILL TREE – script.js (full, 2D pan enabled)
   =========================================================
   Gerekli elemanlar:
   - #skillTree (div), #skill-lines (canvas)
   - #btnUp, #btnDown, #btnReset, #btnAccept, #skillPoints
   - Görseller: img/testskill.png ve img/skill_border{1..4}.png
========================================================= */
(() => {
  /* =======================
     AYARLAR
     ======================= */
  const VIEW_W = 1920, VIEW_H = 1080;

  // Boyutlar (px)
  const SIZE = {
    center: 175,       // skill_border1
    r1:     150,       // skill_border2
    r2:     100,       // skill_border3
    r3:      80        // skill_border4
  };

  // Mesafeler / adetler
  const CONFIG = {
    r1: { count: 5, radiusFromCenter: 260 },                         // 1. halka
    r2: { perParent: 4, arcDeg: 120, distFromR1: 60, clearance: 60 }, // 2. halka
    r3: { perParent: 3, distFromR2: 30, gap: 60, clearance: 20 }      // 3. halka (tangent)
  };

  // (opsiyonel) puan maliyetleri
  const COST = { center: 0, r1: 2, r2: 1, r3: 1 };

  const deg2rad = d => d * Math.PI / 180;

  /* =======================
     DOM
     ======================= */
  const tree   = document.getElementById('skillTree');
  const canvas = document.getElementById('skill-lines');
  const ctx    = canvas.getContext('2d');

  const btnUp     = document.getElementById('btnUp');
  const btnDown   = document.getElementById('btnDown');
  const btnReset  = document.getElementById('btnReset');
  const btnAccept = document.getElementById('btnAccept');
  const pointsEl  = document.getElementById('skillPoints');

  canvas.width  = VIEW_W;
  canvas.height = VIEW_H;

  let points = Number(pointsEl?.textContent || '90');

  // === 2D PAN ===
  let panX = 0, panY = 0;
  function applyPan(){
    // hem ağacı hem çizgileri aynı transform ile taşı
    tree.style.transform   = `translate(${panX}px, ${panY}px)`;
    canvas.style.transform = `translate(${panX}px, ${panY}px)`;
    redrawLines();
  }

  // kayıtlar
  /** @type {{el:HTMLDivElement, layer:'center'|'r1'|'r2'|'r3', expanded:boolean}[]} */
  const nodes = [];
  /** @type {{a:any,b:any}[]} */
  const edges = [];

  function centerOf(el){
    // transform her ikisine de uygulanıyor; fark aldığımız için doğru relatif merkez bulunur
    const tb = tree.getBoundingClientRect();
    const r  = el.getBoundingClientRect();
    return { x: r.left - tb.left + r.width/2, y: r.top - tb.top + r.height/2 };
  }

  /* =======================
     ÇİZGİLER
     ======================= */
  function redrawLines(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    edges.forEach(({a,b})=>{
      const A = centerOf(a.el), B = centerOf(b.el);
      const aActive = a.el.classList.contains('active');
      const bActive = b.el.classList.contains('active');
      const active = aActive && bActive;

      // beyaz kontur
      ctx.lineWidth = 3; ctx.strokeStyle = 'white';
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();

      // hafif gölge
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(128,128,128,0.5)';
      ctx.beginPath(); ctx.moveTo(A.x+1, A.y+1); ctx.lineTo(B.x+1, B.y+1); ctx.stroke();

      // ana çizgi
      ctx.lineWidth = 2; ctx.strokeStyle = active ? 'darkred' : 'gray';
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
    });
  }

  /* =======================
     NODE OLUŞTURUCU
     ======================= */
  function makeSkill(cx, cy, layer){
    const size = layer==='center'?SIZE.center:layer==='r1'?SIZE.r1:layer==='r2'?SIZE.r2:SIZE.r3;

    const el = document.createElement('div');
    el.className = 'skill';
    el.style.left   = `${cx - size/2}px`;
    el.style.top    = `${cy - size/2}px`;
    el.style.width  = `${size}px`;
    el.style.height = `${size}px`;

    // ikon (ARKA)
    const icon = document.createElement('img');
    icon.className = 'skill-icon';
    icon.src = 'img/testskill.png';

    // border (ÖN) – katmana göre
    const border = document.createElement('img');
    border.className = 'skill-border';
    border.src =
      layer==='center' ? 'img/skill_border1.png' :
      layer==='r1'     ? 'img/skill_border2.png' :
      layer==='r2'     ? 'img/skill_border3.png' :
                         'img/skill_border4.png';

    el.appendChild(icon);
    el.appendChild(border);
    tree.appendChild(el);

    const node = { el, layer, expanded:false };
    nodes.push(node);

    // tıklama: aktif et + ilk tıklamada genişlet
    el.addEventListener('click', e=>{
      e.stopPropagation();

      if(!el.classList.contains('active')){
        const cost = COST[layer] ?? 0;
        if(points < cost) return;
        points -= cost;
        if(pointsEl) pointsEl.textContent = String(points).padStart(2,'0');
        el.classList.add('active');
        icon.classList.add('active');  // filtre kalksın
        redrawLines();
      }

      if(!node.expanded){
        expand(node);
        node.expanded = true;
        redrawLines();
      }
    });

    return node;
  }

  /* =======================
     GENİŞLETME
     ======================= */
  function expand(node){
    if(node.layer==='center') return expandFromCenter(node);
    if(node.layer==='r1')     return expandFromR1(node);
    if(node.layer==='r2')     return expandFromR2(node);
  }

  // Merkez → 1. halka (simetrik 360°)
  function expandFromCenter(core){
    const C = centerOf(core.el);
    for(let i=0;i<CONFIG.r1.count;i++){
      const ang = deg2rad(i*(360/CONFIG.r1.count));
      const x = C.x + CONFIG.r1.radiusFromCenter * Math.cos(ang);
      const y = C.y + CONFIG.r1.radiusFromCenter * Math.sin(ang);
      const n = makeSkill(x,y,'r1');
      edges.push({a:core,b:n});
    }
  }

  // 1. halka → 2. halka (base yön çevresinde yay)
  function expandFromR1(r1Node){
    const core = nodes.find(n=>n.layer==='center');
    const C = centerOf(core.el);
    const P = centerOf(r1Node.el);

    const base  = Math.atan2(P.y - C.y, P.x - C.x);
    const start = base - deg2rad(CONFIG.r2.arcDeg/2);
    const step  = deg2rad(CONFIG.r2.arcDeg/(CONFIG.r2.perParent-1));

    const dist = CONFIG.r2.distFromR1 + CONFIG.r2.clearance + (SIZE.r1/2 + SIZE.r2/2);

    for(let i=0;i<CONFIG.r2.perParent;i++){
      const a = start + i*step;
      const x = P.x + dist * Math.cos(a);
      const y = P.y + dist * Math.sin(a);
      const n = makeSkill(x,y,'r2');
      edges.push({a:r1Node,b:n});
    }
  }

  // 2. halka → 3. halka (tangent eksende simetrik)
  function expandFromR2(r2Node){
    const core = nodes.find(n=>n.layer==='center');
    const C = centerOf(core.el);
    const P = centerOf(r2Node.el);

    const base = Math.atan2(P.y - C.y, P.x - C.x); // radial yön
    const ux = Math.cos(base),  uy = Math.sin(base);
    const tx = -uy,             ty =  Math.cos(base); // tangent yön

    const radial = (SIZE.r2/2 + CONFIG.r3.clearance + SIZE.r3/2 + CONFIG.r3.distFromR2);
    const total  = (CONFIG.r3.perParent - 1) * CONFIG.r3.gap;
    const start  = -total/2;

    for(let i=0;i<CONFIG.r3.perParent;i++){
      const t = start + i*CONFIG.r3.gap;    // tangent ofset
      const cx = P.x + ux*radial + tx*t;
      const cy = P.y + uy*radial + ty*t;
      const n = makeSkill(cx,cy,'r3');
      edges.push({a:r2Node,b:n});
    }
  }

  /* =======================
     BAŞLAT / RESET / ACCEPT
     ======================= */
  function destroyAll(){
    edges.length = 0;
    nodes.forEach(n=>n.el.remove());
    nodes.length = 0;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  function initOnlyCenter(){
    const cx = VIEW_W/2, cy = VIEW_H/2;
    const core = makeSkill(cx,cy,'center');
    core.el.classList.add('active'); // merkez aktif başlar
    core.el.querySelector('.skill-icon')?.classList.add('active');
    redrawLines();
  }

  function resetTree(){
    destroyAll();
    panX = 0; panY = 0; applyPan();
    points = 90; if(pointsEl) pointsEl.textContent = '90';
    initOnlyCenter();
  }

  function acceptTree(){
    const state = nodes.map(n=>({
      layer:n.layer,
      active:n.el.classList.contains('active'),
      x:parseFloat(n.el.style.left)||0,
      y:parseFloat(n.el.style.top)||0
    }));
    console.log('ACCEPT STATE', state);
  }

  // Başlat
  initOnlyCenter();

  // Butonlar (dikey pan kısa yol)
  btnUp   && btnUp.addEventListener('click', ()=>{ panY -= 120; applyPan(); });
  btnDown && btnDown.addEventListener('click', ()=>{ panY += 120; applyPan(); });
  btnReset&& btnReset.addEventListener('click', resetTree);
  btnAccept&&btnAccept.addEventListener('click', acceptTree);

  // === 2D PAN: Drag ile ===
  let dragging=false, sx=0, sy=0, spX=0, spY=0;
  tree.addEventListener('mousedown', e=>{
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    spX = panX;     spY = panY;
  });
  window.addEventListener('mouseup', ()=> dragging=false);
  window.addEventListener('mousemove', e=>{
    if(!dragging) return;
    panX = spX + (e.clientX - sx);
    panY = spY + (e.clientY - sy);
    applyPan();
  });

  // === 2D PAN: Trackpad / Wheel ile ===
  tree.addEventListener('wheel', (e)=>{
    e.preventDefault();          // sayfa scroll’u engelle
    panX -= e.deltaX;            // doğal his için eksi yönde taşı
    panY -= e.deltaY;
    applyPan();
  }, { passive:false });

})();
