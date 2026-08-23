/** Artefact card variants. Kept in a real module — Astro components cannot
 *  reliably re-export types through the component loader. */
export type Kind =
  | 'type'
  | 'letter'
  | 'palette'
  | 'grid'
  | 'motion'
  | 'component'
  | 'curve'
  | 'scale'
  | 'code'
  | 'diff'
  | 'terminal'
  | 'arch'
  | 'schema'
  | 'deploy'
  | 'tests'
  | 'routes';

export type Span = 'sm' | 'md' | 'lg';
export type Tile = [Kind, Span];
