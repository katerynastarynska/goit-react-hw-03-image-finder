import { Component } from 'react';
import { ToastContainer } from 'react-toastify';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';

class App extends Component {
  state = {
        searchQuery: '',
     };


  handleFormImageSearch = searchQuery => {
    console.log(searchQuery);
    this.setState({ searchQuery });
  };


  render() {
    const {searchQuery } = this.state;
    return (
      <div>
        <Searchbar onSubmit={this.handleFormImageSearch} 
        searchQuery={this.state.searchQuery}
        />
        <ToastContainer autoClose={3000} />
        <ImageGallery
          searchQuery={searchQuery}
        />
      </div>
    );
  }
}

export default App;
