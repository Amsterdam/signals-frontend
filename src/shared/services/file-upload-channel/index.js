import { buffers, eventChannel, END } from 'redux-saga';

export default (endpoint, file, id) =>
  eventChannel(emitter => {
    const formData = new window.FormData();
    formData.append('signal_id', id);
    formData.append('image', file);

    const xhr = new window.XMLHttpRequest();

    /* istanbul ignore next */
    const onProgress = e => {
      if (e.lengthComputable) {
        const progress = e.loaded / e.total;
        emitter({ progress });
      }
    };

    /* istanbul ignore next */
    const onFailure = () => {
      emitter({ error: new Error('Upload failed') });
      emitter(END);
    };

    xhr.upload.addEventListener('progress', onProgress);
    xhr.upload.addEventListener('error', onFailure);
    xhr.upload.addEventListener('abort', onFailure);

    /* istanbul ignore next */
    xhr.onload = () => {
      // upload success
      if (xhr.readyState === 4 && xhr.status === 202) {
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
