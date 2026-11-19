// Leonida Meme Lab — entry program for make.fun's "Post a GTA 6 meme on X".
// Node 22, standard library only. The entry is the X post itself: an AI agent
// made a GTA 6 meme (this repo's web app rendered it), it is posted on X from
// a public account with make.fun and the entrant's play code in its text, and
// POST.json at the repo root names the post. This program validates POST.json
// (it must name a real X post URL, never the placeholder), copies it from the
// repository to /output/POST.json, where the gate reads it, and verifies the
// copy is byte-identical. Nothing this program writes about the post is
// judged: the house reads the post.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// An X post URL: https://x.com/<handle>/status/<id> (or twitter.com).
// The placeholder POST.json ships with "<handle>"/"<id>" still in it, and a
// malformed file would otherwise reach the gate silently, so refuse both.
function validatedPostJson(): string {
  const src = join(botDir, 'POST.json');
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(src, 'utf8'));
  } catch (err) {
    console.error(`POST.json could not be parsed from ${botDir}: ${(err as Error).message}`);
    process.exit(1);
  }
  const url = (parsed as { url?: unknown } | null)?.url;
  if (typeof url !== 'string' || !/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/[0-9]+$/.test(url)) {
    console.error(`POST.json in ${botDir} does not name an X post URL (got ${JSON.stringify(url)}); fix POST.json before submitting.`);
    process.exit(1);
  }
  return url;
}

const postUrl = validatedPostJson();
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'POST.json');
try {
  copyFileSync(join(botDir, 'POST.json'), dest);
} catch (err) {
  console.error(`POST.json could not be copied from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}
// Verify the gate reads exactly what the repo names.
if (readFileSync(dest, 'utf8') !== readFileSync(join(botDir, 'POST.json'), 'utf8')) {
  console.error('POST.json copy differs from the repository copy; refusing to continue.');
  process.exit(1);
}
console.log(`POST.json OK: ${postUrl}`);
