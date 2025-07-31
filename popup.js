// Delete category button event
document.getElementById('del-category-btn').addEventListener('click', () => {
  const catNameInput = document.getElementById('new-category-name');
  const catName = catNameInput.value.trim();
  if (!catName) return;
  chrome.storage.local.get(['customConfig'], (result) => {
    let config = result.customConfig;
    // Remove category by name and save
    function delAndSave(cfg) {
      if (!cfg.categories) return;
      const idx = cfg.categories.findIndex(c => c.name === catName);
      if (idx !== -1) {
        cfg.categories.splice(idx, 1);
        chrome.storage.local.set({ customConfig: cfg }, loadConfigAndRender);
        catNameInput.value = '';
      }
    }
    if (!config) {
      fetch(chrome.runtime.getURL('config.json'))
        .then(response => response.json())
        .then(data => {
          config = data;
          delAndSave(config);
        });
    } else {
      delAndSave(config);
    }
  });
});

// Delete link button event
document.getElementById('del-link-btn').addEventListener('click', () => {
  const catSelect = document.getElementById('category-select');
  const linkNameInput = document.getElementById('new-link-name');
  const catIdx = catSelect.value;
  const linkName = linkNameInput.value.trim();
  if (catIdx === '' || catIdx === undefined || !linkName) return;
  chrome.storage.local.get(['customConfig'], (result) => {
    let config = result.customConfig;
    // Remove link by name in selected category and save
    function delAndSave(cfg) {
      if (!cfg.categories || !cfg.categories[catIdx]) return;
      const links = cfg.categories[catIdx].links;
      const idx = links.findIndex(l => l.name === linkName);
      if (idx !== -1) {
        links.splice(idx, 1);
        chrome.storage.local.set({ customConfig: cfg }, loadConfigAndRender);
        linkNameInput.value = '';
      }
    }
    if (!config) {
      fetch(chrome.runtime.getURL('config.json'))
        .then(response => response.json())
        .then(data => {
          config = data;
          delAndSave(config);
        });
    } else {
      delAndSave(config);
    }
  });
});
// Load config (prefer storage.local, fallback to config.json), then render page
function loadConfigAndRender() {
  chrome.storage.local.get(['customConfig'], (result) => {
    if (result.customConfig) {
      renderByConfig(result.customConfig);
    } else {
      fetch(chrome.runtime.getURL('config.json'))
        .then(response => response.json())
        .then(data => {
          renderByConfig(data);
        })
        .catch(err => {
          document.getElementById('nav-container').textContent = 'Failed to load config file';
        });
    }
  });
}

// Render page by config data
function renderByConfig(data) {
  // Set background color
  document.body.style.background = '#e6f7fa';
  document.body.style.backgroundImage = '';
  // Render category dropdown (for adding links)
  const categorySelect = document.getElementById('category-select');
  categorySelect.innerHTML = '';
  if (data.categories && Array.isArray(data.categories)) {
    data.categories.forEach((cat, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = cat.name;
      categorySelect.appendChild(opt);
    });
  }
  // Render categories and links
  const container = document.getElementById('nav-container');
  container.innerHTML = '';
  if (!data.categories || !Array.isArray(data.categories)) {
    container.textContent = 'Config file format error';
    return;
  }
  data.categories.forEach((category) => {
    // Outer card container for category
    const card = document.createElement('div');
    card.className = 'category-card';
    // Category title
    const catTitle = document.createElement('div');
    catTitle.textContent = category.name;
    catTitle.className = 'category-title';
    card.appendChild(catTitle);
    // Links list
    const linksList = document.createElement('div');
    linksList.className = 'links-list';
    category.links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.name;
      a.target = '_blank';
      a.className = 'nav-link';
      linksList.appendChild(a);
    });
    card.appendChild(linksList);
    container.appendChild(card);
  });
}

// Add category button event
document.getElementById('add-category-btn').addEventListener('click', () => {
  const name = document.getElementById('new-category-name').value.trim();
  if (!name) return;
  chrome.storage.local.get(['customConfig'], (result) => {
    let config = result.customConfig;
    // Add new category and save
    if (!config) {
      fetch(chrome.runtime.getURL('config.json'))
        .then(response => response.json())
        .then(data => {
          config = data;
          config.categories = config.categories || [];
          config.categories.push({ name, links: [] });
          chrome.storage.local.set({ customConfig: config }, loadConfigAndRender);
        });
    } else {
      config.categories = config.categories || [];
      config.categories.push({ name, links: [] });
      chrome.storage.local.set({ customConfig: config }, loadConfigAndRender);
    }
    document.getElementById('new-category-name').value = '';
  });
});

// Add link button event
document.getElementById('add-link-btn').addEventListener('click', () => {
  const catIdx = document.getElementById('category-select').value;
  const name = document.getElementById('new-link-name').value.trim();
  let url = document.getElementById('new-link-url').value.trim();
  if (!name || !url) return;
  // Auto-complete http:// prefix to avoid ERR_FILE_NOT_FOUND
  // If not starting with http:// or https://, and not chrome://, file://, about: etc.
  if (!/^https?:\/\//i.test(url) &&
      !/^chrome:|^file:|^about:/i.test(url)) {
    // If user enters www. or domain, auto-complete http://
    url = 'http://' + url.replace(/^\/*/, '');
  }
  chrome.storage.local.get(['customConfig'], (result) => {
    let config = result.customConfig;
    // Add new link to selected category and save
    function addLinkAndSave(cfg) {
      if (!cfg.categories || !cfg.categories[catIdx]) return;
      cfg.categories[catIdx].links.push({ name, url });
      chrome.storage.local.set({ customConfig: cfg }, loadConfigAndRender);
    }
    if (!config) {
      fetch(chrome.runtime.getURL('config.json'))
        .then(response => response.json())
        .then(data => {
          config = data;
          addLinkAndSave(config);
        });
    } else {
      addLinkAndSave(config);
    }
    document.getElementById('new-link-name').value = '';
    document.getElementById('new-link-url').value = '';
  });
});

// Initial render
loadConfigAndRender();
