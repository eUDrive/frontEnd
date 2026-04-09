# Authorization System - Visual Guide

## 1. Login/Sign Up Modal Popup

When a user clicks the auth icon and is NOT logged in, they see:

```
┌─────────────────────────────────────────────────────────────┐
│ Background: Semi-transparent black overlay                  │
│                                                               │
│    ┌──────────────────────────────────────────────────── ✕ ─┐
│    │                                                          │
│    │         Вход в аккаунт                                 │
│    │      Безопасный доступ к вашему профилю               │
│    │                                                          │
│    │  ┌────────────────────────────────────────────────┐   │
│    │  │ Вход  │  Регистрация                           │   │
│    │  └────────────────────────────────────────────────┘   │
│    │                                                          │
│    │  ┌─────────────────────────────────────────────────┐  │
│    │  │ E-mail адрес                                    │  │
│    │  │ [___________________________]                   │  │
│    │  │ Пароль                                         │  │
│    │  │ [___________________________]                   │  │
│    │  │                             Вход в аккаунт ──┐│  │
│    │  │ Условиями обслуживания и Политикой           ││  │
│    │  │ конфиденциальности                            ││  │
│    │  │                                                ││  │
│    │  │                                                ││  │
│    │  │ ──────────────────────────────────────────────┘│  │
│    │  └─────────────────────────────────────────────────┘  │
│    │                                                          │
│    └──────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘

Colors:
- Header & Button: RED gradient (#FF0000 → #CC0000)
- Active tab underline: RED
- Modal background: White
- Overlay: rgba(0, 0, 0, 0.6)
```

## 2. Personal Cabinet Dashboard

When a user is logged in and clicks the auth icon, they see:

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER (RED GRADIENT)                    │
│  ┌──────┐                                                        │
│  │ AVT. │ Добро пожаловать, [Name]!         [Logout Button] │
│  │      │ [email@example.com]                                   │
│  │  AB  │ Поставщик: email                                      │
│  └──────┘                                                        │
├─────────────────────────────────────────────────────────────────┤
│ 👤 Профиль  │ 📦 Заказы  │ ⚙️ Параметры  │ ❓ Помощь         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ИНФОРМАЦИЯ ПРОФИЛЯ                                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Полное имя             │ John Doe                           │ │
│  │ E-mail адрес           │ john@example.com                   │ │
│  │ ID пользователя        │ 1a2b3c4d5e...                     │ │
│  │                                                              │ │
│  │                         [Редактировать профиль]            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Tab Views:

**Profile Tab:**
```
ИНФОРМАЦИЯ ПРОФИЛЯ
┌──────────────────────────────────────────────────┐
│ Полное имя          │ John Doe                   │
│ E-mail адрес        │ john@example.com           │
│ ID пользователя     │ 1a2b3c4d5e6f7g8h          │
│                                                  │
│                 [Редактировать профиль]        │
└──────────────────────────────────────────────────┘
```

**Orders Tab:**
```
ИСТОРИЯ ЗАКАЗОВ
┌──────────────────────────────────────────────────┐
│                                                  │
│                      📦                          │
│               У вас нет заказов                 │
│                                                  │
│           [Перейти в каталог]                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Settings Tab:**
```
ПАРАМЕТРЫ АККАУНТА
┌──────────────────────────────────────────────────┐
│ Уведомления                                  [✓] │
│ Получайте уведомления по почте                   │
├──────────────────────────────────────────────────┤
│ Двухфакторная аутентификация    [Включить]      │
│ Добавьте дополнительный уровень безопасности    │
├──────────────────────────────────────────────────┤
│ Приватность                     [Управлять]     │
│ Управляйте вашей приватностью                    │
└──────────────────────────────────────────────────┘
```

**Help Tab:**
```
ПОМОЩЬ И ПОДДЕРЖКА
┌──────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────┐ │
│ │ Часто задаваемые вопросы                    │ │
│ │ Найдите ответы на общие вопросы              │ │
│ │                  Перейти к FAQ →             │ │
│ └──────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────┐ │
│ │ Связаться с поддержкой                       │ │
│ │ Наша команда готова помочь вам               │ │
│ │            Отправить сообщение →             │ │
│ └──────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────┐ │
│ │ Документация                                 │ │
│ │ Прочитайте нашу документацию                 │ │
│ │              Просмотр документов →            │ │
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

