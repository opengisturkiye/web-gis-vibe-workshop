# 🎓 Workshop Akış Planı

Bu rehber, workshop'un dakika dakika nasıl ilerleyeceğini açıklar.

---

## 📋 Genel Bakış

| Zaman | Konu | Süre |
|-------|------|------|
| 09:00-09:15 | Kurulum ve Kontroller | 15 dk |
| 09:15-09:30 | PostGIS Giriş | 15 dk |
| 09:30-10:00 | GeoServer Yapılandırma | 30 dk |
| 10:00-10:30 | OpenLayers Harita | 30 dk |
| 10:30-10:45 | ☕ Mola | 15 dk |
| 10:45-11:15 | Çizim ve Ölçüm | 30 dk |
| 11:15-12:00 | Serbest Geliştirme | 45 dk |

**Toplam Süre:** 3 saat

---

## 🕘 09:00-09:15 | Kurulum ve Kontroller (15 dk)

### Hedefler
- [ ] Docker Desktop çalışıyor
- [ ] Container'lar başlatıldı
- [ ] Tüm servisler erişilebilir

### Adımlar

1. **Docker Desktop'ı Başlat** (2 dk)
   - Windows'ta Docker Desktop simgesine çift tıklayın
   - Yeşil "Running" durumunu bekleyin

2. **Proje Dizinine Git** (1 dk)
   ```bash
   cd web-gis-vibe-workshop
   ```

3. **Container'ları Başlat** (3 dk)
   ```bash
   docker compose up -d
   ```

4. **Container Durumunu Kontrol Et** (2 dk)
   ```bash
   docker ps
   ```
   Beklenen: 3 container "Up" durumunda

5. **Servislere Erişimi Test Et** (7 dk)
   - http://localhost:8081 → Web uygulaması
   - http://localhost:8080/geoserver → GeoServer (2-3 dk bekleyebilir)
   - PostgreSQL bağlantısı (opsiyonel, DBeaver ile)

### Katılımcı Kontrol Noktası

> 💬 **Soru:** Herkes 3 container'ın "Up" durumunda olduğunu görüyor mu?

---

## 🕘 09:15-09:30 | PostGIS Giriş (15 dk)

### Hedefler
- [ ] PostGIS extension'ı anlamak
- [ ] Mekansal veri yapısını kavramak
- [ ] Örnek sorguları çalıştırmak

### Adımlar

1. **PostgreSQL Container'ına Gir** (2 dk)
   ```bash
   docker exec -it postgis psql -U gis -d gis
   ```

2. **Tabloları Listele** (2 dk)
   ```sql
   \dt
   ```

3. **Verileri İncele** (5 dk)
   ```sql
   SELECT * FROM points;
   
   SELECT id, name, type, ST_AsText(geom) as koordinat
   FROM points;
   ```

4. **Mekansal Sorgu Örneği** (5 dk)
   ```sql
   -- İki nokta arası mesafe
   SELECT 
     a.name as nokta1,
     b.name as nokta2,
     ST_Distance(a.geom::geography, b.geom::geography) / 1000 as mesafe_km
   FROM points a, points b
   WHERE a.id = 1 AND b.id = 2;
   ```

5. **Çıkış** (1 dk)
   ```sql
   \q
   ```

### Katılımcı Kontrol Noktası

> 💬 **Soru:** 17 nokta verisini görebildiniz mi?

---

## 🕘 09:30-10:00 | GeoServer Yapılandırma (30 dk)

### Hedefler
- [ ] GeoServer'a giriş yapmak
- [ ] Workspace oluşturmak
- [ ] PostGIS Store eklemek
- [ ] Layer yayınlamak
- [ ] Layer Preview ile test etmek

### Adımlar

1. **GeoServer'a Giriş** (3 dk)
   - http://localhost:8080/geoserver
   - admin / geoserver

2. **Workspace Oluştur** (5 dk)
   - Data → Workspaces → Add new workspace
   - Name: `workshop`
   - Namespace URI: `http://workshop.local`
   - ✅ Default Workspace
   - Submit

3. **PostGIS Store Ekle** (10 dk)
   - Data → Stores → Add new Store
   - PostGIS seçin
   - Workspace: workshop
   - Data Source Name: postgis_db
   - host: `postgis` ⚠️
   - port: 5432
   - database: gis
   - user: gis
   - passwd: gis
   - Save

4. **Layer Yayınla** (7 dk)
   - points tablosunda "Publish" tıklayın
   - Native/Declared SRS: EPSG:4326
   - Compute from data tıklayın
   - Compute from native bounds tıklayın
   - Save

5. **Layer Preview** (5 dk)
   - Data → Layer Preview
   - workshop:points → OpenLayers
   - Haritada noktaları görün

### Yaygın Hatalar

⚠️ **host = localhost değil, host = postgis!**

### Katılımcı Kontrol Noktası

> 💬 **Soru:** Layer Preview'de 17 kırmızı nokta görüyor musunuz?

