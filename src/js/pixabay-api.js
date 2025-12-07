const BASE_URL = 'https://pixabay.com/api/';

const API_KEY = '53408779-ee8ac1d107b84f4a01a68d938';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  const url = new URL(BASE_URL);
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('q', query.trim());
  url.searchParams.set('image_type', 'photo');
  url.searchParams.set('orientation', 'horizontal');
  url.searchParams.set('safesearch', 'true');
  url.searchParams.set('per_page', String(PER_PAGE));
  url.searchParams.set('page', String(page));

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Pixabay API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}
