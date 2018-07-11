import {
  buffers,
  eventChannel,
  END
} from 'redux-saga';

function createFileUploadChannel(endpoint, file, id) {
  return eventChannel((emitter) => {
    const formData = new window.FormData();
    formData.append('signal_id', id);
    formData.append('image', file);

    const xhr = new window.XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      console.log('progress', e);
      const progress = e.loaded / e.total;
      emitter({ progress });
    };

    xhr.onload = () => {
      // upload success
      if (xhr.readyState === 4 && xhr.status === 202 && xhr.statusText === 'Accepted') {
        console.log('success!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        emitter({ success: true });
        emitter(END);
      } else {
        emitter({ err: new Error('Upload failed') });
        emitter(END);
      }
    };

    xhr.open('POST', endpoint, true);
    xhr.send(formData);

    return () => {
      // xhr.upload.removeEventListener('progress', onProgress);
      // xhr.upload.removeEventListener('error', onFailure);
      // xhr.upload.removeEventListener('abort', onFailure);
      // xhr.onreadystatechange = null;
      // xhr.abort();
    };
  }, buffers.sliding(2));
}

export default createFileUploadChannel;
