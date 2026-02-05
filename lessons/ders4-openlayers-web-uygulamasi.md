# Ders 4: OpenLayers Web Uygulaması (30 dakika)

> **Eğitmen Ders Notu** - OpenLayers ile İnteraktif Harita Geliştirme

---

## 📋 Ders Özeti

| Özellik | Detay |
|---------|-------|
| **Süre** | 30 dakika |
| **Zorluk** | Orta |
| **Ön Gereksinim** | Ders 1-3 tamamlanmış, GeoServer layer yayında |
| **Hedef Kitle** | JavaScript temel bilgisi yararlı (ama zorunlu değil) |

---

## 🎯 Ders Hedefleri

Bu dersin sonunda katılımcılar şunları yapabilecek:

- [ ] Web uygulaması yapısını anlamak (HTML, CSS, JavaScript)
- [ ] OpenLayers temel kavramlarını öğrenmek (Map, View, Layer)
- [ ] WMS katmanını haritaya eklemek
- [ ] Koordinat sistemi dönüşümü yapmak (EPSG:4326 → EPSG:3857)
- [ ] Layer görünürlüğünü kontrol etmek
- [ ] GetFeatureInfo ile popup oluşturmak
- [ ] Harita merkezini ve zoom seviyesini değiştirmek

---

## 📚 Eğitmen Ön Hazırlık

### Ders Öncesi Teknik Kontroller (5 dakika önce)

```bash
# 1. Web container çalışıyor mu?
docker ps | findstr web
# Beklenen: "Up X minutes"

# 2. Web uygulaması erişilebilir mi?
curl http://localhost:8081
# Veya tarayıcıda: http://localhost:8081

# 3. GeoServer WMS servisi çalışıyor mu?
curl "http://localhost:8088/geoserver/ows?service=WMS&version=1.3.0&request=GetCapabilities"

# 4. Tarayıcı Developer Tools hazır mı?
# F12 tuşu ile açılmalı
```

### Materyal Hazırlığı

- [ ] **VS Code:** web/ klasörü açık
- [ ] **Tarayıcı:** 2 sekme (localhost:8081 + Developer Tools)
- [ ] **Slayt:** OpenLayers mimarisi
- [ ] **Kod Örnekleri:** Hazır (copy-paste için)

### Öğretim Stratejisi

**Pedagojik Yaklaşım:**

1. **Code Walkthrough:** Önce hazır kodu göster, sonra açıkla
2. **Live Coding:** Küçük değişiklikler yaparak öğret
3. **Immediate Feedback:** Her değişiklik sonrası tarayıcıyı yenile
4. **Visual Learning:** Harita üzerinde sonuçları göster

---

## 🎬 Ders Akışı (30 dakika)

### Giriş: OpenLayers Nedir? (3 dakika)

**🎤 Eğitmen Konuşması:**

> "Şimdiye kadar backend'i tamamladık: Docker, PostGIS, GeoServer. Artık frontend zamanı!
>
> OpenLayers, açık kaynaklı JavaScript harita kütüphanesidir. Google Maps API'ye alternatif, ama tamamen ücretsiz ve açık kaynak.
>
> 2006'dan beri geliştirilir, çok olgun bir proje. NASA, Dünya Bankası gibi büyük kuruluşlar kullanır."

**📊 Slayt Göster: OpenLayers vs Diğerleri**

