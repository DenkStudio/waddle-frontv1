import * as React from "react";
const ShortsIcon = ({
  isActive,
  isDark,
}: {
  isActive: boolean;
  isDark: boolean;
}) => {
  const fillColor = isDark ? "white" : "black";
  const leftRightOpacity = isActive ? "0.6" : "0.3";
  const centerOpacity = isActive ? "0.9" : "0.6";

  return (
    <svg
      width="27"
      height="24"
      viewBox="0 0 27 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.1304 4.03594H25.323C26.2492 4.03594 27 4.80345 27 5.75022V17.9217C27 18.8684 26.2492 19.6359 25.323 19.6359H21.1304V4.03594Z"
        fill={fillColor}
        fillOpacity={leftRightOpacity}
      />
      <path
        d="M0 5.75022C0 4.80345 0.750827 4.03594 1.67702 4.03594H5.86957V19.6359H1.67702C0.750827 19.6359 0 18.8684 0 17.9217L0 5.75022Z"
        fill={fillColor}
        fillOpacity={leftRightOpacity}
      />
      <path
        d="M19.3696 22.2857C19.3696 23.2325 18.6187 24 17.6925 24H9.30745C8.38126 24 7.63043 23.2325 7.63043 22.2857V1.71429C7.63043 0.767513 8.38126 0 9.30745 0H17.6925C18.6187 0 19.3696 0.767512 19.3696 1.71429V22.2857Z"
        fill={fillColor}
        fillOpacity={centerOpacity}
      />
    </svg>
  );
};
export default ShortsIcon;
