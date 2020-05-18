import React, {useEffect, useState} from 'react';
import './Upload.css';

function Upload() {
  return (
    <div className="upload">
      <form action="/api/upload" method="POST" encType="multipart/form-data">
        <label>
          Title:
          <input type="text" name="title" />
        </label>
        <label>
          Description:
          <textarea name="description"></textarea>
        </label>
        <label>
          Image:
          <input type="file" name="file" />
        </label>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;
