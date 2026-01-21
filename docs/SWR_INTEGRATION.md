# SWR Integration - API Caching and Request Deduplication

## Overview

This implementation adds SWR (stale-while-revalidate) for frontend API caching and request deduplication. This optimizes the application by:

- **Eliminating duplicate API calls** through automatic deduplication
- **Faster page navigation** with cached data
- **Better user experience** by showing previous data while revalidating
- **Reduced network requests** - only fetch on cache miss

## Architecture

### 1. SWR Provider (`src/providers/swr-provider.tsx`)

The global SWR configuration provider wraps the application and sets default caching behavior:

```typescript
<SWRProvider>
  <UserProvider>
    {/* Rest of app */}
  </UserProvider>
</SWRProvider>
```

**Configuration:**
- `revalidateOnFocus: false` - Don't refetch when window regains focus
- `revalidateOnReconnect: false` - Don't refetch on network reconnection
- `dedupingInterval: 60000` - Dedupe identical requests within 1 minute
- `keepPreviousData: true` - Show cached data while fetching new data
- `errorRetryCount: 2` - Retry failed requests up to 2 times

### 2. Data Fetching Hooks

#### Recipes (`src/hooks/use-recipes.ts`)

```typescript
import { useRecipes, useRecipe, useFeaturedRecipes, useRelatedRecipes } from '@/hooks/use-recipes';

// List all recipes with filters
function RecipesPage() {
  const { data, error, isLoading, mutate } = useRecipes({
    page: 1,
    perPage: 12,
    ageGroup: '6-8-ay',
    dietType: 'vejetaryen',
    orderBy: 'date'
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading recipes</div>;

  const { recipes, total, total_pages } = data;
  
  return (
    <div>
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

// Single recipe by slug
function RecipeDetailPage({ slug }: { slug: string }) {
  const { data: recipe, error, isLoading } = useRecipe(slug);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Recipe not found</div>;
  
  return <div>{recipe.title}</div>;
}

// Featured recipes
function HomePage() {
  const { data: featured, isLoading } = useFeaturedRecipes(5);
  
  return (
    <div>
      {featured?.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

// Related recipes
function RelatedRecipes({ recipeId }: { recipeId: number }) {
  const { data: related } = useRelatedRecipes(recipeId, 4);
  
  return (
    <div>
      {related?.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
```

**Caching Strategy:**
- List queries: 60 seconds (1 minute)
- Detail pages: 300 seconds (5 minutes)
- Featured recipes: 60 seconds
- Related recipes: 300 seconds

#### Ingredients (`src/hooks/use-ingredients.ts`)

```typescript
import { 
  useIngredients, 
  useIngredient, 
  useIngredientCategories, 
  useIngredientSearch 
} from '@/hooks/use-ingredients';

// List all ingredients
function IngredientsPage() {
  const { data, error, isLoading } = useIngredients({
    page: 1,
    perPage: 24,
    allergyRisk: 'Düşük',
    season: 'Yaz'
  });

  // Handle both paginated and non-paginated responses
  const ingredients = Array.isArray(data) ? data : data?.ingredients;
  
  return (
    <div>
      {ingredients?.map(ingredient => (
        <IngredientCard key={ingredient.id} ingredient={ingredient} />
      ))}
    </div>
  );
}

// Single ingredient
function IngredientDetailPage({ slug }: { slug: string }) {
  const { data: ingredient, error, isLoading } = useIngredient(slug);
  
  return <div>{ingredient?.name}</div>;
}

// Categories
function IngredientFilters() {
  const { data: categories } = useIngredientCategories();
  
  return (
    <select>
      {categories?.map(cat => (
        <option key={cat}>{cat}</option>
      ))}
    </select>
  );
}

// Search
function IngredientSearch() {
  const [query, setQuery] = useState('');
  const { data: results } = useIngredientSearch(query);
  
  return (
    <div>
      <input onChange={(e) => setQuery(e.target.value)} />
      {results?.map(ingredient => (
        <div key={ingredient.id}>{ingredient.name}</div>
      ))}
    </div>
  );
}
```

**Caching Strategy:**
- List queries: 60 seconds
- Detail pages: 300 seconds (5 minutes)
- Categories: 3600 seconds (1 hour) - rarely changes
- Search results: 30 seconds

#### Discussions (`src/hooks/use-discussions.ts`)

```typescript
import { 
  useDiscussions, 
  useDiscussion, 
  useCircles, 
  useTopContributors 
} from '@/hooks/use-discussions';

// List discussions
function CommunityPage() {
  const { data, error, isLoading } = useDiscussions({
    circle_id: 1,
    page: 1,
    per_page: 20,
    featured_only: false,
    expert_answered: true
  });

  const { discussions, total, pages } = data || {};
  
  return (
    <div>
      {discussions?.map(discussion => (
        <DiscussionCard key={discussion.id} discussion={discussion} />
      ))}
    </div>
  );
}

// Single discussion
function DiscussionPage({ id }: { id: number }) {
  const { data: discussion } = useDiscussion(id);
  
  return <div>{discussion?.title}</div>;
}

// Circles
function CirclesNav() {
  const { data: circles } = useCircles();
  
  return (
    <nav>
      {circles?.map(circle => (
        <a key={circle.id} href={`/topluluk/odak/${circle.slug}`}>
          {circle.name}
        </a>
      ))}
    </nav>
  );
}

// Top contributors
function TopContributorsWidget() {
  const { data: contributors } = useTopContributors(5, 'week');
  
  return (
    <div>
      {contributors?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

**Caching Strategy:**
- Discussions: 30 seconds (more dynamic content)
- Single discussion: 60 seconds
- Circles: 300 seconds (5 minutes)
- Top contributors: 300 seconds

#### Blog Posts (`src/hooks/use-blog.ts`)

```typescript
import { useBlogPosts, useBlogPost } from '@/hooks/use-blog';

