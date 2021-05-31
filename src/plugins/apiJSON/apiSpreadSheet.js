export default {
  dowloadJSONFile: (data, JSONFormat = false) => {
    const file = new Blob(
      [(JSONFormat) ? data : JSON.stringify(data)],
      { type: 'application/json' },
    );
    // console.log(file);
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(file));
    link.setAttribute('style', 'display: none');
    link.setAttribute('download', 'data.json');
    link.textContent = 'DOWNLOAD DATA';
    document.querySelector('body').prepend(link);

    URL.revokeObjectURL(file);
    link.click();
    link.remove();
  },
  uploadJSONFile: (file) => {
    const fileJSONRead = new FileReader();
    return new Promise((resolve, reject) => {
      fileJSONRead.onload = () => resolve(fileJSONRead.result);
      fileJSONRead.onerror = (err) => reject(err);
      fileJSONRead.readAsText(file);
    });
  },
};
