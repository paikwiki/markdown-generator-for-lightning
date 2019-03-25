import getPaddedNumber from './GetPaddedNumber';

// Todo: 여기서 한번 불러줘야만 class 내부에서 쓸 수 있다.
// 알수 없는 현상!
getPaddedNumber(0, '0');

class DataGenerator {
  constructor(data) {
    this.data = data;
    this.idx = 1;
    this.folderOrFilename = '';
    this.captionIngredients = {};
    this.getPaddedNumber = getPaddedNumber;
  }

  getPaddedIndex() {
    let leadingZeros = '';
    if (this.idx < 100) {
      leadingZeros += '0';
    }
    if (this.idx < 10) {
      leadingZeros += '0';
    }
    return leadingZeros + this.idx.toString();
  }

  getCaption() {
    const {
      title, materials, size, year,
    } = this.captionIngredients;
    return [title, materials, size, year].join('_');
  }

  getImagePath() {
    const paddedIndex = this.getPaddedNumber(this.idx, '000');
    const subfolder = `${this.folderOrFilename}s`;
    return `/assets/images/${subfolder}/${this.folderOrFilename}${paddedIndex}.jpg`;
  }

  getThumbPath() {
    const paddedIndex = this.getPaddedNumber(this.idx, '000');
    const subfolder = `${this.folderOrFilename}s`;
    return `/assets/images/${subfolder}/thumbs/${this.folderOrFilename}${paddedIndex}.jpg`;
  }

  getMarkdownDataObjects() {
    const rows = this.data.value.split('\n');
    const markdownDataObjectArray = [];
    rows.forEach((r) => {
      if (r.length > 0) {
        const splitRows = r.split('|').map(i => i.trim());
        const [
          author,
          title,
          materials,
          size,
          year,
          layout,
          categories,
          order,
        ] = splitRows;
        this.folderOrFilename = categories;
        this.captionIngredients = {
          title, materials, size, year,
        };
        const markdownData = {
          idx: this.idx,
          layout,
          categories,
          author,
          title,
          order,
          caption: this.getCaption(),
          image: this.getImagePath(),
          thumb: this.getThumbPath(),
        };

        markdownDataObjectArray.push(markdownData);
        this.idx += 1;
      }
    });
    return markdownDataObjectArray;
  }
}

export default DataGenerator;
