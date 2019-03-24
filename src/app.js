/* eslint-disable no-undef */
import sampleData from './sampleData';

// input: author | title | materials | size | year | layout | categories | order
// output: layout, categories, author, title, caption, image, thumb, order

// Create inputPad
const app = document.querySelector('#app');
const ta = document.createElement('textarea');

ta.id = sampleData.id;
ta.value = sampleData.data;

class DataGenerator {
  constructor(data) {
    this.data = data;
    this.idx = 1;
    this.folderOrFilename = '';
    this.captionIngredients = {};
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
    const paddedIndex = this.getPaddedIndex();
    const subfolder = `${this.folderOrFilename}s`;
    return `/assets/images/${subfolder}/${this.folderOrFilename}${paddedIndex}.jpg`;
  }

  getThumbPath() {
    const paddedIndex = this.getPaddedIndex();
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

// Reset values when button is clicked.
const resetValues = (arr) => {
  arr.forEach((i) => {
    const t = document.querySelector(i);
    t.parentNode.removeChild(t);
  });
};

// Function to download data to a file
// https://stackoverflow.com/a/30832210/9908741
const download = (data, filename, type) => {
  const file = new Blob([data], { type });
  if (window.navigator.msSaveOrOpenBlob) { // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else { // Others
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
};

const inputBtn = document.createElement('button');
inputBtn.innerText = 'Convert';

const inputPad = document.createElement('div');
inputPad.id = 'pad-input';
inputPad.appendChild(ta);
inputPad.appendChild(inputBtn);
app.appendChild(inputPad);

inputBtn.addEventListener('click', () => {
  const resetCheckWithResultPad = document.querySelector('#pad-result');
  if (resetCheckWithResultPad) {
    resetValues(['#pad-result', '#down']);
  }

  const data = document.querySelector('#data');

  const dg = new DataGenerator(data);
  const markdownDatas = dg.getMarkdownDataObjects();

  const artworkNodes = markdownDatas.map((c) => {

    const printOrder = ['layout', 'categories', 'author', 'title', 'caption', 'image', 'thumb', 'order'];

    const liTexts = printOrder.map(i => `${i}: ${c[i]} \n`);

    const lis = liTexts.map((k) => {
      const li = document.createElement('li');
      li.textContent = k;
      return li;
    });

    const ul = document.createElement('ul');
    ul.className = 'artwork-datas';
    lis.forEach((l) => {
      ul.appendChild(l);
    });

    return ul;
  });

  const resultPad = document.createElement('div');
  resultPad.id = 'pad-result';

  artworkNodes.forEach((i) => {
    resultPad.appendChild(i);
  });

  app.appendChild(resultPad);

  const downBtnTarget = document.querySelector('#pad-input');
  const downBtn = document.createElement('button');
  downBtn.id = 'down';
  downBtn.innerText = 'Down';
  downBtnTarget.appendChild(downBtn);

  let downloadInterval;
  downBtn.getText = () => {
    if (markdownDatas.length > 0) {
      const t = markdownDatas.shift();
      const printOrder = ['layout', 'categories', 'author', 'title', 'caption', 'image', 'thumb', 'order'];

      let str = '---\n';
      printOrder.forEach((i) => {
        str += `${i}: ${t[i]} \n`;
      });
      str += '---\n';

      const dt = new Date();
      let month = dt.getMonth() + 1;
      let day = dt.getDate();
      month = month > 10 ? month : `0${month}`;
      day = day > 10 ? day : `0${day}`;
      const year = dt.getFullYear();

      const title = t.title.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s/g, '-');

      download(str, `${year}-${month}-${day}-${title}.md`, 'text');
    } else {
      clearInterval(downloadInterval);
      alert('모든 파일을 생성했습니다.');
    }
  };
  downBtn.addEventListener('click', () => {
    downloadInterval = setInterval(() => {
      downBtn.getText();
    }, 500);
  });
});
