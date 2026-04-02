# TuLink Brand Guide

## Overview
TuLink es una plataforma SaaS de "Link-in-Bio" especializada en e-commerce para WhatsApp. Permite a vendedores crear catálogos virtuales y recibir pedidos directamente por WhatsApp, eliminando la fricción de ventas en redes sociales.

## Stack Tecnológico

- **Framework**: Next.js 16+ con React 19
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Tipografía**: Inter (pesos 300-900)
- **Iconos**: FontAwesome 6.4.0

## Colores de Marca

### Primario (Brand)
- **Verde Esmeralda**: `#2ECC71` - Color principal de marca
- **Verde Oscuro**: `#27ae60` - Hover/active states
- **Verde Claro**: `#58d68d` - Acentos

### Alertas
- **Error**: `#EF4444` (Rojo vibrante)

### Superficies
- **Blanco**: `#FFFFFF` - Fondos de tarjetas, inputs
- **Gray 50**: `#F9FAFB` - Fondo principal
- **Gray 100**: border-gray-100 - Bordes suaves

### Texto
- **Primary**: `#111827` (gray-900)
- **Secondary**: `#6B7280` (gray-600)
- **Muted**: `#9CA3AF` (gray-400)

## Tipografía

### Fuente
- **Inter** - Cargada desde Google Fonts
- Pesos: 300, 400, 500, 600, 700, 800, 900

### Estilos
```tsx
// Hero Headline
className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] font-bold leading-tight"

// Títulos de sección
className="text-4xl lg:text-5xl font-bold"

// Títulos de tarjeta
className="text-xl font-bold"

// Body
className="text-lg text-gray-600"

// Texto pequeño
className="text-sm"
```

## Logo

### Estructura
```tsx
<div className="w-10 h-10 bg-[#2ECC71] rounded-xl flex items-center justify-center">
  <i className="fas fa-link text-white text-lg"></i>
</div>
<span className="text-xl font-bold text-gray-900">TuLink</span>
```

### Variantes
- **Header**: Icono verde esmeralda + texto gris oscuro
- **Footer**: Icono verde esmeralda + texto blanco
- **Mobile**: Versión compacta con icono de 8h-8

## Tono de Comunicación

### Estilo
- **Cercano y amigable**: Hablar directamente al vendedor
- **Profesional pero accesible**: Sin tecnicismos innecesarios
- **Orientado a beneficios**: Enfocarse en lo que el usuario gana
- **Confiable**: Transmitir seguridad y soporte

### Pain Points que Resolvemos
1. **Desorden de Inventario**: Evita subir fotos repetitivas a estados/feeds
2. **Saturación de DMs**: Elimina preguntas repetitivas sobre precios
3. **Fricción de Compra**: Automatiza la creación del pedido

### Palabras Clave
- "Vendedores como tú"
- "Sin comisiones"
- "100% de tus ventas"
- "Prueba gratis"
- "Fácil de usar"

### Frases Típicas
- "Tu catálogo virtual, pedidos por WhatsApp"
- "Comenzar prueba gratis"
- "Sin tarjeta de crédito requerida"
- "Cancela cuando quieras"
- "Empieza a vender en 3 pasos"

## Componentes UI

### Botones
```tsx
// Primario
className="bg-[#2ECC71] text-white px-6 py-3 rounded-[12px] font-semibold 
           hover:bg-[#27ae60] transition-all duration-300 
           active:scale-95 min-h-[48px]"

// Secundario
className="border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-[12px] 
           font-semibold hover:border-[#2ECC71] hover:text-[#2ECC71] 
           transition-all duration-300 min-h-[48px]"
```

### Tarjetas (Cards)
```tsx
// Superficie de tarjeta
className="bg-white rounded-[24px] shadow-sm border border-gray-100"

// Efecto hover (beneficios)
className="card-hover" // translate-y-[-8px] + shadow-xl
```

### Iconos Squircle
```tsx
className="w-14 h-14 rounded-2xl flex items-center justify-center 
           bg-[#2ECC71]/10 text-[#2ECC71]"
```

### Inputs
```tsx
className="w-full px-4 py-3 rounded-[12px] border border-gray-300 
           focus:border-[#2ECC71] focus:ring-2 focus:ring-[#2ECC71]/20 
           outline-none transition-all duration-200 min-h-[48px]"
```

