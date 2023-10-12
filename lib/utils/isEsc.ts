export default function isEsc(e: Event): boolean {
  if ('key' in e) {
    return e.key === 'Escape' || e.key === 'Esc'
  }

  // @ts-ignore
  return e.keyCode === 27
}
