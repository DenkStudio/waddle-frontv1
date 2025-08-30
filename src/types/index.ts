// Common types used throughout the application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

// Video feed types
export interface Video {
  id: string;
  url: string;
  thumbnail?: string;
  title: string;
  description?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified?: boolean;
  };
  likes: number;
  comments: number;
  shares: number;
  views: number;
  duration: number;
  createdAt: string;
  tags?: string[];
}

export interface VideoFeedProps {
  videos: Video[];
  onVideoEnd?: (videoId: string) => void;
  onVideoPlay?: (videoId: string) => void;
  onVideoPause?: (videoId: string) => void;
}

export interface CryptoToken {
  apr: string;
  name: string;
  src: string;
}

export interface Trade {
  id: string;
  username: string;
  img: string;
  token: string;
  type: "LONG" | "SHORT";
  leverage: string;
  profit: string;
  timeAgo: string;
}
