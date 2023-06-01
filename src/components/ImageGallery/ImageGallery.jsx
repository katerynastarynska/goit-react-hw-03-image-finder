import { Component } from 'react';
import { toast } from 'react-toastify';

import css from './ImageGallery.module.css';
import { getImages } from '../../services/api';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class ImageGallery extends Component {
  state = {
    images: [],
    loading: false,
    status: STATUS.IDLE,
    error: null,
    currentPage: 1,
    totalPages: 0,
    limit: 12,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { currentPage } = this.state;
    const { searchQuery } = this.props;
    console.log('prevProps.searchQuery', prevProps.searchQuery);
    console.log('this.props.searchQuery', searchQuery);
    if (prevProps.searchQuery !== searchQuery) {
      await this.setState({ currentPage: 1, images: [] });
      this.fetchImages();
    }
    if (prevState.currentPage !== currentPage) {
      this.fetchImages();
    }
  }

  fetchImages = async () => {
    const { limit, images } = this.state;
    const { searchQuery } = this.props;

    await this.setState({ status: STATUS.PENDING });
    try {
      const data = await getImages({ searchQuery, limit });
      console.log(data);

      if (!data?.hits) {
        toast.error('Service not available');
        throw new Error('Service not available');
      }
      if (!data?.hits?.length) {
        toast.error('Results not found');
        return;
      }
      this.setState({
        images: [...images, ...data.hits],
        totalPages: Math.ceil(data.total / limit),
        status: STATUS.RESOLVED,
        error: null,
      });
    } catch (error) {
      this.setState({ error: error.message, status: STATUS.REJECTED });
    }
  };

//   handleLoadMore = () => {
//     this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
//   };

  render() {
    const { images, status } = this.state;

    if (status === STATUS.PENDING) {
      return <div>Loading...</div>;
    }

    if (status === STATUS.RESOLVED) {
      return (
        <>
          <ul className={css.imageGallery}>
            {images.map(image => {
              return (
                <li key={image.id}>
                  <img src={image.webformatURL} alt="" />
                </li>
              );
            })}
          </ul>
        </>
      );
    }
  }
}

export default ImageGallery;
