import { detecIcon, detecType, setStorage } from "./helper";

const form = document.querySelector("form");
const list = document.querySelector("ul");

form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);

let map;
let coords = [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let layerGroup = [];

// Kullanıcı konumu
navigator.geolocation.getCurrentPosition(
  loadMap,
  console.log("Kullanıcı kabul etmedi ")
);

function onMapClick(e) {
  form.style.display = "flex";
  coords = [e.latlng.lat, e.latlng.lng];
  console.log(coords);
}

function loadMap(e) {
  // Harita kurulumu
  map = new L.map("map").setView([e.coords.latitude, e.coords.longitude], 10);
  L.control;

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  layerGroup = L.layerGroup().addTo(map);

  renderNoteList(notes);

  map.on("click", onMapClick);
}
// Ekrana marker basma
function renderMarker(item) {
  console.log(item);
  
  L.marker(item.coords, { icon: detecIcon(item.status) })
    
    .addTo(layerGroup)
    
    .bindPopup(`${item.desc}`);
}

// Form gönderildiğinde çalışır
function handleSubmit(e) {
  e.preventDefault();
  console.log(e);
  const desc = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  
  notes.push({ id: new Date().getTime(), desc, date, status, coords });
  console.log(notes);
  
  setStorage(notes);
  
  renderNoteList(notes);

  
  form.style.display = "none";
}

function renderNoteList(item) {
  list.innerHTML = "";

  
  layerGroup.clearLayers();
  item.forEach((item) => {
    const listElement = document.createElement("li");

    listElement.dataset.id = item.id;
    listElement.innerHTML = `
    
    <div>
        <p>${item.desc}</p>
        <p><span>Tarih:</span>${item.date}</p>
        <p><span>Durum:</span>${detecType(item.status)}</p>
    </div>
    <i class="bi bi-x" id="delete"></i>
    <i class="bi bi-airplane-fill" id="fly"></i>
    `;
    list.insertAdjacentElement("afterbegin", listElement);

    // Ekrana marker basma
    renderMarker(item);
  });
}

function handleClick(e) {
  console.log(e.target.id);
 
  const id = e.target.parentElement.dataset.id;
  console.log(notes);
  if (e.target.id === "delete") {
    console.log("tıklanıldı");
    
    notes = notes.filter((note) => note.id != id);
    console.log(notes);

   
    setStorage(notes);
   
    renderNoteList(notes);
  }

  if (e.target.id === "fly") {
    const note = notes.find((note) => note.id == id);
    map.flyTo(note.coords);
  }
}
