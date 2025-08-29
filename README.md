# Waddle Front

A modern Next.js application built with TypeScript, Tailwind CSS, and best practices.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ESLint** for code quality
- **Component-based architecture** with reusable UI components
- **Modern folder structure** following Next.js best practices
- **Responsive design** with mobile-first approach
- **Accessibility** built-in

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [class-variance-authority](https://cva.style/) - Component variants
- [clsx](https://github.com/lukeed/clsx) - Conditional classes
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) - Merge Tailwind classes

## 📁 Project Structure

```
src/
├── app/                    # App Router pages and layouts
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   └── ui/                # UI components
│       ├── button.tsx     # Button component
│       ├── card.tsx       # Card component
│       └── input.tsx      # Input component
├── hooks/                  # Custom React hooks
│   └── useLocalStorage.ts # Local storage hook
├── lib/                    # Library code
│   ├── constants.ts       # App constants
│   └── utils.ts           # Utility functions
├── types/                  # TypeScript type definitions
│   └── index.ts           # Common types
└── utils/                  # Utility functions
    └── format.ts          # Formatting utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd waddle-front
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Component Usage

### Button Component

```tsx
import { Button } from '@/components/ui/button'

// Different variants
<Button>Default Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="destructive">Delete</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Input Component

```tsx
import { Input } from '@/components/ui/input'

<Input 
  type="email" 
  placeholder="Enter your email"
  className="w-full"
/>
```

## 🎯 Best Practices Implemented

### 1. **Type Safety**
- Full TypeScript integration
- Proper type definitions for all components
- Interface-based props

### 2. **Component Architecture**
- Reusable UI components
- Consistent component API
- Proper prop forwarding

### 3. **Styling**
- Tailwind CSS with custom design system
- CSS variables for theming
- Responsive design patterns

### 4. **Code Quality**
- ESLint configuration
- Consistent code formatting
- Proper error handling

### 5. **Performance**
- Next.js App Router optimizations
- Image optimization
- Code splitting

### 6. **Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation support

## 🔧 Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- CSS variables for theming
- Custom color palette
- Responsive breakpoints
- Component variants

### TypeScript
- Strict mode enabled
- Path aliases configured (`@/*`)
- Proper type checking

## 📱 Responsive Design

The application is built with a mobile-first approach using Tailwind's responsive utilities:
- `sm:` - Small devices (640px+)
- `md:` - Medium devices (768px+)
- `lg:` - Large devices (1024px+)
- `xl:` - Extra large devices (1280px+)

## 🌙 Dark Mode Support

The application includes CSS variables for both light and dark themes, making it easy to implement theme switching.

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS team for the utility-first CSS framework
- The React community for continuous improvements