## 3. Mobile View

```
On small screens (< 480px):

┌────────────────────┐
│ Logo  Nav  Cart 👤 │  ← Header stays visible
├────────────────────┤
│ Вход в аккаунт     │
│                    │
│ E-mail             │
│ [__________]       │
│ Пароль             │
│ [__________]       │
│                    │
│ [Вход в аккаунт]   │
│                    │
│ Terms & Privacy    │
└────────────────────┘

OR

┌────────────────────┐
│ Logo  Nav  Cart 👤 │  ← "👤" is clickable
├────────────────────┤
│ PERSONAL CABINET   │
│                    │
│  Профиль           │ (text only, no icon)
│  Заказы            │
│  Параметры         │
│  Помощь            │
│                    │
│ Profile Info       │
│ ..................│
│ [Edit Profile]     │
│                    │
│ [Logout]           │
└────────────────────┘
```

## 4. Color Scheme

```
PRIMARY COLORS:
  ██ #FF0000 - Primary Red (buttons, active states)
  ██ #CC0000 - Dark Red (hover states)
  ██ #fff5f5 - Light Red (hover backgrounds)

GRAYSCALE:
  ██ #1a1a1a - Dark text (headings)
  ██ #333333 - Body text
  ██ #666666 - Secondary text
  ██ #999999 - Tertiary text
  ██ #e0e0e0 - Borders
  ██ #f8f8f8 - Light backgrounds
  ██ #ffffff - White (content backgrounds)

BACKGROUNDS:
  ██ rgba(0, 0, 0, 0.6) - Overlay (semi-transparent)
  Linear Gradient:
    ██ #FF0000 → #CC0000 (red gradient for headers/buttons)
```

## 5. Typography

```
Font Family: Montserrat, system fonts

Sizes:
  32px - Main headings (h1)
  24px - Section titles (h2)
  18px - Subsection titles (h3)
  16px - Body text, labels
  14px - Secondary text, hints
  12px - Small text, captions
  13px - Field labels

Weights:
  700 - Headings, primary emphasis
  600 - Buttons, tab labels, field labels
  500 - Body text, descriptions
  400 - Regular text (not commonly used)
```

## 6. Animations

```
Modal Entry:
  • Overlay: fade-in 0.2s
  • Modal box: slide-up 0.3s
  • Combined effect = smooth entrance

Tab Switch:
  • Content fade-in 0.3s
  • No content shift (uses absolute positioning)

Hover Effects:
  • Buttons: scale(1.1), shadow increase
  • Input focus: border color change, shadow
  • Cards: slight translate(Y), shadow increase
  • Links: color change, underline

Transitions: 0.2s - 0.3s ease or cubic-bezier(0.4, 0, 0.2, 1)
```

## 7. Interactive States

```
Buttons:
  Default:  Red bg, white text
  Hover:    Darker red, lifted effect (-2px), enhanced shadow
  Active:   Pressed effect (no lift)
  Disabled: 70% opacity, not-allowed cursor

Input Fields:
  Default:  Gray border, light gray bg
  Focus:    Red border, white bg, red shadow
  Error:    Red border, light red bg
  Disabled: Light gray bg, not-allowed cursor, 60% opacity

Links:
  Default:  Red text
  Hover:    Darker red, underline
  Active:   Darker red

Tabs:
  Default:  Gray text, no underline
  Hover:    Medium gray text
  Active:   Red text, red underline
```
