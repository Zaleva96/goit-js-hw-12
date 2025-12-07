import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('#search-input'),
  loadMoreBtn: document.querySelector('#load-more'),
  gallery: document.querySelector('.gallery'),
};

let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 15;

hideLoadMoreButton();
hideLoader();

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  const query = refs.input.value.trim();
  if (!query) {
    clearGallery();
    hideLoadMoreButton();
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  const isNewSearch = query.toLowerCase() !== currentQuery.toLowerCase();

  if (isNewSearch) {
    currentPage = 1;
    clearGallery();
  } else if (currentPage > 1) {
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
      iziToast.error({
        title: 'No results',
        message: `Sorry, there are no images matching your search query: "${currentQuery}". Please try again.`,
        position: 'topRight',
      });
      return;
    }

    createGallery(hits);

    checkEndCollection(totalHits);

    iziToast.success({
      title: 'Success',
      message: `Found ${totalHits} images.`,
      position: 'topRight',
    });
  } catch (err) {
    console.error(err);
    clearGallery();
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    refs.form.reset();
  }
}

async function onLoadMore() {
  currentPage += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    const { hits = [], totalHits = 0 } = data;

    if (!hits.length) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      return;
    }

    createGallery(hits);

    smoothScrollAfterAppend();

    checkEndCollection(totalHits);
  } catch (err) {
    console.error(err);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function checkEndCollection(totalHits) {
  const totalLoaded = currentPage * PER_PAGE;

  if (totalHits > totalLoaded) {
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();

    if (totalLoaded > 0 && totalHits > 0) {
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  }
}

function smoothScrollAfterAppend() {
  const firstCard = refs.gallery.querySelector('.photo-card');
  if (!firstCard) return;

  const addedCards = refs.gallery.querySelectorAll(
    '.photo-card:nth-last-child(-n+15)'
  );
  if (addedCards.length === 0) return;

  const { height } = addedCards[0].getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
