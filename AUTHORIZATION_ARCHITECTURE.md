```
AUTHORIZATION SYSTEM ARCHITECTURE
==================================

┌─────────────────────────────────────────────────────────┐
│                    APPLICATION FLOW                     │
└─────────────────────────────────────────────────────────┘

USER NOT LOGGED IN
──────────────────
    User clicks auth icon
           ↓
    Header.tsx onClick handler
           ↓
    Navigate to /auth
           ↓
    AuthPage.tsx renders
           ↓
    AuthModal appears as overlay popup
           ↓
    User fills form (Russian):
    • Вход (Login) - email + password
    • Регистрация (Sign Up) - name + email + password
           ↓
    Submit form
           ↓
    AuthContext.login() or AuthContext.signup() called
           ↓
    User authenticated
           ↓
    Modal closes
           ↓
    User's isAuthenticated state = true


USER ALREADY LOGGED IN
──────────────────────
    User clicks auth icon
           ↓
    Header.tsx checks isAuthenticated
           ↓
    Navigate to /cabinet
           ↓
    PersonalCabinetPage renders
           ↓
    Display personal cabinet with:
    • 👤 Profile (name, email, ID)
    • 📦 Orders (empty state → catalog link)
    • ⚙️ Settings (notifications, 2FA, privacy)
    • ❓ Help (FAQ, support, docs)
           ↓
    User can click Logout button
           ↓
    AuthContext.logout() called
           ↓
    Redirected to homepage


COMPONENT STRUCTURE
═══════════════════

src/
├── components/
│   └── Header/
│       ├── Header.tsx          ← Click handler for auth
│       └── Header.css
│
├── pages/
│   ├── AuthPage.tsx            ← Contains AuthModal + legacy AuthPage
│   ├── AuthPage.css            ← Modal popup styles
│   ├── PersonalCabinetPage.tsx ← Dashboard for logged-in users
│   └── PersonalCabinetPage.css ← Cabinet styles
│
├── context/
│   └── AuthContext.tsx         ← User state & auth methods
│
└── App.tsx                     ← Routes including /cabinet


STATE MANAGEMENT
════════════════

AuthContext provides:
├── user: User | null
│   ├── id: string
│   ├── email: string
│   ├── name: string
│   ├── avatar?: string
│   └── provider?: 'email' | 'google' | 'github' | 'microsoft'
├── isAuthenticated: boolean
├── isLoading: boolean
├── error: string | null
├── isSuccess: boolean
└── Methods:
    ├── login(email, password)
    ├── signup(email, password, name)
    ├── oauthLogin(provider, token)
    ├── logout()
    └── clearError()


STYLING SYSTEM
══════════════

COLORS:
  Primary Red:      #FF0000
  Dark Red:         #CC0000
  Light Red BG:     #fff5f5
  Dark Gray Text:   #1a1a1a
  Medium Gray:      #666
  Light Gray:       #999
  Background:       #f8f8f8
  Border:           #e0e0e0

TYPOGRAPHY:
  Font: Montserrat, system fonts
  Headers: font-weight 700
  Labels: font-weight 600
  Body: font-weight 500

SPACING (rem/px):
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  2xl: 32px
  3xl: 40px

ANIMATIONS:
  fadeIn: 0.2s ease-out
  slideUp: 0.3s ease-out
  All transitions: 0.2-0.3s


RESPONSIVE BREAKPOINTS
══════════════════════

Desktop (≥768px):
  - Full tab layout
  - All icons visible
  - Full width forms
  - Multiple column grids

Tablet (768px - 480px):
  - Optimized spacing
  - Adjusted font sizes
  - Touch-friendly elements

Mobile (<480px):
  - Single column layout
  - Icons hidden in tabs
  - Stacked components
  - Full width buttons
  - Larger touch targets


RUSSIAN TRANSLATIONS
════════════════════

Auth Modal:
  • "Вход в аккаунт" = Sign In
  • "Безопасный доступ к вашему профилю" = Secure access to your profile
  • "Вход" = Login (tab)
  • "Регистрация" = Sign Up (tab)
  • "E-mail адрес" = Email Address
  • "Пароль" = Password
  • "Полное имя" = Full Name
  • "Подтвердите пароль" = Confirm Password
  • "Пароли не совпадают" = Passwords do not match

Cabinet:
  • "Добро пожаловать" = Welcome
  • "Профиль" = Profile
  • "Заказы" = Orders
  • "Параметры" = Settings
  • "Помощь" = Help
  • "Выход" = Logout
  • "У вас нет заказов" = You have no orders
  • "История заказов" = Order History


FILES SUMMARY
═════════════

AuthPage.tsx:
  - Lines: ~293
  - Exports: AuthModal component, AuthPage component
  - Dependencies: useAuth, validateEmail, validatePassword, validateName

AuthPage.css:
  - Lines: ~365
  - Key classes: .auth-modal-overlay, .auth-modal, .auth-modal-close
  - Also contains legacy .auth-page styles for compatibility

PersonalCabinetPage.tsx:
  - Lines: ~186
  - Exports: PersonalCabinetPage component
  - Dependencies: useAuth, useNavigate

PersonalCabinetPage.css:
  - Lines: ~400+
  - Full cabinet styling with responsive design
  - Tab navigation, profile cards, settings, help items

App.tsx:
  - Added route: /cabinet → PersonalCabinetPage
  - Updated valid routes list

Header.tsx:
  - Changed auth icon from Link to button
  - Smart routing based on isAuthenticated
```
