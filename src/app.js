/* eslint-disable no-undef */
import downloader from './Downloader';
import sampleData from './sampleData';
import DataGenerator from './DataGenerator';

// input: author | title | materials | size | year | layout | categories | order
// output: layout, categories, author, title, caption, image, thumb, order

// Create inputPad
const ta = document.createElement('textarea');
ta.id = sampleData.id;
ta.value = sampleData.data;

const inputBtn = document.createElement('button');
inputBtn.innerText = 'Convert';

const inputPad = document.createElement('div');
inputPad.id = 'pad-input';
inputPad.appendChild(ta);
inputPad.appendChild(inputBtn);

const app = document.querySelector('#app');
app.appendChild(inputPad);

inputBtn.addEventListener('click', () => {
  const resetCheckWithResultPad = document.querySelector('#pad-result');
  if (resetCheckWithResultPad) {
    ['#pad-result', '#down'].forEach((i) => {
      const t = document.querySelector(i);
      t.remove();
    });
  }

  const data = document.querySelector('#data');
  const dg = new DataGenerator(data);
  const markdownDatas = dg.getMarkdownDataObjects();
  const printOrder = [
    'layout', 'categories', 'author', 'title',
    'caption', 'image', 'thumb', 'order',
  ];
  const artworkNodes = markdownDatas.map((c) => {
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

      downloader(str, `${year}-${month}-${day}-${title}.md`, 'text');
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