```
┌────────────────────────────────────────────────────┐
│         HARITA KÜTÜPHANELERİ KARŞILAŞTIRMA        │
├────────────────────────────────────────────────────┤
│                                                    │
│  OpenLayers                                        │
│  ✅ Açık kaynak (BSD lisans)                       │
│  ✅ WMS, WFS, WCS desteği                          │
│  ✅ Çok sayıda koordinat sistemi                   │
│  ✅ Ağır ama güçlü                                 │
│                                                    │
│  Leaflet                                           │
│  ✅ Hafif ve basit                                 │
│  ❌ WMS desteği plugin ile                         │
│  ✅ Mobil uyumlu                                   │
│                                                    │
│  Google Maps API                                   │
│  ❌ Ücretli (sınırlı ücretsiz)                     │
│  ❌ Sadece Google tile'lar                         │
│  ✅ Çok popüler                                    │
│                                                    │
│  Bizim seçimimiz: OpenLayers                      │
│  Neden? WMS/WFS tam desteği!                      │
│                                                    │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen açıklar:**

> "OpenLayers'ı seçtik çünkü GeoServer ile mükemmel uyumlu. WMS, WFS protokollerini tam destekler."

---

### Adım 1: Web Uygulamasını Açma ve İnceleme (3 dakika)

**🎤 Eğitmen der:**

> "İlk adım: Uygulamayı açalım ve ne var ne yok görelim."

**👨‍🏫 Canlı Demo:**

**Tarayıcı aç:**
```
http://localhost:8081
```

**📊 Beklenen: Web Uygulaması**

```
┌────────────────────────────────────────────────────┐
│ 🗺️ Web GIS Vibe Workshop                          │
├──────────────┬─────────────────────────────────────┤
│              │                                     │
│ SIDEBAR      │         HARITA                     │
│              │                                     │
│ Layer Control│      🗺️ OpenStreetMap              │
│ ☑ OSM        │                                     │
│ ☑ WMS Katmanı│      (Ankara merkez)                │
│              │      Zoom: 12                       │
│ Tools        │                                     │
│ [📐 Çizim]   │                                     │
│ [📏 Ölçüm]   │                                     │
│              │                                     │
│              │      [+] [-] Zoom                   │
│              │      Scale: 1:50000                 │
│              │                                     │
└──────────────┴─────────────────────────────────────┘
```

**🎤 Eğitmen ekranı tanıtır:**

> "İki ana bölüm var:
> 
> **Sol: Sidebar (Kontrol Paneli)**
> - Layer Control: Katmanları aç/kapat
> - Tools: Çizim ve ölçüm araçları
>
> **Sağ: Harita**
> - OpenStreetMap base layer
> - Zoom kontrolleri
> - Ölçek çubuğu
>
> Şimdi kodu inceleyelim!"

**VS Code'u Aç:**

**Eğitmen VS Code'da proje klasörünü açar:**

```
web-gis-vibe-workshop/
  web/
    ├── index.html
    ├── style.css
    └── app.js
```

**🎤 Eğitmen der:**

> "3 dosyamız var. Modern web uygulamasının standart yapısı:
> - `index.html` → Yapı (Skeleton)
> - `style.css` → Görünüm (Styling)
> - `app.js` → Mantık (Logic)"

---

### Adım 2: index.html İnceleme (5 dakika)

**🎤 Eğitmen der:**

> "`index.html` dosyasını açalım. HTML yapısını göreceğiz."

**VS Code'da index.html açık:**

**Eğitmen scroll ederek gösterir (satır satır değil, bölümler halinde):**

**Bölüm 1: HTML Head**

```html
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web GIS Vibe Workshop</title>
    
    <!-- OpenLayers CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v7.5.2/ol.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="style.css">
</head>
```

**🎤 Eğitmen açıklar:**

> "**Line 7-8:** OpenLayers CSS dosyasını CDN'den yüklüyoruz.
> 
> CDN = Content Delivery Network. Dosyayı hızlı indirmek için.
> 
> Versiyon: 7.5.2 (Şubat 2024 itibarıyla stabil)"

**Bölüm 2: Body Yapısı**

```html
<body>
    <!-- Sidebar -->
    <div id="sidebar">
        <h2>🗺️ Web GIS Vibe</h2>
        
        <!-- Layer Control -->
        <div class="control-group">
            <h3>Layer Control</h3>
            <label>
                <input type="checkbox" id="osmLayer" checked>
                OpenStreetMap
            </label>
            <label>
                <input type="checkbox" id="wmsLayer" checked>
                WMS Katmanı (PostGIS)
            </label>
        </div>
        
        <!-- Tools -->
        <div class="control-group">
            <h3>Tools</h3>
            <button id="drawBtn" class="tool-btn">
                <span class="icon">📐</span>
                Çizim (Polygon)
            </button>
            <button id="measureBtn" class="tool-btn">
                <span class="icon">📏</span>
                Ölçüm (Line)
            </button>
            <button id="clearBtn" class="tool-btn danger">
                <span class="icon">🗑️</span>
                Temizle
            </button>
        </div>
    </div>
    
    <!-- Map Container -->
    <div id="map" class="map"></div>
    
    <!-- Popup -->
    <div id="popup" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content"></div>
    </div>
    
    <!-- OpenLayers JS -->
    <script src="https://cdn.jsdelivr.net/npm/ol@v7.5.2/dist/ol.js"></script>
    
    <!-- Custom JS -->
    <script src="app.js"></script>
