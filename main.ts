// Leonida Meme Lab — entry program for make.fun's "Post a GTA 6 meme on X".
// Node 22, standard library only. The entry is the X post itself: an AI agent
// made a GTA 6 meme (this repo's web app rendered it), it is posted on X from
// a public account with make.fun and the entrant's play code in its text, and
// POST.json at the repo root names the post. This program copies POST.json
// from the repository to /output/POST.json, where the gate reads it. Nothing
// this program writes about the post is judged: the house reads the post.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
try {
  copyFileSync(join(botDir, 'POST.json'), join(outDir, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}
