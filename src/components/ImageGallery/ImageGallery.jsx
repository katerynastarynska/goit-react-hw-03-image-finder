import { Component } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import Button from 'components/Button/Button';
import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import { getImages } from '../../services/api';
import css from './ImageGallery.module.css';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class ImageGallery extends Component {
  state = {
    images: [],
    status: STATUS.IDLE,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    limit: 12,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { currentPage, status, error } = this.state;
    const { searchQuery } = this.props;

    if (prevProps.searchQuery !== searchQuery) {
      await this.setState({ currentPage: 1, images: [] });
      this.fetchImages();
    }
    if (prevState.currentPage !== currentPage) {
      this.fetchImages();
    }
    if (prevState.status !== status && status === STATUS.REJECTED && error) {
      toast.error(error);
    }
  }

  fetchImages = async () => {
    const { limit, currentPage, images } = this.state;
    const { searchQuery } = this.props;

    await this.setState({ status: STATUS.PENDING });
    try {
      const data = await getImages({ searchQuery, limit, currentPage });

      if (!data?.hits) {
        toast.error('Service not available');
        throw new Error('Service not available');
      }
      if (!data?.hits?.length) {
        toast.error('Results not found');
        this.setState({ status: STATUS.IDLE });
        return;
      }
      this.setState({
        images: [...images, ...data.hits],
        totalPages: Math.ceil(data.total / limit),
        status: STATUS.RESOLVED,
        error: null,
      });
    } catch (error) {
      this.setState({ error: 'Bad request', status: STATUS.REJECTED });
    }
  };

  handleLoadMore = () => {
    this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
  };

  render() {
    const { images, status, currentPage, totalPages } = this.state;
    const showLoadMoreBtn = images.length !== 0 && currentPage < totalPages;

    if (status === STATUS.PENDING) {
      return <Loader />;
    }

    if (status === STATUS.RESOLVED) {
      return (
        <>
          <ul className={css.imageGallery}>
            {images.map(image => {
              return (
                <li key={image.id} className={css.imageGalleryItem}>
                  <ImageGalleryItem image={image} />
                </li>
              );
            })}
          </ul>
          {showLoadMoreBtn && (
            <Button
              onClick={this.handleLoadMore}
              disabled={status === STATUS.PENDING ? true : false}
            />
          )}
        </>
      );
    }
  }
}
export default ImageGallery;

ImageGallery.propTypes = {
  searchQuery: PropTypes.string.isRequired,
};
