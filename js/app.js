// Load locations data
let locations = [];
let currentTransportMode = 'walking';

fetch('data/locations.json')
  .then(response => response.json())
  .then(data => {
    locations = data;
    renderGallery();
    // Initialize with main gate
    const mainGate = locations.find(l => l.id === 'main-gate');
    if (mainGate) {
      selectLocation(mainGate);
    }
  })
  .catch(error => console.error('Error loading locations:', error));

// Search functionality
const searchInput = document.getElementById('searchInput');
const resultsList = document.getElementById('resultsList');
const mapFrame = document.getElementById('mapFrame');
const routeInfo = document.getElementById('routeInfo');
const directionLink = document.getElementById('directionLink');
const transportMode = document.getElementById('transportMode');
const previewImage = document.getElementById('previewImage');
const previewName = document.getElementById('previewName');
const previewDescription = document.getElementById('previewDescription');
const previewCategory = document.getElementById('previewCategory');
const previewAddress = document.getElementById('previewAddress');

// Gallery elements
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeBtn = document.querySelector('.close');

// Admin form elements
const adminForm = document.getElementById('adminForm');
const adminName = document.getElementById('adminName');
const adminType = document.getElementById('adminType');
const adminThumbnail = document.getElementById('adminThumbnail');
const adminImage = document.getElementById('adminImage');
const adminMapsLink = document.getElementById('adminMapsLink');
const adminDescription = document.getElementById('adminDescription');

transportMode.addEventListener('change', function() {
  currentTransportMode = this.value;
  // Update route if a location is selected
  const selectedLoc = locations.find(loc => loc.name === previewName.textContent);
  if (selectedLoc) {
    updateRoute(selectedLoc);
  }
});

adminForm.addEventListener('submit', function(event) {
  event.preventDefault();
  addNewLocation();
});

searchInput.addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const filtered = locations.filter(loc =>
    loc.name.toLowerCase().includes(query) ||
    loc.type.toLowerCase().includes(query)
  );
  displayResults(filtered);
});

function displayResults(results) {
  resultsList.innerHTML = '';
  results.forEach(loc => {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <h3>${loc.name}</h3>
      <p>${loc.type}</p>
    `;
    item.addEventListener('click', () => selectLocation(loc));
    resultsList.appendChild(item);
  });
}

function selectLocation(loc) {
  updateMap(loc);
  updateRoute(loc);
  updatePreview(loc);
}

function updateMap(loc) {
  const mapUrl = getMapEmbedUrl(loc);
  mapFrame.src = mapUrl;
}

function updateRoute(loc) {
  const routeUrl = getRouteUrl(loc);
  directionLink.href = routeUrl;
  directionLink.textContent = `Get directions to ${loc.name} (${currentTransportMode})`;
}

function updatePreview(loc) {
  previewImage.src = loc.image || loc.thumbnail;
  previewName.textContent = loc.name;
  previewDescription.textContent = loc.description;
  previewCategory.textContent = loc.type;
  previewAddress.textContent = loc.name + ', Mulungushi University Great North Road Campus';
}

function getMapEmbedUrl(loc) {
  if (loc.mapsLink && loc.mapsLink.startsWith('http')) {
    try {
      const url = new URL(loc.mapsLink);
      if (url.hostname.includes('google.com') && url.pathname.startsWith('/maps')) {
        if (url.pathname.includes('/embed')) {
          return loc.mapsLink;
        }

        // convert common maps URL patterns to embed version
        if (url.searchParams.has('q')) {
          url.searchParams.set('output', 'embed');
          return url.toString();
        }

        const embedUrl = new URL('https://www.google.com/maps/embed');
        if (url.pathname.startsWith('/maps/place') || url.pathname.startsWith('/maps/search')) {
          embedUrl.pathname = url.pathname.replace('/maps', '/maps/embed');
          embedUrl.search = url.search;
          return embedUrl.toString();
        }
      }
    } catch (e) {
      // ignore invalid URL and fall back to coordinates
    }
  }
  return `https://www.google.com/maps?q=${loc.lat},${loc.lng}&output=embed&maptype=roadmap`;
}

function getRouteUrl(loc) {
  if (loc.mapsLink && loc.mapsLink.startsWith('http')) {
    try {
      const url = new URL(loc.mapsLink);
      if (url.hostname.includes('google.com')) {
        if (url.pathname.includes('/dir/')) {
          if (!url.searchParams.has('travelmode')) {
            url.searchParams.set('travelmode', currentTransportMode);
          }
          return url.toString();
        }
        if (url.pathname.startsWith('/maps')) {
          const mainGate = locations.find(l => l.id === 'main-gate');
          if (mainGate) {
            return `https://www.google.com/maps/dir/${mainGate.lat},${mainGate.lng}/${loc.lat},${loc.lng}?travelmode=${currentTransportMode}`;
          }
        }
      }
    } catch (e) {
      // invalid URL, fall back to coordinates
    }
  }
  const mainGate = locations.find(l => l.id === 'main-gate');
  return mainGate
    ? `https://www.google.com/maps/dir/${mainGate.lat},${mainGate.lng}/${loc.lat},${loc.lng}?travelmode=${currentTransportMode}`
    : `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
}

function renderGallery() {
  gallery.innerHTML = '';
  locations.forEach(loc => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${loc.thumbnail}" alt="${loc.name}" class="gallery-thumb">
      <div class="gallery-info">
        <span class="category-badge">${loc.type}</span>
        <h3>${loc.name}</h3>
        <p>${loc.description}</p>
        <div class="gallery-actions">
          <button class="view-image-btn" type="button">View Image</button>
          <button class="get-directions-btn" type="button">Get Directions</button>
        </div>
      </div>
    `;

    const img = item.querySelector('.gallery-thumb');
    const viewBtn = item.querySelector('.view-image-btn');
    const dirBtn = item.querySelector('.get-directions-btn');

    img.addEventListener('click', event => {
      event.stopPropagation();
      openLightbox(loc.id);
    });

    viewBtn.addEventListener('click', event => {
      event.stopPropagation();
      openLightbox(loc.id);
    });

    dirBtn.addEventListener('click', event => {
      event.stopPropagation();
      getDirections(loc.id);
    });

    item.addEventListener('click', () => selectLocation(loc));
    gallery.appendChild(item);
  });
}

