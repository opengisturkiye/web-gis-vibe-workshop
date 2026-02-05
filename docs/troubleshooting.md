# 🐛 Sorun Giderme Rehberi

Bu rehber, workshop sırasında karşılaşabileceğiniz yaygın sorunları ve çözümlerini içerir.

---

## 📋 İçindekiler

1. [Docker Sorunları](#1-docker-sorunları)
2. [PostgreSQL/PostGIS Sorunları](#2-postgresqlpostgis-sorunları)
3. [GeoServer Sorunları](#3-geoserver-sorunları)
4. [Web Uygulaması Sorunları](#4-web-uygulaması-sorunları)
5. [Genel Debugging Teknikleri](#5-genel-debugging-teknikleri)

---

## 1. Docker Sorunları

### ❌ Sorun: "docker compose" komutu çalışmıyor

**Belirtiler:**
```
'docker compose' is not recognized as an internal or external command
```

**Çözümler:**

1. Docker Desktop'ı yeniden başlatın
2. Eski sözdizimini deneyin: `docker-compose up -d`
3. Docker Desktop'ın güncel olduğunu kontrol edin

---

### ❌ Sorun: Port kullanımda hatası

**Belirtiler:**
```
Error: bind: address already in use
Ports are not available: listen tcp 0.0.0.0:5432
```

**Çözüm:**

```bash
# Windows'ta portu kullanan uygulamayı bulun
netstat -ano | findstr :5432

# PID numarasıyla uygulamayı sonlandırın
taskkill /PID <PID> /F

# Alternatif: docker-compose.yml'de portu değiştirin
ports:
  - "5433:5432"  # 5432 yerine 5433 kullan
```

---

### ❌ Sorun: Container başlamıyor / sürekli restart

**Belirtiler:**
```
STATUS: Restarting (1) ...
```

**Çözüm:**

```bash
# Logları kontrol edin
docker logs postgis
docker logs geoserver

# Container'ları sıfırlayın
docker compose down -v
docker compose up -d
```

---

### ❌ Sorun: Disk alanı yetersiz

**Belirtiler:**
```
no space left on device
```

**Çözüm:**

```bash
# Kullanılmayan Docker kaynaklarını temizle
docker system prune -a

# Volume'ları da dahil et (DİKKAT: Veri kaybı!)
docker system prune -a --volumes
```

---

## 2. PostgreSQL/PostGIS Sorunları

### ❌ Sorun: Veritabanına bağlanamıyorum

**Belirtiler:**
```
Connection refused
FATAL: password authentication failed
```

**Çözümler:**

1. Container'ın çalıştığını kontrol edin:
```bash
docker ps | findstr postgis
```

2. Manuel bağlantı testi:
```bash
docker exec -it postgis psql -U gis -d gis -c "SELECT 1;"
```

3. Şifre kontrolü - docker-compose.yml'deki değerler:
```yaml
POSTGRES_USER: gis
POSTGRES_PASSWORD: gis
POSTGRES_DB: gis
```

---

### ❌ Sorun: PostGIS extension yok

**Belirtiler:**
```sql
ERROR: function st_geomfromtext does not exist
```

**Çözüm:**

```bash
docker exec -it postgis psql -U gis -d gis
```

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
\dx  -- Extension'ları listele
```

---

### ❌ Sorun: Tablolar boş / veri yok

**Belirtiler:**
```sql
SELECT * FROM points;
-- 0 rows returned
```

**Çözüm:**

```bash
# init.sql'i manuel çalıştır
docker exec -it postgis psql -U gis -d gis -f /docker-entrypoint-initdb.d/init.sql

# Veya SQL'i doğrudan çalıştır
docker exec -it postgis psql -U gis -d gis -c "
INSERT INTO points (name, type, geom) VALUES
('Test Nokta', 'Test', ST_GeomFromText('POINT(32.85 39.92)', 4326));
"
```

---

## 3. GeoServer Sorunları

### ❌ Sorun: GeoServer açılmıyor (404/503)

**Belirtiler:**
- http://localhost:8080/geoserver → 404 Not Found
- HTTP 503 Service Unavailable

**Çözümler:**

1. GeoServer'ın başlamasını bekleyin (2-3 dakika)

2. Logları kontrol edin:
```bash
docker logs geoserver
# "Server startup in XXXXX ms" mesajını arayın
```

3. Container'ı restart edin:
```bash
docker restart geoserver
```

---

### ❌ Sorun: PostGIS Store bağlantı hatası

**Belirtiler:**
```
Connection failed: Connection refused
```

**Çözüm:**

Store ayarlarında **host** değerini kontrol edin:

```
❌ Yanlış: localhost
❌ Yanlış: 127.0.0.1
✅ Doğru:  postgis
```

---

### ❌ Sorun: Layer Preview'de nokta görünmüyor

**Çözümler:**

1. **Bounding Box** hesaplanmış mı kontrol edin:
   - Layer → Edit → Bounding Boxes
   - "Compute from data" tıklayın
   - "Compute from native bounds" tıklayın
   - Save

2. **SRS** doğru mu kontrol edin:
   - Native SRS: EPSG:4326
   - Declared SRS: EPSG:4326

3. Veritabanında veri var mı kontrol edin:
```bash
docker exec -it postgis psql -U gis -d gis -c "SELECT COUNT(*) FROM points;"
```

---

### ❌ Sorun: WMS hata veriyor (500)

**Belirtiler:**
```
HTTP 500 Internal Server Error
```

**Çözüm:**

```bash
# GeoServer loglarını kontrol edin
docker logs geoserver --tail 100

# Serisleri restart edin
docker restart postgis
docker restart geoserver
```

---

## 4. Web Uygulaması Sorunları

### ❌ Sorun: Harita boş görünüyor

**Çözümler:**

1. **Console hatalarını kontrol edin** (F12 → Console)

2. **Network sekmesini kontrol edin:**
   - WMS istekleri 200 mü?
   - CORS hatası var mı?

3. **GeoServer WMS'i test edin:**
```
http://localhost:8080/geoserver/workshop/wms?service=WMS&version=1.1.0&request=GetCapabilities
```

---

### ❌ Sorun: CORS hatası

**Belirtiler:**
```
Access to fetch at 'http://localhost:8080/geoserver...' 
has been blocked by CORS policy
```

**Çözümler:**

1. docker-compose.yml'de CORS **ayarları** kontrol edin:
```yaml
environment:
  CORS_ENABLED: "true"
  CORS_ALLOWED_ORIGINS: "*"
```

2. GeoServer'ı restart edin:
```bash
docker restart geoserver
```

3. GeoServer arayüzünden manuel ayar:
   - Settings → Global → Enable CORS: true
   - Save

---

### ❌ Sorun: Çizim/Ölçüm çalışmıyor

**Çözümler:**

1. **OpenLayers yüklendi mi kontrol edin:**
   - Network sekmesinde ol.js → 200 OK olmalı

2. **Console'da hata var mı kontrol edin**

3. **Buton ID'leri doğru mu kontrol edin:**
```javascript
document.getElementById('drawPolygonBtn')
// null dönüyorsa ID yanlış
```

---

### ❌ Sorun: Feature Info çalışmıyor

**Belirtiler:**
- Noktaya tıklıyorum ama popup açılmıyor

**Çözümler:**

1. Çizim modunun aktif olmadığından emin olun

2. GeoServer GetFeatureInfo'yu test edin:
```
http://localhost:8080/geoserver/workshop/wms?
  SERVICE=WMS&
  VERSION=1.1.1&
  REQUEST=GetFeatureInfo&
  LAYERS=workshop:points&
  QUERY_LAYERS=workshop:points&
  INFO_FORMAT=application/json&
  X=50&Y=50&
  WIDTH=100&HEIGHT=100&
  BBOX=32.8,39.9,32.9,39.95&
  SRS=EPSG:4326
```

---

## 5. Genel Debugging Teknikleri

### Container Durumunu Kontrol Et

```bash
# Tüm container'ları listele
docker ps -a

# Belirli container'ın loglarını gör
docker logs <container_name>

# Container'a gir
docker exec -it <container_name> /bin/bash
```

### Network Kontrolü

```bash
# Docker network'ünü kontrol et
docker network ls
docker network inspect app_gis-network
```

### Tamamen Sıfırlama

```bash
# Tüm container ve volume'ları sil
docker compose down -v

# Docker cache'i temizle
docker system prune -a

# Tekrar başlat
docker compose up -d --build
```

### Browser Cache Temizleme

1. **Chrome:** Ctrl+Shift+Delete → Cache'i temizle
2. **Hard Refresh:** Ctrl+Shift+R

---

## 📞 Yardım Alın

Sorununuz devam ediyorsa:

1. ✅ Container loglarını paylaşın
2. ✅ Browser console hatalarını ekran görüntüsü alın
3. ✅ Hangi adımda takıldığınızı belirtin

---

## ✅ Hızlı Kontrol Listesi

| Kontrol | Komut/Adres |
|---------|-------------|
| Docker çalışıyor mu? | `docker ps` |
| PostGIS çalışıyor mu? | `docker logs postgis` |
| GeoServer çalışıyor mu? | http://localhost:8080/geoserver |
| Web app çalışıyor mu? | http://localhost:8081 |
| WMS erişilebilir mi? | http://localhost:8080/geoserver/workshop/wms?service=WMS&request=GetCapabilities |
