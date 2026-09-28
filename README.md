# 🥐 Sugar & Crumbs — Gourmet Pâtisserie Web App

A high-end, mobile-first gourmet pâtisserie storefront and kitchen management system built for the Abuja market. Designed with luxury aesthetics, smooth single-page application (SPA) views, and real-time localized logistics.

![Sugar & Crumbs Preview](https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop)

---

## ✨ Key Features

- **🍰 Universal Bespoke Treat Studio**: Interactive multi-tier customizer allowing customers to tailor custom cakes, cupcake boxes, artisanal donuts, and craft beverages with real-time dynamic pricing and inscriptions.
- **🪟 Show-Glass Counter Display**: Dedicated category filters for fresh grab-and-go items, including carrot cake wedges, velvet slices, and classic Abuja-style meat pies.
- **📍 Abuja Neighborhood Logistics**: Integrated delivery fee calculation targeting specific Abuja zones (Wuse, Maitama, Gwarinpa, Lugbe, Apo, etc.) alongside free store pickup.
- **🛡️ Secure Owner Admin Dashboard**: Passcode-protected management portal (`SUGARADMIN2026`) featuring live order queue tracking, order status updates (`New`, `Baking`, `Ready`, `Delivered`), and kitchen capacity monitoring to prevent custom/bulk order bottlenecks (capped at 3 heavy orders per day).
- **🎟️ Regex Promo Code Validation**: Custom pattern validation (`SUGAR[0-9]{2}`, e.g., `SUGAR20`) unlocking an instant 20% basket discount.
- **🌙 Dark / Light Mode**: Seamless theme switching with state persistence via `localStorage`.
- **⚡ Advanced Event Architecture**: Powered by 20+ distinct event types handling blur validation, clipboard tracking, paste auto-formatting, haptic touch feedback, and network online/offline status monitoring.

---

## 🛠️ Tech Stack

- **Markup & Layout**: HTML5, Tailwind CSS (via CDN)
- **Styling**: Custom CSS3 (`style.css`), CSS Variables, Flexbox/Grid, Dark Mode tokens
- **Logic**: Vanilla JavaScript (ES6+), DOM manipulation, Event Delegation
- **Persistence**: `localStorage` (Cart, Wishlist, Orders, Theme) & `sessionStorage` (Admin Auth)
- **Icons**: Iconify / Lucide icons
- **Typography**: Playfair Display (Serif) & Plus Jakarta Sans (Sans-Serif)

---

## 🚀 Project Structure

```text
sugar-and-crumbs/
│
├── index.html       # Main Single-Page Application (SPA) container & views
├── style.css        # Custom styles, animations, theme tokens, & responsive rules
└── script.js        # Application state, event handlers, validation, & mock data