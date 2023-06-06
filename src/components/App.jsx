import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Searchbar from './Searchbar/Searchbar';
import Loader from './Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import css from '../components/App.module.css';
import { getImages } from 'services/api';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    status: STATUS.IDLE,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    limit: 12,
  };

  handleFormImageSearch = searchQuery => {
    this.setState({
      searchQuery,
      currentPage: 1,
      images: [],
    });
  };

  componentDidUpdate(_, prevState) {
    const { currentPage, status, error, searchQuery } = this.state;

    if (prevState.searchQuery !== searchQuery) {
      this.setState({ currentPage: 1, images: [] });
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
    const { limit, currentPage, images, searchQuery } = this.state;

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
    const { images, status, currentPage, totalPages, searchQuery } = this.state;
    const showLoadMoreBtn = images.length !== 0 && currentPage < totalPages;

    return (
      <div className={css.app}>
        <Searchbar
          onSubmit={this.handleFormImageSearch}
          searchQuery={searchQuery}
        />
        <ToastContainer autoClose={3000} />

        {status === STATUS.PENDING && <Loader />}

        {status === STATUS.RESOLVED && <ImageGallery images={images} />}

        {showLoadMoreBtn && (
          <Button
            onClick={this.handleLoadMore}
            disabled={status === STATUS.PENDING ? true : false}
          />
        )}
      </div>
    );
  }
}
export default App;
