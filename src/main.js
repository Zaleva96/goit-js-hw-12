import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

// DOM refs
const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('#search-input'),
  loadMoreBtn: document.querySelector('#load-more'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('#loader'),
};

let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 15; // має збігатися з pixabay-api.js

// Ініціалізація стану UI
hideLoadMoreButton();
hideLoader();

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  const query = refs.input.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.',
    });
    return;
  }

  // якщо новий запит — скидаємо сторінку і очищаємо галерею
  const isNewSearch = query.toLowerCase() !== currentQuery.toLowerCase();
  if (isNewSearch) {
    currentPage = 1;
    clearGallery();
  }

  currentQuery = query;

  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    const { hits = [], totalHits = 0 } = data;

    if (!hits.length) {
      hideLoader();
      iziToast.error({
        title: 'No results',
        message: `No images found for "${currentQuery}".`,
      });
      return;
    }

    // додаємо отримані зображення
    createGallery(hits);

    // якщо загальна кількість більша, ніж вже завантажено — показуємо кнопку
    const totalLoaded = currentPage * PER_PAGE;
    if (totalHits > totalLoaded) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }

    // Якщо це новий пошук, прокрутка не потрібна; якщо підвантажили наступну сторінку — зробимо прокрутку
    if (!isNewSearch && hits.length) {
      smoothScrollAfterAppend();
    }

    iziToast.success({
      title: 'Success',
      message: `Found ${totalHits} images.`,
    });
  } catch (err) {
    console.error(err);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again.',
    });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  currentPage += 1;
  showLoader();
  hideLoadMoreButton(); // запобігти повторним клікам поки йде запит

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    const { hits = [], totalHits = 0 } = data;

    if (!hits.length) {
      hideLoader();
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
      });
      hideLoadMoreButton();
      return;
    }

    createGallery(hits);

    const totalLoaded = currentPage * PER_PAGE;
    if (totalHits > totalLoaded) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }

    // Прокрутка після додавання
    smoothScrollAfterAppend();
  } catch (err) {
    console.error(err);
    iziToast.error({ title: 'Error', message: 'Failed to load more images.' });
  } finally {
    hideLoader();
  }
}

function smoothScrollAfterAppend() {
  // Отримаємо висоту першої карточки
  const firstCard = refs.gallery.querySelector('.photo-card');
  if (!firstCard) return;

  const { height } = firstCard.getBoundingClientRect();
  // Прокрутка на дві висоти карточки
  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