### Subdomain Builder
```tsx
// Contenedor
className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 
           bg-white rounded-[12px] overflow-hidden shadow-lg max-w-lg mx-auto"

// Input
className="flex-1 px-4 py-3 sm:py-4 border-0 outline-none 
           focus:ring-2 focus:ring-[#2ECC71]/20 min-h-[48px]"

// Suffix
className="px-4 py-3 sm:py-4 bg-[#2ECC71]/10 text-[#2ECC71] 
           font-semibold flex items-center justify-center min-h-[48px]"
```

### Badge/Label
```tsx
className="inline-flex items-center gap-2 bg-[#2ECC71]/10 text-[#2ECC71] 
           px-4 py-2 rounded-full text-sm font-semibold"
```

### Phone Mockup
```tsx
className="relative w-[280px] h-[580px] bg-gray-900 rounded-[40px] 
           border-4 border-gray-800 shadow-2xl overflow-hidden"
```

## Iconografía
- **Librería**: FontAwesome 6.4.0
- **Estilo**: Sólido (`fas`) y de marca (`fab`)
- **Tamaños comunes**: 
  - `text-lg` para navegación
  - `text-2xl` para iconos en tarjetas
  - `text-3xl` para pasos del flujo

### Iconos Principales
- `fa-link` - Logo
- `fa-rocket` - CTA principal
- `fa-whatsapp` - Integración WhatsApp
- `fa-check` - Confirmaciones, listas
- `fa-images` - Catálogo
- `fa-comments` - Mensajes
- `fa-shopping-cart` - Pedidos
- `fa-cloud-upload-alt` - Subir
- `fa-share-alt` - Compartir

## Espaciado y Layout

### Contenedores
- **Max width**: `max-w-7xl` para contenedores principales
- **Padding horizontal**: `px-4 sm:px-6 lg:px-8`

### Breakpoints
- **Mobile First**: Base styles para móvil
- **768px (sm)**: Tablet pequeño
- **1024px (lg)**: Desktop

### Gap
- **Elementos cercanos**: `gap-2`, `gap-4`
- **Elementos normales**: `gap-6`, `gap-8`
- **Secciones grandes**: `gap-12`, `gap-16`

## Border Radius
- **Botones/Inputs**: `12px` (`rounded-[12px]`)
- **Tarjetas**: `24px` (`rounded-[24px]`)
- **Iconos squircle**: `rounded-2xl`
- **Badge**: `rounded-full`
- **Phone mockup**: `rounded-[40px]`

## Sombras
```tsx
// Tarjetas base
shadow-sm

// Hover en beneficios
shadow-xl

// Elementos destacados
shadow-lg shadow-[#2ECC71]/30

// Navegación
shadow-sm border-b border-gray-100
```

## Animaciones

### Transiciones
- **Generales**: `transition-all duration-300`
- **Inputs**: `transition-all duration-200`
- **Hover cards**: `transition-transform duration-300`

### Efectos
- **Card hover**: `hover:-translate-y-2 hover:shadow-xl`
- **Button active**: `active:scale-95`
- **Loading spinner**: `fa-spin`

## Navegación Móvil

### Drawer
```tsx
// Overlay
className="fixed inset-0 bg-black/50 z-40 lg:hidden"

// Contenido
className="fixed top-0 right-0 h-full w-80 bg-white z-50 
           transform transition-transform duration-300 lg:hidden"
```

## Responsive Design

### Mobile First
- Todos los estilos base son para móvil
- Breakpoints en 768px (`lg:`) para desktop
- Inputs con min-height de 48px (touch-friendly)

### Hero Section
- Mockup se oculta o apila verticalmente en pantallas pequeñas
- Headline: 32px mobile / 52px desktop

## Patrones de Código

### Form Handler
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSubmitted, setIsSubmitted] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  setIsSubmitting(false);
  setIsSubmitted(true);
};
```

### Live Sync (Subdomain)
```tsx
const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
  setSubdomain(value);
};
```

## Uso del Skill
Cuando trabajes en cualquier archivo de TuLink:
1. Usa consistentemente el verde esmeralda `#2ECC71` como color primario
2. Usa Inter como tipografía
3. Usa FontAwesome para iconos
4. Respeta los border radius: 12px (botones/inputs), 24px (tarjetas)
5. Implementa mobile first con breakpoint en 768px
6. Mantén el tono amigable y profesional en textos
7. Los inputs deben tener min-height de 48px para accesibilidad táctil
