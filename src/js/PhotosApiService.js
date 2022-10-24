const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
const KEY_API = '30718682-af518003791b64ef378c3a060';

export default class PhotosApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalPage = 0;
    this.perPage = 40;
    this.imageType = 'photo';
    this.orientation = 'horizontal';
    this.safeSearch = 'true';
    this.totalHits = 1;
  }

  async fetchPhotos() {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY_API}&q=${this.searchQuery}&image_type=${this.imageType}&orientation=${this.orientation}&safesearch=${this.safeSearch}&page=${this.page}&per_page=${this.perPage}`
    );
    return response;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetTotalHits() {
    this.totalHits = 1;
  }

  isLoadMore() {
    return this.page < Math.ceil(this.totalHits / this.perPage);
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
