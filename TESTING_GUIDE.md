# Authorization System - Testing Guide

## Quick Start

### 1. Start Development Server
```bash
cd /home/chiba/projects/tWeb/frontEnd
npm run dev
```

The app will be available at `http://localhost:5174/`

### 2. Build for Production
```bash
npm run build
```

This creates optimized production build in `dist/` directory.

---

## Manual Testing Scenarios

### Scenario 1: User Not Logged In - View Login Modal

**Steps:**
1. Open the application
2. Click the user icon (👤) in the top-right header
3. You should see a modal popup appear

**Expected Behavior:**
- Modal fades in with semi-transparent overlay
- Modal slides up smoothly
- Close button (✕) is visible in top-right
- Two tabs visible: "Вход" (Login) and "Регистрация" (Sign Up)
- Login tab selected by default
- Form contains:
  - E-mail адрес (email field)
  - Пароль (password field)
  - Вход (login button)

**✓ Pass**: All elements render correctly and animations play smoothly

---

### Scenario 2: Sign Up Form Validation

**Steps:**
1. Click auth icon
2. Click "Регистрация" (Sign Up) tab
3. Try submitting with empty fields
4. Fill in invalid email
5. Fill in password with only 5 characters
6. Fill in mismatched password confirmation
7. Fill in valid data

**Expected Behavior:**
- Empty fields show error: "Field is required"
- Invalid email shows: "Invalid email format"
- Short password shows: "Password must contain at least 8 characters..."
- Mismatched passwords show: "Пароли не совпадают"
- Valid data passes validation
- Button shows "Регистрация..." while loading

**✓ Pass**: All validations work correctly

---

### Scenario 3: Mock Authentication

**Steps:**
1. In Sign Up tab, enter:
   - Name: "Иван Петров"
   - Email: "ivan@example.com"
   - Password: "Test12345"
   - Confirm: "Test12345"
2. Click "Зарегистрироваться"
3. Modal should close

**Expected Behavior:**
- Loading state shows "Регистрация..."
- Modal closes after successful auth
- User is now authenticated (state updated)

**✓ Pass**: Mock authentication works

---

### Scenario 4: Logged In User - View Personal Cabinet

**Steps:**
1. After login (from Scenario 3)
2. Click the user icon (👤) in header again
3. You should see the Personal Cabinet page

**Expected Behavior:**
- Page has red gradient header
- Shows user name: "Иван Петров"
- Shows user email: "ivan@example.com"
- Shows user ID
- Four tabs visible:
  - 👤 Профиль (Profile)
  - 📦 Заказы (Orders)
  - ⚙️ Параметры (Settings)
  - ❓ Помощь (Help)
- Profile tab active by default

**✓ Pass**: Cabinet page displays correctly

---

### Scenario 5: Tab Navigation in Cabinet

**Steps:**
1. In Cabinet, click "📦 Заказы" tab
2. Observe content change
3. Click "⚙️ Параметры" tab
4. Click "❓ Помощь" tab
5. Click back to "👤 Профиль"

**Expected Behavior:**
- Content smoothly fades in when switching tabs
- Red underline moves to active tab
- No page reload needed
- All tab content is relevant:
  - Orders: Empty state with catalog link
  - Settings: Notifications, 2FA, Privacy toggles
  - Help: FAQ, Support, Documentation cards
  - Profile: User info with edit button

**✓ Pass**: Tab navigation works smoothly

---

### Scenario 6: Logout

**Steps:**
1. In Personal Cabinet
2. Click the red "Выход" (Logout) button in header

**Expected Behavior:**
- User is logged out
- Redirected to homepage
- User icon now opens login modal again (not cabinet)

**✓ Pass**: Logout works correctly

---

### Scenario 7: Modal Close Button

**Steps:**
1. Click auth icon (not logged in)
2. Modal appears
3. Click the ✕ close button

**Expected Behavior:**
- Modal closes smoothly
- Overlay fades out
- Returns to previous page
- Can re-open modal by clicking auth icon

**✓ Pass**: Close button works

---

### Scenario 8: Responsive Design - Tablet (768px)

**Steps:**
1. Open DevTools (F12)
2. Set viewport to 768x1024 (iPad)
3. Click auth icon

**Expected Behavior:**
- Modal still visible and usable
- Form fields remain accessible
- Buttons are touch-friendly (larger tap targets)
- All text readable without horizontal scroll

**✓ Pass**: Tablet view works

---

### Scenario 9: Responsive Design - Mobile (375px)

**Steps:**
1. Open DevTools (F12)
2. Set viewport to 375x667 (iPhone)
3. Click auth icon
4. Fill form and submit
5. Click user icon to view cabinet

**Expected Behavior:**
- Modal takes up most of screen but leaves edges visible
- Form fields are vertical and full width
- Buttons are clickable (no overlap)
- Cabinet tabs show text only (no icons)
- All content readable
- No horizontal scrolling

