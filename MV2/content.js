// Simple keyword heuristic.
// Increase threshold or refine keywords to reduce false positives.
const KEYWORDS = [
  "porn", "xxx", "hardcore", "teen porn", "milf", "hentai",
  "escort", "anal", "cumshot", "deepthroat", "blowjob",
  "gangbang", "nsfw", "xxx video", "sex video", "free porn",
  "amateur porn", "incest", "bdsm", 
];

// Optional: allowlist (domains you never want closed). You can later move this to chrome.storage.
const ALLOWLIST = new Set([
  // e.g., "wikipedia.org", "nhs.uk" (for sexual education pages)
]);

function domain(host) {
  return host.replace(/^www\./, "");
}

function looksPornByText() {
  // Fast bailouts for gigantic pages.
  const text = (document.body?.innerText || "").toLowerCase();
  if (!text) return false;

  // Count how many distinct keywords appear.
  let hits = 0;
  for (const k of KEYWORDS) {
    if (text.includes(k)) {
      hits++;
      if (hits >= 3) return true; // threshold
    }
  }
  return false;
}

function maybeClose() {
  const host = domain(location.hostname);
  if (ALLOWLIST.has(host)) return;

  if (looksPornByText()) {
    chrome.runtime.sendMessage({ action: "closeThisTab" });
  }
}

// Initial scan after load
if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(maybeClose, 300);
} else {
  window.addEventListener("DOMContentLoaded", () => setTimeout(maybeClose, 300));
}

// Lightweight re-check for single-page apps (optional)
let scheduled = false;
const mo = new MutationObserver(() => {
  if (!scheduled) {
    scheduled = true;
    setTimeout(() => { scheduled = false; maybeClose(); }, 1000);
  }
});
mo.observe(document.documentElement, { childList: true, subtree: true, characterData: false });
