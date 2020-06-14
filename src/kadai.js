// 課題表示
const query = location.search;
const report = `report.cgi${query}`;
const xhr = new XMLHttpRequest();
xhr.open('GET', report, true);
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
    const kadai = document.createElement('div');
    kadai.innerHTML = xhr.responseText.match(/<table border=1 cellpadding=10 cellspacing=0 bgcolor=#ffeecc width=500>(.*?)<\/table>/s)[0];
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
const autocomp = function () {
  document.querySelector('input[name="title"]').value = document.body.innerHTML.match(/「<a href="report\.cgi.*?">(.*?)<\/a>」<\/b><br>/s)[1];
};
window.setTimeout(autocomp, 10); // 早すぎるとだめっぽい？
// 提出時にコピーは後回し
// 文字数カウント
if (document.querySelector('textarea[name="report_text"]')) {
  const div = document.createElement('div');
  div.id = 'textCounter';
  document.querySelector('textarea[name="report_text"]').parentNode.insertBefore(div, document.querySelector('textarea[name="report_text"]').nextSibling);

  document.addEventListener('keyup', () => {
    document.querySelector('#textCounter').innerHTML = `${document.querySelector('textarea[name="report_text"]').value.length} 文字`;
  });
}
