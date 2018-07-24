import {
  buffers,
  eventChannel,
  END
} from 'redux-saga';

function fileUploadChannel(endpoint, file, id) {
  return eventChannel((emitter) => {
    const formData = new window.FormData();
    formData.append('signal_id', id);
    formData.append('image', file);

    const xhr = new window.XMLHttpRequest();

    const onProgress = (e) => {
      if (e.lengthComputable) {
        const progress = e.loaded / e.total;
        emitter({ progress });
      }
    };

    const onFailure = () => {
      emitter({ error: new Error('Upload failed') });
      emitter(END);
    };

    xhr.upload.addEventListener('progress', onProgress);
    xhr.upload.addEventListener('error', onFailure);
    xhr.upload.addEventListener('abort', onFailure);

    xhr.onload = () => {
      // upload success
      if (xhr.readyState === 4 && xhr.status === 202 && xhr.statusText === 'Accepted') {
        emitter({ success: true });
        emitter(END);
      } else {
        onFailure();
      }
    };

    xhr.open('POST', endpoint, true);
    xhr.send(formData);

    return () => {
      xhr.upload.removeEventListener('progress', onProgress);
      xhr.upload.removeEventListener('error', onFailure);
      xhr.upload.removeEventListener('abort', onFailure);
      xhr.onload = null;
      xhr.abort();
    };
  }, buffers.sliding(2));
}

export default fileUploadChannel;
