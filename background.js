// Minimal starter domain list; expand as needed.
const DEFAULT_BLOCKED_DOMAINS = [
  "pornhub.com", "xvideos.com", "xnxx.com",
  "xhamster.com", "youporn.com", "redtube.com",
  "porn.com", "spankbang.com", "rule34.xxx", "hentaihaven.xxx",
    "nhentai.net", "hitomi.la", "fapello.com", "fapdu.com",
    "fux.com", "tnaflix.com", "tube8.com", "yuvutu.com",
    "keezmovies.com", "empflix.com", "youjizz.com", "pornmd.com",
    "eroprofile.com", "brazzers.com", "bangbros.com", "motherless.com",
    "xart.com", "metart.com", "nubilefilms.com", "teenslovehugecocks.com",
    "team-skeet.com", "digitalplayground.com", "evilangel.com", "bangyoulater.com",
    "pornfidelity.com", "mofos.com", "girlsway.com", "twistys.com",
    "4chan.org","gamcore.com", "ledzone.com", "luscious.net"
];

function urlPatternsFor(domains) {
  const patterns = [];
  for (const d of domains) {
    patterns.push(`*://${d}/*`);
    patterns.push(`*://*.${d}/*`);
  }
  return patterns;
}

// Network-level block for main-frame & sub-frame loads to listed domains
browser.webRequest.onBeforeRequest.addListener(
  () => ({ cancel: true }),
  {
    urls: urlPatternsFor(DEFAULT_BLOCKED_DOMAINS),
    types: ["main_frame", "sub_frame"]
  },
  ["blocking"]
);

// Receive close requests from the content script
browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg?.action === "closeThisTab" && sender.tab?.id) {
    return browser.tabs.remove(sender.tab.id).catch(() => {});
  }
});
