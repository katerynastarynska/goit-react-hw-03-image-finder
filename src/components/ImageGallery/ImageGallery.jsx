import { Component } from 'react';
import { toast } from 'react-toastify';

// import Loader from '../Loader/Loader';
// import Button from '../Button/Button';
import Loader from 'components/Loader/Loader';
import Button from 'components/Button/Button';
import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
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
    status: STATUS.IDLE,
    loading: false,
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
    const { limit,  currentPage } = this.state;
    const { searchQuery } = this.props;

    await this.setState({ status: STATUS.PENDING });
    try {
      const data = await getImages({ searchQuery, limit, currentPage });
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
        images: [...data.hits],
        totalPages: Math.ceil(data.total / limit),
        status: STATUS.RESOLVED,
        error: null,
      });
    } catch (error) {
      this.setState({ error: error.message, status: STATUS.REJECTED });
    }
  };

  handleLoadMore = () => {
    console.log('click');

    this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
    console.log(this.state);
  };

  render() {
    const { images, status, error } = this.state;

    if (status === STATUS.PENDING) {
      return <Loader />;
    }

    if (status === STATUS.RESOLVED) {
      return (
        <>
          <ul className={css.imageGallery}>
            {/* {images.map(image => {
              return <ImageGalleryItem image={image} />;
            })} */}
            {images.map(image => { 
                return ( <li key={image.id} className={css.imageGalleryItem}>
                        <ImageGalleryItem image={image}/>
                        </li> 
 )
                   
            })}
          </ul>
          <Button onClick={this.handleLoadMore} />
        </>
      );
    }
    if (status === STATUS.REJECTED) {
      return <div>{error.message}</div>;
    }
  }
}
export default ImageGallery;
