Tamam, bunu “yorum + öneri” değil, doğrudan **proje için referans alınacak teknik seçim dokümanı** formatında, temiz ve düzenli şekilde hazırlıyorum.

---

# TileMaster — Teknik Mimari ve Teknoloji Seçim Dokümanı

## 1. Proje Genel Yaklaşım

TileMaster, TypeScript tabanlı, React merkezli, desktop benzeri bir kullanıcı arayüzü sunan modüler bir uygulama olarak geliştirilecektir.

Uygulama:

* Esnek layout yönetimi
* Dockable panel sistemi
* Genişletilebilir UI bileşenleri
* Merkezi tema sistemi
* Modern state management
* Uzun vadeli ölçeklenebilir mimari

üzerine inşa edilecektir.

---

# 2. UI Framework

## React

Uygulamanın temel UI katmanı React olacaktır.

### Kullanım amacı:

* Component tabanlı UI mimarisi
* Dinamik ve modüler arayüz yapısı
* Geniş ekosistem entegrasyonu
* TypeScript ile güçlü tip güvenliği

---

# 3. Layout Yönetimi

## DockView Tabanlı Layout Sistemi

Layout yönetimi için DockView kullanılacaktır.

### Dockview

### Kullanım alanları:

* Dockable paneller
* Split view layout sistemi
* Tab management
* Workspace organizasyonu
* Desktop-style UI davranışları

### Not:

DockView’un dahili tema sistemi temel styling altyapısı olarak değerlendirilecektir ve mümkün olduğunca global tema sistemi ile uyumlu hale getirilecektir.

---

# 4. UI Component Sistemi

## Radix UI (Primitive Layer)

### Radix UI

Radix UI, düşük seviyeli UI primitive’ler için kullanılacaktır.

### Kullanım alanları:

* Dialog
* Tooltip
* Dropdown
* Context Menu
* Tabs
* Popover
* Scroll Area

Radix UI styling içermez, sadece davranış ve erişilebilirlik sağlar.

---

## shadcn/ui (Component Layer)

### shadcn/ui

Radix UI üzerine kurulu hazır component sistemi olarak kullanılacaktır.

### Kullanım yaklaşımı:

* Component’ler projeye kopyalanarak kullanılacaktır
* Tam kontrol sağlanacaktır
* Tailwind CSS ile özelleştirilecektir

---

# 5. Styling Sistemi

## Tailwind CSS

### Tailwind CSS

Tüm UI styling sistemi Tailwind CSS üzerine kurulacaktır.

### Temel prensipler:

* Utility-first yaklaşım
* Design token tabanlı yapı
* Hardcoded renk kullanımından kaçınma

---

## Merkezi Tema Sistemi

Uygulama genelinde tek bir theme architecture kullanılacaktır.

### Tema katmanları:

### 1. Design Tokens

* Renkler
* Spacing
* Typography
* Border radius
* Shadow sistemleri
* Animation değerleri

### 2. CSS Variables Katmanı

* Tüm design token’lar CSS variable olarak tanımlanır
* UI bileşenleri bu değişkenleri kullanır

### 3. Tailwind Entegrasyonu

* Tailwind config CSS variable’lara bağlanır
* Tüm UI bileşenleri aynı tema kaynağını kullanır

### 4. DockView Theme Entegrasyonu

* DockView tema sistemi global design tokens ile uyumlu hale getirilir
* UI ile görsel tutarlılık sağlanır

---

# 6. Icon Sistemi

## React Icons

### React Icons

### Kullanım:

* Tüm ikonlar React Icons üzerinden sağlanacaktır
* Farklı icon pack’leri tek API altında kullanılabilir

### Önerilen yaklaşım:

* Tek bir icon style seti seçilerek UI tutarlılığı korunacaktır

---

# 7. State Management

## Zustand

### Zustand

Uygulama state yönetimi Zustand ile yapılacaktır.

### Kullanım avantajları:

* Minimal API
* Boilerplate yok
* Modern React uyumu
* Modüler store yapısı
* Performanslı re-render kontrolü

### Store yapısı:

* useThemeStore
* useWorkspaceStore
* useEditorStore
* useProjectStore
* useUIStore
* useSettingsStore

---

# 8. Genel Mimari Yapı

```text
React
 ├── DockView (Layout System)
 │     └── Panels / Tabs / Workspace
 │
 ├── Zustand (State Layer)
 │     └── App-wide State Management
 │
 ├── Tailwind CSS (Styling Layer)
 │     └── Utility-first UI Styling
 │
 ├── Design Tokens (Theme Core)
 │     └── Global Theme Source of Truth
 │
 ├── Radix UI (Primitive Layer)
 │     └── Accessibility + Behavior
 │
 ├── shadcn/ui (Component Layer)
 │     └── UI Components
 │
 └── React Icons (Icon Layer)
       └── Icon System
```

---

# 9. Temel Mimari Prensipler

* Tüm UI bileşenleri tek bir design token sisteminden beslenir
* DockView layout sistemi uygulamanın temel iskeletidir
* Radix UI sadece davranış katmanıdır, styling içermez
* shadcn/ui component’leri özelleştirilebilir yapıdadır
* Zustand global state yerine domain bazlı store yaklaşımı kullanır
* Tailwind CSS tüm styling operasyonlarının merkezindedir

---

# 10. Sistem Hedefi

TileMaster’ın hedef mimarisi:

* Modüler
* Tema kontrollü
* Desktop benzeri UI deneyimi sunan
* Uzun vadede genişletilebilir
* Plugin ve workspace odaklı

bir uygulama yapısıdır.
