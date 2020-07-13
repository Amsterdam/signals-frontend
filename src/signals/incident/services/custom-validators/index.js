import fileSize from '../file-size';

export const validateFileType = (file, meta) => {
  if (meta && meta.allowedFileTypes && Array.isArray(meta.allowedFileTypes)) {
    if (meta.allowedFileTypes.indexOf(file.type) === -1) {
      const allowedFileTypes = meta.allowedFileTypes.map(type => type.split('/')[1]);
      return {
        custom: `Dit bestand heeft niet het juiste type (${file.type.split('/')[1]}). Toegestaan zijn: ${allowedFileTypes.join(', ')}.`,
      };
    }
  }

  return null;
};

export const validateMaxFilesize = (file, meta) => {
  if (meta && meta.maxFileSize) {
    if (file.size >= meta.maxFileSize) {
      return {
        custom: `Dit bestand is te groot (${fileSize(file.size)}). Maximale bestandgrootte is ${fileSize(meta.maxFileSize)}.`,
      };
    }
  }

  return null;
};

export const validateMinFilesize = (file, meta) => {
  if (meta && meta.minFileSize) {
    if (file.size < meta.minFileSize) {
      return {
        custom: `Dit bestand is te klein (${fileSize(file.size)}). Minimale bestandgrootte is ${fileSize(meta.minFileSize)}.`,
      };
    }
  }

  return null;
};

export const validatePhoneNumber = control => {
  if (!control || control.value === '' || control.value === undefined || RegExp('^[ ()0-9+-]*$').test(control.value)) {
    return null;
  }

  return { custom: 'Ongeldig telefoonnummer, alleen cijfers, spaties, haakjes, + en - zijn toegestaan.' };
};
