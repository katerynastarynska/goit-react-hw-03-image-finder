import { Component } from 'react';
import { ToastContainer } from 'react-toastify';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import css from '../components/App.module.css'

class App extends Component {
  state = {
    searchQuery: '',
  };

  handleFormImageSearch = searchQuery => {
    this.setState({ searchQuery });
  };

  render() {
    const { searchQuery } = this.state;
    return (
      <div className={css.app}>
        <Searchbar
          onSubmit={this.handleFormImageSearch}
          searchQuery={this.state.searchQuery}
        />
        <ToastContainer autoClose={3000} />
        <ImageGallery searchQuery={searchQuery} />
      </div>
    );
  }
}

export default App;
