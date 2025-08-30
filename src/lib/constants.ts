// Application constants and configuration

import { CryptoToken, Trade } from "@/types";

export const APP_CONFIG = {
  name: "Waddle Front",
  description: "A modern Next.js application built with best practices",
  version: "1.0.0",
  author: "Your Name",
  url: "https://your-domain.com",
} as const;

export const API_ENDPOINTS = {
  base: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
  },
  users: "/users",
  posts: "/posts",
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
  dashboard: "/dashboard",
  profile: "/profile",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const trendingVaults: CryptoToken[] = [
  {
    apr: "100%",
    name: "Dogecoin1",
    src: "https://yt3.googleusercontent.com/ytc/AIdro_mir_9R_w9VCBNv2_PZnY3Q5fm5tkr8c0EXFTMaG9nPMA=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    apr: "100%",
    name: "Dogecoin",
    src: "https://yt3.googleusercontent.com/ytc/AIdro_mir_9R_w9VCBNv2_PZnY3Q5fm5tkr8c0EXFTMaG9nPMA=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    apr: "100%",
    name: "Dogecoin2",
    src: "https://yt3.googleusercontent.com/ytc/AIdro_mir_9R_w9VCBNv2_PZnY3Q5fm5tkr8c0EXFTMaG9nPMA=s900-c-k-c0x00ffffff-no-rj",
  },
];

export const topTrades: Trade[] = [
  {
    id: "1",
    username: "@cryptowhale",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png",
    token: "$SOL",
    type: "LONG",
    leverage: "10x",
    profit: "+$4,300",
    timeAgo: "3min ago",
  },
  {
    id: "2",
    username: "@cryptowhale",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png",
    token: "$ETH",
    type: "SHORT",
    leverage: "5x",
    profit: "+$2,150",
    timeAgo: "15min ago",
  },
  {
    id: "3",
    username: "@cryptowhale",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png",
    token: "$BTC",
    type: "LONG",
    leverage: "8x",
    profit: "+$6,800",
    timeAgo: "1h ago",
  },
  {
    id: "4",
    username: "@cryptowhale",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png",
    token: "$LSK",
    type: "LONG",
    leverage: "30x",
    profit: "+$108.9",
    timeAgo: "2h ago",
  },
];
