const DESIGN_W = 1490;
const DESIGN_H = 838;

const COLOR = {
  pillFill: 0xefe6f6,
  pillFillTop: 0xf2e7f4,
  pillFillBottom: 0xc8bdde,
  pillStroke: 0xb9aecb,
  textDark: 0x3d3c51,
  textWhite: 0xffffff,
  textStroke: 0x1a1730,
  orange: 0xff7918,
};

const SPRITE_FILES = {
  Coins: 'Coins.png',
  Diamonds: 'Diamonds.png',
  Energy: 'Energy.png',
  Stars: 'Stars.png',
  starsCounter: 'starsCounter.png',
  currencyCounter: 'currencyCounter.png',
  currencyCounter_timer: 'currencyCounter_timer.png',
  eventTimer: 'eventTimer.png',
  bg_resourcebar: 'bg_resourcebar.png',
  Options: 'Options.png',
  plusButton: 'plusButton.png',
  redHint: 'redHint.png',
  mainOffer_1: 'mainOffer_1.png',
  mainOfferTimer: 'mainOfferTimer.png',
  bankButton: 'bankButton.png',
  button_chat: 'button_chat.png',
  button_collections: 'button_collections.png',
  tasks: 'tasks.png',
  Mini_events: 'Mini_events.png',
  Mini_events_locked: 'Mini_events_locked.png',
  playButtonEmpty: 'playButtonEmpty.png',
  playButtonArrow: 'playButtonArrow.png',
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load ' + src));
    img.src = src;
  });
}

async function boot() {
  const keys = Object.keys(SPRITE_FILES);
  const loadedImages = await Promise.all(
    keys.map((key) => loadImage('sprites/' + SPRITE_FILES[key]))
  );
  const images = {};
  keys.forEach((key, i) => { images[key] = loadedImages[i]; });

  const config = {
    type: Phaser.CANVAS,
    width: DESIGN_W,
    height: DESIGN_H,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
      create: function () { create.call(this, images); },
    },
  };

  new Phaser.Game(config);
}

boot();

