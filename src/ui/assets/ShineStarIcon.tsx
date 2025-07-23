import * as React from 'react'

const ShineStarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width='1em' height='1em' viewBox='0 0 64 64' fill='none' {...props}>
    <polygon
      points='32,10 38,28 56,32 38,36 32,54 26,36 8,32 26,28'
      fill='#FFD700'
    />
    <polygon
      points='32,18 35,28 48,32 35,36 32,46 29,36 16,32 29,28'
      fill='#FFF9C4'
      opacity='0.7'
    />
    <circle cx='14' cy='18' r='2' fill='#FFD700' />
    <circle cx='50' cy='20' r='1.5' fill='#FFD700' />
    <circle cx='46' cy='50' r='1.8' fill='#FFD700' />
    <circle cx='18' cy='46' r='1.2' fill='#FFD700' />
  </svg>
)

export default ShineStarIcon
