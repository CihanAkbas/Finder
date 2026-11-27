/** Rebase local edits onto another device's save, including unchecked items. */
export function mergeProgress(base: unknown, local: unknown, remote: unknown, field = ''): unknown {
  if (JSON.stringify(base) === JSON.stringify(local)) return remote
  if (Array.isArray(local)) {
    const previous = Array.isArray(base) ? base : [], incoming = Array.isArray(remote) ? remote : []
    if ([...local, ...previous, ...incoming].every((v) => typeof v === 'string') && field !== 'route' && field !== 'slots' && field !== 'slotNotes' && field !== 'itemIds') {
      const removed = new Set(previous.filter((v) => !local.includes(v)))
      return [...new Set([...incoming.filter((v) => !removed.has(v)), ...local.filter((v) => !previous.includes(v))])]
    }
    if (['customPins', 'properties', 'savedFilters', 'customOutfits'].includes(field)) {
      const index = (items: { id: string }[]) => Object.fromEntries(items.map((item) => [item.id, item]))
      return Object.values(mergeProgress(index(previous), index(local), index(incoming)) as object)
    }
    return local
  }
  if (local && typeof local === 'object') {
    const b = (base ?? {}) as Record<string, unknown>, l = local as Record<string, unknown>, r = (remote ?? {}) as Record<string, unknown>
    return Object.fromEntries([...new Set([...Object.keys(b), ...Object.keys(l), ...Object.keys(r)])].flatMap((key) => {
      const value = mergeProgress(b[key], l[key], r[key], key)
      return value === undefined ? [] : [[key, value]]
    }))
  }
  return local
}
