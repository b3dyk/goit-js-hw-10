import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

// Add imports above this line
import { galleryItems } from './gallery-items';
// Change code below this line

const galleryRef = document.querySelector('.gallery');

galleryRef.append(...createGalleryItems(galleryItems));

function createGalleryItems(items) {
  return items.reduce((arr, { description, original, preview }) => {
    const a = document.createElement('a');
    const img = document.createElement('img');

    a.classList.add('gallery__item');
    a.href = original;
    img.classList.add('gallery__image');
    img.src = preview;
    img.alt = description;

    a.append(img);

    arr = [...arr, a];
    return arr;
  }, []);
}

new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
