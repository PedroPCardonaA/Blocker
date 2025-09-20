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

function rulesFor(domains) {
  const rules = [];
  let idCounter = 1;

  for (const d of domains) {
    rules.push({
      id: idCounter++,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: `||${d}`,
        resourceTypes: ["main_frame", "sub_frame"]
      }
    });
  }
  return rules;
}

// Install blocking rules on startup
chrome.runtime.onInstalled.addListener(() => {
  const rules = rulesFor(DEFAULT_BLOCKED_DOMAINS);

  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: rules.map(r => r.id),
      addRules: rules
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to set rules:", chrome.runtime.lastError);
      }
    }
  );
});

// Receive close requests from the content script
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg?.action === "closeThisTab" && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id, () => chrome.runtime.lastError);
  }
});
