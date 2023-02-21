import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import searchImages from './API';

const { searchForm, gallery, loadMore, colectionInfo } = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
    colectionInfo: document.querySelector('.end-colection'),
  };

let lightbox = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });
  
  let currentPage = 1;
  let currentHits = 0;
  let searchQuery = '';
  
  searchForm.addEventListener('submit', onSubmitForm);
  loadMore.addEventListener('click', onClickLoadMore);
 
  async function onSubmitForm(event) {
    event.preventDefault();
    searchQuery = event.currentTarget.searchQuery.value.trim();
    currentPage = 1;
  
    if (!searchQuery) {
      refresh();
      return;
    }
    const response = await searchImages(searchQuery, currentPage);
    currentHits = response.hits.length;
     if (response.totalHits > 40) {  
      loadMore.classList.remove('is-hidden');
      colectionInfo.classList.add('is-hidden');
     } else {
      loadMore.classList.add('is-hidden');
      colectionInfo.classList.remove('is-hidden');
    }
 
    try {
      if (response.totalHits > 0) {
        Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
        gallery.innerHTML = '';
        renderImageCard(response.hits);
        lightbox.refresh();
          
        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();
  
        window.scrollBy({
          top: cardHeight * -100,
          behavior: 'smooth',
        });
      }
  
      if (response.totalHits === 0) {
        refresh ();
        loadMore.classList.add('is-hidden');
       
      }
    } catch (error) {
      console.log(error);
    }
  } 
  
    async function onClickLoadMore() {
    currentPage += 1;
    const response = await searchImages(searchQuery, currentPage);
    renderImageCard(response.hits);
    lightbox.refresh();
    currentHits += response.hits.length;  

    if (currentHits >= response.totalHits) {
      loadMore.classList.add('is-hidden');
      colectionInfo.classList.remove('is-hidden');
    }
  }

  function renderImageCard(arr) {
    const markup = arr
      .map(item => {
        return `<div class="photo-card">
        <div class="photo">
          <a href="${item.largeImageURL}">
            <img
              class="gallery__image"
              src="${item.webformatURL}"
              alt="${item.tags}"
              loading="lazy"
            />
          </a>
        </div>
        <div class="info">
          <p class="info-item"><b>Likes</b> ${item.likes}</p>
          <p class="info-item"><b>Views</b> ${item.views}</p>
          <p class="info-item"><b>Comments</b> ${item.comments}</p>
          <p class="info-item"><b>Downloads</b> ${item.downloads}</p>
        </div>
      </div>`;
    })
    .join('')
    gallery.insertAdjacentHTML('beforeend', markup);
  }

  function refresh () {
    loadMore.classList.add('is-hidden');
    colectionInfo.classList.add('is-hidden');
    gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }