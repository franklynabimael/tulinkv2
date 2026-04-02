# TuLink Project Rules

## Mandatory Rules for All Code Generation

### 1. Design System Compliance

**Color Palette:**
- Primary Brand Color: `#2ECC71` (Verde Esmeralda)
- Use `#27ae60` for hover states
- Alert/Error: `#EF4444`
- Surfaces: `#FFFFFF` on `#F9FAFB` backgrounds

**Typography:**
- Font Family: **Inter** (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800, 900
- Hero Headlines: 52px desktop / 32px mobile

**Icons:**
- Library: **FontAwesome 6.4.0**
- Use solid (`fas`) and brand (`fab`) styles
- Never use Heroicons or SVG inline icons

**Border Radius:**
- Buttons/Inputs: `12px` (`rounded-[12px]`)
- Cards: `24px` (`rounded-[24px]`)
- Icon Squircles: `rounded-2xl`

### 2. Component Structure

**Buttons:**
```tsx
// Primary
className="bg-[#2ECC71] text-white px-6 py-3 rounded-[12px] font-semibold 
           hover:bg-[#27ae60] transition-all duration-300 
           active:scale-95 min-h-[48px]"

// Secondary
className="border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-[12px] 
           font-semibold hover:border-[#2ECC71] hover:text-[#2ECC71] 
           transition-all duration-300 min-h-[48px]"
```

**Cards:**
```tsx
className="bg-white rounded-[24px] shadow-sm border border-gray-100"
// Hover effect for benefit cards
className="card-hover" // -translate-y-2 + shadow-xl
```

**Inputs:**
- Minimum touch height: `48px`
- Focus ring: `#2ECC71` with 20% opacity
- Border radius: `12px`

**Icon Squircles:**
```tsx
className="w-14 h-14 rounded-2xl flex items-center justify-center 
           bg-[#2ECC71]/10 text-[#2ECC71]"
```

### 3. Responsive Design (Mobile First)

- **Base styles**: Mobile (default)
- **Breakpoint**: `768px` (`lg:` prefix in Tailwind)
- **Touch targets**: Minimum 48px height
- **Navigation**: Drawer menu on mobile with dark overlay

### 4. Navigation Pattern

**Sticky Header:**
- `backdrop-blur-md` with white/80 background
- Logo on left, centered nav links, CTA on right
- Mobile: Hamburger menu → Drawer from right

### 5. Hero Section Requirements

- **Subdomain Builder**: Input with fixed `.tulink.do` suffix
- **Live Sync**: Input updates mockup in real-time
- **Phone Mockup**: Shows preview of user's store
- **Headline**: 52px desktop / 32px mobile

### 6. Benefits Section

- Grid: `minmax(280px, 1fr)` auto-adaptable
- Hover effect: `-8px` Y-axis translation with soft shadow
- Icon style: Squircle with solid icon inside

### 7. User Flow Section (3 Steps)

1. **Sube** - Cloud upload icon
2. **Comparte** - Share icon
3. **Vende** - WhatsApp icon

Numbered circles: `w-20 h-20 bg-[#2ECC71] rounded-full`

### 8. Form Handling Pattern

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSubmitted, setIsSubmitted] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  setIsSubmitting(false);
  setIsSubmitted(true);
  // Auto-scroll to success message
};
```

**Requirements:**
- Visual feedback: "Enviando..." with spinner
- Auto-scroll to success message on submit
- Validation for required fields

### 9. Tone & Communication

- Friendly and approachable
- Professional but accessible (no unnecessary technical jargon)
- Benefit-oriented messaging
- Trust-building language

**Key Phrases:**
- "Tu catálogo virtual, pedidos por WhatsApp"
- "Sin comisiones"
- "Prueba gratis por 1 mes"
- "Sin tarjeta de crédito requerida"
- "Cancela cuando quieras"

### 10. File Structure

```
app/
├── layout.tsx     # Inter font + FontAwesome CDN
├── page.tsx       # Main landing page
└── globals.css    # Design system CSS variables & utilities
```

### 11. Code Quality Standards

- **TypeScript**: Strict typing for all components
- **Accessibility**: ARIA labels for interactive elements
- **Performance**: Use `use client` only when needed
- **SEO**: Proper meta tags and semantic HTML

### 12. Testing Requirements

Before considering a task complete:
1. Run `npm run build` - must pass without errors
2. Check responsive design at mobile (375px), tablet (768px), desktop (1440px)
3. Verify all interactive elements have 48px minimum touch height
4. Ensure color contrast meets WCAG AA standards

### 13. Git Commit Convention

**Format:** `type(scope): description`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `style`: Design/styling changes
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `chore`: Configuration/maintenance

**Example:** `feat(landing): add subdomain builder with live preview`

---

## Quick Reference

| Element | Specification |
|---------|--------------|
| Primary Color | `#2ECC71` |
| Font | Inter (Google Fonts) |
| Icons | FontAwesome 6.4.0 |
| Button Radius | `12px` |
| Card Radius | `24px` |
| Input Height | `min-h-[48px]` |
| Breakpoint | `768px` (lg) |
| Hover Effect | `-translate-y-2` |

---

**IMPORTANT:** Always reference `.qwen/skills/tulink-brand.md` for detailed design specifications before generating new components.
