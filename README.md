==============================
Skill Tree UI – README (EN/TR)
ENGLISH
==============================

Overview
This project provides a 3-layer, radial, symmetric skill tree (center → ring1 → ring2 → ring3).
Only the center node is visible at start; clicking expands children on a symmetric arc.
All counts, distances, and sizes are controlled from a single CONFIG block in script.js.

File Structure
index.html — UI skeleton (top radial controls, bottom buttons, canvas and scene)

style.css — visuals (font, hover scaling, icon/border layering, buttons)

script.js — layout, interactions, line drawing, 2D panning

img/ — images
background.png, base.png, button1.png, radial_red.png
testskill.png
skill_border1.png (center), skill_border2.png (ring1),
skill_border3.png (ring2), skill_border4.png (ring3)

fonts/Hogwarts.woff — font for labels and buttons

How to Run
Open with any local HTTP server (e.g., VSCode Live Server), or double-click index.html if paths are correct.

Customize – Counts & Distances

js
// Sizes (px)
const SIZE = {
  center: 175,  // skill_border1
  r1:     150,  // skill_border2
  r2:     100,  // skill_border3
  r3:      80   // skill_border4
};

// Layer settings
const CONFIG = {
  r1: {                 // Ring 1 (border2)
    count: 6,           // total nodes on ring 1 (e.g., 1, 4, 6)
    radiusFromCenter: 260
  },
  r2: {                 // Ring 2 (border3)
    perParent: 3,       // children per r1 node
    arcDeg: 120,        // arc width around parent direction (symmetric)
    distFromR1: 120,    // r1 -> r2 radial distance
    clearance: 60       // extra spacing between r1 and r2
  },
  r3: {                 // Ring 3 (border4)
    perParent: 3,       // children per r2 node (symmetric)
    distFromR2: 100,    // r2 -> r3 radial distance
    gap: 60,            // tangent spacing between r3 siblings
    clearance: 20       // extra spacing between r2 and r3
  }
};

Quick Examples
1–3–3 layout → r1.count = 1, r2.perParent = 3, r3.perParent = 3

Wider arc for ring 2 → increase r2.arcDeg (e.g., 150)

Increase layer spacing → raise r2.distFromR1 and/or r3.distFromR2

Spread ring 3 siblings → raise r3.gap

Change visual size → adjust values in SIZE

Points & Activation
js
const COST = { center: 0, r1: 2, r2: 1, r3: 1 };
Center starts active and costs 0.

First click on a node (with sufficient points) activates it (icon becomes colored).

On its first click, a node also expands its children.

The top radial shows current points; initial value can be changed in HTML or in script.js.

Connection Lines
Lines are drawn on canvas.

Active-to-active is dark red; otherwise gray.

Each line has a white contour and a subtle shadow for readability.

Panning (Mouse & Trackpad)
Drag with left mouse button → pan in all directions.

Trackpad / wheel → 2D pan (both X and Y).
Adjust speed in script.js:

js
tree.addEventListener('wheel', (e)=>{
  e.preventDefault();
  const speed = 1;       // lower = slower (e.g., 0.6), higher = faster (e.g., 1.5)
  panX -= e.deltaX * speed;
  panY -= e.deltaY * speed;
  applyPan();
}, { passive:false });
Button step size (up/down):

js
panY -= 120; // or +120; change 120 to adjust step
Hover Scaling (Icon + Border Together)
In style.css:

css
.skill{ transition: transform .18s ease; transform-origin: 50% 50%; }
.skill:hover{ transform: scale(1.08); }
Both icon and border scale together.

Reset / Accept
Reset: clears the tree, restores points (default 90), shows center only.

Accept: logs current state as JSON. For FiveM/NUI, post it instead:

js
function acceptTree(){
  const state = nodes.map(n=>({...}));
  // fetch(`https://${GetParentResourceName()}/skillStates`, {
  //   method:'POST', headers:{'Content-Type':'application/json'},
  //   body: JSON.stringify(state)
  // });
  console.log('ACCEPT STATE', state);
}
Troubleshooting
Images not showing → verify paths and filenames under /img

Font not applied → ensure fonts/Hogwarts.woff exists and clear cache

Overlapping nodes → increase arcDeg, gap, clearance, or distances

Pan speed feels off → change the speed multiplier in wheel handler

==============================
TÜRKÇE
==============================

Genel Bakış
Bu proje merkezden açılan 3 katmanlı, simetrik, dairesel bir skill ağacı sunar (merkez → 1. halka → 2. halka → 3. halka).
Başlangıçta yalnızca merkez görünür; tıklayınca çocuklar simetrik bir yay üzerinde açılır.
Tüm adet/mesafe/boyut ayarları script.js içindeki CONFIG’ten yönetilir.

Dosya Yapısı
index.html — UI iskeleti (üst radial kontroller, alt butonlar, canvas ve sahne)

style.css — görünüm (font, hover ölçekleme, ikon/border katmanları, butonlar)

script.js — yerleşim, etkileşim, çizgi çizimi, 2D pan

