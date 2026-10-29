/* Public product catalogue sync. The anonymous key is safe for browser use only with the RLS
   policies in supabase-schema.sql. Never put a service-role key in this file. */
(() => {
  const config = window.MHARO_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey) return;
  const endpoint = config.url.replace(/\/$/, '') + '/rest/v1/products?select=legacy_key,name,description,offer_price,original_price,image_urls,sort_order&active=eq.true&order=sort_order.asc';
  fetch(endpoint, { headers: { apikey: config.anonKey, Authorization: 'Bearer ' + config.anonKey } })
    .then(response => { if (!response.ok) throw new Error('Catalogue unavailable'); return response.json(); })
    .then(products => {
      if (!Array.isArray(products) || !products.length) return;
      const grid = document.querySelector('.products');
      if (!grid) return;
      const existing = new Map([...grid.querySelectorAll('.product')].map(card => [card.dataset.key || slug(card.dataset.name), card]));
      const cards = products.map((item, index) => {
        const key = item.legacy_key || slug(item.name);
        let card = existing.get(key);
        if (!card) {
          card = document.createElement('article'); card.className = 'product';
          card.innerHTML = '<div class="product-visual"><span class="number"></span><img loading="lazy" alt=""><span class="view">VIEW PIECE ↗</span></div><div class="product-meta"><div><h3></h3><p></p><div class="price-row"><s class="old-price"></s><strong class="price"></strong></div><button class="btn gold buy-btn" type="button">Buy Now</button></div><span>MHARO GAHNO</span></div>';
          card.querySelector('.buy-btn').addEventListener('click', event => { event.stopPropagation(); window.openOrderOptions?.(card); });
          card.querySelector('.product-visual').addEventListener('click', () => window.openOrderOptions?.(card));
        }
        card.dataset.key = key; card.dataset.name = item.name; card.dataset.description = item.description || '';
        card.dataset.price = '₹' + item.offer_price; card.dataset.originalPrice = '₹' + item.original_price;
        card.dataset.images = Array.isArray(item.image_urls) ? item.image_urls.join('|') : '';
        card.querySelector('.number').textContent = 'NO. ' + String(index + 1).padStart(2, '0');
        card.querySelector('h3').textContent = item.name;
        card.querySelector('.product-meta p').textContent = item.description || '';
        card.querySelector('.old-price').textContent = '₹' + Number(item.original_price).toLocaleString('en-IN');
        card.querySelector('.price').textContent = '₹' + Number(item.offer_price).toLocaleString('en-IN');
        const images = Array.isArray(item.image_urls) ? item.image_urls : [];
        const image = card.querySelector('.product-visual img');
        image.alt = item.name;
        if (images.length) image.src = images[0];
        if (images.length > 1) {
          let thumbs = card.querySelector('.product-thumbnails');
          if (!thumbs) { thumbs = document.createElement('div'); thumbs.className = 'product-thumbnails'; card.querySelector('.product-visual').after(thumbs); }
          thumbs.replaceChildren(...images.map((src, photoIndex) => {
            const thumb = document.createElement('button'); thumb.type = 'button'; thumb.setAttribute('aria-label', 'Show photo ' + (photoIndex + 1));
            const picture = document.createElement('img'); picture.src = src; picture.alt = ''; thumb.append(picture);
            thumb.addEventListener('click', event => { event.stopPropagation(); image.src = src; }); return thumb;
          }));
        }
        return card;
      });
      grid.replaceChildren(...cards);
    }).catch(error => console.info('Using the saved website catalogue.', error));
  function slug(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
})();
