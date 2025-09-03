/* Active nav link by page */
(function(){
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav .nav-link').forEach(a=>{
    const isActive = a.getAttribute('href').includes(page);
    if ((page === 'home' && a.getAttribute('href').includes('index')) || isActive) {
      a.classList.add('active');
    }
  });
})();

/* Visitor counter (CountAPI with graceful fallback) */
(async function(){
  const el = document.getElementById('visitorCount');
  if(!el) return;

  const NAMESPACE = 'universal-chat-demo';
  const KEY = 'site-visits';
  const localKey = 'uc_visits_cache';
  const wasCountedKey = 'uc_counted_session';

  // Count only once per browser session
  const firstTimeThisSession = !sessionStorage.getItem(wasCountedKey);
  try {
    if (firstTimeThisSession) {
      // increment
      const r = await fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`);
      const data = await r.json();
      el.textContent = (data && data.value) ? data.value.toLocaleString('it-IT') : '1';
      localStorage.setItem(localKey, String(data.value || 1));
      sessionStorage.setItem(wasCountedKey, '1');
    } else {
      // get current
      const r = await fetch(`https://api.countapi.xyz/get/${NAMESPACE}/${KEY}`);
      const data = await r.json();
      el.textContent = (data && data.value) ? data.value.toLocaleString('it-IT') : (localStorage.getItem(localKey) || '—');
    }
  } catch (e) {
    // Fallback: local counter per browser
    const current = Number(localStorage.getItem(localKey) || '0') + (firstTimeThisSession ? 1 : 0);
    localStorage.setItem(localKey, String(current));
    sessionStorage.setItem(wasCountedKey, '1');
    el.textContent = current.toLocaleString('it-IT');
  }
})();
