// Generates de-styled, LLM-friendly copies of docs/content into dist/docs.
// Strips leading frontmatter and MDC container fences (::code-group/::callout/
// ::steps are unwrapped; every other ::component block is dropped with its
// body). Never touches anything inside a code fence. Stdlib only.
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(scriptDir, '../../../docs/content')
const OUT = resolve(scriptDir, '../dist/docs')

const EXCLUDE = new Set(['index.md', '1.playground.md'])
const UNWRAP = new Set(['code-group', 'callout', 'steps'])

const OPEN_RE = /^(:{2,})\s*([A-Za-z][\w-]*)/ // `::name`, `::::u-page-hero{...}`
const CLOSE_RE = /^:{2,}\s*$/ // bare colons => container close
const FENCE_RE = /^\s*(```|~~~)/

function stripFrontmatter(lines) {
  if (lines[0]?.trim() === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') return lines.slice(i + 1)
    }
  }
  return lines
}

function destyle(raw, relPath) {
  const lines = stripFrontmatter(raw.split('\n'))
  const out = []
  const stack = [] // { drop: boolean }
  let inFence = false
  for (const line of lines) {
    if (FENCE_RE.test(line)) {
      inFence = !inFence
      if (!stack.some((s) => s.drop)) out.push(line)
      continue
    }
    if (!inFence) {
      const open = line.match(OPEN_RE)
      if (open) {
        stack.push({ drop: !UNWRAP.has(open[2]) })
        continue // never emit the opening fence line
      }
      if (CLOSE_RE.test(line) && stack.length > 0) {
        stack.pop()
        continue // never emit the closing fence line
      }
    }
    if (!stack.some((s) => s.drop)) out.push(line)
  }
  if (stack.length > 0) {
    console.warn(`[prepare-llm-docs] WARN unbalanced MDC fence in ${relPath}; emitting body unchanged`)
    return stripFrontmatter(raw.split('\n')).join('\n')
  }
  return out.join('\n')
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) files.push(...(await walk(full)))
    else if (e.name.endsWith('.md')) files.push(full)
  }
  return files
}

if (!existsSync(SRC)) {
  console.error(`[prepare-llm-docs] source dir not found: ${SRC}`)
  process.exit(1)
}

const files = await walk(SRC)
let shipped = 0
for (const file of files) {
  const rel = relative(SRC, file)
  if (EXCLUDE.has(rel)) continue
  const raw = await readFile(file, 'utf8')
  const cleaned =
    destyle(raw, rel)
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\n+/, '') + '\n'
  const dest = join(OUT, rel)
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, cleaned, 'utf8')
  shipped++
}
console.log(`[prepare-llm-docs] wrote ${shipped} files to dist/docs`)
