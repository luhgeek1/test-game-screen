const DESIGN_W = 1490;
const DESIGN_H = 838;

const COLOR = {
  pillFill: 0xefe6f6,
  pillStroke: 0xb9aecb,
  textDark: 0x3d3c51,
  textWhite: 0xffffff,
  textStroke: 0x1a1730,
  orange: 0xff7918,
};

const SPRITE_FILES = {
  reference: '../reference_screenshot.png',
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
    type: Phaser.AUTO,
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

  function pill(x, y, w, h, r) {
    const gr = this.add.graphics();
    gr.fillStyle(COLOR.pillFill, 1);
    gr.lineStyle(2, COLOR.pillStroke, 1);
    gr.fillRoundedRect(x, y, w, h, r);
    gr.strokeRoundedRect(x, y, w, h, r);
    return gr;
  }

  function darkText(x, y, text, size) {
    return this.add.text(x, y, text, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: size + 'px',
      fontStyle: 'bold',
      color: '#3d3c51',
    }).setOrigin(0.5);
  }

  function whiteLabel(x, y, text, size) {
    return this.add.text(x, y, text, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: size + 'px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#1a1730',
      strokeThickness: 4,
    }).setOrigin(0.5);
  }

  function icon(key, x, y, w, h) {
    const img = this.add.image(x, y, key);
    img.setDisplaySize(w, h);
    return img;
  }

  function redBadge(x, y, size) {
    const img = this.add.image(x, y, 'redHint');
    img.setDisplaySize(size, size);
    this.add.text(x, y - size * 0.04, '!', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: Math.round(size * 0.6) + 'px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);
    return img;
  }

  function diamondBadge(cx, cy, side, label) {
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
    darkText.call(this, cx, cy, label, Math.round(side * 0.42));
  }

  function sideButton(opts) {
    const { x, y, w, h, key, iconW, iconH, label, hasBadge, labelY } = opts;
    icon.call(this, key, x + w / 2, y + h / 2, iconW, iconH);
    whiteLabel.call(this, x + w / 2, labelY !== undefined ? labelY : y + h + 14, label, 19);
    if (hasBadge) {
      redBadge.call(this, x + w - 6, y + 6, 26);
    }
  }

  this.cameras.main.setBackgroundColor('#000000');

  diamondBadge.call(this, 70, 66, 60, '3');

  pill.call(this, 33, 100, 74, 26, 13);
  darkText.call(this, 70, 113, '2d 20h', 16);

  this.add.image(161, 17, 'starsCounter').setOrigin(0);
  darkText.call(this, 229, 39, '0', 20);

  sideButton.call(this, {
    x: 5, y: 132, w: 106, h: 84,
    key: 'tasks', iconW: 102, iconH: 102,
    label: 'Tasks', hasBadge: true, labelY: 224,
  });

  sideButton.call(this, {
    x: 12, y: 266, w: 98, h: 80,
    key: 'button_chat', iconW: 88, iconH: 88,
    label: 'Chat', hasBadge: true, labelY: 348,
  });

  sideButton.call(this, {
    x: 11, y: 377, w: 110, h: 92,
    key: 'Mini_events', iconW: 102, iconH: 102,
    label: 'Mini-Events', hasBadge: false, labelY: 470,
  });

  icon.call(this, 'Coins', 868, 39, 48, 48);
  this.add.image(893, 23, 'currencyCounter_timer').setOrigin(0);
  darkText.call(this, 932, 38, '10000', 19);
  darkText.call(this, 938, 67, '01:57', 14);
  icon.call(this, 'plusButton', 997, 40, 44, 48);

  icon.call(this, 'Diamonds', 1046, 39, 48, 48);
  this.add.image(1054, 17, 'starsCounter').setOrigin(0);
  darkText.call(this, 1122, 39, '10000', 19);
  icon.call(this, 'plusButton', 1167, 40, 44, 48);

  icon.call(this, 'Energy', 1237, 39, 48, 48);
  this.add.image(1251, 17, 'starsCounter').setOrigin(0);
  darkText.call(this, 1319, 39, '10000', 19);
  icon.call(this, 'plusButton', 1364, 40, 44, 48);

  icon.call(this, 'Options', 1456, 39, 56, 56);
  redBadge.call(this, 1478, 15, 20);

  const offerX = 1320, offerY = 87, offerW = 170, offerH = 144;
  icon.call(this, 'mainOffer_1', offerX + offerW / 2, offerY + offerH / 2, offerW, offerH);

  (function drawSeal(scene, cx, cy, r) {
    const gr = scene.add.graphics();
    const points = [];
    const spikes = 8;
    for (let i = 0; i < spikes * 2; i++) {
      const rad = i % 2 === 0 ? r : r * 0.8;
      const ang = (Math.PI * 2 * i) / (spikes * 2) - Math.PI / 2;
      points.push(new Phaser.Math.Vector2(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad));
    }
    gr.fillStyle(0xcf3a3a, 1);
    gr.lineStyle(3, 0xf0c95a, 1);
    gr.beginPath();
    gr.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) gr.lineTo(points[i].x, points[i].y);
    gr.closePath();
    gr.fillPath();
    gr.strokePath();
    scene.add.text(cx, cy, '+100%', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#f7e3a1',
    }).setOrigin(0.5).setRotation(Phaser.Math.DegToRad(12));
  })(this, offerX + offerW - 18, offerY + 22, 20);

  this.add.image(1340, 210, 'eventTimer').setOrigin(0);
  this.add.text(1411, 228, '10h 2m', {
    fontFamily: 'Arial Black, Arial, sans-serif',
    fontSize: '12px',
    fontStyle: 'bold',
    color: '#f3e6c2',
  }).setOrigin(0.5);

  const bankW = 232, bankH = 275, bankX = 0, bankY = 562;
  icon.call(this, 'bankButton', bankX + bankW / 2, bankY + bankH / 2, bankW, bankH);
  whiteLabel.call(this, 92, 820, 'Bank', 20);
  redBadge.call(this, 145, 648, 28);

  icon.call(this, 'button_collections', 325, 771, 108, 92);
  whiteLabel.call(this, 323, 818, 'Collections', 18);
  redBadge.call(this, 377, 731, 26);

  const playW = 240, playH = 240, playX = 1252, playY = 609;
  icon.call(this, 'playButtonEmpty', playX + playW / 2, playY + playH / 2, playW, playH);
  icon.call(this, 'playButtonArrow', playX + playW / 2, playY + playH / 2 - 16, 70, 70);
  whiteLabel.call(this, playX + playW / 2, playY + playH - 14, 'Play', 22);

  icon.call(this, 'Mini_events_locked', 1240, 751, 96, 96);
  whiteLabel.call(this, 1239, 804, 'Sellout', 18);
  pill.call(this, 1204, 812, 70, 24, 12);
  darkText.call(this, 1239, 824, '4d 3h', 14);
  redBadge.call(this, 1278, 712, 26);

  this.add.image(0, 0, 'reference').setOrigin(0);
}
