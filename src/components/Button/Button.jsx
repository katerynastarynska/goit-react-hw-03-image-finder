import css from './Button.module.css';

export default function Button({ onClick }) {
  return (
    <button className={css.loadMoreBtn} onClick={onClick}>
      Load more
    </button>
  );
}