function create(images) {
  Object.keys(images).forEach((key) => this.textures.addImage(key, images[key]));

  function gradientPillTexture(w, h) {
    const key = 'pillGrad_' + w + '_' + h;
    if (!this.textures.exists(key)) {
      const tex = this.textures.createCanvas(key, w, h);
      const ctx = tex.getContext();
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#f2e7f4');
      grad.addColorStop(1, '#c8bdde');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      tex.refresh();
    }
    return key;
  }

  function maskedGradientFill(x, y, w, h, drawPath) {
    const key = gradientPillTexture.call(this, w, h);
    const img = this.add.image(x, y, key).setOrigin(0);
    const maskShape = this.make.graphics({ x, y });
    maskShape.fillStyle(0xffffff, 1);
    drawPath(maskShape, 0, 0);
    const mask = maskShape.createGeometryMask();
    img.setMask(mask);
    return img;
  }

  function resourceBarPath(g, ox, oy, w, h, r) {
    g.beginPath();
    g.moveTo(ox, oy);
    g.lineTo(ox + w - r, oy);
    g.arc(ox + w - r, oy + r, r, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(360), false);
    g.lineTo(ox + w, oy + h - r);
    g.arc(ox + w - r, oy + h - r, r, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(90), false);
    g.lineTo(ox, oy + h);
    g.closePath();
  }

  function coinTimerBarPath(g, ox, oy, w, h) {
    const r = 15;
    g.beginPath();
    g.moveTo(ox, oy);
    g.lineTo(ox + w - r, oy);
    g.arc(ox + w - r, oy + r, r, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(360), false);
    g.lineTo(ox + w, oy + h - 21);
    g.lineTo(ox + w - 20, oy + h);
    g.lineTo(ox + 18, oy + h);
    g.lineTo(ox, oy + h - 18);
    g.closePath();
  }

  function starPillPath(g, ox, oy, w, h, r, cut) {
    g.beginPath();
    g.moveTo(ox, oy);
    g.lineTo(ox + w - r, oy);
    g.lineTo(ox + w, oy + r);
    g.lineTo(ox + w - cut, oy + h);
    g.lineTo(ox + cut, oy + h);
    g.lineTo(ox, oy + h - cut);
    g.closePath();
  }

  function starPill(x, y, w, h, r, cut) {
    maskedGradientFill.call(this, x, y, w, h, (g, ox, oy) => { starPillPath(g, ox, oy, w, h, r, cut); g.fillPath(); });
    const gr = this.add.graphics();
    gr.lineStyle(1, COLOR.pillStroke, 0.8);
    starPillPath(gr, x, y, w, h, r, cut);
    gr.strokePath();
    return gr;
  }

  function pill(x, y, w, h, r) {
    maskedGradientFill.call(this, x, y, w, h, (g, ox, oy) => g.fillRoundedRect(ox, oy, w, h, r));
    const gr = this.add.graphics();
    gr.lineStyle(2, COLOR.pillStroke, 1);
    gr.strokeRoundedRect(x, y, w, h, r);
    return gr;
  }

  function resourceBar(x, y, w, h, r) {
    maskedGradientFill.call(this, x, y, w, h, (g, ox, oy) => { resourceBarPath(g, ox, oy, w, h, r); g.fillPath(); });
    const gr = this.add.graphics();
    gr.lineStyle(1, COLOR.pillStroke, 0.6);
    resourceBarPath(gr, x, y, w, h, r);
    gr.strokePath();
    return gr;
  }

  function coinTimerBar(x, y, w, h) {
    maskedGradientFill.call(this, x, y, w, h, (g, ox, oy) => { coinTimerBarPath(g, ox, oy, w, h); g.fillPath(); });
    const gr = this.add.graphics();
    gr.lineStyle(1, COLOR.pillStroke, 0.6);
    coinTimerBarPath(gr, x, y, w, h);
    gr.strokePath();
    return gr;
  }

  function darkText(x, y, text, size, strokeThickness = 0) {
    return this.add.text(x, y, text, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: size + 'px',
      fontStyle: 'bold',
      color: '#3d3c51',
      stroke: '#3d3c51',
      strokeThickness,
    }).setOrigin(0.5);
  }

  function coloredText(x, y, text, size, color) {
    return this.add.text(x, y, text, {
      fontFamily: 'Arial, sans-serif',
      fontSize: size + 'px',
      fontStyle: 'bold',
      color,
      stroke: color,
      strokeThickness: 1,
    }).setOrigin(0.5);
  }

  function whiteLabel(x, y, text, size, strokeThickness = 4) {
    return this.add.text(x, y, text, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: size + 'px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#1a1730',
      strokeThickness,
    }).setOrigin(0.5);
  }

  function icon(key, x, y, w, h) {
    const img = this.add.image(x, y, key);
    img.setDisplaySize(w, h);
    return img;
  }

  function iconShadow(key, x, y, w, h, dx = 3, dy = 4, alpha = 0.32) {
    const img = this.add.image(x + dx, y + dy, key);
    img.setDisplaySize(w, h);
    img.setTint(0x16131f);
    img.setAlpha(alpha);
    return img;
  }

  function redBadge(x, y, size, showMark = true) {
    if (!showMark) {
      const img = this.add.image(x, y, 'redHint');
      img.setDisplaySize(size, size);
      return img;
    }
    const r = size / 2;
    const gr = this.add.graphics();
    gr.fillStyle(0xe7002c, 1);
    gr.fillCircle(x, y, r);
    gr.fillStyle(0xffffff, 1);
    const stemW = size * 0.16;
    gr.fillRoundedRect(x - stemW / 2, y - size * 0.32, stemW, size * 0.42, stemW / 2);
    gr.fillCircle(x, y + size * 0.27, stemW * 0.6);
    return gr;
  }

  function diamondBadge(cx, cy, side, label, labelSize) {
    const gr = this.add.graphics();
    gr.fillStyle(COLOR.pillFill, 1);
    gr.lineStyle(2, COLOR.pillStroke, 1);
    gr.save();
    const box = new Phaser.Geom.Rectangle(-side / 2, -side / 2, side, side);
    gr.translateCanvas(cx, cy);
    gr.rotateCanvas(Phaser.Math.DegToRad(45));
    gr.fillRoundedRect(box.x, box.y, box.width, box.height, side * 0.18);
    gr.strokeRoundedRect(box.x, box.y, box.width, box.height, side * 0.18);
    gr.restore();
    darkText.call(this, cx, cy, label, labelSize !== undefined ? labelSize : Math.round(side * 0.42), 1);
  }

  function sideButton(opts) {
    const { x, y, w, h, key, iconW, iconH, label, hasBadge, labelY, labelSize = 19, labelStroke = 4, badgeX, badgeY, badgeSize = 26, shadow = true } = opts;
    if (shadow) iconShadow.call(this, key, x + w / 2, y + h / 2, iconW, iconH);
    icon.call(this, key, x + w / 2, y + h / 2, iconW, iconH);
    whiteLabel.call(this, x + w / 2, labelY !== undefined ? labelY : y + h + 14, label, labelSize, labelStroke);
    if (hasBadge) {
      redBadge.call(this, badgeX !== undefined ? badgeX : x + w - 6, badgeY !== undefined ? badgeY : y + 6, badgeSize);
    }
  }

  this.cameras.main.setBackgroundColor('#000000');
  const bg = this.add.graphics();
  bg.fillStyle(0x232323, 1);
  bg.fillRect(0, 0, DESIGN_W, 1);
  bg.fillStyle(0x141414, 1);
  bg.fillRect(0, DESIGN_H - 2, DESIGN_W, 2);

  diamondBadge.call(this, 70, 66, 36, '3', 25);

  pill.call(this, 36, 100, 68, 26, 13);
  darkText.call(this, 70, 113, '2d 20h', 16);

  starPill.call(this, 190, 23, 71, 35, 3, 6);
  icon.call(this, 'Stars', 187, 42, 58, 58);
  darkText.call(this, 230, 39, '0', 20);

  sideButton.call(this, {
    x: 9, y: 144, w: 106, h: 84,
    key: 'tasks', iconW: 114, iconH: 118,
    label: 'Tasks', hasBadge: true, labelY: 228, labelSize: 20, labelStroke: 1, badgeX: 104, badgeY: 169, badgeSize: 28,
  });

  sideButton.call(this, {
    x: 18, y: 269, w: 98, h: 80,
    key: 'button_chat', iconW: 104, iconH: 102,
    label: 'Chat', hasBadge: true, labelY: 349, labelStroke: 2, badgeX: 102, badgeY: 282,
  });

  sideButton.call(this, {
    x: 9, y: 383, w: 110, h: 92,
    key: 'Mini_events', iconW: 103, iconH: 101, shadow: false,
    label: 'Mini-Events', hasBadge: false, labelY: 474, labelSize: 16, labelStroke: 3,
  });

  coinTimerBar.call(this, 886, 22, 120, 56);
  icon.call(this, 'Coins', 869, 39, 57, 57);
  coloredText.call(this, 933, 38, '10000', 19, '#6b687f');
  coloredText.call(this, 939, 62, '01:57', 15, '#3b70b2');
  (function drawCollectDot(scene, x, y) {
    const gr = scene.add.graphics();
    gr.fillStyle(0x180e04, 1);
    gr.fillCircle(x, y, 13);
    gr.fillStyle(0xff7918, 1);
    gr.fillCircle(x, y, 11);
    gr.fillStyle(0xffffff, 1);
    gr.fillTriangle(x - 4.5, y - 1, x + 4.5, y - 1, x, y - 7);
    gr.fillRect(x - 2, y - 1, 4, 8);
  })(this, 893, 66);
  icon.call(this, 'plusButton', 996, 40, 34, 36);

  resourceBar.call(this, 1066, 22, 132, 35, 14);
  icon.call(this, 'Diamonds', 1053, 35, 127, 127);
  coloredText.call(this, 1120, 38, '10000', 19, '#6b687f');
  icon.call(this, 'plusButton', 1182, 40, 34, 36);

  resourceBar.call(this, 1243, 22, 142, 35, 14);
  icon.call(this, 'Energy', 1239, 35, 85, 85);
  coloredText.call(this, 1307, 38, '10000', 19, '#6b687f');
  icon.call(this, 'plusButton', 1369, 40, 34, 36);

  icon.call(this, 'Options', 1456, 39, 56, 56);
  redBadge.call(this, 1474, 22, 26, false);

  const offerX = 1321, offerY = 102, offerW = 170, offerH = 128;
  icon.call(this, 'mainOffer_1', offerX + offerW / 2, offerY + offerH / 2, offerW, offerH);

  (function drawSeal(scene, cx, cy, r) {
    const spikes = 11;
    const innerRatio = 0.9;
    const makePoints = (ox, oy, radius) => {
      const pts = [];
      for (let i = 0; i < spikes * 2; i++) {
        const rad = i % 2 === 0 ? radius : radius * innerRatio;
        const ang = (Math.PI * 2 * i) / (spikes * 2) - Math.PI / 2;
        pts.push(new Phaser.Math.Vector2(ox + Math.cos(ang) * rad, oy + Math.sin(ang) * rad));
      }
      return pts;
    };
    const polyPath = (g, points) => {
      g.beginPath();
      g.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) g.lineTo(points[i].x, points[i].y);
      g.closePath();
    };

    const grShadow = scene.add.graphics();
    grShadow.fillStyle(0x0a0805, 0.55);
    polyPath(grShadow, makePoints(cx + 5, cy + 6, r * 1.04));
    grShadow.fillPath();

    const grGold = scene.add.graphics();
    grGold.fillStyle(0x6b4408, 1);
    polyPath(grGold, makePoints(cx, cy, r));
    grGold.fillPath();
    grGold.fillStyle(0xf6d670, 1);
    polyPath(grGold, makePoints(cx, cy - 0.6, r * 0.96));
    grGold.fillPath();

    const innerR = r * 0.76;
    const size = Math.ceil(innerR * 2.2);
    const key = 'sealGrad_' + size;
    if (!scene.textures.exists(key)) {
      const tex = scene.textures.createCanvas(key, size, size);
      const ctx = tex.getContext();
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, '#c31914');
      grad.addColorStop(0.4, '#8a0f0c');
      grad.addColorStop(1, '#560908');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      tex.refresh();
    }
    const img = scene.add.image(cx, cy, key).setOrigin(0.5);
    const maskShape = scene.make.graphics({ x: cx - size / 2, y: cy - size / 2 });
    maskShape.fillStyle(0xffffff, 1);
    const innerPts = makePoints(size / 2, size / 2, innerR);
    maskShape.beginPath();
    maskShape.moveTo(innerPts[0].x, innerPts[0].y);
    for (let i = 1; i < innerPts.length; i++) maskShape.lineTo(innerPts[i].x, innerPts[i].y);
    maskShape.closePath();
    maskShape.fillPath();
    img.setMask(maskShape.createGeometryMask());

    const textStyle = {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
    };
    scene.add.text(cx + 1, cy + 1.5, '+100%', { ...textStyle, color: '#4a2400' })
      .setOrigin(0.5).setRotation(Phaser.Math.DegToRad(12));
    scene.add.text(cx, cy, '+100%', { ...textStyle, color: '#ffe9a8' })
      .setOrigin(0.5).setRotation(Phaser.Math.DegToRad(12));
  })(this, offerX + offerW - 23, offerY + 24, 22);

  this.add.image(1375, 210, 'mainOfferTimer').setOrigin(0).setDisplaySize(116, 24);
  this.add.text(1432, 223, '10h 2m', {
    fontFamily: 'Arial Black, Arial, sans-serif',
    fontSize: '12px',
    fontStyle: 'bold',
    color: '#f8e97a',
  }).setOrigin(0.5);

  const bankW = 234, bankH = 280, bankX = -1, bankY = 562;
  icon.call(this, 'bankButton', bankX + bankW / 2, bankY + bankH / 2, bankW, bankH);
  whiteLabel.call(this, 92, 820, 'Bank', 20);
  redBadge.call(this, 145, 648, 27);

  icon.call(this, 'button_collections', 327, 762, 130, 114);
  whiteLabel.call(this, 324, 823, 'Collections', 18);
  redBadge.call(this, 379, 730, 27);

  const playW = 230, playH = 226, playX = 1262, playY = 611;
  icon.call(this, 'playButtonEmpty', playX + playW / 2, playY + playH / 2, playW, playH);
  icon.call(this, 'playButtonArrow', playX + playW / 2 - 27, playY + playH / 2 - 37, 100, 100);
  whiteLabel.call(this, playX + playW / 2 + 18, playY + playH - 17, 'Play', 22);

  icon.call(this, 'Mini_events_locked', 1235, 755, 88, 88);
  whiteLabel.call(this, 1239, 796, 'Sellout', 18);
  pill.call(this, 1204, 812, 70, 24, 12);
  darkText.call(this, 1239, 824, '4d 3h', 14);
  redBadge.call(this, 1273, 734, 23);

}
