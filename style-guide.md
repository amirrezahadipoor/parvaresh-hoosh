# Khanak Academy — Visual Style Guide

## 1. Brand Colors

| Role | Hex | Name |
|------|-----|------|
| Primary | `#FF6B6B` | Reading (warm red) |
| Primary | `#4ECDC4` | Math (teal) |
| Primary | `#A29BFE` | Logic (soft purple) |
| Primary | `#F9CA24` | Science (golden yellow) |
| Primary | `#FF8A5C` | Social-Emotional (coral) |
| Primary | `#F368E0` | Art (pink) |

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#FFF8F0` | Main app background (warm cream) |
| Text | `#2D3436` | Primary text |
| Text Light | `#636E72` | Secondary text |
| Success | `#00B894` | Correct answer / reward |
| Error | `#D63031` | Wrong answer (used minimally) |
| Button | `#6C5CE7` | Interactive elements |

## 2. Typography

- **Font**: Vazirmatn (FD) — open-source, RTL-optimized Persian font
- **Fallback**: 'B Nazanin', 'Tahoma', sans-serif
- **Sizes**:
  - Headers: 28px, 24px, 20px
  - Body: 16px for readable text, 18px for children's reading
  - Button/Label: 14px-16px
  - Extra large (game UI): 32px-48px
- **Line height**: 1.8 for readability
- **Text direction**: RTL (direction: rtl; unicode-bidi: embed)

## 3. Mascot: "Khanak" the Wise Fox

- A cute, friendly fox character with big eyes and round features
- Color: warm orange (#E17055) with white chest and tail tip
- Wears a tiny round glasses (teacher look)
- Expressions: happy, thinking, surprised, proud, encouraging
- Will be drawn as SVG (vector) for crisp rendering at any size
- Used as guide/narrator throughout the app

## 4. Design Principles

- **Big touch targets**: Buttons at least 48x48dp, preferably 56x56dp
- **Generous spacing**: 16dp minimum, 24dp preferred between interactive elements
- **Rounded corners**: 12-16px radius on cards and buttons
- **Soft shadows**: Subtle box-shadow for depth (0 2px 8px rgba(0,0,0,0.1))
- **No small text**: Minimum 14px for any text
- **Icon + Text**: All buttons have both icon and text label
- **Colorful but not chaotic**: Max 3 colors per screen

## 5. Icon Style

- Simple, filled, rounded icons (material-like but custom)
- All icons in SVG format
- Line weight: 2-3px
- Corner radius: 2px
- Consistent 24x24px viewport

## 6. Animation Principles

- Duration: 300-500ms for UI transitions
- Easing: ease-out for entrances, ease-in-out for state changes
- Spring animations for rewards (bouncy, fun)
- Particle effects for celebrations (confetti, stars)
- Mascot idle animation: gentle bounce every 4 seconds

## 7. Audio Style

- Voice: Child-friendly, warm, encouraging female Persian narrator
- Sound effects: Gentle, musical, not jarring
- Reward sound: Rising chime (C-E-G arpeggio)
- Error: Soft descending tone, not punishing
- Button clicks: Subtle pop

## 8. Layout Grid

- Fluid 4-column grid on phone, 8-column on tablet
- Content max-width: 800px
- Horizontal padding: 16px (phone), 32px (tablet)
- Bottom navigation bar: 64px height
- Top header: 56px height