/**
 * Web GIS Workshop - OpenLayers Application
 * Docker, PostGIS, GeoServer ve OpenLayers ile interaktif harita uygulaması
 */

// ============================================
// Configuration
// ============================================

const CONFIG = {
    // GeoServer ayarları
    geoserver: {
        url: 'http://localhost:8080/geoserver',
        workspace: 'workshop',
        layer: 'points'
    },
    // Harita başlangıç ayarları (İstanbul merkez)
    map: {
        center: [28.9784, 41.0082], // İstanbul koordinatları [lon, lat] - Galata Köprüsü
        zoom: 12,
        minZoom: 4,
        maxZoom: 19
    }
};

// ============================================
// Map Initialization
// ============================================

// Popup overlay için elementler
const popupContainer = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');
const popupCloser = document.getElementById('popup-closer');

// Popup overlay oluştur
const popupOverlay = new ol.Overlay({
    element: popupContainer,
    autoPan: {
        animation: {
            duration: 250
        }
    }
});

// Popup kapatma
popupCloser.onclick = function () {
    popupOverlay.setPosition(undefined);
    popupCloser.blur();
    return false;
};

// ============================================
// Layers
// ============================================

// OSM Base Layer
const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: 'OpenStreetMap'
});

// WMS Layer (GeoServer)
const wmsLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: `${CONFIG.geoserver.url}/wms`,
        params: {
            'LAYERS': `${CONFIG.geoserver.workspace}:${CONFIG.geoserver.layer}`,
            'TILED': true,
            'FORMAT': 'image/png',
            'TRANSPARENT': true
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
    }),
    visible: true,
    title: 'WMS Points'
});

// Vector source ve layer (çizim için)
const drawSource = new ol.source.Vector();

const drawLayer = new ol.layer.Vector({
    source: drawSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(79, 70, 229, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#4f46e5',
            width: 3
        }),
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: '#4f46e5'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffffff',
                width: 2
            })
        })
    }),
    visible: true,
    title: 'Çizim Katmanı'
});

// ============================================
// Map Instance
// ============================================

const map = new ol.Map({
    target: 'map',
    layers: [osmLayer, wmsLayer, drawLayer],
    overlays: [popupOverlay],
    view: new ol.View({
        center: ol.proj.fromLonLat(CONFIG.map.center),
        zoom: CONFIG.map.zoom,
        minZoom: CONFIG.map.minZoom,
        maxZoom: CONFIG.map.maxZoom
    }),
    controls: ol.control.defaults.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.FullScreen()
    ])
});

// ============================================
// Interactions
// ============================================

let currentDraw = null;

// Polygon çizim interaction
const drawPolygon = new ol.interaction.Draw({
    source: drawSource,
    type: 'Polygon',
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(79, 70, 229, 0.3)'
        }),
        stroke: new ol.style.Stroke({
            color: '#4f46e5',
            lineDash: [10, 10],
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: '#4f46e5'
            })
        })
    })
});

// Line çizim interaction (ölçüm için)
const drawLine = new ol.interaction.Draw({
    source: drawSource,
    type: 'LineString',
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#06b6d4',
            lineDash: [10, 10],
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: '#06b6d4'
            })
        })
    })
});

// Point çizim interaction
const drawPoint = new ol.interaction.Draw({
    source: drawSource,
    type: 'Point'
});

// ============================================
// Event Handlers - Drawing
// ============================================

// Polygon çizim tamamlandığında
drawPolygon.on('drawend', function (event) {
    const geometry = event.feature.getGeometry();
    const area = ol.sphere.getArea(geometry);
    const areaKm = (area / 1000000).toFixed(4);

    console.log(`Çizilen alan: ${areaKm} km²`);
    document.getElementById('lastArea').textContent = `${areaKm} km²`;

    // Aktif aracı devre dışı bırak
    deactivateDrawing();
});

// Line çizim tamamlandığında
drawLine.on('drawend', function (event) {
    const geometry = event.feature.getGeometry();
    const length = ol.sphere.getLength(geometry);
    const lengthKm = (length / 1000).toFixed(2);

    console.log(`Ölçülen mesafe: ${lengthKm} km`);
    document.getElementById('lastDistance').textContent = `${lengthKm} km`;

    alert(`📏 Mesafe: ${lengthKm} km`);

    // Aktif aracı devre dışı bırak
    deactivateDrawing();
});

// Point çizim tamamlandığında
drawPoint.on('drawend', function (event) {
    const geometry = event.feature.getGeometry();
    const coords = ol.proj.toLonLat(geometry.getCoordinates());

    console.log(`Nokta eklendi: [${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}]`);

    // Aktif aracı devre dışı bırak
    deactivateDrawing();
});

// ============================================
// Drawing Control Functions
// ============================================

function activateDrawing(drawInteraction, buttonId) {
    // Önceki çizimi devre dışı bırak
    deactivateDrawing();

    // Yeni çizimi aktifleştir
    currentDraw = drawInteraction;
    map.addInteraction(currentDraw);

    // Buton stilini güncelle
    document.getElementById(buttonId).classList.add('active');
}

