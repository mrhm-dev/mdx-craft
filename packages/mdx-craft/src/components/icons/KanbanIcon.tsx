import { FC, SVGProps } from 'react'

/**
 * KanbanIcon - Three left-aligned bars of different sizes, no bounding box.
 */
export const KanbanIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" aria-hidden="true" {...props}>
    {/* Longest bar at top */}
    <rect x="4" y="6" width="12" height="3" rx="1" fill="currentColor" />
    {/* Medium bar in the middle */}
    <rect x="4" y="11" width="8" height="3" rx="1" fill="currentColor" />
    {/* Shortest bar at bottom */}
    <rect x="4" y="16" width="4" height="3" rx="1" fill="currentColor" />
  </svg>
)