</body>
```

**🎤 Eğitmen açıklar:**

> "**Line 3-32:** Sidebar yapısı. Checkbox'lar, butonlar.
> 
> **Line 35:** `<div id="map">` → Haritanın render edileceği yer!
> 
> **Line 38-41:** Popup elementi. Şu an gizli, JavaScript ile göstereceğiz.
> 
> **Line 44:** OpenLayers JavaScript dosyası (CDN)
> 
> **Line 47:** Bizim `app.js` dosyamız. Burada sihir başlayacak!"

**⚠️ Kritik Nokta:**

**🎤 Eğitmen vurgular:**

> "`<div id='map'>` önemli! OpenLayers bu ID'yi kullanarak haritayı oluşturacak. ID değişirse harita görünmez!"

---

### Adım 3: style.css İnceleme (3 dakika)

**🎤 Eğitmen der:**

> "CSS'e hızlıca bakalım. Görsel tasarımdan sorumlu."

**VS Code'da style.css açık:**

**Eğitmen önemli kısımları gösterir:**

```css
/* CSS Variables */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --sidebar-width: 280px;
}

/* Layout */
body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
}

#sidebar {
    width: var(--sidebar-width);
    background: var(--primary-color);
    color: white;
    overflow-y: auto;
}

#map {
    flex: 1;
    height: 100vh;
}
```

**🎤 Eğitmen açıklar:**

> "**Line 2-5:** CSS değişkenleri. Renkleri tek yerden değiştirebiliriz.
> 
> **Line 9:** Flexbox layout. Modern CSS'in gücü!
> 
> **Line 15-18:** Sidebar sol tarafta, sabit genişlik (280px).
> 
> **Line 20-23:** Harita sağda, kalan tüm alanı kaplar (`flex: 1`)."

**💡 Pratik Örnek:**

**🎤 Eğitmen der:**

> "Rengi değiştirmek isterseniz:"

```css
:root {
    --primary-color: #1a252f; /* Daha koyu */
}
```

**Tarayıcıyı yenile (F5) → Sidebar koyu renk olur**

---

### Adım 4: app.js İnceleme - CONFIG (5 dakika)

**🎤 Eğitmen der:**

> "Şimdi asıl işler başlıyor! `app.js` dosyasını açalım."

**VS Code'da app.js açık:**

**Bölüm 1: CONFIG Nesnesi**

```javascript
// ═══════════════════════════════════════════════════
//  YAPIFLANDIRMA (CONFIG)
// ═══════════════════════════════════════════════════

const CONFIG = {
    geoserverUrl: 'http://localhost:8088/geoserver',  // Port 8088 çakışma önü için
    workspace: 'workshop',
    layerName: 'points',
    center: [32.8597, 39.9334], // Ankara [lon, lat]
    zoom: 12
};
```

**🎤 Eğitmen açıklar:**

> "`CONFIG` objesi tüm ayarları tutar. Tek yerden değiştirebiliriz.
> 
> **geoserverUrl:** GeoServer adresi
> **workspace:** Ders 3'te oluşturduğumuz workspace
> **layerName:** Yayınladığımız layer (points)
> **center:** Harita merkezi (Ankara)
> **zoom:** Zoom seviyesi (1-20 arası, 12 şehir seviyesi)"

**💡 Eğitmen der:**

> "Haritayı İstanbul'a taşımak isterseniz:"

```javascript
center: [29.0, 41.02], // İstanbul [lon, lat]
zoom: 11
```

---

### Adım 5: app.js İnceleme - Layers (7 dakika)

**Bölüm 2: OpenStreetMap Layer**

```javascript
// ═══════════════════════════════════════════════════
//  BASE LAYER (OpenStreetMap)
// ═══════════════════════════════════════════════════

