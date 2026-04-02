# TuLink - Guía de Diseño y Mejoras Responsive

## 📋 Resumen de Cambios Aplicados

Esta guía documenta todas las mejoras de diseño y responsive aplicadas a la landing page de TuLink para referencia futura.

**IMPORTANTE**: Esta guía complementa los documentos oficiales:
- `.qwen/skills/tulink-brand.md` - Guía completa de marca
- `.qwen/skills/tulink-conversion-engine.md` - Principios de conversión

---

## 🎨 Sistema de Diseño

### Brand Colors (OFICIAL)
```css
--brand-primary: #2ECC71;        /* Verde Esmeralda */
--brand-primary-dark: #27ae60;   /* Hover/active */
--brand-primary-light: #58d68d;  /* Acentos */
--brand-primary-glow: rgba(46, 204, 113, 0.4);
--brand-gradient: linear-gradient(135deg, #2ECC71 0%, #27ae60 100%);
```

### Tipografía (OFICIAL)
- **Fuente**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800, 900

### Tamaños de Texto
```css
/* Hero Headline */
text-[38px] sm:text-[46px] md:text-[54px] lg:text-[62px]

/* Títulos de sección */
text-3xl sm:text-4xl lg:text-5xl

/* Títulos de tarjeta */
text-xl sm:text-2xl

/* Body text */
text-base sm:text-lg

/* Texto pequeño */
text-sm
```

### Bordes Redondeados (OFICIAL)
- Botones/Inputs: `12px` (`rounded-[12px]`)
- Tarjetas: `24px` (`rounded-[24px]`)
- Iconos squircle: `rounded-2xl`
- Badge: `rounded-full`
- Phone mockup: `rounded-[40px]` / `rounded-[50px]`

---

## 📱 Responsive Breakpoints

### Mobile First Approach (OFICIAL)
```css
/* Base: Mobile (< 768px) */
/* sm: ≥ 640px */
/* md: ≥ 768px */
/* lg: ≥ 1024px */
```

### Reglas Críticas

#### 1. Prevención de Scroll Horizontal
```css
@media (max-width: 768px) {
  body {
    overflow-x: hidden;
  }
  .max-w-7xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
```

#### 2. Elementos Touch-Friendly (OFICIAL)
- Inputs: `min-h-[48px]` mínimo
- Botones: `min-h-[48px]` mínimo
- Áreas clickeables: mínimo 44x44px

#### 3. Hero Section
- Padding: `py-16 sm:py-28`
- Orbes decorativos: `hidden sm:block`
- Phone mockup: `w-[260px] h-[520px]` (móvil) vs `w-[320px] h-[640px]` (desktop)
- CTA texto corto en móvil

#### 4. Cards de Beneficios
- Padding: `p-6 sm:p-10`
- Títulos: `text-lg sm:text-2xl`
- Iconos: `text-xl sm:text-2xl`

#### 5. Tabla de Precios
- Scroll horizontal controlado con `overflow-x-auto`
- `min-w-[600px]` para mantener legibilidad
- Indicador: "Desliza para ver más"

#### 6. Formulario
- Padding: `p-6 sm:p-10 lg:p-12`
- Inputs: `text-sm sm:text-base`
- Labels: `text-sm font-bold`

---

## ✨ Efectos Visuales

