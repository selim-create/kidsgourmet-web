# KidsGourmet Frontend - API Integration Documentation

## 📋 Genel Bakış

Bu dokümantasyon, KidsGourmet frontend uygulamasının backend API'sine entegrasyonunu açıklar. Tüm mock veriler gerçek API endpoint'lerine bağlanmıştır.

## 🏗️ Mimari

### Katmanlar

```
┌─────────────────────────────────────┐
│         UI Components/Pages         │
│   (Login, Register, Dashboard...)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Custom Hooks & Context        │
│  (useUser, useFavorites, etc.)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          Services Layer             │
│  (authService, recipeService...)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│            API Wrapper              │
│     (fetchAPI, fetchAuthAPI)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Backend API (kg-core)        │
│    https://api.kidsgourmet.com.tr   │
└─────────────────────────────────────┘
```

## 📁 Dosya Yapısı

```
src/
├── lib/
│   ├── types.ts          # Tüm tip tanımları
│   ├── constants.ts      # API endpoints ve sabitler
│   └── api.ts           # Merkezi API istek fonksiyonu
├── services/
│   ├── auth-service.ts       # Kimlik doğrulama
│   ├── recipe-service.ts     # Tarifler
│   ├── ingredient-service.ts # Malzemeler
│   └── user-service.ts       # Kullanıcı işlemleri
├── hooks/
│   ├── use-user.tsx          # Kullanıcı context ve hook
│   ├── use-favorites.tsx     # Favoriler hook
│   └── use-shopping-list.tsx # Alışveriş listesi hook
└── app/
    ├── layout.tsx            # UserProvider ile sarmalanmış
    ├── (auth)/
    │   ├── login/page.tsx    # API'ye bağlı giriş
    │   └── register/page.tsx # API'ye bağlı kayıt
    └── ...
```

## 🔐 Kimlik Doğrulama

### Token Yönetimi

```typescript
// Token localStorage'da 'kg_token' anahtarı ile saklanır
localStorage.setItem('kg_token', token);
localStorage.getItem('kg_token');
localStorage.removeItem('kg_token');
```

### Kullanım

```typescript
import { authService } from '@/services/auth-service';

// Giriş
const response = await authService.login({ email, password });
// response.token ve response.user döner

// Kayıt
const response = await authService.register({ email, password, name });

// Mevcut kullanıcı
const user = await authService.getCurrentUser();

// Çıkış
authService.logout();
```

## 🎣 Custom Hooks Kullanımı

### useUser Hook

Global kullanıcı durumu yönetimi:

```typescript
import { useUser } from '@/hooks/use-user';

function MyComponent() {
  const { 
    user,              // Mevcut kullanıcı
    isAuthenticated,   // Giriş yapılmış mı?
    isLoading,         // Yükleniyor mu?
    login,             // Giriş fonksiyonu
    logout,            // Çıkış fonksiyonu
    register,          // Kayıt fonksiyonu
    activeChild,       // Aktif çocuk profili
    setActiveChild,    // Aktif çocuk değiştir
    refreshUser        // Kullanıcı bilgisini yenile
  } = useUser();

  // Kullanım
  if (isLoading) return <div>Yükleniyor...</div>;
  if (!isAuthenticated) return <div>Lütfen giriş yapın</div>;
  
  return <div>Merhaba {user.name}</div>;
}
```

### useFavorites Hook

Favori tarifleri yönetme:

```typescript
import { useFavorites } from '@/hooks/use-favorites';

function FavoriteButton({ recipeId }) {
  const { 
    isFavorite,      // Favori mi kontrol et
    toggleFavorite,  // Favori ekle/çıkar
    favorites,       // Tüm favoriler
    isLoading 
  } = useFavorites();

  return (
    <button onClick={() => toggleFavorite(recipeId)}>
      {isFavorite(recipeId) ? '❤️' : '🤍'}
    </button>
  );
}
```

### useShoppingList Hook

Alışveriş listesi yönetimi:

```typescript
import { useShoppingList } from '@/hooks/use-shopping-list';

function ShoppingList() {
  const {
    items,           // Liste öğeleri
    addItems,        // Öğe ekle
    removeItem,      // Öğe sil
    toggleItem,      // İşaretle/işaret kaldır
    clearChecked,    // İşaretlileri temizle
    copyToClipboard, // Panoya kopyala
    shareWhatsapp    // WhatsApp'ta paylaş
  } = useShoppingList();

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <input 
            type="checkbox"
            checked={item.checked}
            onChange={() => toggleItem(item.id)}
          />
          {item.ingredient}
        </div>
      ))}
    </div>
  );
}
```

## 🍳 Servisler

### Recipe Service

```typescript
import { recipeService } from '@/services/recipe-service';

// Tüm tarifler
const recipes = await recipeService.getAll({
  page: 1,
  perPage: 12,
  ageGroup: '6-9-ay',
  dietType: 'vegan',
  search: 'havuç'
});

// Tekil tarif
const recipe = await recipeService.getBySlug('bal-kabakli-corba');

// Öne çıkan tarifler
const featured = await recipeService.getFeatured(5);

// Yaş grubuna göre
const ageRecipes = await recipeService.getByAgeGroup('6-9-ay', 10);

// Benzer tarifler
const related = await recipeService.getRelated(recipeId, 4);
```

