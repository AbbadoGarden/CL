const sourceText = document.getElementById('sourceText');
const resultText = document.getElementById('resultText');
const previewArticle = document.getElementById('previewArticle');

const normalizePunctuation = document.getElementById('normalizePunctuation');
const smartTitle = document.getElementById('smartTitle');
const smartParagraph = document.getElementById('smartParagraph');
const trimSpaces = document.getElementById('trimSpaces');

const formatBtn = document.getElementById('formatBtn');
const copyBtn = document.getElementById('copyBtn');

const punctuationMap = new Map([
  [',', '，'],
  ['.', '。'],
  ['?', '？'],
  ['!', '！'],
  [':', '：'],
  [';', '；'],
  ['(', '（'],
  [')', '）']
]);

const formatText = (raw) => {
  let text = raw.replace(/\r\n/g, '\n');

  if (trimSpaces.checked) {
    text = text
      .split('\n')
      .map((line) => line.trim().replace(/\s+/g, ' '))
      .join('\n');
  }

  if (normalizePunctuation.checked) {
    text = [...text]
      .map((char) => punctuationMap.get(char) || char)
      .join('')
      .replace(/\"([^\"]+)\"/g, '“$1”');
  }

  const lines = text.split('\n').filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { output: '', title: '', paragraphs: [] };
  }

  let title = '';
  let paragraphs = [...lines];

  if (smartTitle.checked && lines[0].length <= 30) {
    title = lines[0].trim();
    paragraphs = lines.slice(1);
  }

  if (smartParagraph.checked) {
    paragraphs = paragraphs.map((item) => item.replace(/([。！？])\s*/g, '$1\n'));
    paragraphs = paragraphs
      .flatMap((item) => item.split('\n'))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const output = [
    title ? `# ${title}` : '',
    ...paragraphs.map((paragraph) => paragraph)
  ]
    .filter(Boolean)
    .join('\n\n');

  return { output, title, paragraphs };
};

const renderPreview = ({ title, paragraphs }) => {
  previewArticle.innerHTML = '';

  if (title) {
    const heading = document.createElement('h1');
    heading.textContent = title;
    previewArticle.appendChild(heading);
  }

  paragraphs.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    previewArticle.appendChild(p);
  });
};

const onFormat = () => {
  const { output, title, paragraphs } = formatText(sourceText.value);
  resultText.value = output;
  renderPreview({ title, paragraphs });
};

formatBtn.addEventListener('click', onFormat);

copyBtn.addEventListener('click', async () => {
  if (!resultText.value.trim()) {
    return;
  }

  try {
    await navigator.clipboard.writeText(resultText.value);
    copyBtn.textContent = '已复制';
    setTimeout(() => {
      copyBtn.textContent = '复制结果';
    }, 1200);
  } catch {
    copyBtn.textContent = '复制失败';
    setTimeout(() => {
      copyBtn.textContent = '复制结果';
    }, 1200);
  }
});

sourceText.value = `内容运营提效指南
很多文章写得很好, 但粘贴到公众号后台后排版很乱. 读者会快速流失.
你可以先用工具规范标点, 再自动分段, 最后复制到编辑器中继续微调.
这样能把编辑时间从30分钟降到5分钟!`;

onFormat();