// List blog posts
function BlogPage() {
  const { data, error, isLoading } = useBlogPosts({
    page: 1,
    perPage: 12,
    category: 5
  });

  const { posts, total, totalPages } = data || {};
  
  return (
    <div>
      {posts?.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// Single blog post
function BlogPostPage({ slug }: { slug: string }) {
  const { data: post } = useBlogPost(slug);
  
  return <div>{post?.title.rendered}</div>;
}
```

**Caching Strategy:**
- List queries: 60 seconds
- Detail pages: 300 seconds (5 minutes)

### 3. Prefetching (`src/lib/prefetch.ts`)

Prefetching allows you to load data before the user navigates to a page, improving perceived performance.

```typescript
import { 
  prefetchRecipe, 
  prefetchIngredient, 
  prefetchPopularData 
} from '@/lib/prefetch';

// Prefetch on hover (already integrated in RecipeCard and IngredientCard)
function RecipeCard({ recipe }) {
  const handleMouseEnter = () => {
    prefetchRecipe(recipe.slug);
  };
  
  return (
    <Link 
      href={`/tarifler/${recipe.slug}`}
      onMouseEnter={handleMouseEnter}
    >
      {recipe.title}
    </Link>
  );
}

// Prefetch popular data on app load
function Layout() {
  useEffect(() => {
    prefetchPopularData();
  }, []);
  
  return <div>{children}</div>;
}
```

## Usage Examples

### Replacing useState/useEffect Pattern

**Before (Traditional Pattern):**
```typescript
function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    recipeService.getAll({ page: 1, perPage: 12 })
      .then(data => {
        setRecipes(data.recipes);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  
  return <div>{recipes.map(...)}</div>;
}
```

**After (SWR Pattern):**
```typescript
import { useRecipes } from '@/hooks/use-recipes';

function RecipesPage() {
  const { data, error, isLoading } = useRecipes({ page: 1, perPage: 12 });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  
  return <div>{data.recipes.map(...)}</div>;
}
```

### Manual Revalidation

```typescript
function RecipesPage() {
  const { data, mutate } = useRecipes({ page: 1 });
  
  const handleRefresh = async () => {
    // Force revalidate
    await mutate();
  };
  
  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      {data?.recipes.map(...)}
    </div>
  );
}
```

### Optimistic Updates

```typescript
function RecipeActions({ recipe }) {
  const { mutate } = useRecipe(recipe.slug);
  
  const handleLike = async () => {
    // Optimistically update UI
    mutate(
      { ...recipe, likes: recipe.likes + 1 },
      false // Don't revalidate
    );
    
    // Make API call
    await api.likeRecipe(recipe.id);
    
    // Revalidate to get server state
    mutate();
  };
  
  return <button onClick={handleLike}>Like</button>;
}
```

## Performance Benefits

### Before SWR
- **Duplicate requests:** Multiple components fetching same data
- **Slow navigation:** Fresh API call on every page visit
- **Poor UX:** Loading spinner on every navigation
- **High network usage:** Repeated requests for same data

### After SWR
- **Zero duplicates:** Automatic request deduplication
- **Instant navigation:** Cached data shown immediately
- **Better UX:** Previous data shown while revalidating
- **Optimized network:** Minimal API calls

## Cache Invalidation

### Automatic Invalidation
SWR automatically revalidates data based on the `dedupingInterval` setting.

### Manual Invalidation
```typescript
import { mutate } from 'swr';

// Invalidate specific key
mutate(['recipe', 'avokado-puresi']);

// Invalidate all recipes
mutate(key => Array.isArray(key) && key[0] === 'recipes');

// Invalidate everything
mutate(() => true);
```

## Best Practices

1. **Use appropriate cache times:**
   - Static content (categories): 1 hour+
   - Semi-static (recipes): 5 minutes
   - Dynamic (discussions): 30-60 seconds
   - Real-time (search): 10-30 seconds

2. **Prefetch on hover** for better perceived performance

3. **Use `keepPreviousData: true`** for lists to prevent loading flicker

4. **Handle both loading and error states** appropriately

5. **Use optimistic updates** for better UX on mutations

6. **Invalidate cache** after mutations to keep data fresh

## Migration Guide

To migrate existing components:

1. Import the appropriate hook
2. Replace useState/useEffect with the hook
3. Update loading/error handling
4. Remove manual API calls
5. Test the component

## Monitoring

In development, SWR errors are logged to the console. Monitor the Network tab to verify:
- Request deduplication is working
- Cache hits vs misses
- Revalidation behavior

## Further Reading

- [SWR Documentation](https://swr.vercel.app/)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
