import React, {useEffect, useState} from 'react';
import axios from 'axios';

function UserPage() {
  const [images, setImages] = useState(null);

  useEffect(() => {
    axios.get('/api/images')
      .then(res => {
        setImages(res.data.images);
      });
  }, []);

  if (!images) return <p>Loading...</p>;

  return <div>
    {images.map(imageId => {
      return <img src={`/api/images/${imageId}`} />
    })};
  </div>
}

export default UserPage;