const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true
});
```

**🎤 Eğitmen açıklar:**

> "OpenLayers'da her şey **nesne** (object).
> 
> `ol.layer.Tile` → Tile (karo) katmanı oluşturur.
> `ol.source.OSM` → OpenStreetMap tile kaynağı.
> `visible: true` → Başlangıçta görünür."

**Bölüm 3: WMS Layer (ÇOK ÖNEMLİ!)**

```javascript
// ═══════════════════════════════════════════════════
//  WMS LAYER (GeoServer)
// ═══════════════════════════════════════════════════

const wmsLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: `${CONFIG.geoserverUrl}/ows`,
        params: {
            'LAYERS': `${CONFIG.workspace}:${CONFIG.layerName}`,
            'TILED': true
        },
        serverType: 'geoserver'
    }),
    visible: true
});
```

**🎤 Eğitmen satır satır açıklar:**

**Line 1: `ol.layer.Tile`**

> "Yine tile layer, ama bu sefer WMS kaynağından."

**Line 2: `ol.source.TileWMS`**

> "WMS tile kaynağı. GeoServer'dan tile'lar çeker."

**Line 3: `url`**

> "GeoServer WMS endpoint'i:
> `http://localhost:8088/geoserver/ows`
> 
> Template literal kullanıyoruz (backtick)."

**Line 4-6: `params`**

> "WMS parametreleri:
> 
> **LAYERS:** `workshop:points` (workspace:layer)
> **TILED:** `true` (tile cache kullan, performans)"

**Line 7: `serverType`**

> "`geoserver` yazınca OpenLayers GeoServer'a özel optimizasyonlar yapar."

**⚠️ Kritik Nokta:**

**Eğitmen vurgular:**

> "Bu kod sayesinde GeoServer'daki layer haritaya eklenir! Ders 3'teki emeğimiz buraya bağlandı!"

**Bölüm 4: Map Oluşturma**

```javascript
// ═══════════════════════════════════════════════════
//  MAP (Harita)
// ═══════════════════════════════════════════════════

const map = new ol.Map({
    target: 'map',
    layers: [osmLayer, wmsLayer],
    view: new ol.View({
        center: ol.proj.fromLonLat(CONFIG.center),
        zoom: CONFIG.zoom
    })
});
```

**🎤 Eğitmen açıklar:**

**Line 1: `ol.Map`**

> "Harita nesnesi. En üst seviye container."

**Line 2: `target: 'map'`**

> "`<div id='map'>` elementini bulur. Haritayı oraya render eder."

**Line 3: `layers: [osmLayer, wmsLayer]`**

> "Katmanlar array olarak verilir. **Sıra önemli!**
> 
> İlk eleman en altta (OSM), son eleman en üstte (WMS)."

**Line 4: `ol.View`**

> "Görünüm ayarları: merkez, zoom, rotasyon vb."

**Line 5: `ol.proj.fromLonLat()`** (ÇOK ÖNEMLİ!)

> "⚠️ Koordinat dönüşümü!
> 
> **Girdi:** [lon, lat] EPSG:4326 (WGS84)
> **Çıktı:** [x, y] EPSG:3857 (Web Mercator)
> 
> Neden? OpenLayers dahili olarak Web Mercator kullanır!
> 
> `[29.0, 41.02]` (İstanbul WGS84)
> →
> `[3227858.97, 5009377.09]` (Web Mercator)"

**📊 Slayt Göster: Koordinat Sistemleri**

