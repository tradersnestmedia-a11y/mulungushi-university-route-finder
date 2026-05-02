// Data storage
let locations = [];
let events = [];
let teamMembers = [];
let aboutInfo = {
  content: "Mulungushi University is a public university in Zambia, established to provide quality higher education and research opportunities. The university is committed to excellence in teaching, learning, and community engagement.",
  image: "https://i.postimg.cc/132Qfgqw/gate.jpg",
  contact: "Address: Great North Road, Kabwe, Zambia\nPhone: +260 123 456 789\nEmail: info@mulungushi.ac.zm"
};
let settings = {
  logo: "https://via.placeholder.com/50x50?text=MU",
  title: "Mulungushi University Route Finder",
  subtitle: "Venue locator and campus navigation for students, staff, and visitors.",
  adminPassword: "admin123"
};

let currentTransportMode = "walking";
let currentSlideIndex = 0;
let slideInterval;
let isAdminLoggedIn = false;
let currentView = "home";

// Toast notification function
function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = `toast-notification ${isError ? 'error' : ''}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Load data from localStorage
function loadData() {
  // Load locations
  const storedLocations = localStorage.getItem("mu_locations");
  if (storedLocations) {
    locations = JSON.parse(storedLocations);
    console.log("Locations loaded from localStorage:", locations.length);
  } else {
    locations = [
      {
        id: "main-gate",
        name: "Main Gate",
        type: "Landmark",
        lat: -14.29090,
        lng: 28.55127,
        thumbnail: "https://i.postimg.cc/132Qfgqw/gate.jpg",
        image: "https://i.postimg.cc/132Qfgqw/gate.jpg",
        description: "The main entrance to Mulungushi University Great North Road Campus."
      },
      {
        id: "ict-block",
        name: "ICT Block",
        type: "Facility",
        lat: -14.292465,
        lng: 28.555363,
        thumbnail: "https://i.postimg.cc/nhCxFKCj/ict.jpg",
        image: "https://i.postimg.cc/nhCxFKCj/ict.jpg",
        description: "Information and Communication Technology facilities."
      },
      {
        id: "administration-block",
        name: "Administration Block",
        type: "Office",
        lat: -14.295785,
        lng: 28.559561,
        thumbnail: "https://i.postimg.cc/K8RbG7RD/admin.jpg",
        image: "https://i.postimg.cc/K8RbG7RD/admin.jpg",
        description: "University administration offices."
      },
      {
        id: "university-library",
        name: "University Library",
        type: "Facility",
        lat: -14.296243,
        lng: 28.560507,
        thumbnail: "https://i.postimg.cc/6pyKWVyG/lib.jpg",
        image: "https://i.postimg.cc/6pyKWVyG/lib.jpg",
        description: "Central library with extensive resources."
      }
    ];
    saveLocations();
  }

  // Load events
  const storedEvents = localStorage.getItem("mu_events");
  if (storedEvents) {
    events = JSON.parse(storedEvents);
    console.log("Events loaded from localStorage:", events.length);
  } else {
    events = [
      {
        id: "event-1",
        title: "Freshman Orientation Week",
        date: "2026-01-15",
        image: "https://i.postimg.cc/132Qfgqw/gate.jpg",
        description: "Welcome new students with campus tours, registration assistance, and orientation activities.",
        location: "Main Campus"
      },
      {
        id: "event-2",
        title: "Research Symposium 2026",
        date: "2026-03-10",
        image: "https://i.postimg.cc/nhCxFKCj/ict.jpg",
        description: "Annual research symposium showcasing student and faculty research projects.",
        location: "Great Hall"
      }
    ];
    saveEvents();
  }

  // Load team members
  const storedTeam = localStorage.getItem("mu_team");
  if (storedTeam) {
    teamMembers = JSON.parse(storedTeam);
    console.log("Team members loaded from localStorage:", teamMembers.length);
  } else {
    teamMembers = [
      {
        id: "team-1",
        name: "Prof. John Banda",
        role: "Vice Chancellor",
        image: "https://via.placeholder.com/300x250?text=Prof+Banda",
        bio: "Leading the university with a vision for excellence in higher education.",
        email: "vc@mulungushi.ac.zm"
      },
      {
        id: "team-2",
        name: "Dr. Sarah Mwale",
        role: "Registrar",
        image: "https://via.placeholder.com/300x250?text=Dr+Sarah",
        bio: "Overseeing academic records and student services.",
        email: "registrar@mulungushi.ac.zm"
      }
    ];
    saveTeam();
  }

  // Load about info
  const storedAbout = localStorage.getItem("mu_about");
  if (storedAbout) {
    aboutInfo = JSON.parse(storedAbout);
    console.log("About info loaded from localStorage");
  } else {
    saveAbout();
  }

  // Load settings
  const storedSettings = localStorage.getItem("mu_settings");
  if (storedSettings) {
    settings = JSON.parse(storedSettings);
    console.log("Settings loaded from localStorage");
  } else {
    saveSettings();
  }
}

// Save functions with console logs
function saveLocations() {
  localStorage.setItem("mu_locations", JSON.stringify(locations));
  console.log("✅ Locations saved to localStorage:", locations.length);
}

function saveEvents() {
  localStorage.setItem("mu_events", JSON.stringify(events));
  console.log("✅ Events saved to localStorage:", events.length);
}

function saveTeam() {
  localStorage.setItem("mu_team", JSON.stringify(teamMembers));
  console.log("✅ Team members saved to localStorage:", teamMembers.length);
}

function saveAbout() {
  localStorage.setItem("mu_about", JSON.stringify(aboutInfo));
  console.log("✅ About info saved to localStorage");
}

function saveSettings() {
  localStorage.setItem("mu_settings", JSON.stringify(settings));
  console.log("✅ Settings saved to localStorage");
}

// DOM Elements
const searchInput = document.getElementById("searchInput");
const resultsList = document.getElementById("resultsList");
const mapFrame = document.getElementById("mapFrame");
const directionLink = document.getElementById("directionLink");
const transportMode = document.getElementById("transportMode");
const previewImage = document.getElementById("previewImage");
const previewName = document.getElementById("previewName");
const previewDescription = document.getElementById("previewDescription");
const previewCategory = document.getElementById("previewCategory");
const previewAddress = document.getElementById("previewAddress");
const gallery = document.getElementById("gallery");
const slideshow = document.getElementById("slideshow");
const slidePrev = document.getElementById("slidePrev");
const slideNext = document.getElementById("slideNext");
const slideDots = document.getElementById("slideDots");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeBtn = document.querySelector(".close");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");
const loginModal = document.getElementById("loginModal");
const loginPassword = document.getElementById("loginPassword");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");
const modalClose = document.querySelector(".modal-close");
const adminPanel = document.getElementById("adminPanel");
const publicContent = document.getElementById("publicContent");
const publicAboutSection = document.getElementById("publicAboutSection");
const publicTeamSection = document.getElementById("publicTeamSection");
const fabMenu = document.getElementById("fabMenu");
const fabButton = document.getElementById("fabButton");
const fabAdminBtn = document.getElementById("fabAdminBtn");
const siteLogo = document.getElementById("siteLogo");
const navButtons = document.querySelectorAll(".nav-btn");

// Initialize
loadData();
renderAll();

// Event Listeners
transportMode.addEventListener("change", function() {
  currentTransportMode = this.value;
  const selectedLoc = locations.find(loc => loc.name === previewName.textContent);
  if (selectedLoc) updateRoute(selectedLoc);
});

searchInput.addEventListener("input", function() {
  const query = this.value.toLowerCase();
  const filtered = locations.filter(loc =>
    loc.name.toLowerCase().includes(query) || loc.type.toLowerCase().includes(query)
  );
  displayResults(filtered);
});

// Navigation Buttons
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.dataset.view;
    if (view) {
      showView(view);
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    }
  });
});

adminLoginBtn.addEventListener("click", () => loginModal.classList.add("show"));
modalClose.addEventListener("click", () => loginModal.classList.remove("show"));
loginSubmitBtn.addEventListener("click", checkLogin);
adminLogoutBtn.addEventListener("click", logout);

// FAB Menu Toggle
if (fabButton) {
  fabButton.addEventListener("click", (e) => {
    e.stopPropagation();
    fabMenu.classList.toggle("open");
  });
}

// Close FAB menu when clicking outside
document.addEventListener("click", (e) => {
  if (fabMenu && !fabMenu.contains(e.target)) {
    fabMenu.classList.remove("open");
  }
});

// FAB Options Event Listeners
document.querySelectorAll(".fab-option").forEach(option => {
  option.addEventListener("click", (e) => {
    const view = option.dataset.view;
    if (view) {
      showView(view);
      fabMenu.classList.remove("open");
      navButtons.forEach(btn => {
        if (btn.dataset.view === view) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }
  });
});

// FAB Admin Button
if (fabAdminBtn) {
  fabAdminBtn.addEventListener("click", () => {
    if (isAdminLoggedIn) {
      showAdminMode();
    } else {
      loginModal.classList.add("show");
    }
    fabMenu.classList.remove("open");
  });
}

// Admin Navigation
const adminNavBtns = document.querySelectorAll(".admin-nav-btn");
adminNavBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    showAdminTab(tab);
    adminNavBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Scroll to Top Button
const scrollTopBtn = document.createElement("button");
scrollTopBtn.className = "scroll-top";
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function checkLogin() {
  if (loginPassword.value === settings.adminPassword) {
    isAdminLoggedIn = true;
    loginModal.classList.remove("show");
    loginPassword.value = "";
    showAdminMode();
    showToast("✅ Login successful! Welcome Admin.");
  } else {
    showToast("❌ Incorrect password!", true);
  }
}

function logout() {
  isAdminLoggedIn = false;
  showPublicMode();
  currentView = "home";
  showView("home");
  navButtons.forEach(btn => {
    if (btn.dataset.view === "home") {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  showToast("✅ Logged out successfully.");
}

function showAdminMode() {
  adminPanel.style.display = "block";
  publicContent.style.display = "none";
  publicAboutSection.style.display = "none";
  publicTeamSection.style.display = "none";
  if (fabMenu) fabMenu.style.display = "none";
  adminLoginBtn.style.display = "none";
  loadAdminData();
}

function showPublicMode() {
  adminPanel.style.display = "none";
  adminLoginBtn.style.display = "flex";
  if (window.innerWidth <= 992 && fabMenu) {
    fabMenu.style.display = "block";
  }
}

function showView(view) {
  currentView = view;
  if (isAdminLoggedIn) return;
  
  if (view === "home") {
    publicContent.style.display = "block";
    publicAboutSection.style.display = "none";
    publicTeamSection.style.display = "none";
  } else if (view === "about") {
    publicContent.style.display = "none";
    publicAboutSection.style.display = "block";
    publicTeamSection.style.display = "none";
    renderPublicAbout();
  } else if (view === "team") {
    publicContent.style.display = "none";
    publicAboutSection.style.display = "none";
    publicTeamSection.style.display = "block";
    renderPublicTeam();
  }
  
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showAdminTab(tabId) {
  document.querySelectorAll(".admin-tab").forEach(tab => tab.style.display = "none");
  document.getElementById(`${tabId}Tab`).style.display = "block";
}

function loadAdminData() {
  document.getElementById("statLocations").textContent = locations.length;
  document.getElementById("statEvents").textContent = events.length;
  document.getElementById("statTeam").textContent = teamMembers.length;
  renderManageLocations();
  renderManageEvents();
  renderManageTeam();
  document.getElementById("aboutContent").value = aboutInfo.content;
  document.getElementById("aboutImage").value = aboutInfo.image;
  document.getElementById("contactInfo").value = aboutInfo.contact;
  document.getElementById("siteLogoUrl").value = settings.logo;
  document.getElementById("siteTitle").value = settings.title;
  document.getElementById("siteSubtitle").value = settings.subtitle;
}

function renderAll() {
  renderGallery();
  renderSlideshow();
  startSlideshow();
  updateSiteSettings();
  const mainGate = locations.find(l => l.id === "main-gate");
  if (mainGate) selectLocation(mainGate);
}

function updateSiteSettings() {
  if (siteLogo) siteLogo.src = settings.logo;
  const brandTitle = document.querySelector(".brand h1");
  const brandSubtitle = document.querySelector(".brand p");
  if (brandTitle) brandTitle.textContent = settings.title;
  if (brandSubtitle) brandSubtitle.textContent = settings.subtitle;
}

function renderGallery() {
  if (!gallery) return;
  gallery.innerHTML = "";
  locations.forEach(loc => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.innerHTML = `
      <img src="${loc.thumbnail}" alt="${loc.name}" class="gallery-thumb">
      <div class="gallery-info">
        <span class="category-badge">${loc.type}</span>
        <h3>${loc.name}</h3>
        <p>${loc.description.substring(0, 80)}...</p>
        <div class="gallery-actions">
          <button class="view-image-btn" type="button" title="View Full Image">View Image</button>
          <button class="get-directions-btn" type="button" title="Get Directions">Get Directions</button>
        </div>
      </div>
    `;
    
    const viewBtn = item.querySelector(".view-image-btn");
    const dirBtn = item.querySelector(".get-directions-btn");
    
    viewBtn.addEventListener("click", e => {
      e.stopPropagation();
      openLightbox(loc.id);
    });
    
    dirBtn.addEventListener("click", e => {
      e.stopPropagation();
      getDirections(loc.id);
    });
    
    item.addEventListener("click", () => selectLocation(loc));
    gallery.appendChild(item);
  });
}

function renderSlideshow() {
  if (!slideshow) return;
  slideshow.innerHTML = "";
  if (events.length === 0) {
    slideshow.innerHTML = '<div class="slide active"><div class="slide-content"><p>No events scheduled. Check back soon!</p></div></div>';
    return;
  }
  
  events.forEach((event, idx) => {
    const slide = document.createElement("div");
    slide.className = "slide" + (idx === 0 ? " active" : "");
    slide.innerHTML = `
      <img src="${event.image}" alt="${event.title}" class="slide-image">
      <div class="slide-content">
        <h3>${event.title}</h3>
        <div class="event-date">📅 ${formatDate(event.date)}</div>
        <p>${event.description}</p>
        ${event.location ? `<div class="event-location">📍 ${event.location}</div>` : ""}
      </div>
    `;
    slideshow.appendChild(slide);
  });
  
  renderDots();
}

function renderDots() {
  if (!slideDots) return;
  slideDots.innerHTML = "";
  for (let i = 0; i < events.length; i++) {
    const dot = document.createElement("span");
    dot.className = "dot" + (i === currentSlideIndex ? " active" : "");
    dot.addEventListener("click", () => goToSlide(i));
    slideDots.appendChild(dot);
  }
}

function startSlideshow() {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    if (events.length > 0) {
      nextSlide();
    }
  }, 5000);
}

function goToSlide(index) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  
  if (slides.length === 0) return;
  
  if (slides[currentSlideIndex]) slides[currentSlideIndex].classList.remove("active");
  if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.remove("active");
  
  currentSlideIndex = index;
  if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
  if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;
  
  if (slides[currentSlideIndex]) slides[currentSlideIndex].classList.add("active");
  if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add("active");
}

function nextSlide() {
  goToSlide(currentSlideIndex + 1);
}

function prevSlide() {
  goToSlide(currentSlideIndex - 1);
}

if (slidePrev) slidePrev.addEventListener("click", prevSlide);
if (slideNext) slideNext.addEventListener("click", nextSlide);

function renderPublicAbout() {
  const container = document.getElementById("publicAboutContent");
  if (!container) return;
  container.innerHTML = `
    <div class="about-container">
      ${aboutInfo.image ? `<img src="${aboutInfo.image}" alt="Mulungushi University" class="about-image">` : ""}
      <div class="about-text">
        ${aboutInfo.content.split("\n").map(p => `<p>${p}</p>`).join("")}
        <div class="contact-info">
          <h3>Contact Information</h3>
          ${aboutInfo.contact.split("\n").map(line => `<p>${line}</p>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderPublicTeam() {
  const container = document.getElementById("publicTeamGrid");
  if (!container) return;
  container.innerHTML = teamMembers.map(member => `
    <div class="team-card">
      <img src="${member.image}" alt="${member.name}">
      <div class="team-card-content">
        <h3>${member.name}</h3>
        <div class="team-role">${member.role}</div>
        ${member.bio ? `<div class="team-bio">${member.bio}</div>` : ""}
        ${member.email ? `<div class="team-email">📧 ${member.email}</div>` : ""}
      </div>
    </div>
  `).join("");
}

function displayResults(results) {
  if (!resultsList) return;
  resultsList.innerHTML = "";
  results.forEach(loc => {
    const item = document.createElement("div");
    item.className = "result-item";
    item.innerHTML = `<h3>${loc.name}</h3><p>${loc.type}</p>`;
    item.addEventListener("click", () => selectLocation(loc));
    resultsList.appendChild(item);
  });
}

function selectLocation(loc) {
  updateMap(loc);
  updateRoute(loc);
  updatePreview(loc);
}

function updateMap(loc) {
  if (!mapFrame) return;
  mapFrame.src = getMapEmbedUrl(loc);
}

function updateRoute(loc) {
  if (!directionLink) return;
  const routeUrl = getRouteUrl(loc);
  directionLink.href = routeUrl;
  directionLink.textContent = `Get directions to ${loc.name} (${currentTransportMode})`;
}

function updatePreview(loc) {
  if (!previewImage) return;
  previewImage.src = loc.image || loc.thumbnail;
  previewName.textContent = loc.name;
  previewDescription.textContent = loc.description;
  previewCategory.textContent = loc.type;
  previewAddress.textContent = loc.name + ", Mulungushi University Great North Road Campus";
}

function getMapEmbedUrl(loc) {
  if (loc.lat != null && loc.lng != null) {
    return `https://www.google.com/maps?q=${loc.lat},${loc.lng}&output=embed&maptype=roadmap`;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(loc.name)}&output=embed&maptype=roadmap`;
}

function getRouteUrl(loc) {
  const mainGate = locations.find(l => l.id === "main-gate");
  if (loc.lat != null && loc.lng != null && mainGate) {
    return `https://www.google.com/maps/dir/${mainGate.lat},${mainGate.lng}/${loc.lat},${loc.lng}?travelmode=${currentTransportMode}`;
  }
  return `https://www.google.com/maps/dir/Current+Location/${encodeURIComponent(loc.name)}?travelmode=${currentTransportMode}`;
}

function openLightbox(id) {
  const loc = locations.find(l => l.id === id);
  if (!loc) return;
  lightboxImg.src = loc.image || loc.thumbnail;
  lightboxImg.alt = loc.name;
  lightboxCaption.innerHTML = `<h3>${loc.name}</h3><p>${loc.description}</p>`;
  lightbox.classList.add("show");
}

function getDirections(id) {
  const loc = locations.find(l => l.id === id);
  if (!loc) return;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const url = `https://www.google.com/maps/dir/${position.coords.latitude},${position.coords.longitude}/${loc.lat},${loc.lng}?travelmode=${currentTransportMode}`;
        window.open(url, "_blank");
      },
      () => {
        const url = `https://www.google.com/maps/dir/Current+Location/${loc.lat},${loc.lng}?travelmode=${currentTransportMode}`;
        window.open(url, "_blank");
      }
    );
  } else {
    const url = `https://www.google.com/maps/dir/Current+Location/${loc.lat},${loc.lng}?travelmode=${currentTransportMode}`;
    window.open(url, "_blank");
  }
  selectLocation(loc);
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Admin Forms
const adminForm = document.getElementById("adminForm");
if (adminForm) {
  adminForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const newLoc = {
      id: Date.now().toString(),
      name: document.getElementById("adminName").value,
      type: document.getElementById("adminType").value,
      lat: -14.29,
      lng: 28.55,
      thumbnail: document.getElementById("adminThumbnail").value,
      image: document.getElementById("adminImage").value,
      mapsLink: document.getElementById("adminMapsLink").value,
      description: document.getElementById("adminDescription").value
    };
    locations.push(newLoc);
    saveLocations();
    renderGallery();
    renderManageLocations();
    loadAdminData();
    this.reset();
    showToast(`✅ "${newLoc.name}" added successfully!`);
  });
}

