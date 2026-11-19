# Leonida Meme Lab — agent notes

Entry for make.fun's "Post a GTA 6 meme on X" bounty (gta6-meme-x-01, $500, top 50 share).

## What this repo is

A static, client-side meme generator (`index.html` + `app.js` + `styles.css`).
It draws on a 1024x1024 canvas from two embedded assets (`assets.js`):
- the Vice City sunset highway scene (AI-generated in this session),
- make.fun's ghost mascot (from make.fun's public press kit, https://make.fun/press/).

Three templates: **Welcome Sign** (the featured meme), **WASTED**, **Loading Leonida**.
The user edits the captions, toggles/resizes the ghost, and downloads a PNG.

## The post

`POST.json` names the X post that is this entry. The post's first picture is
`assets/meme.png` — the featured meme rendered by this app: a `WELCOME TO
LEONIDA` highway sign at sunset, the ghost standing by the sign pole, and the
caption "POPULATION: EVERYONE WHO CALLED IN SICK TODAY". The post text carries
a make.fun link, the tag @makefunai, and the entrant's play code.

## How it is judged

The house reads the post from X (first picture + text) and an AI judge ranks
posts two at a time: make.fun in the picture first (the ghost), then funny,
then GTA 6-specific, then how well it sells make.fun, then short/readable,
original, and a clean image with the ghost worked into the scene.

## Run

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

`main.ts` (Node 22, stdlib only) copies `POST.json` to `/output/POST.json` for
the grader; run it with `MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts`.
