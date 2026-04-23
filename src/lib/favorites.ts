/**
 * Favorites Manager (Bookmarked Calculators)
 *
 * Stores up to 5 favorite calculators in localStorage.
 * Users can bookmark/unbookmark calculators from header star button.
 * Favorites appear as a widget on the homepage.
 *
 * Key: ct.favorites.v1
 * Max entries: 5
 */

export interface FavoriteCalculator {
  id: string;
  title: string;
  href: string;
  emoji?: string;
  addedAt: number;
}

const STORAGE_KEY = 'ct.favorites.v1';
const MAX_FAVORITES = 5;

/**
 * Check if localStorage is available (handles private browsing mode)
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__ct_storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all favorite calculators
 */
export function getFavorites(): FavoriteCalculator[] {
  if (!isLocalStorageAvailable()) return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Check if a calculator is favorited
 */
export function isFavorited(href: string): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    const favorites = getFavorites();
    return favorites.some((fav) => fav.href === href);
  } catch {
    return false;
  }
}

/**
 * Add a calculator to favorites
 * Returns the favorite entry if successful, null otherwise
 */
export function addFavorite(
  title: string,
  href: string,
  emoji?: string
): FavoriteCalculator | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const favorites = getFavorites();

    // Check if already favorited
    if (favorites.some((fav) => fav.href === href)) {
      return null; // Already favorited
    }

    const id = `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const entry: FavoriteCalculator = {
      id,
      title,
      href,
      emoji,
      addedAt: Date.now(),
    };

    // Add to front (newest first)
    favorites.unshift(entry);

    // Keep only MAX_FAVORITES (remove oldest)
    if (favorites.length > MAX_FAVORITES) {
      favorites.length = MAX_FAVORITES;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    return entry;
  } catch {
    return null;
  }
}

/**
 * Remove a calculator from favorites
 */
export function removeFavorite(href: string): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    const favorites = getFavorites();
    const filtered = favorites.filter((fav) => fav.href !== href);

    if (filtered.length === favorites.length) {
      return false; // Not found
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/**
 * Toggle favorite status
 * Returns true if now favorited, false if removed
 */
export function toggleFavorite(
  title: string,
  href: string,
  emoji?: string
): boolean {
  if (!isFavorited(href)) {
    addFavorite(title, href, emoji);
    return true; // Now favorited
  } else {
    removeFavorite(href);
    return false; // Now removed
  }
}

/**
 * Clear all favorites
 */
export function clearFavorites(): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
