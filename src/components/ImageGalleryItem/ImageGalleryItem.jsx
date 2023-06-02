import css from '../ImageGalleryItem/ImageGalleryItem.module.css';

export default function ImageGalleryItem({ image }) {
  return (
      <img className={css.imageGalleryItemImage} src={image.webformatURL} alt={image.tags} />
  );
}
