// 課題表示
const query = window.location.search;
const report = `report.cgi${query}`;
const xhr = new XMLHttpRequest();

xhr.open('GET', report, true);
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const kadai = document.createElement('div');
    const kadaiRegExp = /<table border=1 cellpadding=10 cellspacing=0 bgcolor=#ffeecc width=500>(.*?)<\/table>/s;

    [kadai.innerHTML] = xhr.responseText.match(kadaiRegExp);

    if (!kadai.innerHTML) {
      alert('課題を取得できません。セッションが切れているようです。');
    }

    kadai.style.padding = '16px';
    kadai.style.width = '575px';

    const form = document.querySelector('form[name="form_text"]')
    || document.querySelector('form[name="form_file"]')
    || document.querySelector('form[name="form_url"]');

    form.insertBefore(kadai, form.firstChild);
  }
};
xhr.send();

// リセットボタン抹消
document.querySelector('input[type="reset"]').style.display = 'none';

const submit = document.querySelector('input[type="submit"]');
submit.style.width = '200px';
submit.style.height = '50px';

// タイトルに自動入力
const autocomp = () => {
  const title = document.body.innerHTML.match(/「<a href="report\.cgi.*?">(.*?)<\/a>」<\/b><br>/s)[1];
  document.querySelector('input[name="title"]').value = title;
};

window.setTimeout(autocomp, 10); // 早すぎるとだめっぽい？

// 提出時にコピーは後回し
// 文字数カウント
const reportTextElement = document.querySelector('textarea[name="report_text"]');
if (reportTextElement) {
  const textCounterElement = document.createElement('div');
  textCounterElement.id = 'textCounter';
  reportTextElement.parentNode.insertBefore(textCounterElement, reportTextElement.nextSibling);

  textCounterElement.innerHTML = '0 文字';

  document.addEventListener('keyup', () => {
    const wordCount = reportTextElement.value.length;
    textCounterElement.innerHTML = `${wordCount} 文字`;
  });
}
