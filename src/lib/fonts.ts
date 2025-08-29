import localFont from "next/font/local";

export const aeonik = localFont({
  src: [
    {
      path: "../fonts/AeonikTRIAL-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/AeonikTRIAL-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/AeonikTRIAL-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/AeonikTRIAL-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/AeonikTRIAL-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/AeonikTRIAL-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/AeonikTRIAL-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-aeonik",
  display: "swap",
});
