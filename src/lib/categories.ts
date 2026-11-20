import type { CategoryNode, GameMarker } from '@/types/game'

export function walkCategories(
  nodes: CategoryNode[],
  visit: (node: CategoryNode, parent: CategoryNode | null) => void,
  parent: CategoryNode | null = null,
) {
  for (const node of nodes) {
    visit(node, parent)
    if (node.children?.length) walkCategories(node.children, visit, node)
  }
}

export function leafCategories(nodes: CategoryNode[]) {
  const leaves: CategoryNode[] = []
  walkCategories(nodes, (node) => {
    if (!node.children?.length) leaves.push(node)
  })
  return leaves
}

export function categoryMap(nodes: CategoryNode[]) {
  const map = new Map<string, CategoryNode>()
  walkCategories(nodes, (node) => map.set(node.id, node))
  return map
}

export function leafIds(node: CategoryNode): string[] {
  if (!node.children?.length) return [node.id]
  return node.children.flatMap(leafIds)
}

export function markersFor(markers: GameMarker[], node: CategoryNode) {
  const ids = new Set(leafIds(node))
  return markers.filter((marker) => ids.has(marker.category))
}

export function countFound(markers: GameMarker[], found: ReadonlySet<string>) {
  let count = 0
  for (const marker of markers) {
    if (found.has(marker.id)) count += 1
  }
  return count
}
