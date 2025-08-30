import * as React from "react"
const CustomShareIcon = ({isActive, isDark}: {isActive: boolean, isDark: boolean}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
  >
    <g clipPath="url(#a)">
      <path fill="#F4F4F4" d="M0 0h24v24H0z" />
      <path
        fill={isActive ? "#1657FF" : isDark ? "#fff" : "#000"}
        fillOpacity={isActive ? 1 : isDark ? 0.6 : 0.6}
        d="M19.48 1.998c2.552 0 4.52 2.122 4.52 4.58v10.041c0 2.458-1.969 4.58-4.52 4.58H4.52c-2.552 0-4.52-2.122-4.52-4.58V6.577C0 4.12 1.968 1.998 4.52 1.998h14.96Zm-6.868 6.417c-.307-.365-.92-.366-1.328 0l-3.779 3.748a.921.921 0 0 0 0 1.372c.306.366.92.366 1.328 0L12 10.425l3.166 3.201c.307.366.919.366 1.327 0a.92.92 0 0 0 0-1.371l-3.88-3.84Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill={isActive ? "#1657FF" : isDark ? "#fff" : "#000"} d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default CustomShareIcon