### Ingredient Service

```typescript
import { ingredientService } from '@/services/ingredient-service';

// Tüm malzemeler
const ingredients = await ingredientService.getAll({
  page: 1,
  perPage: 24,
  startAge: '6-ay',
  allergyRisk: 'Düşük',
  season: 'Kış'
});

// Tekil malzeme
const ingredient = await ingredientService.getBySlug('avokado');

// Arama
const results = await ingredientService.search('muz');
```

### User Service

```typescript
import { userService } from '@/services/user-service';

// Profil
const profile = await userService.getProfile();
await userService.updateProfile({ name: 'Yeni İsim' });

// Çocuklar
const children = await userService.getChildren();
const newChild = await userService.addChild({
  name: 'Ali',
  birth_date: '2023-06-15',
  allergens: ['süt']
});

// Favoriler
const favorites = await userService.getFavorites();
await userService.addFavorite(recipeId);
await userService.removeFavorite(recipeId);

// Alışveriş Listesi
const list = await userService.getShoppingList();
await userService.addToShoppingList([{ ingredient: 'Avokado', checked: false }]);
```

## 🔌 API Endpoints

Tüm endpoint'ler `src/lib/constants.ts` dosyasında tanımlıdır:

```typescript
export const API_ENDPOINTS = {
  // Recipes
  RECIPES: '/kg/v1/recipes',
  RECIPE_BY_SLUG: (slug) => `/kg/v1/recipes/${slug}`,
  RECIPES_FEATURED: '/kg/v1/recipes/featured',
  RECIPES_BY_AGE: (age) => `/kg/v1/recipes/by-age/${age}`,
  
  // Ingredients
  INGREDIENTS: '/kg/v1/ingredients',
  INGREDIENT_BY_SLUG: (slug) => `/kg/v1/ingredients/${slug}`,
  INGREDIENTS_SEARCH: '/kg/v1/ingredients/search',
  
  // Auth
  AUTH_LOGIN: '/kg/v1/auth/login',
  AUTH_REGISTER: '/kg/v1/auth/register',
  AUTH_ME: '/kg/v1/auth/me',
  
  // User
  USER_PROFILE: '/kg/v1/user/profile',
  USER_CHILDREN: '/kg/v1/user/children',
  USER_FAVORITES: '/kg/v1/user/favorites',
  USER_SHOPPING_LIST: '/kg/v1/user/shopping-list',
  
  // Search
  SEARCH: '/kg/v1/search',
};
```

## 🚀 Kurulum ve Çalıştırma

### 1. Environment Değişkenleri

`.env.local` dosyası oluşturun:

```bash
cp .env.example .env.local
```

`.env.local` içeriği:

```
NEXT_PUBLIC_WORDPRESS_API_URL=https://api.kidsgourmet.com.tr/wp-json
```

### 2. Bağımlılıkları Yükle

```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

### 4. Production Build

```bash
npm run build
npm start
```

## 🔍 Hata Ayıklama

### API İsteklerini İzleme

Tarayıcı console'unda tüm API hataları loglanır:

```javascript
// api.ts içinde
console.error(`API Error: ${res.status} at ${endpoint}`, errorData);
```

### Token Sorunları

```javascript
// Token'ı kontrol et
console.log(localStorage.getItem('kg_token'));

// Token'ı temizle
localStorage.removeItem('kg_token');
```

### Network İsteklerini İzleme

Browser DevTools > Network sekmesinden tüm API isteklerini görebilirsiniz.

## ⚠️ Önemli Notlar

1. **SSR/CSR**: Server-side rendering sayfalarında `localStorage` kullanılamaz. Bu yüzden token kontrolü client-side yapılır.

2. **Auth Guard**: Korumalı sayfalar için `useUser` hook'u ile kontrol yapın:

```typescript
const { isAuthenticated, isLoading } = useUser();

if (isLoading) return <Loading />;
if (!isAuthenticated) return <Redirect to="/login" />;
```

3. **Error Handling**: Tüm API çağrılarında try-catch kullanın ve kullanıcıya anlamlı mesajlar gösterin.

4. **Loading States**: API çağrıları sırasında loading göstergeleri kullanın.

## 📝 Örnek Kullanım Senaryoları

### Tarif Detay Sayfası

```typescript
// Server Component (SSR)
export default async function RecipePage({ params }) {
  const recipe = await recipeService.getBySlug(params.slug);
  
  if (!recipe) {
    notFound();
  }
  
  return <RecipeDetailClient recipe={recipe} />;
}

// Client Component (interaktif özellikler için)
'use client';

function RecipeDetailClient({ recipe }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  
  return (
    <div>
      <h1>{recipe.title}</h1>
      <button onClick={() => toggleFavorite(recipe.id)}>
        {isFavorite(recipe.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
      </button>
    </div>
  );
}
```

### Giriş Formu

```typescript
'use client';

function LoginForm() {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Giriş Yap</button>
    </form>
  );
}
```

## 🧪 Test

Build test:

```bash
npm run build
```

TypeScript type check:

```bash
npm run type-check
```

## 📚 Kaynaklar

- Backend API Dokümantasyonu: `kg-core` repository
- Next.js App Router: https://nextjs.org/docs
- TypeScript: https://www.typescriptlang.org/

## 🆘 Destek

Sorunlar için GitHub Issues kullanın.
