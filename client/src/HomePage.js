import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ImageContainer from './ImageContainer';


export default function HomePage() {
  return <div>
    <h2>Home</h2>
    <ImageContainer noImagesText="You have no friends" imageUrl={`/api/users/home`} />
  </div>;
}