```
┌────────────────────────────────────────────────────┐
│         KOORDİNAT SİSTEMLERİ                       │
├────────────────────────────────────────────────────┤
│                                                    │
│  EPSG:4326 (WGS84)                                │
│  ├─ Coğrafi koordinatlar (derece)                 │
│  ├─ Lon: -180 → +180                              │
│  ├─ Lat: -90 → +90                                │
│  └─ GPS, PostGIS varsayılan                       │
│                                                    │
│  EPSG:3857 (Web Mercator)                         │
│  ├─ Projeksiyon koordinatları (metre)             │
│  ├─ X: -20037508 → +20037508                      │
│  ├─ Y: -20037508 → +20037508                      │
│  └─ Google Maps, OpenLayers varsayılan            │
│                                                    │
│  Dönüşüm Fonksiyonları:                           │
│  ol.proj.fromLonLat([lon,lat]) → [x,y]           │
│  ol.proj.toLonLat([x,y]) → [lon,lat]             │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

### Adım 6: Layer Control (Checkbox) (4 dakika)

**🎤 Eğitmen der:**

> "Sidebar'daki checkbox'lar nasıl çalışıyor? Event listener ekleyelim."

**Kod:**

```javascript
// ═══════════════════════════════════════════════════
//  LAYER CONTROL
// ═══════════════════════════════════════════════════

document.getElementById('osmLayer').onchange = function(e) {
    osmLayer.setVisible(e.target.checked);
};

document.getElementById('wmsLayer').onchange = function(e) {
    wmsLayer.setVisible(e.target.checked);
};
```

**🎤 Eğitmen açıklar:**

**Line 1:**

> "`getElementById('osmLayer')` → HTML'deki checkbox'ı bulur"

**Line 2:**

> "`onchange` event'i → Checkbox değişince tetiklenir"

**Line 3:**

> "`e.target.checked` → true/false (işaretli mi?)
> `setVisible()` → Layer görünürlüğünü değiştirir"

**👨‍🏫 Canlı Test:**

**Eğitmen tarayıcıda:**

1. WMS Katmanı checkbox'ını kaldır → Noktalar kaybolur
2. Tekrar işaretle → Noktalar geri gelir

**🎤 Eğitmen der:**

> "Gördünüz mü? Checkbox ile layer aç/kapat! JavaScript event handling!"

---

### Adım 7: GetFeatureInfo (Popup) (5 dakika)

**🎤 Eğitmen der:**

> "Noktaya tıklayınca popup açılması. Bu, WMS GetFeatureInfo isteği ile yapılır."

**Kod (uzun, adım adım göster):**

```javascript
// ═══════════════════════════════════════════════════
//  POPUP (GetFeatureInfo)
// ═══════════════════════════════════════════════════

// Popup overlay
const popup = new ol.Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
map.addOverlay(popup);

// Popup closer
document.getElementById('popup-closer').onclick = function() {
    popup.setPosition(undefined);
    return false;
};