const eventForm = document.getElementById("eventForm");
if (eventForm) {
  eventForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const newEvent = {
      id: Date.now().toString(),
      title: document.getElementById("eventTitle").value,
      date: document.getElementById("eventDate").value,
      image: document.getElementById("eventImage").value,
      description: document.getElementById("eventDescription").value,
      location: document.getElementById("eventLocation").value
    };
    events.push(newEvent);
    saveEvents();
    renderSlideshow();
    startSlideshow();
    renderManageEvents();
    loadAdminData();
    this.reset();
    showToast(`✅ "${newEvent.title}" event added successfully!`);
  });
}

const teamForm = document.getElementById("teamForm");
if (teamForm) {
  teamForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const newMember = {
      id: Date.now().toString(),
      name: document.getElementById("teamName").value,
      role: document.getElementById("teamRole").value,
      image: document.getElementById("teamImage").value,
      bio: document.getElementById("teamBio").value,
      email: document.getElementById("teamEmail").value
    };
    teamMembers.push(newMember);
    saveTeam();
    renderManageTeam();
    loadAdminData();
    if (!isAdminLoggedIn) renderPublicTeam();
    this.reset();
    showToast(`✅ "${newMember.name}" added to team!`);
  });
}

const aboutForm = document.getElementById("aboutForm");
if (aboutForm) {
  aboutForm.addEventListener("submit", function(e) {
    e.preventDefault();
    aboutInfo = {
      content: document.getElementById("aboutContent").value,
      image: document.getElementById("aboutImage").value,
      contact: document.getElementById("contactInfo").value
    };
    saveAbout();
    if (!isAdminLoggedIn) renderPublicAbout();
    showToast("✅ About information saved successfully!");
  });
}

