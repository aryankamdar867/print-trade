/**
 * PRINT TRADE (रंगतरंग) PUNE — NON-AI EDITORIAL INTERACTIVE ENGINE
 * Features:
 * 1. Photorealistic 3D Visiting Card with Inertia Tilt, Hologram Glare & 360° Flip
 * 2. vCard (.vcf) Instant Mobile Contact Exporter
 * 3. Interactive 3D Pantone Swatch Fan Deck
 * 4. Bar Blanket Workshop Calculator & Live IST Operating Hours
 */

// =================================================================
// 1. PHOTOREALISTIC 3D VISITING CARD PHYSICS & INTERACTION
// =================================================================
let isCardFlipped = false;
let cardElement, cardStage;
let currentTiltX = 0, currentTiltY = 0;
let targetTiltX = 0, targetTiltY = 0;

function init3DVisitingCard() {
  cardStage = document.getElementById('card-3d-stage');
  cardElement = document.getElementById('card-3d');
  if (!cardStage || !cardElement) return;

  const glareFront = document.getElementById('card-glare-front');
  const glareBack = document.getElementById('card-glare-back');

  // Mouse Move Tilt & Holographic Foil Reflection
  cardStage.addEventListener('mousemove', (e) => {
    const rect = cardStage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    // Smooth target angle calculation (Max 18 degrees tilt)
    targetTiltY = x * 36;
    targetTiltX = -y * 28;

    // Glare position (percentage)
    const glareX = ((x + 0.5) * 100).toFixed(1);
    const glareY = ((y + 0.5) * 100).toFixed(1);

    const activeGlare = isCardFlipped ? glareBack : glareFront;
    if (activeGlare) {
      activeGlare.style.setProperty('--glare-x', `${glareX}%`);
      activeGlare.style.setProperty('--glare-y', `${glareY}%`);
      activeGlare.style.setProperty('--glare-opacity', '0.7');
    }
  });

  // Mouse Leave: Settle card back to level position
  cardStage.addEventListener('mouseleave', () => {
    targetTiltX = 0;
    targetTiltY = 0;
    if (glareFront) glareFront.style.setProperty('--glare-opacity', '0');
    if (glareBack) glareBack.style.setProperty('--glare-opacity', '0');
  });

  // Click on card or stage flips the card
  cardStage.addEventListener('click', (e) => {
    // If clicking a link or button inside, let it handle naturally
    if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button') {
      return;
    }
    flipCardManual();
  });

  // Touch Support for mobile devices
  cardStage.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = cardStage.getBoundingClientRect();
      const t = e.touches[0];
      const x = (t.clientX - rect.left) / rect.width - 0.5;
      const y = (t.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = x * 28;
      targetTiltX = -y * 22;
    }
  }, { passive: true });

  cardStage.addEventListener('touchend', () => {
    targetTiltX = 0;
    targetTiltY = 0;
  });

  // Continuous physics interpolation loop (Inertia damping)
  function cardPhysicsLoop() {
    requestAnimationFrame(cardPhysicsLoop);

    currentTiltX += (targetTiltX - currentTiltX) * 0.12;
    currentTiltY += (targetTiltY - currentTiltY) * 0.12;

    const baseFlip = isCardFlipped ? 180 : 0;
    cardElement.style.transform = `rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${(baseFlip + currentTiltY).toFixed(2)}deg) translateZ(10px)`;
  }
  cardPhysicsLoop();
}

function flipCardManual() {
  if (!cardElement) return;

  cardElement.classList.add('flipping');
  isCardFlipped = !isCardFlipped;

  // Clear flipping class after spring animation
  setTimeout(() => {
    cardElement.classList.remove('flipping');
  }, 700);
}

