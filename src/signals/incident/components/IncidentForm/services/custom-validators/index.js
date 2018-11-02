export function validateFileType(control, file, meta) {
  if (meta && meta.allowedFileTypes && Array.isArray(meta.allowedFileTypes)) {
    if (meta.allowedFileTypes.indexOf(file.type) === -1) {
      return { custom: 'Dit bestand heeft niet het juiste type.' };
    }
  }
  return null;
}

export function validateMaxFilesize(control, file, meta) {
  if (meta && meta.maxFileSize) {
    if (file.size > meta.maxFileSize) {
      return { custom: 'Dit bestand is te groot.' };
    }
  }
  return null;
}
