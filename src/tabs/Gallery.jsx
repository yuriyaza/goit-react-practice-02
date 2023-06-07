import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';

export class Gallery extends Component {
  state = {
    query: '',
    page: 1,
    images: [],
    isLoading: false,
    isShowButton: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      this.getImages(query, page);
    }
  }

  getImages = async (query, page) => {
    this.setState({ isLoading: true });

    try {
      const {
        total_results,
        page: currentPage,
        per_page,
        photos,
      } = await ImageService.getImages(query, page);
      this.setState(prevState => ({
        images: [...prevState.images, ...photos],
        isShowButton: currentPage < Math.ceil(total_results / per_page),
      }));
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSubmit = query => {
    if (query !== this.state.query) {
      this.setState({ images: [], page: 1 });
    }
    this.setState({ query });
    // console.log(query);
  };

  handleClickButton = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    const { images, isLoading, isShowButton } = this.state;
    const isShowImages = images.length > 0;
    return (
      <>
        <SearchForm onSubmit={this.handleSubmit} />
        {isShowImages && (
          <Grid>
            {images.map(({ id, src: { small }, alt }) => {
              return (
                <GridItem key={id}>
                  <CardItem>
                    <img src={small} alt={alt} />
                  </CardItem>
                </GridItem>
              );
            })}
          </Grid>
        )}
        {isLoading && <Text textAlign="center">Loading...</Text>}
        {isShowButton && (
          <Button onClick={this.handleClickButton}>Load more</Button>
        )}
      </>
    );
  }
}
