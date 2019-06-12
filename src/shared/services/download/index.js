import 'whatwg-fetch';

export default function* download(url, filename, authorizationToken) {
  const headers = {};

  if (authorizationToken) {
    headers.Authorization = `Bearer ${authorizationToken}`;
  }

  return yield fetch(url, {
    method: 'GET',
    headers,
    responseType: 'blob'
  }).then((response) => response.blob())
    .then((blob) => {
      const urlTag = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = urlTag;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    });
}