// Map click event
map.on('singleclick', function(evt) {
    const viewResolution = map.getView().getResolution();
    const url = wmsLayer.getSource().getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        'EPSG:3857',
        {'INFO_FORMAT': 'application/json'}
    );
    
    if (url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.features.length > 0) {
                    const feature = data.features[0];
                    const props = feature.properties;
                    
                    // Popup içeriği oluştur
                    const content = `
                        <h3>${props.name}</h3>
                        <p><strong>Tür:</strong> ${props.type}</p>
                        <p>${props.description}</p>
                    `;
                    
                    document.getElementById('popup-content').innerHTML = content;
                    popup.setPosition(evt.coordinate);
                } else {
                    popup.setPosition(undefined);
                }
            })
            .catch(err => {
                console.error('GetFeatureInfo hatası:', err);
            });
    }
});
```

**🎤 Eğitmen bölümler halinde açıklar:**

**Bölüm 1: Overlay (Lines 1-12)**

> "`ol.Overlay` → HTML elementini harita üzerine yerleştirir.
> 
> `element: document.getElementById('popup')` → HTML'deki popup div'i
> `autoPan: true` → Popup ekran dışındaysa harita kayar"

**Bölüm 2: Popup Closer (Lines 14-17)**

> "Popup'ın X butonu. Tıklanınca `setPosition(undefined)` → gizle"

**Bölüm 3: Map Click Event (Lines 19-47)**

> "Haritaya tıklanınca tetiklenir."

**Line 20-25:**

> "`getFeatureInfoUrl()` → GeoServer'a GetFeatureInfo isteği URL'si oluşturur.
> 
> Parametreler:
> - `evt.coordinate` → Tıklanan nokta (Web Mercator)
> - `viewResolution` → Mevcut çözünürlük
> - `'EPSG:3857'` → Koordinat sistemi
> - `'application/json'` → JSON yanıt iste"

**Line 27-46:**

> "`fetch(url)` → HTTP isteği gönder (modern JavaScript, AJAX yerine)
> `.then(response => response.json())` → Yanıtı JSON'a çevir
> `.then(data => ...)` → Veriyle işlem yap"

**Line 31-35:**

> "`data.features[0]` → İlk feature'ı al
> `feature.properties` → Öznitelikler (name, type, description)"

**Line 37-41:**

> "Popup HTML içeriği oluştur. Template literal kullanıyoruz."

**Line 43:**

> "`popup.setPosition(evt.coordinate)` → Popup'ı tıklanan noktaya yerleştir"

**👨‍🏫 Canlı Test:**

**Eğitmen tarayıcıda:**

1. Haritada bir noktaya tıkla (İstanbul'a zoom yap önce)
2. Popup açılır: "Galata Kulesi, Tür: Tarihi, ..."
3. X butonuna tıkla → Popup kapanır

**🎤 Eğitmen der:**

> "GetFeatureInfo çalışıyor! GeoServer'dan JSON yanıt geldi, popup'ta gösterdik!"

**⚠️ Developer Tools Göster:**

**F12 → Network sekmesi:**

**GetFeatureInfo isteği:**

```
http://localhost:8088/geoserver/wms?
  SERVICE=WMS&
  VERSION=1.1.1&
  REQUEST=GetFeatureInfo&
  LAYERS=workshop:points&
  QUERY_LAYERS=workshop:points&
  INFO_FORMAT=application/json&
  FEATURE_COUNT=50&
  X=145&Y=276&
  WIDTH=256&HEIGHT=256&
  SRS=EPSG:3857&
  BBOX=...
```

**Response (JSON):**

```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "id": "points.2",
    "properties": {
      "id": 2,
      "name": "Galata Kulesi",
      "type": "Tarihi",
      "description": "Beyoğlu'nda yer alan..."
    }
  }]
}
```

---

### Adım 8: Harita Merkezini İstanbul'a Taşıma (3 dakika)

**🎤 Eğitmen der:**

> "Son adım: Haritayı İstanbul'a taşıyalım. Noktalarımız orada!"

**VS Code'da app.js:**

**Eski:**
```javascript
const CONFIG = {
    center: [32.8597, 39.9334], // Ankara
    zoom: 12
};
```

**Yeni:**
```javascript
const CONFIG = {
    center: [29.0, 41.02], // İstanbul
    zoom: 11
};
```

**Dosyayı kaydet (Ctrl+S)**

**Tarayıcıyı yenile (F5)**

**📊 Beklenen:**

Harita İstanbul'a kayar, 17 nokta görünür (zoom out gerekebilir)

**🎤 Eğitmen der:**

> "Harika! Artık İstanbul'daki tüm noktaları görüyoruz!"

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes İstanbul'u görüyor mu? 17 nokta var mı? Noktaya tıklayınca popup açılıyor mu?"

---

### Kapanış ve Özet (2 dakika)

**🎤 Eğitmen der:**

> "Tebrikler! 30 dakikada tam çalışan bir Web CBS uygulaması geliştirdik!"

**📊 Slayt: Ders 4 Özeti**

```
✅ TAMAMLANAN GÖREVLER
─────────────────────────────────────────
✓ Web uygulaması yapısı anlaşıldı
✓ OpenLayers temel kavramları öğrenildi
✓ WMS katmanı haritaya eklendi
✓ Koordinat dönüşümü yapıldı (4326→3857)
✓ Layer görünürlük kontrolü eklendi
✓ GetFeatureInfo ile popup oluşturuldu
✓ Harita merkezi İstanbul'a taşındı