### Animaciones
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px var(--brand-primary-glow); }
  50% { box-shadow: 0 0 40px var(--brand-primary-glow); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Efectos Hover (OFICIAL)
```css
/* Cards */
.card-hover:hover {
  transform: translateY(-12px);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15),
              0 0 0 1px rgba(46, 204, 113, 0.1),
              0 0 40px rgba(46, 204, 113, 0.15);
}

/* Botones Primarios */
.btn-primary:hover {
  box-shadow: 0 8px 30px rgba(46, 204, 113, 0.5);
  transform: translateY(-3px);
}

/* Botones Secundarios */
.btn-secondary:hover {
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.2);
  transform: translateY(-2px);
}

/* Iconos Squircle */
.icon-squircle:hover {
  transform: scale(1.1) rotate(5deg);
}
```

### Glassmorphism
```css
.glass {
  @apply bg-white/70 backdrop-blur-xl border border-white/20;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

## 🎯 Componentes Clave

### Badge New
```css
.badge-new {
  @apply inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(46, 204, 113, 0.08) 100%);
  color: var(--brand-primary);
  border: 1px solid rgba(46, 204, 113, 0.25);
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.15);
  animation: pulse-glow 3s ease-in-out infinite;
}
```

### Step Badge
```css
.step-badge {
  @apply w-20 h-20 rounded-full flex items-center justify-center 
         text-white text-3xl font-black shadow-2xl;
  background: var(--brand-gradient);
  box-shadow: 0 10px 40px rgba(46, 204, 113, 0.4),
              0 0 0 8px rgba(46, 204, 113, 0.1);
  animation: float 4s ease-in-out infinite;
}
```

### Phone Mockup
```css
.phone-mockup {
  @apply relative w-[320px] h-[640px] rounded-[50px] overflow-hidden;
  background: linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 50%, #0d0d0d 100%);
  box-shadow: 0 0 0 2px #3d3d3d,
              0 0 0 5px #1a1a1a,
              0 30px 60px -15px rgba(0, 0, 0, 0.6),
              0 0 120px rgba(46, 204, 113, 0.15),
              inset 0 2px 4px rgba(255, 255, 255, 0.1);
  animation: float 7s ease-in-out infinite;
}
```

### Pricing Card Popular
```css
.pricing-card-popular {
  @apply relative overflow-hidden border-2 border-[#2ECC71];
  box-shadow: 0 20px 60px rgba(46, 204, 113, 0.2),
              0 0 0 4px rgba(46, 204, 113, 0.08),
              0 0 100px rgba(46, 204, 113, 0.1);
  transform: scale(1.02);
}
```

### Botones (OFICIAL)
```css
/* Primario */
.btn-primary {
  @apply bg-gradient-to-r from-[#2ECC71] to-[#27ae60] text-white px-8 py-4 
         rounded-[16px] font-bold relative overflow-hidden
         active:scale-95 min-h-[56px] transition-all duration-500
         shadow-lg shadow-[#2ECC71]/30;
}

/* Secundario */
.btn-secondary {
  @apply border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-[16px]
         font-semibold transition-all duration-300 min-h-[56px]
         hover:border-[#2ECC71] hover:text-[#2ECC71] hover:bg-[#2ECC71]/5;
}
```

### Inputs (OFICIAL)
```css
.input-interactive {
  @apply w-full px-5 py-4 rounded-[14px] border border-gray-300
         focus:border-[#2ECC71] focus:ring-4 focus:ring-[#2ECC71]/15
         outline-none transition-all duration-300 min-h-[56px];
}
```

### Icon Squircle (OFICIAL)
```css
.icon-squircle {
  @apply w-16 h-16 rounded-2xl flex items-center justify-center
         bg-gradient-to-br from-[#2ECC71]/20 via-[#2ECC71]/10 to-[#2ECC71]/5 
         text-[#2ECC71] transition-all duration-300;
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.2),
              inset 0 2px 4px rgba(255, 255, 255, 0.3);
}
```

---

## 📏 Reglas de Responsive

### 1. Padding de Secciones
```
Móvil: py-16 (64px)
Tablet/Desktop: sm:py-28 (112px)
```

### 2. Tamaños de Texto
```
Móvil: text-base / text-sm
Tablet: sm:text-lg / sm:text-base
Desktop: lg:text-xl
```

### 3. Espaciado entre Elementos
```
Móvil: gap-3 / gap-4
Desktop: lg:gap-8 / lg:gap-10
```

### 4. Grid Layouts
```
Móvil: grid-cols-1
Tablet: sm:grid-cols-2
Desktop: lg:grid-cols-3
```

### 5. Elementos Decorativos
- Ocultar en móvil con `hidden sm:block`
- Reducir opacidad en pantallas pequeñas
- Simplificar efectos en móvil

---

## ✍️ Copywriting y Tono (OFICIAL)

### Estilo de Comunicación
- **Cercano y amigable**: Hablar directamente al vendedor
- **Profesional pero accesible**: Sin tecnicismos
- **Orientado a beneficios**: Enfocarse en resultados
- **Tono LATAM**: Español simple, usar "tú"

### Frases que Convierten
```
✅ "Tu catálogo virtual, pedidos por WhatsApp"
✅ "Comenzar prueba gratis"
✅ "Sin tarjeta de crédito"
✅ "Cancela cuando quieras"
✅ "Empieza a vender en 3 pasos"
✅ "Vende más por WhatsApp sin complicarte"
```

### Palabras Clave
- "Vendedores como tú"
- "Sin comisiones"
- "100% de tus ventas"
- "Prueba gratis"
- "Fácil de usar"

### CTAs Recomendados
```
✅ "Empezar ahora"
✅ "Probar gratis"
✅ "Vender por WhatsApp hoy"
✅ "Comenzar prueba gratis"
```

### Pain Points que Resolvemos
1. **Desorden de Inventario**: Evita fotos repetitivas
2. **Saturación de DMs**: Elimina preguntas repetitivas
3. **Fricción de Compra**: Automatiza pedidos

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Verificar errores
npm run lint
```

---

## ✅ Checklist para Futuras Páginas

### Antes de Publicar
- [ ] Probar en viewport de 375px (iPhone SE)
- [ ] Probar en viewport de 768px (iPad)
- [ ] Probar en viewport de 1024px (Desktop)
- [ ] Verificar que no haya scroll horizontal no intencional
- [ ] Tablas con scroll tienen indicador visual
- [ ] Botones tienen área táctil mínima de 48px
- [ ] Textos son legibles sin zoom
- [ ] Imágenes y mockups escalan proporcionalmente
- [ ] Colores respetan la marca (#2ECC71)
- [ ] Copywriting sigue el tono LATAM
- [ ] CTAs son claros y orientados a acción

### Elementos que Necesitan Atención Especial
1. **Tablas**: Siempre con `overflow-x-auto` y `min-width`
2. **Mockups**: Tamaños reducidos en móvil
3. **Formularios**: Inputs con padding táctil
4. **Navegación**: Menú hamburguesa en móvil
5. **Footer**: Layout vertical en móvil

### Brand Compliance
- [ ] Verde esmeralda #2ECC71 como primario
- [ ] Tipografía Inter
- [ ] Iconos FontAwesome
- [ ] Border radius: 12px (botones), 24px (tarjetas)
- [ ] Mobile first con breakpoint en 768px

---

## 🎨 Utilidades Personalizadas

```css
/* Gradient backgrounds */
.gradient-hero {
  background: radial-gradient(ellipse at 20% 0%, rgba(46, 204, 113, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(46, 204, 113, 0.1) 0%, transparent 40%),
              linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(249, 250, 251, 1) 100%);
}

.gradient-orb {
  @apply absolute rounded-full blur-3xl;
  background: radial-gradient(circle, rgba(46, 204, 113, 0.2) 0%, rgba(46, 204, 113, 0.05) 50%, transparent 70%);
  animation: float 8s ease-in-out infinite;
}

/* Feature check list */
.feature-check {
  @apply flex items-center gap-3 text-gray-600;
}

.feature-check i {
  @apply text-[#2ECC71] text-sm;
  filter: drop-shadow(0 2px 4px rgba(46, 204, 113, 0.3));
}

/* Scrollbar personalizada */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(46, 204, 113, 0.3) rgba(241, 245, 249, 0.5);
}
```

---

## 📚 Recursos Adicionales

### Archivos de Referencia
- `.qwen/skills/tulink-brand.md` - Guía completa de marca
- `.qwen/skills/tulink-conversion-engine.md` - Principios de conversión
- `app/globals.css` - Estilos globales
- `app/page.tsx` - Landing page principal

### Iconos FontAwesome Principales
```
fa-link         - Logo
fa-rocket       - CTA principal
fa-whatsapp     - Integración WhatsApp
fa-check        - Confirmaciones
fa-check-circle - Features
fa-images       - Catálogo
fa-comments     - Mensajes
fa-shopping-cart- Pedidos
fa-cloud-upload - Subir
fa-share-alt    - Compartir
fa-sparkles     - Badge nuevo
fa-heart        - Beneficios
fa-lightbulb    - Cómo funciona
fa-tag          - Precios
fa-shield-heart - Garantía
```

---

*Última actualización: Abril 2026*  
*Versión: 1.1 - Alineada con guías oficiales TuLink*
