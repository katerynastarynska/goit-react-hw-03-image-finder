import { Component } from 'react';

import css from '../ImageGalleryItem/ImageGalleryItem.module.css';
import Modal from 'components/Modal/Modal';

class ImageGalleryItem extends Component {
  state = {
    showModal: false,
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };
  render() {
    const { image } = this.props;
    const { showModal } = this.state;
    return (
      <>
        <img
          className={css.imageGalleryItemImage}
          src={image.webformatURL}
          alt={image.tags}
          onClick={this.toggleModal}
          image={image}
        />
        {showModal && (
          <Modal onClose={this.toggleModal}>
            <img src={image.largeImageURL} alt={image.tags} />
          </Modal>
        )}
      </>
    );
  }
}

export default ImageGalleryItem;
