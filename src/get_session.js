if (document.referrer === 'https://vu.sfc.keio.ac.jp/sfc-sfs/login.cgi') {
  const sfsid = window.location.search.match(/[0-9a-f]{48}/);

  chrome.storage.local.set({ sfsid });
  window.location.href = `https://vu.sfc.keio.ac.jp/sfc-sfs/portal_s/s01.cgi?id=${sfsid}&type=s&mode=1&lang=ja`;
}