function openLightbox(id) {
  const loc = locations.find(l => l.id === id);
  lightboxImg.src = loc.image || loc.thumbnail;
  lightboxImg.alt = `${loc.name} full view`;
  lightboxCaption.innerHTML = `<h3>${loc.name}</h3><p>${loc.description}</p>`;
  lightbox.classList.add('show');
}

function getDirections(id) {
  const loc = locations.find(l => l.id === id);
  selectLocation(loc);
  document.querySelector('.panel-map').scrollIntoView({ behavior: 'smooth' });
}

function addNewLocation() {
  const name = adminName.value.trim();
  const type = adminType.value.trim();
  const thumbnail = adminThumbnail.value.trim();
  const image = adminImage.value.trim();
  const mapsLink = adminMapsLink.value.trim();
  const description = adminDescription.value.trim();

  if (!name || !type || !thumbnail || !image || !mapsLink || !description) {
    alert('Please complete all fields before adding the location.');
    return;
  }

  const locationData = parseLocationInput(mapsLink);
  if (!locationData) {
    alert('Invalid location input. Enter coordinates like -14.4470,28.4465 or a valid Google Maps link (including short links).');
    return;
  }

  const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
  const newLoc = {
    id,
    name,
    type,
    lat: locationData.lat,
    lng: locationData.lng,
    thumbnail,
    image,
    mapsLink: locationData.mapsLink || mapsLink,
    description
  };
  locations.push(newLoc);
  renderGallery();
  selectLocation(newLoc);
  adminForm.reset();
  alert('Location added successfully!');
}

function parseLocationInput(input) {
  const coordRegex = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
  const urlRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;

  const coordMatch = input.match(coordRegex);
  if (coordMatch) {
    return {
      lat: parseFloat(coordMatch[1]),
      lng: parseFloat(coordMatch[2]),
      mapsLink: null
    };
  }

  try {
    const url = new URL(input);
    const hostname = url.hostname.toLowerCase();
    const isGoogleMap = hostname.includes('google.com') || hostname.includes('goo.gl') || hostname.includes('maps.app.goo.gl');
    if (!isGoogleMap) {
      return null;
    }

    const urlMatch = input.match(urlRegex);
    if (urlMatch) {
      return {
        lat: parseFloat(urlMatch[1]),
        lng: parseFloat(urlMatch[2]),
        mapsLink: input
      };
    }

    return {
      lat: null,
      lng: null,
      mapsLink: input
    };
  } catch (e) {
    return null;
  }
}

function getMapEmbedUrl(loc) {
  if (loc.mapsLink && loc.mapsLink.startsWith('http')) {
    try {
      const url = new URL(loc.mapsLink);
      const hostname = url.hostname.toLowerCase();
      if (hostname.includes('maps.app.goo.gl') || hostname.includes('goo.gl')) {
        return loc.mapsLink;
      }
      if (hostname.includes('google.com')) {
        if (url.pathname.includes('/embed')) {
          return loc.mapsLink;
        }
        if (url.searchParams.has('q')) {
          url.searchParams.set('output', 'embed');
          return url.toString();
        }
        const embedUrl = new URL('https://www.google.com/maps/embed');
        if (url.pathname.startsWith('/maps/place') || url.pathname.startsWith('/maps/search')) {
          embedUrl.pathname = url.pathname.replace('/maps', '/maps/embed');
          embedUrl.search = url.search;
          return embedUrl.toString();
        }
      }
    } catch (e) {
      // ignore invalid URL and fall back to coordinates
    }
  }
  if (loc.lat != null && loc.lng != null) {
    return `https://www.google.com/maps?q=${loc.lat},${loc.lng}&output=embed&maptype=roadmap`;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(loc.name || 'Mulungushi University')}&output=embed&maptype=roadmap`;
}

function getRouteUrl(loc) {
  if (loc.mapsLink && loc.mapsLink.startsWith('http')) {
    try {
      const url = new URL(loc.mapsLink);
      const hostname = url.hostname.toLowerCase();
      if (hostname.includes('maps.app.goo.gl') || hostname.includes('goo.gl')) {
        return loc.mapsLink;
      }
      if (hostname.includes('google.com')) {
        if (url.pathname.includes('/dir/')) {
          if (!url.searchParams.has('travelmode')) {
            url.searchParams.set('travelmode', currentTransportMode);
          }
          return url.toString();
        }
        if (loc.lat != null && loc.lng != null) {
          return `https://www.google.com/maps/dir/Current+Location/${loc.lat},${loc.lng}?travelmode=${currentTransportMode}`;
        }
      }
    } catch (e) {
      // invalid URL, fall back to coordinates
    }
  }
  if (loc.lat != null && loc.lng != null) {
    return `https://www.google.com/maps/dir/Current+Location/${loc.lat},${loc.lng}?travelmode=${currentTransportMode}`;
  }
  return loc.mapsLink || `https://www.google.com/maps?q=${encodeURIComponent(loc.name || 'Mulungushi University')}`;
}

closeBtn.onclick = function() {
  lightbox.classList.remove('show');
}

lightbox.onclick = function(event) {
  if (event.target === lightbox) {
    lightbox.classList.remove('show');
  }
}