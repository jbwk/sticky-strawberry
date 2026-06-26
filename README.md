# Sticky Strawberry 🍓

A cozy, child-friendly mobile web game for four-year-olds.

---

## Folder structure

```
sticky-strawberry/
├── index.html          ← Complete self-contained game
├── manifest.json       ← PWA manifest (install to home screen)
├── sw.js               ← Service worker (offline support)
├── assets/
│   └── audio/          ← Drop .mp3 files here (see below)
└── README.md
```

---

## Testing locally

**Option A — double-click**
Open `index.html` directly in Safari, Chrome, or Firefox.
Most features work without a server. Audio requires a server (see below).

**Option B — local server (recommended for audio)**

```bash
cd sticky-strawberry
npx serve .
# or: python3 -m http.server 8000
# then open http://localhost:8000
```

**Option C — test on iPhone**
1. Run a local server (Option B).
2. Find your Mac's IP: `ipconfig getifaddr en0`
3. Open `http://<your-ip>:8000` in Safari on your iPhone.
4. Tap Share → "Add to Home Screen" to install as a PWA.

---

## iPhone checklist

- [ ] Portrait layout fills screen without scrolling
- [ ] No accidental zoom when double-tapping
- [ ] Strawberry tap target is easy for small fingers
- [ ] Pillow drags smoothly with one finger
- [ ] Sound toggle persists across reloads
- [ ] Landscape shows "Turn me upright" overlay
- [ ] Works after airplane mode (service worker offline cache)
- [ ] "Add to Home Screen" installs cleanly
- [ ] No text is too small to read
- [ ] All celebration endings play without errors

---

## Replacing placeholder art

All graphics are drawn programmatically on a canvas — no image files required.
If you want to add custom sprites later, load them in `ASSETS` at the top of `index.html`
and draw them with `ctx.drawImage()` inside the relevant draw functions.

---

## Audio

The only audio file is the background song:

| Filename | When it plays |
|---|---|
| `full_song.mp3` | Loops throughout the game (starts on first interaction) |

All **sound effects are synthesized at runtime** with the Web Audio API — no
files required. They live in the `sfx()` function in `index.html` (tap, sticky
peel, falling whistle, pillow/basket/teddy catches, head boop, giggle, bedtime
chime). Tweak the `tone()` / `noise()` parameters there to change how they sound.

Audio only starts after the first user interaction (required by mobile browsers).
The sound toggle is remembered in `localStorage`.

---

## Sing-along mode

The lyrics object and line hooks are in `index.html`.
To enable auto-advancing lyrics during play:

```js
// After calling newRound(), add:
sing.on = true;
sing.line = 0;
sing.timer = 0;

// In updatePlaying() / updateFalling(), add a timer:
sing.timer += dT;
if (sing.timer > sing.dur) {
  sing.timer = 0;
  sing.line = (sing.line + 1) % LYRICS.length;
  play('lyric_0' + (sing.line + 1));
}
```

---

## Game states

`TITLE` → `PLAYING` → `FALLING` → `LANDING` → `CELEBRATION` → back to `PLAYING` (or `BEDTIME`)

---

## Lyrics

> Sticky strawberry, sticky strawberry  
> When will you fall down?  
> Sticky strawberry, oh sticky strawberry  
> Where will you fall down?  
>
> Will you come down soon?  
> Will I be in bed?  
> Will I be asleep  
> When you hit my head?
