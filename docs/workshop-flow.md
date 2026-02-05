# 🎓 Workshop Akış Planı

Bu rehber, workshop'un dakika dakika nasıl ilerleyeceğini açıklar.

---

## 📋 Genel Bakış

| Zaman | Konu | Süre |
|-------|------|------|
| **ÖN ÇALIŞMA** | *Kurulum Kılavuzu (docs/kurulum-oncesi.md)* | *30 dk (workshop öncesi)* |
| 09:00-09:15 | Docker Container Yönetimi | 15 dk |
| 09:15-09:30 | PostGIS Mekansal Veri | 15 dk |
| 09:30-09:50 | GeoServer Bağlantı Yapılandırması | 20 dk |
| 09:50-10:10 | GeoServer Katman Yayını | 20 dk |
| 10:10-10:20 | ☕ Mola | 10 dk |
| 10:20-10:50 | OpenLayers Web Uygulaması | 30 dk |
| 10:50-11:20 | Çizim ve Ölçüm Araçları | 30 dk |
| 11:20-11:30 | ☕ Mola | 10 dk |
| 11:30-12:15 | Serbest Geliştirme ve GitHub Push | 45 dk |
| 12:15-12:30 | Kapanış & Soru-Cevap | 15 dk |

**Toplam Workshop Süresi:** 3 saat 30 dakika (+ 20 dk molalar = **3.5 saat**)

**Opsiyonel İleri Seviye:**
- Ders 3c: SLD Kategorik Stiller (15 dk) - Ders 3b sonrası veya Ders 6 içinde yapılabilir

---

## 📧 ÖN ÇALIŞMA | Workshop Öncesi (1 gün önce)

### Hedefler
- [ ] Tüm katılımcılar WSL2 ve Docker Desktop kurdular
- [ ] Workshop projesi bilgisayarlarda hazır
- [ ] Kurulum sorunları önceden çözüldü

### Eğitmen Görevleri

**Workshop'tan 1 hafta önce:**
- 📧 Katılımcılara `docs/kurulum-oncesi.md` dosyasını gönderin
- 📱 Kurulum desteği için iletişim kanalı kurun (Slack/Discord/Email)

**Workshop'tan 1 gün önce:**
- 📞 Kurulum kontrolü maili atın
- 📋 Sorun yaşayan katılımcılarla iletişime geçin

---

## 🕘 09:00-09:15 | Docker Container Yönetimi (15 dk)

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

## 🕘 09:15-09:30 | PostGIS Mekansal Veri (15 dk)

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

## 🕘 09:30-09:50 | GeoServer Bağlantı Yapılandırması (20 dk)

### Hedefler
- [ ] GeoServer'a giriş yapmak
- [ ] Workspace oluşturmak
- [ ] PostGIS Store eklemek (Docker network ile host=postgis)

### Adımlar

1. **GeoServer'a Giriş** (3 dk)
   - http://localhost:8088/geoserver
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
   - **host: `postgis`** ⚠️⚠️⚠️ (EN KRİTİK!)
   - port: 5432
   - database: gis
   - user: gis
   - passwd: gis
   - Save

4. **Bağlantı Testi** (2 dk)
   - "Save" sonrası hata yoksa başarılı
   - Layer listesi otomatik gösterilir

### Katılımcı Kontrol Noktası

> 💬 **Soru:** Store kaydedildi ve "New Layer" sayfası açıldı mı?

> ⚠️ **Yaygın Hata:** host=localhost yazıldıysa bağlantı başarısız olur!

**→ Sonraki adım: Ders 3b - GeoServer Katman Yayını**

---

## 🕘 09:50-10:10 | GeoServer Katman Yayını (20 dk)

### Hedefler
- [ ] Layer yayınlamak
- [ ] CRS yapılandırması
- [ ] Bounding box hesaplama
- [ ] Layer Preview ile test etmek

### Adımlar

1. **Layer Yayınla** (7 dk)
   - Store kaydedildikten sonra otomatik açılan "New Layer" sayfasında
   - points tablosunda "Publish" tıklayın
   - Native/Declared SRS: EPSG:4326
   - Compute from data tıklayın
   - Compute from native bounds tıklayın
2. **Layer Preview ile Test** (8 dk)
   - Data → Layer Preview
   - workshop:points → OpenLayers
   - ✅ Haritada 17 nokta görünmeli

3. **GetFeatureInfo Test** (3 dk)
   - Haritada bir noktaya tıklayın
   - Popup'ta nokta bilgileri gösterilir

4. **WMS URL Yapısı Açıklama** (2 dk)
   - Layer Preview'da URL'yi inceleyin
   - `/ows?service=WMS&version=1.3.0` yapısını gösterin

### Katılımcı Kontrol Noktası

> 💬 **Soru:** Haritada İstanbul noktalarını görebiliyor musunuz?

> ℹ️ **Opsiyonel:** İleri seviye katılımcılar için Ders 3c (SLD Stiller) önerilebilir

**→ 10 dakika mola zamanı!**

---

## 🕘 10:10-10:20 | ☕ Mola (10 dk)

