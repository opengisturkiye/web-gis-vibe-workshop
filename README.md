# 🌍 Web GIS Vibe Coding Workshop

> Docker, PostGIS, GeoServer ve OpenLayers ile **uçtan uca Web CBS uygulaması** geliştirme rehberi

---

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Gereksinimler](#-gereksinimler)
- [Kurulum](#-kurulum)
- [Proje Yapısı](#-proje-yapısı)
- [Adım Adım Kullanım](#-adım-adım-kullanım)
- [GeoServer Yapılandırması](#-geoserver-yapılandırması)
- [Uygulama Özellikleri](#-uygulama-özellikleri)
- [Sorun Giderme](#-sorun-giderme)
- [İleri Seviye](#-i̇leri-seviye)
- [Katkıda Bulunma](#-katkıda-bulunma)

---

## 🎯 Proje Hakkında

Bu workshop, modern Web CBS (Coğrafi Bilgi Sistemleri) teknolojilerini kullanarak **interaktif harita uygulaması** geliştirmeyi öğretir.

### Ne Öğreneceksiniz?

- 🐳 **Docker** ile mikroservis mimarisi
- 🗄️ **PostgreSQL + PostGIS** ile mekansal veri yönetimi
- 🗺️ **GeoServer** ile harita servisleri (WMS/WFS)
- 📍 **OpenLayers** ile interaktif harita arayüzü
- ✏️ Çizim, ölçüm ve sayısallaştırma araçları

### Teknoloji Stack

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| Docker | 20.10+ | Container yönetimi |
| PostgreSQL | 15 | Veritabanı |
| PostGIS | 3.3 | Mekansal veri desteği |
| GeoServer | 2.24.1 | Harita servisleri |
| OpenLayers | 7.5.2 | Frontend harita kütüphanesi |
| Nginx | Alpine | Web sunucusu |

---

## ⚙️ Gereksinimler

### Zorunlu
- ✅ **Docker Desktop** (v20.10 veya üzeri)
- ✅ **Windows için WSL2** aktif (Windows kullanıcıları için)
- ✅ **4GB+ RAM** (önerilen 8GB)
- ✅ **5GB+ Disk Alanı**

### Önerilen
- 💻 **VS Code/Antigravity/Cursor IDE** veya benzeri kod editörü
- 🔌 **PostgreSQL Client** (DBeaver, pgAdmin, vb.)
- 🌐 **Modern Tarayıcı** (Chrome, Firefox, Edge)

### Kurulum Kontrolleri

```bash
# Docker versiyonunu kontrol et
docker --version
# Çıktı: Docker version 20.10.x veya üzeri

# Docker Compose kontrol
docker compose version
# Çıktı: Docker Compose version v2.x.x

# Docker çalışıyor mu?
docker ps
```

---

## 🚀 Kurulum

### 1. Projeyi İndirin

```bash
git clone https://github.com/opengisturkiye/web-gis-vibe-workshop.git
cd web-gis-vibe-workshop
```

### 2. Container'ları Başlatın

```bash
# Tüm servisleri arka planda başlat
docker compose up -d

# Logları takip edin (opsiyonel)
docker compose logs -f
```

### 3. Servislerin Hazır Olmasını Bekleyin

```bash
# Container durumlarını kontrol edin
docker ps

# Çıktı şöyle görünmeli:
# CONTAINER ID   IMAGE                     STATUS         PORTS
# xxxxx          postgis/postgis:15-3.3    Up 2 minutes   0.0.0.0:5432->5432/tcp
# xxxxx          kartoza/geoserver:2.24.1  Up 2 minutes   0.0.0.0:8080->8080/tcp
# xxxxx          nginx:alpine              Up 2 minutes   0.0.0.0:8081->80/tcp
```

⏱️ **Not:** GeoServer'ın tamamen başlaması 2-3 dakika sürebilir.

### 4. Servislere Erişin

| Servis | URL | Kullanıcı | Şifre |
|--------|-----|-----------|-------|
| 🗺️ **Web Uygulaması** | http://localhost:8081 | - | - |
| 🌐 **GeoServer** | http://localhost:8080/geoserver | `admin` | `geoserver` |
| 🗄️ **PostgreSQL** | `localhost:5432` | `gis` | `gis` |

---

## 📁 Proje Yapısı

```
web-gis-vibe-workshop/
│
├── 📄 README.md                    # Bu dosya
├── 🐳 docker-compose.yml           # Docker servisleri tanımı
│
├── 📂 data/                        # Örnek veri dosyaları
│   └── sample_data.geojson         # İstanbul simge mekanları verileri
│
├── 📂 db/                          # PostgreSQL/PostGIS
│   └── init.sql                    # Başlangıç SQL scripti
│
├── 📂 geoserver/                   # GeoServer data dizini
│   └── data_dir/                   # (otomatik oluşur)
│
├── 📂 web/                         # Web uygulaması
│   ├── index.html                  # Ana sayfa
│   ├── app.js                      # JavaScript mantığı
│   ├── style.css                   # Stil dosyası
│   └── sidebar.js                  # Sidebar yönetimi (opsiyonel)
│
└── 📂 docs/                        # Dokümantasyon
    ├── geoserver-setup.md          # GeoServer kurulum rehberi
    ├── troubleshooting.md          # Sorun giderme
    ├── workshop-flow.md            # Workshop akış planı
    └── advanced-tasks.md           # İleri seviye özellikler
```

---

## 🎓 Adım Adım Kullanım

### Adım 1: PostGIS Veritabanını Kontrol Edin

#### A) PostgreSQL Client ile Bağlantı

**DBeaver veya pgAdmin kullanarak:**

- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `gis`
- **Username:** `gis`
- **Password:** `gis`

#### B) Verileri Sorgulayın

```sql
-- Tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Points tablosunu görüntüle
SELECT * FROM points;

-- Geometrileri WKT formatında göster
SELECT id, name, type, ST_AsText(geom) as geometry 
FROM points;

-- Kaç nokta var?
SELECT COUNT(*) FROM points;
```

**Beklenen Çıktı:**
```
id | name              | type    | geometry
---|-------------------|---------|------------------
1  | Kız Kulesi        | Tarihi  | POINT(29.0041 41.0211)
2  | Galata Kulesi     | Tarihi  | POINT(28.9742 41.0256)
3  | Ayasofya Camii    | Tarihi  | POINT(28.9800 41.0086)
```

#### C) Docker CLI ile Hızlı Kontrol

```bash
# PostgreSQL container'ına girin
docker exec -it postgis psql -U gis -d gis

# Sorguları çalıştırın
\dt                          # Tabloları listele
SELECT * FROM points;        # Verileri görüntüle
\q                           # Çıkış
```

---

### Adım 2: GeoServer'ı Yapılandırın

> 📖 **Detaylı anlatım için:** `docs/geoserver-setup.md` dosyasına bakın

#### A) GeoServer'a Giriş Yapın

1. Tarayıcıda açın: **http://localhost:8080/geoserver**
2. Sağ üstten **Login** tıklayın
3. Giriş bilgileri:
   - **Username:** `admin`
   - **Password:** `geoserver`

#### B) Workspace Oluşturun

1. Sol menüden **Data → Workspaces** tıklayın
2. **Add new workspace** butonuna tıklayın
3. Form alanlarını doldurun:
   ```
   Name: workshop
   Namespace URI: http://workshop.local
   ✅ Default Workspace
   ```
4. **Submit** butonuna tıklayın

#### C) PostGIS Store Ekleyin

1. **Data → Stores → Add new Store** tıklayın
2. **Vector Data Sources** altında **PostGIS** seçin
3. Bağlantı bilgilerini girin:

   | Alan | Değer |
   |------|-------|
   | Workspace | `workshop` |
   | Data Source Name | `postgis_db` |
   | host | `postgis` ⚠️ **(container adı!)** |
   | port | `5432` |
   | database | `gis` |
   | schema | `public` |
   | user | `gis` |
   | passwd | `gis` |

4. **Save** tıklayın

#### D) Layer Yayınlayın

1. Store kaydedildikten sonra otomatik olarak **New Layer** sayfası açılır
2. `points` tablosunun yanındaki **Publish** butonuna tıklayın
3. **Data** sekmesinde:
   - **Native SRS:** `EPSG:4326` (otomatik gelir)
   - **Declared SRS:** `EPSG:4326`
4. **Bounding Boxes** bölümünde:
   - **Compute from data** linki tıklayın
   - **Compute from native bounds** linki tıklayın
5. **Save** tıklayın

#### E) Layer'ı Test Edin

1. **Data → Layer Preview** menüsüne gidin
2. `workshop:points` katmanını bulun
3. **OpenLayers** formatında önizleme açın
4. ✅ Haritada 17 kırmızı noktayı görmelisiniz

---

### Adım 3: Web Uygulamasını Açın

1. Tarayıcıda açın: **http://localhost:8081**
2. Harita otomatik olarak İstanbul merkez üzerinde açılır
3. Sol tarafta sidebar kontrollerini görürsünüz

**İlk görünüm:**
```
┌─────────────┬──────────────────────────┐
│             │                          │
│ 🗺️ Katmanlar │     🗺️ Harita           │
│ ☑ WMS       │     (İstanbul)           │
│             │     • Kız Kulesi         │
│ 🛠️ Araçlar   │     • Galata Kulesi      │
│ [Çizim]     │     • Ayasofya Camii     │
│ [Ölçüm]     │                          │
│ [Temizle]   │                          │
│             │                          │
└─────────────┴──────────────────────────┘
```

---

## 🎨 Uygulama Özellikleri

### 1. 🗺️ Katman Yönetimi

**Kullanım:**
- Sidebar'da `WMS Katmanı` checkbox'ını işaretleyin/kaldırın
- Katman görünürlüğü anlık değişir

**Teknik Detay:**
```javascript
// web/app.js
document.getElementById("wmsLayer").onchange = (e) => {
  wmsLayer.setVisible(e.target.checked);
};
```

---

### 2. 📍 Feature Info (Nokta Bilgisi)

**Kullanım:**
- Haritada herhangi bir noktaya **tıklayın**
- Popup'ta nokta bilgileri görüntülenir (İsim, Tip)

**Beklenen Çıktı:**
```
╔═══════════════════════╗
║ İsim: Anıtkabir       ║
║ Tip: Anıt             ║
╚═══════════════════════╝
```

**Teknik Detay:**
```javascript
map.on("singleclick", (evt) => {
  const url = wmsLayer.getSource().getFeatureInfoUrl(...);
  fetch(url)
    .then(r => r.json())
    .then(data => {
      alert(`İsim: ${data.features[0].properties.name}`);
    });
});
```

---

### 3. ✏️ Çizim Aracı (Polygon)

**Kullanım:**
1. **📐 Çizim (Polygon)** butonuna tıklayın
2. Haritada birden fazla nokta işaretleyin
3. Çift tıklayarak çizimi tamamlayın
4. Console'da alan bilgisi görüntülenir

**Console Çıktısı:**
```javascript
Çizilen alan: 2.45 km²
```

**Ne İşe Yarar?**
- Bölge seçimi
- Park alanı çizimi
- Proje alanı belirleme

---

### 4. 📏 Ölçüm Aracı (Line)

**Kullanım:**
1. **📏 Ölçüm (Line)** butonuna tıklayın
2. Başlangıç noktası işaretleyin
3. Mesafe ölçmek istediğiniz noktaları işaretleyin
4. Çift tıklayarak bitirin
5. Alert ile mesafe gösterilir

**Alert Çıktısı:**
```
╔═══════════════════════╗
║ Mesafe: 3.24 km       ║
╚═══════════════════════╝
```

---

### 5. 🗑️ Temizleme

**Kullanım:**
- **🗑️ Temizle** butonuna tıklayın
- Tüm çizimler ve ölçümler silinir
- Interaction pasif hale gelir

---

## 🐛 Sorun Giderme

### ❌ Sorun 1: GeoServer Açılmıyor

**Belirtiler:**
- `http://localhost:8080/geoserver` → 404 veya bağlantı hatası

**Çözüm:**
```bash
# 1. Container çalışıyor mu?
docker ps | grep geoserver

# 2. Logları kontrol et
docker logs geoserver

# 3. Bekliyorsa tekrar dene (2-3 dk)
# GeoServer başlatma mesajı: "Server startup in 45231 ms"

# 4. Container'ı restart et
docker restart geoserver
```

---

### ❌ Sorun 2: WMS Katmanı Görünmüyor

**Belirtiler:**
- Harita açılıyor ama noktalar yok
- Console'da hata: `Failed to load resource: net::ERR_CONNECTION_REFUSED`

**Çözüm:**

#### A) GeoServer Layer Kontrolü
```bash
# Layer yayında mı?
http://localhost:8080/geoserver/workshop/wms?
  service=WMS&
  version=1.1.0&
  request=GetCapabilities
```

#### B) Layer Preview Test
1. GeoServer → **Data → Layer Preview**
2. `workshop:points` → **OpenLayers**
3. Noktaları görebiliyor musunuz?
   - **Evet:** Web app tarafında sorun var
   - **Hayır:** GeoServer yapılandırması hatalı

#### C) Browser Console Kontrolü
```javascript
// F12 → Console
// Şu hata varsa:
"Access to fetch at 'http://localhost:8080/geoserver/wms' 
from origin 'http://localhost:8081' has been blocked by CORS policy"

// Çözüm: GeoServer CORS ayarı
```

**CORS Ayarı:**
1. GeoServer → **Settings → Global**
2. **Enable CORS:** `true`
3. **Save** ve GeoServer'ı restart edin

---

### ❌ Sorun 3: PostGIS Bağlantı Hatası

**Belirtiler:**
- GeoServer Store'da "Connection failed" hatası

**Çözüm:**

```bash
# 1. PostGIS container çalışıyor mu?
docker ps | grep postgis

# 2. Manuel bağlantı testi
docker exec -it postgis psql -U gis -d gis -c "SELECT version();"

# 3. GeoServer Store host'u kontrol et
# ❌ Yanlış: localhost, 127.0.0.1
# ✅ Doğru: postgis (container adı)
```

**GeoServer Store Ayarları:**
```
host: postgis          ← Container adı (!)
port: 5432
database: gis
user: gis
password: gis
```

---

### ❌ Sorun 4: Port Çakışması

**Belirtiler:**
```
Error: bind: address already in use
```

**Çözüm:**

```bash
# Windows'ta port kullanımını kontrol et
netstat -ano | findstr :8080
netstat -ano | findstr :5432

# Process'i sonlandır (PID numarasını yukarıdaki komuttan alın)
taskkill /PID <PID_NUMARASI> /F

# Ya da docker-compose.yml'de portu değiştirin
ports:
  - "8082:8080"  # 8080 yerine 8082 kullan
```

---

### ❌ Sorun 5: Çizim/Ölçüm Çalışmıyor

**Belirtiler:**
- Butona tıklıyorum ama haritada işaretleyemiyorum

**Çözüm:**

```javascript
// Console'da kontrol edin:
console.log(map.getInteractions());

// Interaction'lar listeleniyorsa sorun yok
// Eğer hata varsa, app.js'i kontrol edin
```

**Debug:**
```bash
# Browser Console → Network sekmesi
# OpenLayers CDN yüklenmiş mi?
https://cdn.jsdelivr.net/npm/ol@7.5.2/dist/ol.js  ← 200 OK olmalı
```

---

### 🆘 Acil Durum: Sıfırdan Başlatma

```bash
# 1. Tüm container'ları durdur ve sil
docker compose down -v

# 2. Docker cache'i temizle (opsiyonel)
docker system prune -a

# 3. Tekrar başlat
docker compose up -d --build

# 4. 2-3 dakika bekle ve kontrol et
docker ps
```

---

## 🚀 İleri Seviye

> 📖 **Detaylı örnekler için:** `docs/advanced-tasks.md` dosyasına bakın

### 1. Sayısallaştırma Sonuçlarını Kaydetme

Çizdiğiniz polygon'ları PostGIS'e kaydedin:

```javascript
// Kaydet butonu ekleyin
document.getElementById("saveBtn").onclick = () => {
  const features = source.getFeatures();
  const geojson = new ol.format.GeoJSON().writeFeatures(features, {
    featureProjection: "EPSG:3857",
    dataProjection: "EPSG:4326"
  });
  
  // Backend API'ye gönderin (PHP/Node.js gerekir)
  fetch("http://localhost:3000/save-polygons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: geojson
  })
  .then(r => r.json())
  .then(data => alert("✅ Veriler PostGIS'e kaydedildi!"));
};
```

---

### 2. GeoServer SLD Styling

Noktaları kırmızı daire yerine özel simge ile gösterin:

```xml
<!-- GeoServer → Styles → Add new style -->
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0">
  <NamedLayer>
    <Name>workshop:points</Name>
    <UserStyle>
      <FeatureTypeStyle>
        <Rule>
          <PointSymbolizer>
            <Graphic>
              <ExternalGraphic>
                <OnlineResource xlink:href="http://maps.google.com/mapfiles/kml/paddle/red-stars.png"/>
                <Format>image/png</Format>
              </ExternalGraphic>
              <Size>32</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

---

### 3. WFS ile Veri Düzenleme

Feature eklemek için WFS-T kullanın:

```javascript
const formatWFS = new ol.format.WFS();
const formatGML = new ol.format.GML({
  featureNS: "http://workshop.local",
  featureType: "points",
  srsName: "EPSG:4326"
});

// Yeni feature oluştur
const newFeature = new ol.Feature({
  geometry: new ol.geom.Point([32.85, 39.92]),
  name: "Yeni Nokta",
  type: "Test"
});

// Transaction isteği oluştur
const transactionRequest = formatWFS.writeTransaction(
  [newFeature], // insert
  null,          // update
  null,          // delete
  formatGML
);

// GeoServer'a gönder
fetch("http://localhost:8080/geoserver/wfs", {
  method: "POST",
  headers: { "Content-Type": "text/xml" },
  body: new XMLSerializer().serializeToString(transactionRequest)
})
.then(response => response.text())
.then(data => console.log("✅ Feature eklendi:", data));
```

---

### 4. Heatmap (Isı Haritası)

Nokta yoğunluğunu gösterin:

```javascript
const heatmapLayer = new ol.layer.Heatmap({
  source: new ol.source.Vector({
    url: "data/sample_data.geojson",
    format: new ol.format.GeoJSON()
  }),
  blur: 20,
  radius: 15,
  weight: function(feature) {
    return 1; // Ya da feature özelliğine göre ağırlık
  }
});

map.addLayer(heatmapLayer);
```

---

### 5. Clustering (Kümeleme)

Yakın noktaları gruplandırın:

```javascript
const clusterSource = new ol.source.Cluster({
  distance: 40,
  source: new ol.source.Vector({
    url: "data/sample_data.geojson",
    format: new ol.format.GeoJSON()
  })
});

const clusterLayer = new ol.layer.Vector({
  source: clusterSource,
  style: function(feature) {
    const size = feature.get("features").length;
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10 + (size * 2),
        fill: new ol.style.Fill({ color: "#3399CC" }),
        stroke: new ol.style.Stroke({ color: "#fff", width: 2 })
      }),
      text: new ol.style.Text({
        text: size.toString(),
        fill: new ol.style.Fill({ color: "#fff" }),
        font: "bold 14px sans-serif"
      })
    });
  }
});

map.addLayer(clusterLayer);
```

---

## 📚 Ek Kaynaklar

### Resmi Dokümantasyonlar
- 📘 [OpenLayers Documentation](https://openlayers.org/en/latest/doc/)
- 📗 [GeoServer User Manual](https://docs.geoserver.org/)
- 📙 [PostGIS Documentation](https://postgis.net/documentation/)
- 📕 [Docker Compose Reference](https://docs.docker.com/compose/)

### Öğrenme Kaynakları
- 🎥 [OpenLayers Workshop](https://openlayers.org/workshop/)
- 🎥 [GeoServer Tutorials](https://docs.geoserver.org/latest/en/user/tutorials/)
- 📖 [PostGIS in Action](https://www.manning.com/books/postgis-in-action-third-edition)

### Topluluk
- 💬 [GIS Stack Exchange](https://gis.stackexchange.com/)
- 💬 [OpenLayers GitHub Discussions](https://github.com/openlayers/openlayers/discussions)
- 💬 [GeoServer Users Mailing List](https://sourceforge.net/projects/geoserver/lists/geoserver-users)

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Fork edin (`https://github.com/kullanici/web-gis-vibe-workshop/fork`)
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add: harika özellik'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Geliştirme Rehberi

```bash
# Development modda çalıştırma
docker compose -f docker-compose.dev.yml up

# Loglama
docker compose logs -f geoserver

# Test
npm test  # (Test framework eklenecek)
```

---

## 📝 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

## 👥 Yazarlar

- **Workshop Hazırlayan** - *İlk versiyon* - [@kullanici](https://github.com/kullanici)

Katkıda bulunanların listesini [contributors](https://github.com/kullanici/web-gis-vibe-workshop/contributors) sayfasından görebilirsiniz.

---

## 🙏 Teşekkürler

- [OpenLayers](https://openlayers.org/) ekibine
- [GeoServer](https://geoserver.org/) topluluğuna
- [PostGIS](https://postgis.net/) geliştiricilerine
- Workshop katılımcılarına

---

## 📞 İletişim

- **Workshop Soruları:** workshop@example.com
- **Bug Bildirimi:** [GitHub Issues](https://github.com/kullanici/web-gis-vibe-workshop/issues)
- **Twitter:** [@workshop_gis](https://twitter.com/workshop_gis)

---

## 🎓 Workshop Planı

| Zaman | Konu | Süre |
|-------|------|------|
| 09:00-09:15 | Kurulum ve Kontroller | 15 dk |
| 09:15-09:30 | PostGIS Giriş | 15 dk |
| 09:30-10:00 | GeoServer Yapılandırma | 30 dk |
| 10:00-10:30 | OpenLayers Harita | 30 dk |
| 10:30-10:45 | ☕ Mola | 15 dk |
| 10:45-11:15 | Çizim ve Ölçüm | 30 dk |
| 11:15-12:00 | Serbest Geliştirme | 45 dk |

---

## ⭐ Yıldız Vermeyi Unutmayın!

Bu proje işinize yaradıysa GitHub'da ⭐ vermeyi unutmayın!

```bash
# Son kontrol
docker ps  # ✅ 3 container çalışıyor olmalı
curl http://localhost:8081  # ✅ HTML dönmeli
curl http://localhost:8080/geoserver  # ✅ 200 OK

# Keyifli kodlamalar! 🚀
```

---

<div align="center">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/GeoServer-00A0E3?style=for-the-badge&logo=geoserver&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenLayers-1F6B75?style=for-the-badge&logo=openlayers&logoColor=white" />
</div>

<div align="center">
  <sub>Built with ❤️ for GIS Community</sub>
</div>