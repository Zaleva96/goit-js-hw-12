import SimpleLightbox from 'simplelightbox';

const refs = {
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('#loader'),
  loadMoreBtn: document.querySelector('#load-more'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function _show(el) {
  if (el) el.classList.remove('is-hidden');
}
function _hide(el) {
  if (el) el.classList.add('is-hidden');
}

export function createGallery(images = []) {
  if (!refs.gallery) return;

  const markup = images
    .map(hit => {
      return `
      <li class="photo-card">
        <a class="gallery__link" href="${hit.largeImageURL}">
          <img class="gallery__image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b><span>${hit.likes}</span></p>
          <p class="info-item"><b>Views</b><span>${hit.views}</span></p>
          <p class="info-item"><b>Comments</b><span>${hit.comments}</span></p>
          <p class="info-item"><b>Downloads</b><span>${hit.downloads}</span></p>
        </div>
      </li>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

export function clearGallery() {
  if (!refs.gallery) return;
  refs.gallery.innerHTML = '';
}

export function showLoader() {
  _show(refs.loader);
}

export function hideLoader() {
  _hide(refs.loader);
}

export function showLoadMoreButton() {
  _show(refs.loadMoreBtn);
}

export function hideLoadMoreButton() {
  _hide(refs.loadMoreBtn);
}