**Eğitmen Notları:**
- Sorun yaşayan katılımcılara yardım edin
- GeoServer store ve layer yapılandırmasını kontrol edin
- Ders 4 için terminal ve VS Code hazırlığı yapın

---

## 🕘 10:20-10:50 | OpenLayers Web Uygulaması (30 dk)

### Hedefler
- [ ] Web uygulamasını anlamak
- [ ] Kod yapısını incelemek
- [ ] WMS katmanının çalıştığını görmek
- [ ] Feature Info'yu test etmek

### Adımlar

1. **Web Uygulamasını Aç** (2 dk)
   - http://localhost:8081
   - İstanbul merkez görünmeli

2. **index.html İncele** (5 dk)
   - Sidebar yapısı
   - OpenLayers CDN
   - Kontrol elementleri

3. **style.css İncele** (5 dk)
   - CSS değişkenleri
   - Light tema (minimal tasarım)
   - Responsive tasarım

4. **app.js İncele** (10 dk)
   - CONFIG nesnesi
   - Layer tanımları
   - Map oluşturma
   - Event handlers

5. **WMS Katmanını Test Et** (5 dk)
   - Sidebar'da "Noktalar (WMS)" checkbox'ı
   - Açıp kapatarak katman görünürlüğünü test edin

6. **GetFeatureInfo Popup Test** (3 dk)
   - Haritada bir noktaya tıklayın
   - Popup'ta nokta bilgilerini görün

### Katılımcı Kontrol Noktası

> 💬 **Soru:** Web uygulamasında İstanbul'u görüyor ve noktalara tıklayabiliyor musunuz?

---

## 🕘 10:50-11:20 | Çizim ve Ölçüm Araçları (30 dk)

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

## 🕘 10:50-11:20 | Çizim ve Ölçüm Araçları (30 dk)

### Hedefler
- [ ] Vector layer oluşturmak
- [ ] Polygon çizimi yapmak
- [ ] Mesafe ölçümü yapmak
- [ ] Alan hesaplamalarını görmek

### Adımlar

1. **Polygon Çizimi** (10 dk)
   - "▭ Polygon" butonuna tıklayın
   - Haritada birkaç nokta işaretleyin
   - Çift tıklayarak tamamlayın
   - Console'da alan değerini görün (km²)

2. **Mesafe Ölçümü** (10 dk)
   - "― Line" butonuna tıklayın
   - İki nokta arasını çizin
   - Console'da mesafe değerini görün (km)

3. **Nokta Çizimi** (3 dk)
   - "● Point" butonuna tıklayın
   - Haritada bir nokta işaretleyin

4. **Temizleme** (2 dk)
   - "× Temizle" butonuna tıklayın
   - Tüm çizimlerin silindiğini görün

5. **Kodu İncele** (5 dk)
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

## 🕘 11:20-11:30 | ☕ Mola (10 dk)

**Eğitmen Notları:**
- Sorun yaşayan katılımcılara yardım edin
- Ders 6 için görev listesini hazırlayın
- GitHub hesapları kontrol edin (varsa)

---

## 🕘 11:30-12:15 | Serbest Geliştirme ve GitHub Push (45 dk)

### Hedefler
- [ ] Kendi fikirlerini geliştirmek
- [ ] Pratik yaparak pekiştirmek
- [ ] Kodları GitHub'a yüklemek

### Önerilen Geliştirmeler

#### 🟢 Seviye 1: Kolay (15-20 dk)
- [ ] Yeni stil renkleri deneyin
- [ ] Başka bir harita altlığı ekleyin (Stamen, CartoDB)
- [ ] Popup'a daha fazla bilgi ekleyin
- [ ] Harita merkezini değiştirin
- [ ] Zoom/Pan kontrolleri ekleyin

#### 🟡 Seviye 2: Orta (25-30 dk)
- [ ] Çizimleri LocalStorage'a kaydedin
- [ ] Layer switch (radio button) ekleyin
- [ ] Koordinat gösterme (mouse move)
- [ ] Ölçüm sonuçlarını haritada göster (Overlay)

#### 🔴 Seviye 3: İleri (40+ dk)
- [ ] WFS-T ile veri kaydetme
- [ ] Clustering (kümeleme) özelliği
- [ ] Heatmap (ısı haritası)
- [ ] Custom SLD stil oluşturma (GeoServer)
- [ ] Backend API (Node.js/Python)

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

### GitHub'a Yükleme (Son 10 dakika)

**Katılımcılara söyleyin:**

1. **Git yapılandırması:**
   ```bash
   git config --global user.name "Adınız Soyadınız"
   git config --global user.email "email@example.com"
   ```

2. **Değişiklikleri commit edin:**
   ```bash
   git add -A
   git commit -m "Workshop sonucu: Özelleştirmeler ve iyileştirmeler"
   ```

3. **GitHub'a push edin:**
   - GitHub hesabı gerekli (yoksa hızlıca oluşturabilirler)
   - SSH key veya HTTPS ile push
   ```bash
   git push origin main
   ```

**Detaylı talimatlar için:** Ders 6 içindeki "BONUS: Kodunuzu GitHub'a Yükleyelim" bölümüne bakın

---

## 🕘 12:15-12:30 | Kapanış & Soru-Cevap (15 dk)

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