img/ — görseller
background.png, base.png, button1.png, radial_red.png
testskill.png
skill_border1.png (merkez), skill_border2.png (1. halka),
skill_border3.png (2. halka), skill_border4.png (3. halka)

fonts/Hogwarts.woff — yazı tipi

Çalıştırma
Herhangi bir yerel HTTP sunucusu ile aç (ör. VSCode Live Server) veya yol/adlar doğruysa index.html’i çift tıkla.

Özelleştirme – Sayılar & Mesafeler
script.js içindeki şu blokları düzenle:

js
Kopyala
Düzenle
// Boyutlar (px)
const SIZE = {
  center: 175,  // skill_border1
  r1:     150,  // skill_border2
  r2:     100,  // skill_border3
  r3:      80   // skill_border4
};

// Katman ayarları
const CONFIG = {
  r1: {                 // 1. halka (border2)
    count: 6,           // halka 1 toplam adet (örn: 1, 4, 6)
    radiusFromCenter: 260
  },
  r2: {                 // 2. halka (border3)
    perParent: 3,       // her r1 düğümüne kaç çocuk
    arcDeg: 120,        // r1 yönü etrafında yay genişliği (simetrik dağıtılır)
    distFromR1: 120,    // r1 -> r2 mesafe
    clearance: 60       // r1–r2 arası ekstra hava
  },
  r3: {                 // 3. halka (border4)
    perParent: 3,       // her r2 düğümüne kaç çocuk (simetrik)
    distFromR2: 100,    // r2 -> r3 mesafe
    gap: 60,            // r3 kardeşler arasında tangent boşluk (yayılma)
    clearance: 20       // r2–r3 arası ekstra hava
  }
};
Hızlı Örnekler
1–3–3 düzeni → r1.count = 1, r2.perParent = 3, r3.perParent = 3

halka yayı daha geniş → r2.arcDeg değerini yükselt (örn: 150)

Katmanlar arası mesafe → r2.distFromR1 ve/veya r3.distFromR2 artır

halka daha seyrek → r3.gap artır

Görsel boyut → SIZE değerlerini değiştir

Puan & Aktivasyon
js
Kopyala
Düzenle
const COST = { center: 0, r1: 2, r2: 1, r3: 1 };
Merkez aktif başlar, puan harcatmaz.

Bir düğüme ilk tıklama (puan yeterliyse) düğümü aktif yapar (ikon renklenir).

İlk tıklamada düğüm sadece bir kez çocuklarını açar.

Üstteki kırmızı dairede puan görünür; başlangıç değeri HTML’de veya script.js’de değiştirilebilir.

Bağlantı Çizgileri
Çizgiler canvas’a çizilir.

Aktif–aktif bağlantı koyu kırmızı, diğerleri gri.

Okunabilirlik için beyaz kontur ve hafif gölge uygulanır.

Pan/Scroll (Mouse & Trackpad)
Sol tuş basılı sürükle → her yöne pan

Trackpad / tekerlek → 2D pan (X ve Y birlikte)
Hızı script.js’te ayarla:

js
Kopyala
Düzenle
tree.addEventListener('wheel', (e)=>{
  e.preventDefault();
  const speed = 1;  // 0.6 daha yavaş, 1.5 daha hızlı
  panX -= e.deltaX * speed;
  panY -= e.deltaY * speed;
  applyPan();
}, { passive:false });
Buton adımı (yukarı/aşağı):

js
Kopyala
Düzenle
panY -= 120; // veya +120; adımı değiştirmek için 120’yi düzenle
Hover Ölçekleme (İkon + Border Birlikte)
style.css’te:

css
Kopyala
Düzenle
.skill{ transition: transform .18s ease; transform-origin: 50% 50%; }
.skill:hover{ transform: scale(1.08); }
İkon ve border birlikte büyür.

Reset / Accept
Reset: ağacı sıfırlar, puanı 90’a çeker, sadece merkezi bırakır.

Accept: mevcut durumu JSON olarak console.log’lar. FiveM/NUI için post edebilirsiniz:

js
Kopyala
Düzenle
function acceptTree(){
  const state = nodes.map(n=>({...}));
  // fetch(`https://${GetParentResourceName()}/skillStates`, {
  //   method:'POST', headers:{'Content-Type':'application/json'},
  //   body: JSON.stringify(state)
  // });
  console.log('ACCEPT STATE', state);
}
Sorun Giderme
Görseller görünmüyor → /img altındaki ad ve yolları kontrol et

Font değişmedi → fonts/Hogwarts.woff mevcut mu? Tarayıcı önbelleğini temizle

Düğümler çakışıyor → arcDeg, gap, clearance ve mesafeleri artır

Pan hızı uygun değil → wheel handler içindeki speed çarpanını değiştir

## 📜 Lisans

<a href="https://creativecommons.org">Custom Skill Tree UI / UX</a> © 2025 by 
<a href="https://creativecommons.org">Serhat Kaş</a> 
is licensed under 
<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>  
<img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC" style="max-width: 1em; max-height:1em; margin-left: .2em;">
<img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY" style="max-width: 1em; max-height:1em; margin-left: .2em;">

