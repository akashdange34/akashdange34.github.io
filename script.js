// script.js - सर्व्हिसेस लोड करा, सर्च व बुकिंग व्यवस्थापन (लोकलस्टोरेज)
async function loadServices(){
  const res = await fetch('services.json');
  const services = await res.json();
  const list = document.getElementById('services-list');
  const select = document.getElementById('service_select');
  services.forEach(s =>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${s.name}</strong><div class="cat">${s.category || ''}</div>`;
    list.appendChild(li);
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.name}`;
    select.appendChild(opt);
  });

  // search
  const search = document.getElementById('search');
  search.addEventListener('input', e=>{
    const q = e.target.value.trim().toLowerCase();
    list.innerHTML='';
    services.filter(s=>s.name.toLowerCase().includes(q) || (s.category||'').toLowerCase().includes(q)).forEach(s=>{
      const li = document.createElement('li');
      li.innerHTML = `<strong>${s.name}</strong><div class="cat">${s.category || ''}</div>`;
      list.appendChild(li);
    });
  });
}

function saveBooking(data){
  const key = 'adms_bookings_v1';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push(data);
  localStorage.setItem(key, JSON.stringify(existing));
}

function showAdmin(){
  const params = new URLSearchParams(location.search);
  if(!params.has('admin')) return;
  document.getElementById('admin').style.display='block';
  const key = 'adms_bookings_v1';
  const bookings = JSON.parse(localStorage.getItem(key) || '[]');
  const container = document.getElementById('bookings-table');
  if(bookings.length===0){ container.innerHTML='<p>कुठलेही बुकिंग्स सध्या नाहीत.</p>'; return }
  const table = document.createElement('table');
  table.style.width='100%';
  table.border=1;
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>नाव</th><th>फोन</th><th>सेवा</th><th>दिन</th><th>वेळ</th><th>टीप</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  bookings.forEach(b=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${b.name}</td><td>${b.phone}</td><td>${b.serviceName}</td><td>${b.date||''}</td><td>${b.time||''}</td><td>${b.notes||''}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

function getServiceNameById(id){
  const select = document.getElementById('service_select');
  const opt = select.querySelector(`option[value="${id}"]`);
  return opt ? opt.textContent : id;
}

window.addEventListener('DOMContentLoaded', async ()=>{
  await loadServices();
  showAdmin();
  document.getElementById('booking-form').addEventListener('submit', e=>{
    e.preventDefault();
    const data = {
      name: document.getElementById('customer_name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      service: document.getElementById('service_select').value,
      serviceName: getServiceNameById(document.getElementById('service_select').value),
      date: document.getElementById('preferred_date').value,
      time: document.getElementById('preferred_time').value,
      notes: document.getElementById('notes').value,
      createdAt: new Date().toISOString()
    };
    saveBooking(data);
    alert('तुमची विनंती नोंद झाली आहे. आम्ही लवकरच संपर्क करू.');
    e.target.reset();
  });
});
