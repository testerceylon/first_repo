# Adding New Tools to the Homepage

The homepage is designed as a scalable tools marketplace. Adding new tools is simple and follows a component-based architecture.

## How to Add a New Tool

### Step 1: Define Your Tool

Open [apps/web/src/app/page.tsx](apps/web/src/app/page.tsx) and add a new tool object to the `tools` array:

```typescript
const tools: ToolCardProps[] = [
  // Existing tools...
  
  // Your new tool
  {
    icon: YourIcon,                          // Import from lucide-react
    title: "Your Tool Name",
    description: "Short description of what it does",
    price: "$5",                             // Display price
    priceSubtext: "per use",                 // Optional: e.g., "per month", "per file"
    badge: "Popular",                        // Badge text (e.g., "New", "Pro", "Featured")
    features: [
      "Feature benefit 1",
      "Feature benefit 2",
      "Feature benefit 3",
      "Feature benefit 4",
    ],
    ctaText: "Get Started",                  // Button text
    ctaLink: "/your-tool",                   // Link to tool page
    gradientFrom: "blue-600",                // Tailwind gradient start color
    gradientTo: "cyan-600",                  // Tailwind gradient end color
    requireAuth: true,                       // Optional: require sign-in
  },
];
```

### Step 2: Choose Your Gradient Theme

Pick complementary colors for your tool's theme. Examples:

- **Purple/Violet**: `violet-600` → `purple-600` (QR Generator)
- **Pink/Fuchsia**: `fuchsia-600` → `pink-600` (Image Cropper)
- **Blue/Cyan**: `blue-600` → `cyan-600`
- **Green/Emerald**: `green-600` → `emerald-600`
- **Orange/Amber**: `orange-600` → `amber-600`
- **Red/Rose**: `red-600` → `rose-600`

### Step 3: That's It!

The tool will automatically:
- ✅ Display on the homepage in the grid
- ✅ Animate on scroll with staggered entrance
- ✅ Show gradient theme throughout (icon, badge, price, button)
- ✅ Handle hover effects and interactions
- ✅ Scale beautifully on all devices
- ✅ Check auth status and redirect if needed

## Example: Adding a PDF Converter Tool

```typescript
import { FileTextIcon } from "lucide-react";

const tools: ToolCardProps[] = [
  // ... existing tools
  
  {
    icon: FileTextIcon,
    title: "PDF Converter",
    description: "Convert documents to PDF format instantly",
    price: "$0.50",
    priceSubtext: "per conversion",
    badge: "Fast & Secure",
    features: [
      "Convert Word, Excel, images to PDF",
      "Merge multiple files",
      "Compress PDF size",
      "100% client-side processing",
      "No file size limits",
    ],
    ctaText: "Convert Now",
    ctaLink: "/pdf",
    gradientFrom: "red-600",
    gradientTo: "orange-600",
    requireAuth: false,
  },
];
```

## Grid Layout

The grid automatically adjusts:
- **Mobile**: 1 column (stacked)
- **Tablet**: 2 columns
- **Desktop**: 2 columns (centered)

For more than 4 tools, consider switching to 3 columns:
```typescript
// In apps/web/src/app/page.tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 ...">
```

## Component Structure

```
apps/web/src/
├── app/
│   └── page.tsx                    # Homepage (tools array defined here)
├── components/
│   ├── tool-card.tsx              # Reusable tool card component
│   └── animated-background.tsx    # Background gradient blobs
```

## Customization Options

### Per-Tool Customization

Each tool card supports:
- Custom icon (any Lucide icon)
- Custom gradient colors
- Badge text and style
- Feature list (unlimited features)
- Price formatting
- Auth requirements

### Global Styling

Modify [apps/web/src/components/tool-card.tsx](apps/web/src/components/tool-card.tsx) to change:
- Card dimensions and spacing
- Animation timings and effects
- Hover behaviors
- Typography styles

### Background Animations

Edit [apps/web/src/components/animated-background.tsx](apps/web/src/components/animated-background.tsx) to adjust:
- Number of gradient blobs
- Animation speeds and patterns
- Blob colors and sizes
- Blur intensity

## Tips for Best Results

1. **Keep descriptions concise** (1-2 lines max)
2. **Use action-oriented CTAs** ("Generate", "Convert", "Try Now")
3. **List 4-5 key features** (most impactful benefits)
4. **Choose vibrant gradients** that match your tool's purpose
5. **Test on mobile** to ensure text is readable

## Future Enhancements

Consider adding:
- Tool categories/filters
- Search functionality
- "Most Popular" sorting
- Featured/promoted tools section
- Tool usage statistics
