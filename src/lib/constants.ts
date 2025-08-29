// Application constants and configuration

export const APP_CONFIG = {
  name: 'Waddle Front',
  description: 'A modern Next.js application built with best practices',
  version: '1.0.0',
  author: 'Your Name',
  url: 'https://your-domain.com',
} as const

export const API_ENDPOINTS = {
  base: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  users: '/users',
  posts: '/posts',
} as const

export const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
  dashboard: '/dashboard',
  profile: '/profile',
} as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const
