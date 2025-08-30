import * as React from "react"
const CustomShortsIcon = ({isActive, isDark}: {isActive: boolean, isDark: boolean}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={30}
    fill="none"
  >
    <path
      fill={isActive ? "#FFF" : isDark ? "#fff" : "#000"}
      fillOpacity={isActive ? 0.51 : isDark ? 0.3 : 0.3}
      d="M27 5.045h5.5a2 2 0 0 1 2 2v15.5a2 2 0 0 1-2 2H27v-19.5ZM0 7.045a2 2 0 0 1 2-2h5.5v19.5H2a2 2 0 0 1-2-2v-15.5Z"
    />
    <rect
      width={15}
      height={30}
      x={24.75}
      y={30}
      fill={isActive ? "#FFF" : isDark ? "#fff" : "#000"}
      fillOpacity={isActive ? 1 : isDark ? 0.6 : 0.6}
      rx={2}
      transform="rotate(180 24.75 30)"
    />
  </svg>
)
export default CustomShortsIcon
