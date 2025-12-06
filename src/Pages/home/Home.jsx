import React from 'react';
import Map from './map/Map';
import LatestBooks from './latestBooks/LatestBooks';
import BookLibrary from './statics/BookLibrary';
import Stats from './statics/Stats';
import NewsLetter from './statics/NewsLetter';
import Slider from './slider/Slider';
import Container from '../../shared/container';

const Home = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">Welcome to the BookStore</h1>
      <p className="text-center mt-4 text-lg">Discover and manage your favorite books all in one place.</p>
      <Slider></Slider>
      <Container>
        <LatestBooks></LatestBooks>
        <Map></Map>
        <BookLibrary></BookLibrary>
        <NewsLetter></NewsLetter>
        <Stats></Stats>
      </Container>
    </div>
  );
};

export default Home;