// =================================================================
// 2. VCARD (.VCF) CONTACT EXPORTER (ONE-CLICK SMARTPHONE SAVE)
// =================================================================
function downloadVCard() {
  const vcardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Satish Khose - Print Trade Pune',
    'N:Khose;Satish;;;',
    'ORG:Print Trade (रंगतरंग)',
    'TITLE:Offset Inks & Bar Blankets Specialist',
    'TEL;TYPE=CELL,VOICE:+919422234377',
    'TEL;TYPE=CELL,VOICE:+919823154377',
    'TEL;TYPE=WORK,VOICE:02024463099',
    'EMAIL;TYPE=WORK:satish_khose@rediffmail.com',
    'ADR;TYPE=WORK:;;Shop No. 5, Swamikrupa CHS, 187, Shinde Ali Rd, Shukrawar Peth;Pune;Maharashtra;411002;India',
    'NOTE:GSTIN: 27AIFPK7547K1ZS. Offset Matching Inks, Bar Blankets, Damping Clothes & Press Chemicals.',
    'URL:https://maps.google.com/?q=Print+Trade+Shukrawar+Peth+Pune',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Print_Trade_Satish_Khose.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// =================================================================
// 3. 3D PANTONE SWATCH FAN DECK INTERACTION
// =================================================================
function initSwatchFanDeck() {
  const container = document.getElementById('fan-deck-container');
  const slider = document.getElementById('fan-slider');
  const angleText = document.getElementById('fan-angle-text');
  const readoutCode = document.getElementById('readout-code');
  const readoutDelta = document.getElementById('readout-delta');
  const readoutDesc = document.getElementById('readout-desc');

  if (!container || !slider) return;

  // Handle Spread Angle Slider
  slider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    const ratio = val / 45; // 45deg is default base
    container.style.setProperty('--fan-spread', ratio);
    if (angleText) angleText.textContent = `${val}°`;
  });

  // Handle Blade Hover & Click
  const blades = document.querySelectorAll('.swatch-blade');
  blades.forEach(blade => {
    blade.addEventListener('mouseenter', () => {
      blades.forEach(b => b.classList.remove('active-blade'));
      blade.classList.add('active-blade');

      const code = blade.getAttribute('data-code');
      const color = blade.getAttribute('data-color');
      const delta = blade.getAttribute('data-delta');
      const desc = blade.getAttribute('data-desc');

      if (readoutCode) {
        readoutCode.textContent = code;
        readoutCode.style.backgroundColor = color;
      }
      if (readoutDelta) {
        readoutDelta.textContent = `${delta} (Passed)`;
      }
      if (readoutDesc) {
        readoutDesc.textContent = desc;
      }
    });
  });
}

// =================================================================
// 4. BAR BLANKET WORKSHOP CALCULATOR
// =================================================================
function setPressSpec(machineName, width, length, gauge) {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    if (btn.textContent.includes(machineName)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (width) document.getElementById('in-width').value = width;
  if (length) document.getElementById('in-length').value = length;
  if (gauge) document.getElementById('in-gauge').value = gauge;
}

function dispatchBlanketWhatsApp() {
  const width = document.getElementById('in-width').value;
  const length = document.getElementById('in-length').value;
  const gauge = document.getElementById('in-gauge').value;
  const bars = document.getElementById('in-bars').value;
  const qty = document.getElementById('in-qty').value;

  const msg = `Hello Print Trade Pune (Satish Khose ji), I would like a quote for Bar Blankets:%0A- Press Cylinder Dimensions: ${width} mm x ${length} mm%0A- Thickness Gauge: ${gauge}%0A- Bar Type: ${bars}%0A- Quantity: ${qty} units%0APlease confirm lead time and delivery in Pune.`;
  window.open(`https://wa.me/919422234377?text=${msg}`, '_blank');
}

// =================================================================
// 5. LIVE BUSINESS HOURS CLOCK (PUNE IST)
// =================================================================
function checkStoreStatus() {
  const statusEl = document.getElementById('header-status');
  if (!statusEl) return;

  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (3600000 * 5.5)); // Indian Standard Time (UTC+5:30)
  
  const day = istDate.getDay(); // 0 is Sunday
  const hour = istDate.getHours();
  const minute = istDate.getMinutes();
  const current = hour + (minute / 60);

  if (day === 0) {
    statusEl.textContent = 'Closed on Sunday · Opens Monday 10:00 AM';
    statusEl.parentElement.className = 'inline-flex items-center gap-1.5 text-white/60 font-semibold';
  } else if (current >= 10 && current < 18.5) {
    statusEl.textContent = 'Open Today · Closes 6:30 PM';
    statusEl.parentElement.className = 'inline-flex items-center gap-1.5 text-emerald-400 font-semibold';
  } else {
    statusEl.textContent = 'Closed Now · Opens 10:00 AM';
    statusEl.parentElement.className = 'inline-flex items-center gap-1.5 text-white/60 font-semibold';
  }
}

// =================================================================
// 6. INITIALIZATION
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
  checkStoreStatus();
  setInterval(checkStoreStatus, 60000);

  // Initialize Interactive 3D Visiting Card
  init3DVisitingCard();

  // Initialize 3D Pantone Swatch Fan Deck
  initSwatchFanDeck();
});
