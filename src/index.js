import './css/style.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PhotosApiService from './js/PhotosApiService';
import LoadMoreBtn from './js/LoadMoreBtn';
import onError from './js/onError';
import markup from './js/templates/markup.hbs';
import onInfo from './js/onInfo';
import onSmoothScroll from './js/onSmoothScroll';

const refs = {
  form: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
};

const photosApiService = new PhotosApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

refs.form.addEventListener('submit', onSearchPhotos);
loadMoreBtn.getRefs().addEventListener('click', loadMorePhotos);

async function onSearchPhotos(e) {
  e.preventDefault();
  photosApiService.resetPage();
  clearMarkupPhotos();
  loadMoreBtn.hide();
  const {
    elements: { searchQuery },
  } = e.currentTarget;
  if (searchQuery.value === '') {
    onInfo(`Enter more inforvation.`);
    return;
  }
  photosApiService.query = searchQuery.value;

  try {
    await fetchPhotos();

    photosApiService.page > 1
      ? onInfo(`Hooray! We found ${photosApiService.totalHits} images.`)
      : null;

    if (
      photosApiService.totalHits > photosApiService.perPage &&
      photosApiService.page > 1
    ) {
      loadMoreBtn.show();
    }

    if (
      1 < photosApiService.totalHits &&
      photosApiService.totalHits <= photosApiService.perPage
    ) {
      noMorePhotosInfo(
        "We're sorry, but you've reached the end of search results."
      );
    }

    lightbox.refresh();
  } catch (error) {
    onError(error.message);
  }
}

async function fetchPhotos() {
  const searchData = await photosApiService.fetchPhotos();
  const {
    data: { hits, totalHits },
  } = searchData;

  if (hits.length === 0) {
    onError(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreBtn.hide();
    return;
  }
  photosApiService.totalHits = totalHits;
  appendMarkupPhotos(hits);
  photosApiService.incrementPage();
}

async function loadMorePhotos() {
  try {
    await fetchPhotos();
    lightbox.refresh();
    onSmoothScroll();

    if (!photosApiService.isLoadMore()) {
      loadMoreBtn.hide();
      noMorePhotosInfo(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    onError(error.message);
    loadMoreBtn.hide();
  }
}

function appendMarkupPhotos(arrObjPhotos) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup(arrObjPhotos));
}

function clearMarkupPhotos() {
  refs.galleryContainer.innerHTML = '';
}

function noMorePhotosInfo(message) {
  const markup = `<h3 class="message-container">${message}</h3>`;
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.gallery a');