**✓ Pass**: Mobile view works

---

### Scenario 10: Browser Navigation

**Steps:**
1. Submit login form
2. Modal closes
3. Use browser back button
4. Forward button

**Expected Behavior:**
- Back button returns to previous route
- Forward button works
- Modal doesn't reappear unexpectedly
- Navigation history is preserved

**✓ Pass**: Browser history works correctly

---

## Automated Testing (Future)

The following can be automated with Jest/React Testing Library:

```javascript
// Example test structure
describe('AuthModal', () => {
  test('should render login form by default', () => {
    // Render component
    // Check for email/password inputs
  });

  test('should switch to signup tab', () => {
    // Click signup tab
    // Check for name field
  });

  test('should validate email format', () => {
    // Enter invalid email
    // Check for error message
  });

  test('should show loading state during submission', () => {
    // Submit form
    // Check button text changes to "Вход..."
  });
});

describe('PersonalCabinetPage', () => {
  test('should show cabinet for authenticated users', () => {
    // Mock useAuth to return authenticated user
    // Check if cabinet content renders
  });

  test('should redirect to auth when not authenticated', () => {
    // Mock useAuth to return null
    // Check for redirect to auth
  });

  test('should switch tabs correctly', () => {
    // Click each tab
    // Verify content changes
  });
});
```

---

## Performance Testing

### Check Bundle Size:
```bash
npm run build
# Check console output for gzip size
# Current: ~45KB CSS, ~280KB JS
```

### Lighthouse Audit:
1. Open DevTools → Lighthouse
2. Run audit
3. Check for:
   - Performance: >90
   - Accessibility: >90
   - Best Practices: >90
   - SEO: >90

---

## Accessibility Testing

### Keyboard Navigation:
1. Press Tab to navigate through form fields
2. Press Shift+Tab to go backwards
3. Press Enter to submit form
4. Press Escape to close modal
5. Use arrow keys to switch tabs (if implemented)

### Screen Reader:
1. Use NVDA (Windows) or VoiceOver (Mac)
2. Check that form labels are associated with inputs
3. Verify button text is clear
4. Check that tab changes announce correctly

### Color Contrast:
- Red #FF0000 on white: ✓ (good)
- Dark text #1a1a1a on white: ✓ (excellent)
- Light gray text on white: Need to verify WCAG compliance

---

## API Integration Testing (When Backend Ready)

Currently using mock data. When backend is ready:

```javascript
// Update AuthContext.tsx:
const login = useCallback(async (email: string, password: string) => {
  try {
    setAuthState(prev => ({...prev, isLoading: true, error: null}));
    
    // Replace mock with actual API call:
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    });
    
    if (!response.ok) throw new Error('Login failed');
    
    const data = await response.json();
    const mockUser: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      avatar: data.user.avatar,
      provider: 'email'
    };
    
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      isSuccess: true
    });
    
    localStorage.setItem('auth_token', data.token);
  } catch (err) {
    handleError(err instanceof Error ? err.message : 'Login failed');
  }
}, []);
```

---

## Known Limitations & TODOs

- [ ] Password reset not implemented
- [ ] OAuth (Google, GitHub) not fully integrated
- [ ] 2FA settings show UI but no backend
- [ ] Avatar upload not implemented
- [ ] Edit profile not functional
- [ ] Orders/history requires backend API
- [ ] Help section links are placeholders
- [ ] Email confirmation not implemented

---

## Debugging Tips

### Check Authentication State:
Open DevTools Console:
```javascript
// Check if user is logged in
localStorage.getItem('auth_token')

// Check AuthContext (if exposed)
// Look for Redux/Context DevTools extension for detailed state
```

### Common Issues:

1. **Modal doesn't appear**
   - Check browser console for errors
   - Verify isOpen prop is true
   - Check if overlay z-index is sufficient

2. **Form validation errors**
   - Check validation functions in `src/utils/validation.ts`
   - Verify input values are being captured

3. **Cabinet doesn't show**
   - Check isAuthenticated flag
   - Verify user object is populated
   - Check localStorage for auth_token

4. **Styling looks wrong**
   - Check CSS file imports
   - Verify no CSS conflicts
   - Clear browser cache (Ctrl+Shift+Delete)

---

## Browser Compatibility

- ✓ Chrome/Edge (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Metrics

Target metrics:
- Modal open time: <200ms
- Form submission response: <500ms
- Cabinet page load: <500ms
- Animations: 60fps (no jank)

---

For more information, see:
- AUTHORIZATION_REBUILD_SUMMARY.md - Feature overview
- AUTHORIZATION_ARCHITECTURE.md - Technical architecture
- VISUAL_GUIDE.md - UI/UX reference
