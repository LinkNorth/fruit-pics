import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function ImageContainer({imageUrl, noImagesText}) {
  const [loading, setLoading] = useState(true);
  const [fetchedAll, setFetchedAll] = useState(false);
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios({
      method: 'GET',
      url: imageUrl,
      params: {
        page: page
      }
    })
    .then(res => {
      setImages([...images, ...res.data.images]);
      if (res.data.meta.done) {
        setFetchedAll(true);
      }
      setLoading(false);
    });
  }, [imageUrl, page]);


  function onScroll(e) {
    let documentHeight = document.body.clientHeight;
    let windowHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let margin = 200;
    if (documentHeight - (windowHeight + scrollY) < margin) {
      if (loading) return;
      setLoading(true);
      setPage(page + 1);
    }
  }

  useEffect(() => {
    if (fetchedAll) return () => {};
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [loading]);

  let text = null;

  if (!images.length && !loading && noImagesText) {
    text = <p>{noImagesText}</p>;
  }

  return <div className="image-container">
    {text}
    {images.map(imageId => {
      return <img key={imageId} src={`/api/images/${imageId}`} />
    })}
  </div>
}