📚 ÖĞRENİLEN KAVRAMLAR
─────────────────────────────────────────
• OpenLayers nesneleri (Map, View, Layer, Source)
• ol.layer.Tile ve ol.source.TileWMS
• ol.proj.fromLonLat() dönüşümü
• EPSG:4326 vs EPSG:3857
• Event handling (onchange, onclick)
• Fetch API (modern AJAX)
• ol.Overlay (popup)
• GetFeatureInfo isteği

🔑 KRİTİK NOKTALAR
─────────────────────────────────────────
❗ target: 'map' → HTML element ID
❗ ol.proj.fromLonLat() → Koordinat dönüşümü
❗ Layer sırası önemli (array'de)
❗ INFO_FORMAT: 'application/json'
```

**🎤 Eğitmen der:**

> "Sonraki derste çizim ve ölçüm araçları ekleyeceğiz. Polygon çizme, mesafe ölçme!"

---

## 📋 Eğitmen Kontrol Listesi

### Ders Sonunda

- [ ] Tüm katılımcılar haritayı görüyor
- [ ] İstanbul merkez, 17 nokta görünür
- [ ] Checkbox'lar çalışıyor (layer aç/kapat)
- [ ] Popup çalışıyor (noktaya tıklama)

### Yaygın Sorunlar

| Sorun | Çözüm |
|-------|-------|
| Harita boş | `target: 'map'` ID doğru mu? |
| WMS layer görünmüyor | GeoServer çalışıyor mu? Layer yayında mı? |
| Koordinat hatası | `ol.proj.fromLonLat()` kullan |
| CORS hatası | GeoServer CORS ayarlarını kontrol et |

---

## 🔧 Troubleshooting Rehberi

### 1. Harita Görünmüyor (Boş Sayfa)

**F12 → Console:**

```
Uncaught TypeError: Cannot read property 'ol' of undefined
```

**Çözüm:** OpenLayers CDN yüklenmemiş. İnternet bağlantısı kontrol et.

```html
<!-- Doğru CDN URL'si -->
<script src="https://cdn.jsdelivr.net/npm/ol@v7.5.2/dist/ol.js"></script>
```

### 2. WMS Layer Görünmüyor

**F12 → Network → wms isteği 404:**

**Çözüm:** GeoServer URL veya layer adı yanlış.

```javascript
// Doğru:
url: 'http://localhost:8080/geoserver/wms',
params: {
    'LAYERS': 'workshop:points' // workspace:layer
}
```

### 3. CORS Hatası

**F12 → Console:**

```
Access to fetch at 'http://localhost:8080/geoserver/wms' blocked by CORS
```

**Çözüm:** GeoServer CORS ayarları.

GeoServer Admin → Settings → Global → Cross-Origin Resource Sharing (CORS):

```
Enable CORS: ☑
Allowed Origins: http://localhost:8081
```

---

## 📚 Ek Kaynaklar

### OpenLayers API Referansı

| Sınıf | Açıklama | Dokümantasyon |
|-------|----------|---------------|
| `ol.Map` | Harita container | https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html |
| `ol.View` | Görünüm (center, zoom) | https://openlayers.org/en/latest/apidoc/module-ol_View-View.html |
| `ol.layer.Tile` | Tile katmanı | https://openlayers.org/en/latest/apidoc/module-ol_layer_Tile-TileLayer.html |
| `ol.source.TileWMS` | WMS kaynağı | https://openlayers.org/en/latest/apidoc/module-ol_source_TileWMS-TileWMS.html |
| `ol.Overlay` | HTML overlay | https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html |

---

**🎉 Başarılar!**
