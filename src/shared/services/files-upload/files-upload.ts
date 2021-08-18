/** Upload files to url using separate fetch requests */
export const filesUpload = ({ url, files }: { url: string; files: FileList }) =>
  Promise.all(
    Array.from(files).map((file) => {
      const formData = new FormData()
      formData.append('file', file)

      return fetch(url, { body: formData, method: 'POST' })
    })
  )
