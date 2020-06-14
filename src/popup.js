// sfsidをChrome strageから取得する
const getSFSId = () => new Promise((resolve, reject) => {
  chrome.storage.local.get(['sfsid'], (result) => {
    if (result.sfsid) {
      resolve(result.sfsid);
    } else {
      const lessons = document.querySelector('#lessons');

      lessons.innerHTML = '⚠ SFC-SFSにログインしてください';
      window.open('https://vu.sfc.keio.ac.jp/sfc-sfs/', '_blank');
    }
  });
});

// 受講中のクラスを取得する
const loadLessons = (sfsid) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  const url = `https://vu.sfc.keio.ac.jp/sfc-sfs/sfs_class/student/view_list.cgi?id=${sfsid}`;

  xhr.open('GET', url, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const matches = xhr.responseText.matchAll(/<a href="(.*?)" target="_blank">(.*?)<\/a>/sg);
      resolve(matches);
    }
  };
  xhr.send();
});

// 未提出の課題を取得する
const loadTasks = (url, name, progress) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      progress.value += 1;

      const matches = xhr.responseText.matchAll(
        /課題No\.(.*?) \n<a href=\.\.\/report\/report\.cgi\?(.*?) target=report>「(.*?)」<\/a>\n<font color="(.*?)">(?:.*?)deadline<\/span>: (.*?), 提出者(.*?)名/sg,
      );
      let text = '';

      for (const match of matches) {
        if (match[4] === 'red') {
          text += `<p><img src=https://vu.sfc.keio.ac.jp/sfc-sfs/img2/square_red.gif> No.${match[1]}
            <a href="https://vu.sfc.keio.ac.jp/sfc-sfs/sfs_class/report/report.cgi?${match[2]}" target="_blank">「${match[3]}」</a><br>　(〆切: ${match[5]}, 提出者${match[6]}名 ) <p>`;
        }
      }

      if (text !== '') {
        text = `<p class="lesson">${name}</p>${text}`;
      }

      resolve(text);
    }
  };
  xhr.send();
});

(async () => {
  const sfsid = await getSFSId();
  const matches = [...await loadLessons(sfsid)];
  const promises = [];
  const progress = document.querySelector('#progress');
  let index = 0;

  for (; index < matches.length; index += 1) {
    const [_, url, name] = matches[index];
    promises[index] = loadTasks(url, name, progress);
  }

  progress.setAttribute('max', index + 1);
  progress.value = 2;

  Promise.all(promises).then((response) => {
    const lessons = document.querySelector('#lessons');
    let text = '';

    for (let index = 0; index < response.length; index += 1) {
      const value = response[index];
      text += value;
    }

    lessons.innerHTML = text;
  });
})();
