import React, {useEffect, useState} from 'react';

function Upload() {
  return (
    <div className="upload">
      <form action="/api/upload" method="POST" encType="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;