function deactivateDrawing() {
    if (currentDraw) {
        map.removeInteraction(currentDraw);
        currentDraw = null;
    }

    // Tüm butonlardan active class'ını kaldır
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// ============================================
// Event Handlers - UI Controls
// ============================================

// Polygon çizim butonu
document.getElementById('drawPolygonBtn').onclick = function () {
    activateDrawing(drawPolygon, 'drawPolygonBtn');
};

// Line çizim butonu (ölçüm)
document.getElementById('drawLineBtn').onclick = function () {
    activateDrawing(drawLine, 'drawLineBtn');
};

// Point çizim butonu
document.getElementById('drawPointBtn').onclick = function () {
    activateDrawing(drawPoint, 'drawPointBtn');
};

// Temizle butonu
document.getElementById('clearBtn').onclick = function () {
    drawSource.clear();
    deactivateDrawing();
    document.getElementById('lastDistance').textContent = '-';
    document.getElementById('lastArea').textContent = '-';
    document.getElementById('infoPanel').innerHTML = '<p class="info-hint">Haritada bir noktaya tıklayarak bilgi alabilirsiniz.</p>';
    popupOverlay.setPosition(undefined);
    console.log('Tüm çizimler temizlendi.');
};

// Layer görünürlük kontrolleri
document.getElementById('wmsLayer').onchange = function (e) {
    wmsLayer.setVisible(e.target.checked);
};

document.getElementById('osmLayer').onchange = function (e) {
    osmLayer.setVisible(e.target.checked);
};

document.getElementById('drawLayer').onchange = function (e) {
    drawLayer.setVisible(e.target.checked);
};

// ============================================
// Feature Info (WMS GetFeatureInfo)
// ============================================

map.on('singleclick', function (evt) {
    // Eğer çizim modu aktifse, feature info gösterme
    if (currentDraw) return;

    const viewResolution = map.getView().getResolution();
    const url = wmsLayer.getSource().getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        'EPSG:3857',
        {
            'INFO_FORMAT': 'application/json',
            'FEATURE_COUNT': 10
        }
    );

    if (url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.features && data.features.length > 0) {
                    const feature = data.features[0];
                    const props = feature.properties;

                    // Popup içeriğini oluştur
                    popupContent.innerHTML = `
                        <h3>${props.name || 'Bilinmeyen'}</h3>
                        <p>${props.description || ''}</p>
                        <span class="popup-type">${props.type || 'Tip belirtilmemiş'}</span>
                    `;

                    // Popup'ı göster
                    popupOverlay.setPosition(evt.coordinate);

                    // Info panelini güncelle
                    updateInfoPanel(props);
                } else {
                    popupOverlay.setPosition(undefined);
                }
            })
            .catch(error => {
                console.error('Feature info hatası:', error);
            });
    }
});

// Info panelini güncelle
function updateInfoPanel(props) {
    const infoPanel = document.getElementById('infoPanel');
    infoPanel.innerHTML = `
        <div class="feature-info">
            <div class="info-row">
                <span class="label">İsim:</span>
                <span class="value">${props.name || '-'}</span>
            </div>
            <div class="info-row">
                <span class="label">Tip:</span>
                <span class="value">${props.type || '-'}</span>
            </div>
            ${props.description ? `
            <div class="info-row">
                <span class="label">Açıklama:</span>
                <span class="value">${props.description}</span>
            </div>
            ` : ''}
        </div>
    `;
}

// ============================================
// Mouse Coordinate Display
// ============================================

map.on('pointermove', function (evt) {
    if (evt.dragging) return;

    const coords = ol.proj.toLonLat(evt.coordinate);
    const coordsText = `${coords[0].toFixed(4)}°, ${coords[1].toFixed(4)}°`;
    document.getElementById('mouseCoords').textContent = coordsText;
});

// ============================================
// Zoom Level Display
// ============================================

map.getView().on('change:resolution', function () {
    const zoom = Math.round(map.getView().getZoom());
    document.getElementById('zoomLevel').textContent = zoom;
});

// İlk yüklemede zoom seviyesini göster
document.getElementById('zoomLevel').textContent = CONFIG.map.zoom;

// ============================================
// Console Welcome Message
// ============================================

console.log('%c🌍 Web GIS Workshop', 'font-size: 24px; font-weight: bold; color: #4f46e5;');
console.log('%cDocker + PostGIS + GeoServer + OpenLayers', 'font-size: 14px; color: #06b6d4;');
console.log('-------------------------------------------');
console.log('Kullanılabilir nesneler:');
console.log('  - map: OpenLayers harita nesnesi');
console.log('  - wmsLayer: GeoServer WMS katmanı');
console.log('  - drawSource: Çizim vektör kaynağı');
console.log('  - CONFIG: Yapılandırma ayarları');
console.log('-------------------------------------------');
