export default {
  dowloadJSONFile: (data) => {
    const file = new Blob(
      [JSON.stringify(data)],
      { type: 'application/json' },
    );
    console.log(file);
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
};
