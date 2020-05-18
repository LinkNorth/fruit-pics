import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ImageModal from './ImageModal';

export default function ImageContainer({imageUrl, noImagesText}) {
  const [loading, setLoading] = useState(true);
  const [fetchedAll, setFetchedAll] = useState(false);
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [modalImageId, setModalImageId] = useState(null);

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
    setModalImageId(null);
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

  function showModal(imageId) {
    setModalImageId(imageId);
  }

  function closeModal() {
    setModalImageId(null);
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

  let modal = null;
  if (modalImageId) {
    modal = <ImageModal imageId={modalImageId} onCloseModal={closeModal} />;
  }

  return <>
    {modal}
    <div className="image-container">
    {text}
    {images.map(imageId => {
      return <img key={imageId} onClick={() => showModal(imageId)} src={`/api/images/${imageId}/raw`} />
    })}
    </div>
  </>
}