const settingsForm = document.getElementById("settingsForm");
if (settingsForm) {
  settingsForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const newPassword = document.getElementById("adminPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    
    if (newPassword && newPassword !== confirmPassword) {
      showToast("❌ Passwords do not match!", true);
      return;
    }
    
    settings = {
      logo: document.getElementById("siteLogoUrl").value,
      title: document.getElementById("siteTitle").value,
      subtitle: document.getElementById("siteSubtitle").value,
      adminPassword: newPassword || settings.adminPassword
    };
    saveSettings();
    updateSiteSettings();
    showToast("✅ Settings saved successfully!");
    if (newPassword) {
      showToast("⚠️ Password changed. Remember your new password!");
    }
  });
}

function renderManageLocations() {
  const container = document.getElementById("manageLocationsList");
  if (!container) return;
  container.innerHTML = locations.map(loc => `
    <div class="manage-item">
      <div class="manage-item-info">
        <h4><i class="fas fa-building"></i> ${loc.name}</h4>
        <p><strong>Type:</strong> ${loc.type}</p>
        <p>${loc.description.substring(0, 80)}...</p>
      </div>
      <button class="delete-btn" onclick="window.deleteLocation('${loc.id}')" title="Delete Location">
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>
  `).join("");
}

function renderManageEvents() {
  const container = document.getElementById("manageEventsList");
  if (!container) return;
  container.innerHTML = events.map(event => `
    <div class="manage-item">
      <div class="manage-item-info">
        <h4><i class="fas fa-calendar-alt"></i> ${event.title}</h4>
        <p><strong>Date:</strong> ${formatDate(event.date)}</p>
        <p>${event.description.substring(0, 80)}...</p>
      </div>
      <button class="delete-btn" onclick="window.deleteEvent('${event.id}')" title="Delete Event">
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>
  `).join("");
}

