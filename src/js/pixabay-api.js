import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

const API_KEY = '53408779-ee8ac1d107b84f4a01a68d938';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query.trim(),
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: PER_PAGE,
    page: page,
  };

  try {
    const response = await axios.get(BASE_URL, { params });

    return response.data;
  } catch (error) {
    throw error;
  }
}