---

## 🕘 10:00-10:30 | OpenLayers Harita (30 dk)

### Hedefler
- [ ] Web uygulamasını anlamak
- [ ] Kod yapısını incelemek
- [ ] WMS katmanının çalıştığını görmek
- [ ] Feature Info'yu test etmek

### Adımlar

1. **Web Uygulamasını Aç** (2 dk)
   - http://localhost:8081
   - Ankara merkez görünmeli

2. **index.html İncele** (5 dk)
   - Sidebar yapısı
   - OpenLayers CDN
   - Kontrol elementleri

3. **style.css İncele** (5 dk)
   - CSS değişkenleri
   - Dark tema
   - Responsive tasarım

4. **app.js İncele** (10 dk)
   - CONFIG nesnesi
   - Layer tanımları
   - Map oluşturma
   - Event handlers

5. **WMS Katmanını Test Et** (5 dk)
   - Sidebar'da "WMS Katmanı" checkbox'ı
   - Açıp kapatarak katman görünürlüğünü test edin

6. **Feature Info Test** (3 dk)
   - Haritada bir noktaya tıklayın
   - Popup'ta bilgi göründüğünü kontrol edin

### Kod Analizi

```javascript
// WMS katmanı nasıl tanımlanır
const wmsLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: {
            'LAYERS': 'workshop:points',
            'TILED': true
        }
    })
});
```

### Katılımcı Kontrol Noktası

> 💬 **Soru:** Noktaya tıklayınca popup açılıyor mu?

---

## ☕ 10:30-10:45 | Mola (15 dk)

---

## 🕘 10:45-11:15 | Çizim ve Ölçüm (30 dk)

### Hedefler
- [ ] Polygon çizimi yapmak
- [ ] Mesafe ölçümü yapmak
- [ ] Alan hesaplamalarını görmek

### Adımlar

1. **Polygon Çizimi** (10 dk)
   - "📐 Çizim (Polygon)" butonuna tıklayın
   - Haritada birkaç nokta işaretleyin
   - Çift tıklayarak tamamlayın
   - Console'da alan değerini görün

2. **Mesafe Ölçümü** (10 dk)
   - "📏 Ölçüm (Line)" butonuna tıklayın
   - İki nokta arasını çizin
   - Alert'te mesafe değerini görün

3. **Temizleme** (3 dk)
   - "🗑️ Temizle" butonuna tıklayın
   - Tüm çizimlerin silindiğini görün

4. **Kodu İncele** (7 dk)
   ```javascript
   // Alan hesaplama
   const area = ol.sphere.getArea(geometry);
   const areaKm = (area / 1000000).toFixed(4);
   
   // Mesafe hesaplama
   const length = ol.sphere.getLength(geometry);
   const lengthKm = (length / 1000).toFixed(2);
   ```

### Katılımcı Kontrol Noktası

> 💬 **Soru:** Ölçüm sonuçlarını görebildiniz mi?

---

## 🕘 11:15-12:00 | Serbest Geliştirme (45 dk)

### Önerilen Geliştirmeler

#### Seviye 1: Kolay
- [ ] Yeni stil renkleri deneyin
- [ ] Başka bir harita altlığı ekleyin (Bing, Stamen)
- [ ] Popup'a daha fazla bilgi ekleyin

#### Seviye 2: Orta
- [ ] Nokta ekleme özelliği (Point drawing)
- [ ] Çizimleri LocalStorage'a kaydedin
- [ ] Heatmap katmanı ekleyin

#### Seviye 3: İleri
- [ ] WFS-T ile veri kaydetme
- [ ] Clustering özelliği
- [ ] Custom SLD stil oluşturma

### Kod Örnekleri

**Yeni Altlık Ekleme:**
```javascript
const stamen = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'watercolor'
    })
});
map.addLayer(stamen);
```

**LocalStorage Kayıt:**
```javascript
const geojson = new ol.format.GeoJSON().writeFeatures(
    drawSource.getFeatures()
);
localStorage.setItem('drawings', geojson);
```

---

## 📝 Workshop Sonrası

### Ödev Önerileri
1. Kendi verilerinizi PostGIS'e yükleyin
2. GeoServer'da yeni layer yayınlayın
3. Web uygulamasına yeni özellikler ekleyin

### Kaynaklar
- [OpenLayers Örnekleri](https://openlayers.org/en/latest/examples/)
- [GeoServer Dokümantasyonu](https://docs.geoserver.org/)
- [PostGIS Referansı](https://postgis.net/docs/reference.html)

---

## ✅ Final Kontrol Listesi

- [ ] Docker container'ları çalışıyor
- [ ] PostGIS'te veriler mevcut
- [ ] GeoServer'da layer yayında
- [ ] Web uygulaması WMS'i gösteriyor
- [ ] Feature Info çalışıyor
- [ ] Çizim araçları çalışıyor
- [ ] Ölçüm araçları çalışıyor

---

**İyi çalışmalar! 🚀**