function renderManageTeam() {
  const container = document.getElementById("manageTeamList");
  if (!container) return;
  container.innerHTML = teamMembers.map(member => `
    <div class="manage-item">
      <div class="manage-item-info">
        <h4><i class="fas fa-user"></i> ${member.name}</h4>
        <p><strong>Role:</strong> ${member.role}</p>
        ${member.email ? `<p><strong>Email:</strong> ${member.email}</p>` : ""}
      </div>
      <button class="delete-btn" onclick="window.deleteTeamMember('${member.id}')" title="Delete Team Member">
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>
  `).join("");
}

// Global delete functions
window.deleteLocation = function(id) {
  const locName = locations.find(l => l.id === id)?.name;
  locations = locations.filter(l => l.id !== id);
  saveLocations();
  renderGallery();
  renderManageLocations();
  loadAdminData();
  showToast(`🗑️ "${locName}" has been deleted.`);
};

window.deleteEvent = function(id) {
  const eventTitle = events.find(e => e.id === id)?.title;
  events = events.filter(e => e.id !== id);
  saveEvents();
  renderSlideshow();
  renderManageEvents();
  loadAdminData();
  showToast(`🗑️ "${eventTitle}" event has been deleted.`);
};

window.deleteTeamMember = function(id) {
  const memberName = teamMembers.find(t => t.id === id)?.name;
  teamMembers = teamMembers.filter(t => t.id !== id);
  saveTeam();
  renderManageTeam();
  loadAdminData();
  if (!isAdminLoggedIn) renderPublicTeam();
  showToast(`🗑️ "${memberName}" has been removed from team.`);
};

// Lightbox close
if (closeBtn) {
  closeBtn.onclick = () => lightbox.classList.remove("show");
}
if (lightbox) {
  lightbox.onclick = (event) => { if (event.target === lightbox) lightbox.classList.remove("show"); };
}

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth <= 992 && !isAdminLoggedIn && fabMenu) {
    fabMenu.style.display = "block";
  } else if (fabMenu) {
    fabMenu.style.display = "none";
  }
});

// Initial check for mobile/tablet
if (window.innerWidth <= 992 && !isAdminLoggedIn && fabMenu) {
  fabMenu.style.display = "block";
}

// Set active home button on load
navButtons.forEach(btn => {
  if (btn.dataset.view === "home") {
    btn.classList.add("active");
  }
});

console.log("✅ Application loaded successfully!");
console.log("📊 Data status:", {
  locations: locations.length,
  events: events.length,
  teamMembers: teamMembers.length,
  adminPassword: "***hidden***"
});