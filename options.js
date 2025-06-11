function renderDomains(data) {
  const container = document.getElementById('domain-list');
  container.innerHTML = '';
  Object.keys(data).forEach(domain => {
    const div = document.createElement('div');
    div.className = 'domain-entry';
    const span = document.createElement('span');
    span.textContent = domain + ': ' + (data[domain] || []).join(', ');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      document.getElementById('domain-input').value = domain;
      document.getElementById('words-input').value = (data[domain] || []).join(', ');
    });
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      browser.storage.local.remove(domain).then(loadDomains);
    });
    div.appendChild(span);
    div.appendChild(editBtn);
    div.appendChild(delBtn);
    container.appendChild(div);
  });
}

function loadDomains() {
  browser.storage.local.get(null).then(renderDomains);
}

document.getElementById('save-btn').addEventListener('click', () => {
  const domain = document.getElementById('domain-input').value.trim();
  const words = document.getElementById('words-input').value.split(',').map(w => w.trim()).filter(w => w);
  if (domain) {
    const data = {};
    data[domain] = words;
    browser.storage.local.set(data).then(() => {
      document.getElementById('domain-input').value = '';
      document.getElementById('words-input').value = '';
      loadDomains();
    });
  }
});

document.addEventListener('DOMContentLoaded', loadDomains);
