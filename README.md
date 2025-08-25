# RemoveAList Landing Page

A modern, responsive landing page for RemoveAList - Australia's AI-powered moving platform.

## 🎨 Design Features

- **Green Color Scheme**: Based on the RemoveAList logo (#4CAF50 primary)
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Smooth Animations**: Powered by Framer Motion
- **Modern UI**: Clean, minimalist design with Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd removelist-landing
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
removelist-landing/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js       # Navigation with mobile menu
│   │   ├── Hero.js         # Hero section with animated mockup
│   │   ├── Features.js     # Feature grid
│   │   ├── HowItWorks.js   # Process steps
│   │   ├── Partners.js     # Partner benefits
│   │   ├── Sustainability.js # Eco features
│   │   ├── CTA.js         # Call-to-action section
│   │   └── Footer.js      # Footer with links
│   ├── App.js             # Main app component
│   ├── index.js           # Entry point
│   └── index.css          # Tailwind imports
├── tailwind.config.js     # Tailwind configuration
└── package.json
```

## 🛠️ Technologies Used

- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

## 🎯 Features

- Animated hero section with phone mockup
- Smooth scroll navigation
- Interactive feature cards
- Step-by-step process visualization
- Partner benefits showcase
- Sustainability focus section
- Responsive mobile menu
- Hover effects and micro-interactions

## 🏗️ Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🔧 Customization

### Colors
Edit the color palette in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#E8F5E9',
    // ... other shades
    500: '#4CAF50', // Main brand color
  }
}
```

### Content
All text content is directly in the component files for easy editing.

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

The build folder is ready to be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

## 📄 License

This project is part of the RemoveAList platform.