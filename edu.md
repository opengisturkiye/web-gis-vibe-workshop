# 🎓 Web GIS Vibe Workshop - Eğitmen Ders Notu

> Docker, PostGIS, GeoServer ve OpenLayers ile Web CBS Uygulaması Geliştirme - Tam Uygulama Rehberi

---

## 📚 İçindekiler

1. [Workshop Hazırlık (Ders Öncesi)](#1-workshop-hazırlık-ders-öncesi)
2. [Ders 1: Docker ve Ortam Kurulumu (15 dk)](#2-ders-1-docker-ve-ortam-kurulumu-15-dk)
3. [Ders 2: PostGIS ve Mekansal Veri (15 dk)](#3-ders-2-postgis-ve-mekansal-veri-15-dk)
4. [Ders 3: GeoServer Yapılandırması (30 dk)](#4-ders-3-geoserver-yapılandırması-30-dk)
5. [Ders 4: OpenLayers Web Uygulaması (30 dk)](#5-ders-4-openlayers-web-uygulaması-30-dk)
6. [MOLA (15 dk)](#6-mola-15-dk)
7. [Ders 5: Çizim ve Ölçüm Araçları (30 dk)](#7-ders-5-çizim-ve-ölçüm-araçları-30-dk)
8. [Ders 6: Serbest Geliştirme ve Özelleştirme (45 dk)](#8-ders-6-serbest-geliştirme-ve-özelleştirme-45-dk)
9. [Kapanış ve Özet (15 dk)](#9-kapanış-ve-özet-15-dk)

**Toplam Süre:** 3 saat 15 dakika

---

## 1. Workshop Hazırlık (Ders Öncesi)

### 🎯 Eğitmen Görevleri

#### Teknik Kontroller
- [ ] Docker Desktop yüklü ve çalışıyor mu?
- [ ] Workshop deposunu klonladınız mı?
- [ ] Tüm container'lar başlıyor mu?
- [ ] Port çakışması var mı? (8080, 8081, 5432)
- [ ] İnternet bağlantısı stabil mi?

#### Materyal Hazırlığı
- [ ] Sunum slaytları hazır
- [ ] Kod örnekleri test edildi
- [ ] Örnek veriler (sample_data.geojson) kontrol edildi
- [ ] Yedek Docker image'ları yerel olarak mevcut

#### Katılımcı Kontrol Listesi

Katılımcıların ders öncesi sahip olması gerekenler:

```
✅ Docker Desktop yüklü (v20.10+)
✅ 4GB+ RAM (8GB önerilen)
✅ 5GB+ Disk alanı
✅ Modern web tarayıcı (Chrome/Firefox/Edge)
✅ Kod editörü (VS Code önerilir)
```

#### Hızlı Test Komutu (Eğitmen İçin)

```bash
# Proje dizinine git
cd web-gis-vibe-workshop

# Tüm servisleri başlat
docker compose up -d

# Container durumlarını kontrol et
docker ps

# Logları kontrol et
docker compose logs -f

# Test URL'leri
# http://localhost:8081 - Web Uygulaması
# http://localhost:8080/geoserver - GeoServer
```

---

## 2. Ders 1: Docker ve Ortam Kurulumu (15 dk)

### 🎯 Ders Hedefleri

- [ ] Docker Desktop'ı başlatmak
- [ ] Container'ları başlatmak
- [ ] Servislerin erişilebilir olduğunu doğrulamak
- [ ] Temel Docker komutlarını öğrenmek

### 📝 Eğitmen Anlatım Notları

#### Giriş (2 dk)

**Eğitmen der ki:**

> "Bugün 3 saatlik yolculuğumuzda sıfırdan Web CBS uygulaması geliştireceğiz. Docker sayesinde tüm sistemleri izole container'larda çalıştıracağız. Bu sayede herkesin aynı ortamı kullanması garanti edilecek."

**Slayt göster:** Workshop teknoloji stack'i
- Docker Container
- PostgreSQL + PostGIS
- GeoServer
- OpenLayers

#### Adım 1: Docker Desktop'ı Başlatma (2 dk)

**Eğitmen yapar:**

1. Windows'ta Docker Desktop simgesine çift tıklayın
2. Yeşil "Running" durumunu gösterin
3. Sağ alt köşedeki Docker simgesinin yeşil olduğunu vurgulayın

**Katılımcılardan iste:**
> "Hepiniz Docker Desktop'ı açın. Yeşil 'Running' durumunu görene kadar bekleyin."

**Yaygın sorunlar:**
- Docker başlamıyorsa → Bilgisayarı yeniden başlatın
- WSL2 hatası → Windows güncelleme gerekli

#### Adım 2: Proje Dizinine Gitme (1 dk)

**Eğitmen terminal açar ve der:**

```bash
cd web-gis-vibe-workshop
```

**Açıklama:**
> "Tüm Docker yapılandırmalarımız `docker-compose.yml` dosyasında. Bu dosya 3 servisi tanımlıyor: PostGIS, GeoServer ve Nginx."

#### Adım 3: Container'ları Başlatma (3 dk)

**Eğitmen komutu çalıştırır:**

```bash
docker compose up -d
```

**Açıklama:**
> "`-d` bayrağı detached mod demektir. Container'lar arka planda çalışacak."

**Beklenen çıktı göster:**
```
[+] Running 3/3
✔ Container postgis    Started
✔ Container geoserver  Started  
✔ Container web        Started
```

**Eğitmen uyarır:**
> "⏱️ GeoServer'ın tamamen başlaması 2-3 dakika sürebilir. Sabırlı olun!"

#### Adım 4: Container Durumunu Kontrol Etme (2 dk)

**Eğitmen komutu çalıştırır:**

```bash
docker ps
```

**Açıklama:**
> "3 container'ın 'Up' durumunda olduğunu görüyorsunuz. Status sütunundaki süre, container'ın ne kadar süredir çalıştığını gösterir."

**Beklenen çıktı:**
```
CONTAINER ID   IMAGE                     STATUS         PORTS
xxxxx          postgis/postgis:15-3.3    Up 2 minutes   0.0.0.0:5432->5432/tcp
xxxxx          kartoza/geoserver:2.24.1  Up 2 minutes   0.0.0.0:8080->8080/tcp
xxxxx          nginx:alpine              Up 2 minutes   0.0.0.0:8081->80/tcp
```

#### Adım 5: Servislere Erişim Testi (5 dk)

**Eğitmen tarayıcıda gösterir:**

##### 5.1 Web Uygulaması
- URL: http://localhost:8081
- **Beklenen:** Ankara'yı gösteren harita
- **Açıklama:** "Bu bizim frontend uygulamımız. OpenLayers ile geliştirildi."

##### 5.2 GeoServer Admin Panel
- URL: http://localhost:8080/geoserver
- Kullanıcı: `admin`
- Şifre: `geoserver`
- **Beklenen:** GeoServer ana sayfası
- **Açıklama:** "GeoServer, mekansal verileri harita servisleri olarak yayınlar."

**Eğitmen uyarır:**
> "⚠️ GeoServer'a ilk erişimde 2-3 dakika bekleyin. 'HTTP 404' hatası alırsanız, biraz daha bekleyin."

##### 5.3 PostgreSQL (Opsiyonel)
- Host: `localhost`
- Port: `5432`
- Database: `gis`
- User: `gis`
- Password: `gis`

**Eğitmen der:**
> "PostgreSQL bağlantısını DBeaver veya pgAdmin ile test edebilirsiniz, ama şu an zorunlu değil. Sonraki derste SQL ile çalışacağız."

### 🎯 Kontrol Noktası (Tüm Katılımcılar)

**Eğitmen sorar:**

> 💬 "Herkes 3 container'ın 'Up' durumunda olduğunu görüyor mu?"

**Katılımcı cevabı beklenir: Evet/Hayır**

**Hayır diyenler için:**
```bash
# Container loglarını kontrol et
docker compose logs geoserver

# Gerekirse yeniden başlat
docker compose restart
```

### 📋 Ders 1 Özet

✅ **Öğrendiklerimiz:**
- Docker Desktop'ı başlatma
- `docker compose up -d` komutu
- `docker ps` ile container kontrolü
- Port yönlendirme kavramı (8080:8080, 5432:5432)

✅ **Teknik Kavramlar:**
- Container nedir?
- Docker Compose nedir?
- Detached mode (-d)

---

## 3. Ders 2: PostGIS ve Mekansal Veri (15 dk)

### 🎯 Ders Hedefleri

- [ ] PostgreSQL container'ına giriş yapmak
- [ ] PostGIS extension'ını anlamak
- [ ] Mekansal veri yapısını kavramak
- [ ] Örnek mekansal sorgular yapmak

### 📝 Eğitmen Anlatım Notları

#### Giriş (2 dk)

**Eğitmen der ki:**

> "PostGIS, PostgreSQL'in mekansal veri eklentisidir. Noktalar, çizgiler, poligonlar gibi geometrik verileri saklar ve sorgular. İstanbul'daki 17 önemli mekanın verisi hazır yüklü."

**Slayt göster:** PostGIS veri türleri
- POINT (Nokta)
- LINESTRING (Çizgi)
- POLYGON (Poligon)
- MULTIPOINT, MULTILINESTRING, MULTIPOLYGON

#### Adım 1: PostgreSQL Container'ına Giriş (3 dk)

**Eğitmen komutu çalıştırır:**

```bash
docker exec -it postgis psql -U gis -d gis
```

**Açıklama:**
> "Bu komut, `postgis` container'ının içine girip `psql` (PostgreSQL CLI) başlatır."

**Beklenen çıktı:**
```
psql (15.x)
Type "help" for help.

gis=#
```

**Eğitmen vurgular:**
> "Artık PostgreSQL terminalindeyiz. SQL sorguları yazabiliriz."

#### Adım 2: Tabloları Listeleme (2 dk)

**Eğitmen komutu çalıştırır:**

```sql
\dt
```

**Açıklama:**
> "`\dt` psql komutudur. Tablolar (tables) listeler."

**Beklenen çıktı:**
```
List of relations
Schema | Name     | Type  | Owner
--------+----------+-------+-------
public | points   | table | gis
public | polygons | table | gis
public | lines    | table | gis
```

**Eğitmen der:**
> "3 tablomuz var: points (noktalar), polygons (poligonlar), lines (çizgiler). Şimdilik sadece `points` tablosu dolu."

#### Adım 3: Nokta Verilerini Görüntüleme (3 dk)

**Eğitmen sorguyu çalıştırır:**

```sql
SELECT * FROM points;
```

**Açıklama:**
> "17 satır görüyoruz. Her satır İstanbul'daki bir mekanı temsil ediyor."

**Eğitmen sütunları açıklar:**
- `id`: Benzersiz kimlik
- `name`: Mekan adı (Galata Kulesi, Kız Kulesi, vb.)
- `type`: Kategori (Tarihi, Stadyum, Üniversite, vb.)
- `description`: Açıklama
- `geom`: Geometri (POINT türünde, binary format)
- `created_at`: Oluşturulma tarihi

#### Adım 4: Geometriyi İnsan Okunabilir Formatta Gösterme (3 dk)

**Eğitmen sorguyu çalıştırır:**

```sql
SELECT id, name, type, ST_AsText(geom) as koordinat
FROM points;
```

**Açıklama:**
> "`ST_AsText()` PostGIS fonksiyonudur. Geometriyi WKT (Well-Known Text) formatına çevirir."

**Beklenen çıktı:**
```
 id |        name         |   type    |         koordinat
----+---------------------+-----------+---------------------------
  1 | Kız Kulesi          | Tarihi    | POINT(29.0041 41.0211)
  2 | Galata Kulesi       | Tarihi    | POINT(28.9742 41.0256)
  3 | Ayasofya Camii      | Tarihi    | POINT(28.98 41.0086)
```

**Eğitmen açıklar:**
> "POINT(28.9742 41.0256) → Boylam 28.97°, Enlem 41.02°. Bu koordinatlar WGS84 (EPSG:4326) sistemindedir."

#### Adım 5: Mekansal Sorgu - Mesafe Hesaplama (5 dk)

**Eğitmen sorguyu çalıştırır:**

```sql
SELECT 
  a.name as nokta1,
  b.name as nokta2,
  ST_Distance(a.geom::geography, b.geom::geography) / 1000 as mesafe_km
FROM points a, points b
WHERE a.id = 1 AND b.id = 2;
```

**Açıklama adım adım:**

1. **FROM points a, points b** → İki tabloyu birleştir (self-join)
2. **a.geom::geography** → EPSG:4326'dan coğrafi koordinata çevir
3. **ST_Distance()** → İki nokta arası mesafeyi metre cinsinden hesapla
4. **/ 1000** → Kilometreye çevir

**Beklenen çıktı:**
```
   nokta1    |    nokta2     | mesafe_km
-------------+---------------+------------
 Kız Kulesi  | Galata Kulesi |      2.93
```

**Eğitmen vurgular:**
> "Kız Kulesi ile Galata Kulesi arası kuş uçuşu 2.93 km! PostGIS bunu saniyeler içinde hesaplıyor."

#### Adım 6: Çıkış (1 dk)

**Eğitmen komutu çalıştırır:**

```sql
\q
```

**Açıklama:**
> "`\q` quit (çık) anlamına gelir. PostgreSQL terminalinden çıkıp normal terminale döneriz."

### 🎯 Kontrol Noktası (Tüm Katılımcılar)

**Eğitmen sorar:**

> 💬 "17 nokta verisini görebildiniz mi? Mesafe hesaplama sorgusu çalıştı mı?"

**Katılımcı cevabı beklenir: Evet/Hayır**

**Hayır diyenler için:**
```bash
# Container loglarını kontrol et
docker compose logs postgis

# Veritabanına yeniden gir
docker exec -it postgis psql -U gis -d gis
```

### 📋 Ders 2 Özet

✅ **Öğrendiklerimiz:**
- PostGIS extension nedir?
- Geometri veri türleri (POINT, LINESTRING, POLYGON)
- `ST_AsText()` - Geometriyi WKT formatında görme
- `ST_Distance()` - İki nokta arası mesafe hesaplama
- Geography vs Geometry kavramı

✅ **SQL Komutları:**
```sql
\dt                           -- Tabloları listele
SELECT * FROM points;         -- Tüm verileri getir
ST_AsText(geom)               -- Geometriyi WKT olarak göster
ST_Distance(geom1, geom2)     -- Mesafe hesapla
```

---

## 4. Ders 3: GeoServer Yapılandırması (30 dk)

### 🎯 Ders Hedefleri

- [ ] GeoServer Admin Panel'e giriş yapmak
- [ ] Workspace oluşturmak
- [ ] PostGIS veri kaynağı (store) eklemek
- [ ] Layer (katman) yayınlamak
- [ ] Layer Preview ile haritayı test etmek

### 📝 Eğitmen Anlatım Notları

#### Giriş (2 dk)

**Eğitmen der ki:**

> "GeoServer, mekansal verileri harita servisleri olarak yayınlar. WMS (Web Map Service) ve WFS (Web Feature Service) protokollerini destekler. Şimdi PostGIS'teki noktaları WMS servisi olarak yayınlayacağız."

**Slayt göster:** GeoServer mimarisi
- Workspace → Store → Layer → Style → Service (WMS/WFS)

#### Adım 1: GeoServer'a Giriş (3 dk)

**Eğitmen tarayıcıda gösterir:**

1. URL: http://localhost:8080/geoserver
2. Sağ üst köşedeki **Login** butonuna tıkla
3. Kullanıcı adı: `admin`
4. Şifre: `geoserver`
5. **Login** butonuna tıkla

**Beklenen:** GeoServer ana sayfası açılır, sol tarafta menü görünür

**Eğitmen uyarır:**
> "⏱️ İlk girişte 30 saniye kadar yavaş olabilir. Sabırlı olun!"

**Ekranı tanıt:**
- **Sol menü:** Veri yönetimi (Data, Workspaces, Stores, Layers)
- **Orta panel:** Genel bilgi ve istatistikler
- **Üst menü:** Çıkış ve ayarlar

#### Adım 2: Workspace Oluşturma (5 dk)

**Eğitmen adımları gösterir:**

1. Sol menüden **Data → Workspaces** seçin
2. **Add new workspace** butonuna tıklayın

**Form doldurma:**

| Alan | Değer | Açıklama |
|------|-------|----------|
| **Name** | `workshop` | Küçük harf, boşluksuz |
| **Namespace URI** | `http://workshop.local` | URL formatında |
| **Default Workspace** | ✅ İşaretle | Varsayılan olsun |

3. **Submit** butonuna tıklayın

**Beklenen:** "Workspace `workshop` successfully created" mesajı görünür

**Eğitmen açıklar:**

> "Workspace, layer ve store'ları organize etmek için klasör gibidir. Her projede ayrı workspace kullanabilirsiniz."

**Katılımcılardan iste:**
> "Herkes aynı adımları takip edin. Workspace adını tam olarak `workshop` yazın!"

#### Adım 3: PostGIS Store (Veri Kaynağı) Ekleme (10 dk)

**Eğitmen adımları gösterir:**

1. Sol menüden **Data → Stores** seçin
2. **Add new Store** butonuna tıklayın
3. **Vector Data Sources** bölümünde **PostGIS** seçin

**Form doldurma:**

| Alan | Değer | ⚠️ Önemli Not |
|------|-------|--------------|
| **Workspace** | `workshop` | Dropdown'dan seçin |
| **Data Source Name** | `postgis_db` | İstediğiniz isim |
| **Description** | PostGIS Database | Opsiyonel |
| **Enabled** | ✅ İşaretle | Aktif olsun |

**Connection Parameters:**

| Alan | Değer | ⚠️ ÇOKTANBAYILIYOR! |
|------|-------|-------------------|
| **dbtype** | `postgis` | Otomatik seçili |
| **host** | `postgis` | ❗ `localhost` DEĞİL! Container adı |
| **port** | `5432` | Varsayılan PostgreSQL portu |
| **database** | `gis` | Veritabanı adı |
| **schema** | `public` | Varsayılan schema |
| **user** | `gis` | Kullanıcı adı |
| **passwd** | `gis` | Şifre |

4. **Save** butonuna tıklayın

**Beklenen:** "New PostGIS data store successfully created" mesajı görünür

**⚠️ EĞITMEN UYARISI (ÇOK ÖNEMLİ!):**

**Eğitmen ekranı büyütür ve vurgular:**

> "🚨 **En kritik hata burası!** `host` alanına `localhost` veya `127.0.0.1` YAZMAYIN! Docker container'ları kendi network'ünde çalışır. Container adı olan `postgis` yazmalısınız!"

**Ekranda göster:**
```
❌ YANLIŞ: host = localhost
❌ YANLIŞ: host = 127.0.0.1
✅ DOĞRU:  host = postgis
```

**Eğitmen açıklar:**

> "Docker Compose, her container'a bir DNS adı atar. Bu sayede container'lar birbirini isimle bulabilir. `docker-compose.yml` dosyasında service adı `postgis` olduğu için host'u da öyle yazıyoruz."

**Katılımcılardan iste:**
> "Herkes formu doldurmadan önce host alanını gösterin! Yanınızdaki arkadaşınızın da kontrol edin!"

#### Adım 4: Layer (Katman) Yayınlama (7 dk)

**Eğitmen Store'u kaydettiğinde otomatik açılan sayfayı gösterir:**

**Beklenen sayfa:** "New Layer chooser" sayfası

**Tabloda görünür:**
- `points` → **Publish** butonu
- `polygons` → **Publish** butonu
- `lines` → **Publish** butonu

**Eğitmen `points` tablosundaki **Publish** butonuna tıklar**

**Layer Edit Sayfası Açılır:**

##### Adım 4.1: Data Sekmesi

**Koordinat Sistemi Ayarları:**

1. **Native SRS** bölümünü bulun
2. `EPSG:4326` yazın (otomatik tamamlanabilir)
3. **Declared SRS** de `EPSG:4326` seçin
4. **SRS Handling** → `Force declared` seçin

**Eğitmen açıklar:**

> "EPSG:4326 (WGS84) dünya çapında en yaygın koordinat sistemidir. GPS koordinatları da bu sistemdedir."

**Bounding Boxes (Sınırlayıcı Kutular):**

1. **Native Bounding Box** → **Compute from data** butonuna tıklayın
2. **Lat/Lon Bounding Box** → **Compute from native bounds** butonuna tıklayın

**Beklenen:** Koordinat değerleri otomatik dolar (İstanbul bölgesi)

**Eğitmen gösterir:**
```
Min X: 28.8097  (En batı nokta)
Max X: 29.0449  (En doğu nokta)
Min Y: 40.9878  (En güney nokta)
Max Y: 41.1050  (En kuzey nokta)
```

**Eğitmen açıklar:**

> "Bu değerler, verilerimizin coğrafi kapsamını gösterir. İstanbul'un bir bölümünü kapsıyor."

##### Adım 4.2: Publishing Sekmesi (Opsiyonel, hızlıca göster)

**Eğitmen sadece gösterir, değiştirmez:**
- **Layer is enabled:** ✅ İşaretli
- **Advertised:** ✅ İşaretli

##### Adım 4.3: Kaydet

**Eğitmen en alttaki **Save** butonuna tıklar**

**Beklenen:** "Layer `workshop:points` successfully saved" mesajı görünür

**Katılımcılardan iste:**
> "Herkes aynı adımları takip edin. Save butonuna basmadan önce Bounding Box değerlerinin dolduğundan emin olun!"

#### Adım 5: Layer Preview (Önizleme) (5 dk)

**Eğitmen adımları gösterir:**

1. Sol menüden **Data → Layer Preview** seçin
2. Arama kutusuna `workshop:points` yazın
3. Satırda **OpenLayers** seçeneğine tıklayın

**Beklenen:** Yeni sekmede OpenLayers haritası açılır

**Harita özellikleri:**
- İstanbul haritası görünür
- 17 kırmızı nokta görünür
- Zoom yapılabilir, kaydırılabilir
- Noktalara tıklanınca bilgi popup'ı açılır

**Eğitmen zoom yapar ve bir noktaya tıklar:**

**Popup içeriği gösterir:**
```
id: 1
name: Kız Kulesi
type: Tarihi
description: İstanbul Boğazı'nın simgesi...
geom: POINT(29.0041 41.0211)
```

**Eğitmen açıklar:**

> "Bu WMS servisidir! Artık bu layer'ı herhangi bir harita uygulamasında kullanabiliriz. URL'si şu: `http://localhost:8080/geoserver/wms`"

**WMS URL'sini göster:**

Tarayıcı adres çubuğunda:
```
http://localhost:8080/geoserver/workshop/wms?service=WMS&version=1.1.0&request=GetMap&layers=workshop:points...
```

**Eğitmen vurgular:**

> "Bu URL'ye dikkat edin! Sonraki derste OpenLayers'da bu URL'yi kullanacağız."

### 🎯 Kontrol Noktası (Tüm Katılımcılar)

**Eğitmen sorar:**

> 💬 "Layer Preview'de 17 kırmızı nokta görüyor musunuz? Popup çalışıyor mu?"

**Katılımcı cevabı beklenir: Evet/Hayır**

**Hayır diyenler için troubleshooting:**

##### Sorun 1: "Could not connect to host"
```
Çözüm: Store ayarlarına geri dön
Data → Stores → postgis_db → Edit
host = postgis olduğundan emin ol
Save → Layer'ı yeniden yayınla
```

##### Sorun 2: "No such layer: workshop:points"
```
Çözüm: Layer düzgün yayınlanmamış
Data → Layers → workshop:points
Enabled ✅ olduğundan emin ol
Save
```

##### Sorun 3: "Bounding Box boş"
```
Çözüm: Layer Edit sayfasına geri dön
Data → Layers → workshop:points → Edit
Compute from data butonuna tekrar tıkla
Compute from native bounds butonuna tıkla
Save
```

### 📋 Ders 3 Özet

✅ **Öğrendiklerimiz:**
- GeoServer mimarisi (Workspace → Store → Layer)
- PostGIS Store bağlantısı
- Docker container network mantığı (host = postgis)
- EPSG:4326 koordinat sistemi
- Bounding Box kavramı
- WMS servisi yayınlama
- Layer Preview ile test etme

✅ **Kritik Noktalar:**
- ❗ host = `postgis` (localhost değil!)
- ❗ Bounding Box değerlerini hesapla
- ❗ EPSG:4326 koordinat sistemi seç

✅ **Oluşturulan Yapı:**
```
Workspace: workshop
  └─ Store: postgis_db
       └─ Layer: workshop:points (WMS)
```

---

## 5. Ders 4: OpenLayers Web Uygulaması (30 dk)

### 🎯 Ders Hedefleri

- [ ] Web uygulaması yapısını anlamak
- [ ] OpenLayers temel kavramlarını öğrenmek
- [ ] WMS katmanını haritaya eklemek
- [ ] Feature Info (popup) işlevini test etmek
- [ ] Katman görünürlüğünü kontrol etmek

### 📝 Eğitmen Anlatım Notları

#### Giriş (3 dk)

**Eğitmen der ki:**

> "OpenLayers, açık kaynaklı JavaScript harita kütüphanesidir. Google Maps'e alternatiftir. Şimdi hazır web uygulamasını inceleyip, GeoServer'daki WMS katmanını ekleyeceğiz."

**Slayt göster:** OpenLayers mimarisi
- Map (Harita container)
- View (Merkez, zoom seviyesi)
- Layers (Base map, WMS, vb.)
- Controls (Zoom, ölçek çubuğu)
- Interactions (Tıklama, çizim)

#### Adım 1: Web Uygulamasını Açma (2 dk)

**Eğitmen tarayıcıda gösterir:**

URL: http://localhost:8081

**Beklenen görünüm:**
- Sol tarafta sidebar (Layer Control, Tools)
- Sağda OpenStreetMap haritası
- Merkez: Ankara (TBMM çevresi)
- Zoom seviyesi: 12

**Eğitmen ekranı tanıtır:**

1. **Sidebar (Sol Panel):**
   - Layer Control (Katman kontrolü)
   - Tools (Araçlar: Çizim, Ölçüm)

2. **Harita (Sağ Panel):**
   - OpenStreetMap base layer
   - Zoom kontrolleri (+/-)
   - Ölçek çubuğu (Scale Line)

#### Adım 2: Kod Yapısını İnceleme (8 dk)

**Eğitmen VS Code açar ve dosyaları gösterir:**

##### 2.1 index.html (2 dk)

**Dosya yolu:** `web/index.html`

**Eğitmen vurgular:**

```html
<!-- OpenLayers CDN -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v7.5.2/ol.css">
<script src="https://cdn.jsdelivr.net/npm/ol@v7.5.2/dist/ol.js"></script>
```

**Açıklama:**
> "CDN kullanarak OpenLayers'ı yüklüyoruz. Versiyon 7.5.2 kullanıyoruz."

**HTML yapısı gösterir:**

```html
<body>
    <div id="sidebar">
        <!-- Layer Control -->
        <div class="control-group">
            <h3>Layer Control</h3>
            <label>
                <input type="checkbox" id="osmLayer" checked>
                OpenStreetMap
            </label>
            <label>
                <input type="checkbox" id="wmsLayer" checked>
                WMS Katmanı
            </label>
        </div>
        
        <!-- Tools -->
        <div class="control-group">
            <h3>Tools</h3>
            <button id="drawBtn">📐 Çizim (Polygon)</button>
            <button id="measureBtn">📏 Ölçüm (Line)</button>
        </div>
    </div>
    
    <div id="map" class="map"></div>
    <div id="popup" class="ol-popup">...</div>
</body>
```

**Eğitmen açıklar:**
> "3 ana bölüm var: sidebar, map, popup. Tüm kontroller sidebar'da."

##### 2.2 style.css (2 dk)

**Dosya yolu:** `web/style.css`

**Eğitmen CSS değişkenlerini gösterir:**

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --sidebar-width: 280px;
}

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

**Eğitmen açıklar:**
> "Flexbox kullanarak responsive layout yapıyoruz. Sidebar sol, harita sağda esneyerek genişliyor."

##### 2.3 app.js (4 dk)

**Dosya yolu:** `web/app.js`

**Eğitmen kodu bölüm bölüm gösterir:**

##### Bölüm 1: CONFIG Objesi

```javascript
const CONFIG = {
    geoserverUrl: 'http://localhost:8080/geoserver',
    workspace: 'workshop',
    layerName: 'points',
    center: [32.8597, 39.9334], // Ankara [lon, lat]
    zoom: 12
};
```

**Açıklama:**
> "Tüm yapılandırma tek yerde. GeoServer URL'sini ve workspace adını buradan değiştirebiliriz."

##### Bölüm 2: Base Layer (OpenStreetMap)

```javascript
const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true
});
```

**Açıklama:**
> "OSM tile katmanı. `visible: true` ile başlangıçta görünür olur."

##### Bölüm 3: WMS Layer

```javascript
const wmsLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: `${CONFIG.geoserverUrl}/wms`,
        params: {
            'LAYERS': `${CONFIG.workspace}:${CONFIG.layerName}`,
            'TILED': true
        },
        serverType: 'geoserver'
    }),
    visible: true
});
```

**Eğitmen satır satır açıklar:**

1. **url:** GeoServer WMS endpoint'i
2. **LAYERS:** Tam layer adı (workspace:layerName)
3. **TILED:** Tile cache kullan (performans)
4. **serverType:** GeoServer'a özel optimizasyonlar

**Eğitmen vurgular:**
> "Bu layer, GeoServer'daki `workshop:points` layer'ını gösterir. URL'ye dikkat: `/geoserver/wms`"

##### Bölüm 4: Map Oluşturma

```javascript
const map = new ol.Map({
    target: 'map',
    layers: [osmLayer, wmsLayer],
    view: new ol.View({
        center: ol.proj.fromLonLat(CONFIG.center),
        zoom: CONFIG.zoom
    })
});
```

**Eğitmen açıklar:**

1. **target:** HTML'deki `<div id="map">` elementi
2. **layers:** Katmanlar listesi (OSM + WMS)
3. **view:** Merkez koordinat ve zoom
4. **ol.proj.fromLonLat():** [lon, lat] → Web Mercator (EPSG:3857)

**Koordinat sistemi açıklaması:**
> "OpenLayers Web Mercator (EPSG:3857) kullanır, ama giriş koordinatları WGS84 (EPSG:4326). `fromLonLat()` dönüşüm yapar."

#### Adım 3: WMS Katmanını Test Etme (5 dk)

**Eğitmen tarayıcıya döner:**

1. **Katmanı Kapat:**
   - Sidebar'da "WMS Katmanı" checkbox'ının işaretini kaldır
   - **Beklenen:** Noktalar kaybolur

2. **Katmanı Aç:**
   - Checkbox'ı tekrar işaretle
   - **Beklenen:** Noktalar geri gelir

**Eğitmen kodu gösterir (app.js):**

```javascript
document.getElementById('wmsLayer').onchange = function(e) {
    wmsLayer.setVisible(e.target.checked);
};
```

**Açıklama:**
> "Checkbox değişince `setVisible()` metodu çağrılır. Layer görünürlüğü toggle edilir."

#### Adım 4: Feature Info (Popup) Test Etme (7 dk)

**Eğitmen haritada bir noktaya tıklar:**

**Beklenen:** Popup açılır, nokta bilgileri gösterilir

**Popup içeriği:**
```
Kız Kulesi
Tür: Tarihi
İstanbul Boğazı'nın simgesi...
```

**Eğitmen kodu gösterir (app.js):**

```javascript
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
                    
                    // Popup içeriği
                    document.getElementById('popup-title').innerText = props.name;
                    document.getElementById('popup-type').innerText = props.type;
                    document.getElementById('popup-desc').innerText = props.description;
                    
                    // Popup konumu
                    popup.setPosition(evt.coordinate);
                }
            });
    }
});
```

**Eğitmen adım adım açıklar:**

1. **map.on('singleclick')** → Haritaya tıklama eventi
2. **getFeatureInfoUrl()** → GeoServer'a GetFeatureInfo isteği URL'si oluşturur
3. **fetch(url)** → WMS isteği gönder, JSON yanıt al
4. **data.features[0]** → İlk feature'ı al
5. **popup.setPosition()** → Popup'ı tıklanan koordinata yerleştir

**Eğitmen tarayıcı Developer Tools açar:**

**Network sekmesini gösterir:**

Request URL:
```
http://localhost:8080/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image/png&TRANSPARENT=true&QUERY_LAYERS=workshop:points&LAYERS=workshop:points&exceptions=application/vnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=145&Y=276&SRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX=...
```

**Eğitmen vurgular:**
> "GetFeatureInfo isteği, tıklanan pikseldeki feature bilgilerini getirir. JSON formatında yanıt alıyoruz."

**Response (JSON):**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "points.1",
      "geometry": {...},
      "properties": {
        "id": 1,
        "name": "Kız Kulesi",
        "type": "Tarihi",
        "description": "İstanbul Boğazı'nın simgesi...",
        "created_at": "2024-01-15T10:30:00Z"
      }
    }
  ]
}
```

#### Adım 5: Haritayı İstanbul'a Getirme (5 dk)

**Eğitmen der:**

> "Şu an harita Ankara'da. İstanbul'daki noktaları görmek için merkezı değiştirelim."

**Eğitmen app.js'i düzenler:**

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

**Kaydet ve tarayıcıyı yenile (F5)**

**Beklenen:** Harita İstanbul'a kayar, 17 nokta görünür

**Eğitmen zoom yapar:**

> "Tüm noktaları görmek için zoom out yapın. Boğaz'ın iki yakasında noktalar dağılmış."

**Katılımcılardan iste:**
> "Herkes aynı değişikliği yapın! center: [29.0, 41.02], zoom: 11"

### 🎯 Kontrol Noktası (Tüm Katılımcılar)

**Eğitmen sorar:**

> 💬 "Harita İstanbul'da mı? 17 nokta görünüyor mu? Noktaya tıklayınca popup açılıyor mu?"

**Katılımcı cevabı beklenir: Evet/Hayır**

**Hayır diyenler için troubleshooting:**

##### Sorun 1: Noktalar görünmüyor
```
Çözüm 1: WMS Layer checkbox'ı açık mı kontrol et
Çözüm 2: Browser Console'da hata var mı bak (F12)
Çözüm 3: GeoServer'da Layer yayında mı kontrol et
```

##### Sorun 2: Popup çalışmıyor
```
Çözüm 1: Developer Tools → Console → Hata mesajları
Çözüm 2: Network sekmesinde GetFeatureInfo isteği gidiyor mu?
Çözüm 3: app.js'de popup element ID'leri doğru mu?
```

##### Sorun 3: CORS hatası
```
Hata: "Access to fetch at 'http://localhost:8080/geoserver/wms' from origin 'http://localhost:8081' has been blocked by CORS policy"

Çözüm: GeoServer'da CORS ayarları yapılmalı (docs/geoserver-setup.md)
```

### 📋 Ders 4 Özet

✅ **Öğrendiklerimiz:**
- OpenLayers temel kavramları (Map, View, Layer)
- WMS katmanı ekleme
- Koordinat sistemi dönüşümü (EPSG:4326 → EPSG:3857)
- GetFeatureInfo ile feature sorgulama
- Popup oluşturma ve konumlandırma
- Layer görünürlük kontrolü

✅ **Kod Yapısı:**
```
web/
├── index.html   → HTML yapı (sidebar, map, popup)
├── style.css    → CSS stil (flexbox, dark theme)
└── app.js       → JavaScript mantık (map, layers, events)
```

✅ **OpenLayers Nesneleri:**
```javascript
ol.Map           → Harita container
ol.View          → Görünüm (center, zoom)
ol.layer.Tile    → Tile katmanı
ol.source.OSM    → OpenStreetMap tile kaynağı
ol.source.TileWMS → GeoServer WMS kaynağı
ol.Overlay       → Popup overlay
```

---

## 6. MOLA (15 dk)

### ☕ Mola Aktiviteleri

**Eğitmen der:**

> "15 dakika mola! Kahve, çay alın. Geri geldiğimizde çizim ve ölçüm araçlarına başlayacağız."

**Eğitmen not alır:**
- Hangi katılımcılar geride kaldı?
- Hangi konularda daha fazla açıklama gerekli?
- Teknik sorunlar var mı?

**Mola sonrası kontrol:**
- [ ] Herkesin uygulaması çalışıyor mu?
- [ ] Tüm container'lar hâlâ ayakta mı? (`docker ps`)
- [ ] Sorular var mı?

---

## 7. Ders 5: Çizim ve Ölçüm Araçları (30 dk)

### 🎯 Ders Hedefleri

- [ ] Polygon çizim aracını kullanmak
- [ ] Alan hesaplama yapmak
- [ ] Line ölçüm aracını kullanmak
- [ ] Mesafe hesaplama yapmak
- [ ] Çizim stilini özelleştirmek

### 📝 Eğitmen Anlatım Notları

#### Giriş (2 dk)

**Eğitmen der ki:**

> "Sayısallaştırma (digitization), coğrafi nesneleri haritadan çizerek veri oluşturmaktır. Şimdi polygon çizme ve line ölçme araçlarını ekleyeceğiz. OpenLayers'ın Draw interaction'ını kullanacağız."

**Slayt göster:** Sayısallaştırma türleri
- Point (Nokta)
- LineString (Çizgi)
- Polygon (Poligon)

#### Adım 1: Polygon Çizim Aracını İnceleme (8 dk)

**Eğitmen web uygulamasına döner:**

1. Sidebar'da **📐 Çizim (Polygon)** butonuna tıkla

**Beklenen:** Buton aktif olur (renklenebilir)

2. Haritada 3-4 nokta işaretle (tıkla)
3. Çift tıklayarak poligonu tamamla

**Beklenen:** 
- Mavi çizgili polygon oluşur
- Console'da mesaj: "Alan: 12.34 km²"

**Eğitmen kodu gösterir (app.js):**

```javascript
// Çizim için vector layer
const drawSource = new ol.source.Vector();
const drawLayer = new ol.layer.Vector({
    source: drawSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#3498db',
            width: 3
        })
    })
});

map.addLayer(drawLayer);
```

**Eğitmen açıklar:**

1. **Vector Source:** Çizimlerin saklandığı kaynak
2. **Vector Layer:** Çizimlerin gösterildiği katman
3. **Style:** Dolgu rengi (şeffaf beyaz), çizgi rengi (mavi), kalınlık (3px)

**Draw Interaction:**

```javascript
let draw; // Global değişken

document.getElementById('drawBtn').onclick = function() {
    // Önceki çizim varsa kaldır
    if (draw) {
        map.removeInteraction(draw);
    }
    
    // Yeni Draw interaction oluştur
    draw = new ol.interaction.Draw({
        source: drawSource,
        type: 'Polygon'
    });
    
    // Çizim tamamlandığında
    draw.on('drawend', function(e) {
        const feature = e.feature;
        const geometry = feature.getGeometry();
        
        // Alan hesaplama (metre kare)
        const area = ol.sphere.getArea(geometry);
        const areaKm2 = (area / 1000000).toFixed(2);
        
        console.log('Alan:', areaKm2, 'km²');
        alert(`Poligon alanı: ${areaKm2} km²`);
        
        // Interaction'ı kaldır
        map.removeInteraction(draw);
        draw = null;
    });
    
    map.addInteraction(draw);
};
```

**Eğitmen satır satır açıklar:**

1. **new ol.interaction.Draw()** → Çizim interaction'ı
2. **type: 'Polygon'** → Poligon çizimi
3. **drawend event** → Çizim tamamlandığında tetiklenir
4. **ol.sphere.getArea()** → Spherical Mercator'da alan hesaplar (metre kare)
5. **/ 1000000** → Kilometrekareye çevir

**Eğitmen vurgular:**

> "`ol.sphere` modülü, küresel yüzeyde (dünya) doğru hesaplama yapar. Düz projeksiyon hatası minimize edilir."

**Katılımcılardan iste:**
> "Herkes bir polygon çizin! Ankara içinde herhangi bir alan seçin. Alan değerini göreceksiniz."

#### Adım 2: Polygon Çizim Demo (5 dk)

**Eğitmen canlı demo yapar:**

**Senaryo:** "İstanbul Tarihi Yarımada'nın alanını hesaplayalım."

1. Haritayı İstanbul Tarihi Yarımada'ya getir (zoom)
2. Polygon çizim butonuna tıkla
3. Yarımada sınırlarını takip ederek poligon çiz:
   - Sarayburnu
   - Sirkeci
   - Fatih
   - Kumkapı
   - Yenikapı
   - Sarayburnu (kapalı polygon)
4. Çift tıkla

**Beklenen sonuç:**
```
Poligon alanı: 6.23 km²
```

**Eğitmen açıklar:**

> "Tarihi Yarımada yaklaşık 6 km² alan kaplıyor. Bu değer gerçeğe oldukça yakın!"

**Eğitmen Console'u gösterir:**

```
Alan: 6.23 km²
```

#### Adım 3: Line Ölçüm Aracını İnceleme (8 dk)

**Eğitmen der:**

> "Şimdi mesafe ölçümü yapalım. İki nokta arasındaki uzaklığı hesaplayacağız."

**Eğitmen kodu gösterir (app.js):**

```javascript
document.getElementById('measureBtn').onclick = function() {
    // Önceki çizim varsa kaldır
    if (draw) {
        map.removeInteraction(draw);
    }
    
    // Line çizimi
    draw = new ol.interaction.Draw({
        source: drawSource,
        type: 'LineString'
    });
    
    // Çizim tamamlandığında
    draw.on('drawend', function(e) {
        const feature = e.feature;
        const geometry = feature.getGeometry();
        
        // Mesafe hesaplama (metre)
        const length = ol.sphere.getLength(geometry);
        const lengthKm = (length / 1000).toFixed(2);
        
        console.log('Mesafe:', lengthKm, 'km');
        alert(`Çizgi uzunluğu: ${lengthKm} km`);
        
        // Interaction'ı kaldır
        map.removeInteraction(draw);
        draw = null;
    });
    
    map.addInteraction(draw);
};
```

**Eğitmen açıklar:**

1. **type: 'LineString'** → Çizgi çizimi
2. **ol.sphere.getLength()** → Spherical Mercator'da uzunluk hesaplar (metre)
3. **/ 1000** → Kilometreye çevir

**Fark polygon ile aynı mantık, sadece geometri türü ve hesaplama fonksiyonu farklı.**

#### Adım 4: Line Ölçüm Demo (5 dk)

**Eğitmen canlı demo yapar:**

**Senaryo:** "Kız Kulesi'nden Galata Kulesi'ne mesafe ölçelim."

1. Haritayı Boğaz'a getir
2. Line ölçüm butonuna tıkla
3. Kız Kulesi'ne tıkla (başlangıç)
4. Galata Kulesi'ne tıkla (bitiş)
5. Çift tıkla (veya Enter tuşu)

**Beklenen sonuç:**
```
Çizgi uzunluğu: 2.93 km
```

**Eğitmen karşılaştırır:**

> "PostGIS'te SQL sorgusuyla 2.93 km hesaplamıştık. OpenLayers da aynı sonucu veriyor! İki araç da WGS84 spheroid kullanıyor."

**Katılımcılardan iste:**
> "Herkes bir mesafe ölçümü yapın! İstanbul'da iki nokta seçin."

#### Adım 5: Çizim Stilini Özelleştirme (Bonus, 2 dk)

**Eğitmen der:**

> "Çizim stilini değiştirmek isterseniz, Style nesnesini düzenleyebilirsiniz."

**Eğitmen kodu gösterir:**

```javascript
// Farklı bir stil
const customStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.3)' // Kırmızı şeffaf dolgu
    }),
    stroke: new ol.style.Stroke({
        color: '#e74c3c', // Kırmızı çizgi
        width: 4,
        lineDash: [10, 5] // Kesik çizgi
    }),
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({ color: '#e74c3c' }),
        stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
    })
});

drawLayer.setStyle(customStyle);
```

**Açıklama:**
- **lineDash:** Kesik çizgi deseni (10px çizgi, 5px boşluk)
- **image:** Vertex (köşe) noktaları için stil

**Eğitmen tarayıcıda gösterir:**

Yeni stil uygulanınca polygon kırmızı, kesik çizgili görünür.

### 🎯 Kontrol Noktası (Tüm Katılımcılar)

**Eğitmen sorar:**

> 💬 "Polygon çizimi çalışıyor mu? Alan değeri görünüyor mu? Line ölçümü doğru sonuç veriyor mu?"

**Katılımcı cevabı beklenir: Evet/Hayır**

**Hayır diyenler için troubleshooting:**

##### Sorun 1: Çizim başlamıyor
```
Çözüm: Console'da hata mesajı var mı?
Kontrol: draw değişkeni undefined mı?
Çözüm: Kodu tekrar gözden geçir, drawSource tanımlı mı?
```

##### Sorun 2: Alan/Mesafe hesaplanmıyor
```
Çözüm: ol.sphere modülü yüklü mü?
Çözüm: drawend event tetikleniyor mu? Console'da log ekle
```

### 📋 Ders 5 Özet

✅ **Öğrendiklerimiz:**
- OpenLayers Draw interaction
- Polygon çizimi (type: 'Polygon')
- LineString çizimi (type: 'LineString')
- Alan hesaplama (ol.sphere.getArea)
- Mesafe hesaplama (ol.sphere.getLength)
- Spherical Mercator koordinat sistemi
- Vector layer ve source kavramı
- Çizim stili özelleştirme

✅ **Kod Yapısı:**
```javascript
Vector Source (drawSource)
  → Vector Layer (drawLayer)
    → Draw Interaction (draw)
      → drawend event
        → Geometry hesaplama
```

✅ **Kullanılan Formüller:**
```javascript
Alan (km²) = ol.sphere.getArea(geometry) / 1000000
Mesafe (km) = ol.sphere.getLength(geometry) / 1000
```

---

## 8. Ders 6: Serbest Geliştirme ve Özelleştirme (45 dk)

### 🎯 Ders Hedefleri

- [ ] Öğrenilen teknikleri pekiştirmek
- [ ] Kişisel özelleştirmeler yapmak
- [ ] İleri seviye özellikleri keşfetmek
- [ ] Problem çözme becerilerini geliştirmek

### 📝 Eğitmen Anlatım Notları

#### Giriş (3 dk)

**Eğitmen der ki:**

> "Artık temel Web CBS uygulamanız hazır! Şimdi 45 dakika serbest çalışma zamanı. Aşağıdaki görevlerden istediğinizi seçebilir, kendi fikirlerinizi geliştirebilirsiniz."

**Eğitmen tahta/ekranda gösterir:**

### 🎯 Önerilen Görevler (Zorluk Seviyelerine Göre)

#### 🟢 Başlangıç Seviyesi

1. **Harita Merkezini Değiştir**
   - Kendi şehrini merkez yap
   - İlgini çeken bir bölgeyi göster

2. **Stil Renklerini Değiştir**
   - CSS değişkenlerini düzenle
   - Polygon çizim rengini özelleştir

3. **Yeni Nokta Verileri Ekle**
   - `db/init.sql` dosyasına kendi verilerini ekle
   - Container'ı yeniden başlat
   - GeoServer'da layer'ı güncelle

#### 🟡 Orta Seviye

4. **Point Çizim Aracı Ekle**
   - Draw type: 'Point'
   - Tıklanan koordinatı göster

5. **Temizle Butonu Ekle**
   - Tüm çizimleri sil
   - `drawSource.clear()` metodunu kullan

6. **Ölçüm Sonuçlarını Haritada Göster**
   - Alert yerine harita üzerinde label göster
   - Overlay kullan

7. **Base Map Değiştir**
   - Bing Maps, Stamen Terrain, vb. ekle
   - Radio button ile değiştir

#### 🔴 İleri Seviye

8. **WFS-T ile Veri Kaydetme**
   - Çizilen polygon'u PostGIS'e kaydet
   - WFS-T (Transaction) kullan

9. **Heatmap (Isı Haritası)**
   - Points layer'ı heatmap olarak göster
   - `ol.layer.Heatmap` kullan

10. **Clustering (Kümeleme)**
    - Yakın noktaları grupla
    - `ol.source.Cluster` kullan

11. **Custom SLD Stili**
    - GeoServer'da SLD dosyası oluştur
    - Type'a göre farklı renkler (Tarihi=mavi, Stadyum=yeşil)

12. **Backend API Oluştur**
    - Node.js/Express API
    - Çizimleri veritabanına kaydet

#### Katılımcı Seçimi (2 dk)

**Eğitmen der:**

> "Herkes bir görev seçsin. Zorluk seviyenize uygun olanı tercih edin. Birden fazla görevi de deneyebilirsiniz."

**Eğitmen not tutar:**
- Hangi katılımcı hangi görevi seçti?
- Grup çalışması yapılabilir mi?

#### Serbest Çalışma (35 dk)

**Eğitmen roller:**

1. **Danışman:** Takılan katılımcılara yardım et
2. **Motivator:** İlerleyenleri teşvik et
3. **Kaynak:** Dokümanlara yönlendir

**Eğitmen tavsiyeleri:**

##### Görev 1: Harita Merkezini Değiştir

**Katılımcı sorar:** "İzmir'i merkez yapmak istiyorum."

**Eğitmen der:**
```javascript
// app.js
const CONFIG = {
    center: [27.14, 38.42], // İzmir [lon, lat]
    zoom: 12
};
```

##### Görev 3: Yeni Nokta Verileri Ekle

**Katılımcı sorar:** "Ankara'daki üniversiteleri eklemek istiyorum."

**Eğitmen der:**

1. **db/init.sql** dosyasını aç
2. INSERT bölümüne ekle:

```sql
INSERT INTO points (name, type, description, geom) VALUES
    ('Hacettepe Üniversitesi', 'Üniversite', 'Ankara Beytepe Kampüsü', ST_GeomFromText('POINT(32.7475 39.8680)', 4326)),
    ('ODTÜ', 'Üniversite', 'Orta Doğu Teknik Üniversitesi', ST_GeomFromText('POINT(32.7784 39.8922)', 4326));
```

3. Container'ı yeniden başlat:

```bash
docker compose down
docker compose up -d
```

4. GeoServer'da layer'ı yeniden yükle (veya cache temizle)

##### Görev 4: Point Çizim Aracı Ekle

**Katılımcı sorar:** "Nokta çizimi nasıl yapılır?"

**Eğitmen der:**

```javascript
// HTML'e ekle
<button id="pointBtn">📍 Nokta Ekle</button>

// app.js'e ekle
document.getElementById('pointBtn').onclick = function() {
    if (draw) {
        map.removeInteraction(draw);
    }
    
    draw = new ol.interaction.Draw({
        source: drawSource,
        type: 'Point'
    });
    
    draw.on('drawend', function(e) {
        const feature = e.feature;
        const coord = feature.getGeometry().getCoordinates();
        const lonlat = ol.proj.toLonLat(coord);
        
        alert(`Koordinat: ${lonlat[0].toFixed(4)}, ${lonlat[1].toFixed(4)}`);
        
        map.removeInteraction(draw);
        draw = null;
    });
    
    map.addInteraction(draw);
};
```

##### Görev 5: Temizle Butonu Ekle

**Katılımcı sorar:** "Tüm çizimleri nasıl silerim?"

**Eğitmen der:**

```javascript
// HTML'e ekle
<button id="clearBtn">🗑️ Temizle</button>

// app.js'e ekle
document.getElementById('clearBtn').onclick = function() {
    drawSource.clear(); // Tüm feature'ları sil
    if (draw) {
        map.removeInteraction(draw);
        draw = null;
    }
};
```

##### Görev 9: Heatmap (İleri Seviye)

**Katılımcı sorar:** "Heatmap nasıl oluşturabilirim?"

**Eğitmen der:**

```javascript
// WMS layer'ı gizle, heatmap ekle

// 1. WFS ile noktaları al
const vectorSource = new ol.source.Vector({
    url: 'http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=workshop:points&outputFormat=application/json',
    format: new ol.format.GeoJSON()
});

// 2. Heatmap layer oluştur
const heatmapLayer = new ol.layer.Heatmap({
    source: vectorSource,
    blur: 15,
    radius: 8
});

map.addLayer(heatmapLayer);
```

**Eğitmen açıklar:**

> "WFS ile feature'ları vector olarak alıyoruz (GeoJSON). Heatmap layer bunları yoğunluk haritası olarak gösterir."

#### Ara Kontrol (10 dk ara)

**Eğitmen sınıfı gezer:**

- Herkes ilerleme kaydetti mi?
- Takılanlar var mı?
- Grup içi paylaşım teşvik et: "X arkadaşınız harika bir şey yaptı, gösterin!"

#### Kapanış (5 dk)

**Eğitmen der:**

> "Son 5 dakika! Kodunuzu kaydedin. Kim paylaşmak isterse ekranda gösterelim."

**Gönüllü katılımcılar:**

1-2 katılımcı çalışmasını sunar (3 dk)

**Eğitmen teşekkür eder:**

> "Harika işler çıkardınız! Serbest çalışma en iyi öğrenme yöntemidir."

### 📋 Ders 6 Özet

✅ **Kazanımlar:**
- Pratik yapma fırsatı
- Problem çözme deneyimi
- Özelleştirme becerileri
- Dokümantasyon okuma alışkanlığı

✅ **Tamamlanan Görevler:**
- (Katılımcıların yaptıklarını listele)

---

## 9. Kapanış ve Özet (15 dk)

### 🎯 Ders Hedefleri

- [ ] Workshop'u özetlemek
- [ ] Öğrenilen kavramları pekiştirmek
- [ ] Sonraki adımları paylaşmak
- [ ] Soru-cevap

### 📝 Eğitmen Anlatım Notları

#### Giriş (2 dk)

**Eğitmen der ki:**

> "3 saatlik yolculuğumuz sona erdi! Sıfırdan Web CBS uygulaması geliştirdik. Şimdi öğrendiklerimizi özetleyelim."

#### Teknoloji Stack Özeti (3 dk)

**Eğitmen slayt gösterir:**

### 🚀 Kullandığımız Teknolojiler

| Teknoloji | Rol | Ne Öğrendik? |
|-----------|-----|-------------|
| **Docker** | Container yönetimi | `docker compose up`, `docker ps`, `docker exec` |
| **PostgreSQL** | Veritabanı | SQL sorguları, tablo yapıları |
| **PostGIS** | Mekansal extension | `ST_Distance`, `ST_AsText`, geometri türleri |
| **GeoServer** | Harita servisleri | Workspace, Store, Layer, WMS/WFS |
| **OpenLayers** | Frontend harita | Map, Layer, Draw, Overlay |
| **Nginx** | Web sunucusu | Static dosya servisi |

#### Öğrenilen Kavramlar (5 dk)

**Eğitmen liste gösterir:**

### 📚 Temel Kavramlar

✅ **Mekansal Veri:**
- Geometri türleri: POINT, LINESTRING, POLYGON
- Koordinat sistemleri: EPSG:4326 (WGS84), EPSG:3857 (Web Mercator)
- Mekansal sorgular: Mesafe, alan hesaplama

✅ **Web Servisleri:**
- WMS (Web Map Service): Harita görüntüleri
- WFS (Web Feature Service): Vektör verileri
- GetFeatureInfo: Feature sorguları

✅ **Frontend Geliştirme:**
- OpenLayers Map API
- Layer yönetimi
- Interaction (Draw, Select)
- Event handling

✅ **DevOps:**
- Docker container'lar
- Port yönlendirme
- Container network
- Volume mount

#### Proje Akışı (3 dk)

**Eğitmen diyagram gösterir:**

```
1. Docker Container'ları Başlat
   ↓
2. PostGIS'te Mekansal Veri Oluştur
   ↓
3. GeoServer'da WMS Servisi Yayınla
   ↓
4. OpenLayers ile Web Uygulaması Geliştir
   ↓
5. Çizim ve Ölçüm Araçları Ekle
```

**Eğitmen vurgular:**

> "Bu akış, gerçek dünya Web CBS projelerinin temelini oluşturur. Şirketlerde de aynı teknoloji stack kullanılır."

#### Sonraki Adımlar (3 dk)

**Eğitmen önerilerde bulunur:**

### 🎯 Kendinizi Geliştirmek İçin

#### Kısa Vadeli (1 hafta)
- [ ] `docs/advanced-tasks.md` dosyasındaki görevleri dene
- [ ] Kendi şehrinin haritasını oluştur
- [ ] Farklı veri setleri yükle (GeoJSON, Shapefile)

#### Orta Vadeli (1 ay)
- [ ] Backend API geliştir (Node.js/Express, Python/Flask)
- [ ] WFS-T ile veri düzenleme
- [ ] Custom SLD stilleri oluştur
- [ ] Kullanıcı kimlik doğrulaması ekle

#### Uzun Vadeli (3+ ay)
- [ ] Gerçek dünya projesi geliştir
- [ ] Mobil uygulama entegrasyonu (React Native)
- [ ] Cloud deployment (AWS, Google Cloud)
- [ ] Büyük veri seti optimizasyonu

#### Öğrenme Kaynakları

**Eğitmen listeler:**

📖 **Dokümantasyon:**
- OpenLayers: https://openlayers.org/
- GeoServer: https://docs.geoserver.org/
- PostGIS: https://postgis.net/documentation/

🎥 **Video Eğitimler:**
- OpenLayers tutorials (YouTube)
- GeoServer webinar series

🌐 **Topluluklar:**
- GIS Stack Exchange
- OpenLayers GitHub Issues
- GeoServer mailing list

#### Soru-Cevap (2 dk)

**Eğitmen sorar:**

> "Sorularınızı alayım! Herhangi bir konu hakkında sormak istediğiniz var mı?"

**Yaygın sorular ve cevaplar:**

##### S1: "Production ortamına nasıl deploy edilir?"

**Eğitmen der:**
> "Docker Compose yerine Kubernetes kullanabilirsiniz. GeoServer cluster kurabilir, PostgreSQL replication yapabilirsiniz. HTTPS ekleyin, domain name alın."

##### S2: "Performans sorunlarını nasıl çözeriz?"

**Eğitmen der:**
> "GeoServer'da tile cache açın (GeoWebCache). PostGIS'te spatial index kullanın. Büyük veri setlerinde clustering uygulayın."

##### S3: "Mobil uygulamaya nasıl entegre edilir?"

**Eğitmen der:**
> "WMS servisi evrenseldir. React Native, Flutter gibi frameworklerde MapBox SDK veya Leaflet kullanabilirsiniz. Aynı GeoServer endpoint'ini çağırırsınız."

### 🎉 Teşekkür

**Eğitmen der:**

> "Katılımınız için teşekkürler! Web CBS dünyasına ilk adımı attınız. Başarılarınızı duymak isterim. LinkedIn'den bağlantıda kalabiliriz."

**Eğitmen iletişim bilgilerini paylaşır:**

📧 Email: [email]
💼 LinkedIn: [profile]
🐙 GitHub: [repository]

#### Feedback Anketi (Opsiyonel)

**Eğitmen form linki paylaşır:**

> "5 dakikanızı ayırıp feedback verebilir misiniz? Gelecekteki workshop'ları geliştirmemize yardımcı olur."

### 📋 Kapanış Özeti

✅ **Workshop Tamamlandı:**
- 3 saat boyunca 6 ders işlendi
- Docker, PostGIS, GeoServer, OpenLayers öğrenildi
- Web CBS uygulaması geliştirildi
- Çizim ve ölçüm araçları eklendi

✅ **Sonraki Adımlar:**
- Serbest çalışma ve pratik
- İleri seviye konular
- Gerçek dünya projeleri

✅ **Kaynaklar:**
- GitHub repository: https://github.com/opengisturkiye/web-gis-vibe-workshop
- Dokümantasyon: `docs/` klasörü
- Topluluk desteği

---

## 📌 Ekler

### A. Hızlı Komut Referansı

#### Docker Komutları

```bash
# Container'ları başlat
docker compose up -d

# Container durumunu kontrol et
docker ps

# Logları görüntüle
docker compose logs -f

# Container'ı yeniden başlat
docker compose restart [service_name]

# Container'ları durdur
docker compose down

# PostgreSQL container'ına gir
docker exec -it postgis psql -U gis -d gis

# Container içinde bash
docker exec -it postgis bash
```

#### PostgreSQL/PostGIS Komutları

```sql
-- Tabloları listele
\dt

-- Tablo yapısını göster
\d points

-- Verileri sorgula
SELECT * FROM points;

-- Geometriyi WKT formatında göster
SELECT id, name, ST_AsText(geom) FROM points;

-- Mesafe hesapla (km)
SELECT 
  ST_Distance(a.geom::geography, b.geom::geography) / 1000 as km
FROM points a, points b
WHERE a.id = 1 AND b.id = 2;

-- Çıkış
\q
```

#### GeoServer URL'leri

```
Admin Panel:
http://localhost:8080/geoserver

WMS GetCapabilities:
http://localhost:8080/geoserver/wms?service=WMS&version=1.1.0&request=GetCapabilities

WMS GetMap:
http://localhost:8080/geoserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=workshop:points&bbox=28.8,40.9,29.1,41.2&width=768&height=768&srs=EPSG:4326&format=image/png

WFS GetFeature:
http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=workshop:points&outputFormat=application/json
```

### B. Yaygın Hatalar ve Çözümleri

#### 1. GeoServer Başlamıyor

**Hata:**
```
ERROR: connection to server at "postgis" (172.18.0.2), port 5432 failed
```

**Çözüm:**
```bash
# PostgreSQL container'ı çalışıyor mu kontrol et
docker ps

# Logları kontrol et
docker compose logs postgis

# Gerekirse yeniden başlat
docker compose restart postgis
docker compose restart geoserver
```

#### 2. Web Uygulaması CORS Hatası

**Hata (Browser Console):**
```
Access to fetch at 'http://localhost:8080/geoserver/wms' from origin 'http://localhost:8081' has been blocked by CORS policy
```

**Çözüm:**

GeoServer'da CORS ayarları:
1. `http://localhost:8080/geoserver` → Login
2. Settings → Global
3. **CORS Allowed Origins:** `http://localhost:8081`
4. **CORS Allowed Methods:** `GET, POST, PUT, DELETE, HEAD, OPTIONS`
5. Save

#### 3. Port Çakışması

**Hata:**
```
Error starting userland proxy: listen tcp4 0.0.0.0:5432: bind: address already in use
```

**Çözüm:**

`docker-compose.yml` dosyasında portu değiştir:

```yaml
ports:
  - "5433:5432"  # 5432 yerine 5433 kullan
```

#### 4. Veriler Görünmüyor

**Sorun:** GeoServer Layer Preview'de boş harita

**Kontrol adımları:**

1. PostgreSQL'de veriler var mı?
```sql
SELECT COUNT(*) FROM points;
```

2. Layer'da Bounding Box tanımlı mı?
   - Data → Layers → workshop:points → Edit
   - Compute from data

3. Layer "Enabled" mi?
   - Layer listesinde yeşil tik var mı?

### C. Öğrenci Değerlendirme Formu

**Workshop sonunda katılımcılara sorulan sorular:**

#### Teknik Başarı (0-10 puan)

- [ ] Docker container'ları başarıyla çalıştırdım
- [ ] PostGIS sorgularını çalıştırabildim
- [ ] GeoServer'da layer yayınladım
- [ ] Web uygulamasını başarıyla açtım
- [ ] Çizim ve ölçüm araçlarını kullandım

#### Öğrenme Değerlendirmesi

1. Docker hakkında ne öğrendiniz? (Kısa cevap)
2. PostGIS'in avantajları neler? (Kısa cevap)
3. WMS nedir, nerede kullanılır? (Kısa cevap)

#### Feedback

1. Workshop süresi yeterli miydi? (Evet/Hayır/Yorumlar)
2. En çok hangi bölümü beğendiniz?
3. Geliştirme önerileri:

---

## 🎓 Sertifika (Opsiyonel)

**Workshop tamamlama sertifikası:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        WEB GIS VIBE WORKSHOP SERTIFIKASI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bu belge, [KATILIMCI ADI] katılımcısının,

"Docker, PostGIS, GeoServer ve OpenLayers ile
Web CBS Uygulaması Geliştirme Workshop"

eğitimini başarıyla tamamladığını onaylar.

Tarih: [TARİH]
Süre: 3 saat
Eğitmen: [EĞİTMEN ADI]

Kazanılan Beceriler:
✓ Docker container yönetimi
✓ PostgreSQL + PostGIS mekansal veri işleme
✓ GeoServer WMS/WFS servisleri
✓ OpenLayers harita geliştirme
✓ Sayısallaştırma ve ölçüm araçları

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📝 Eğitmen Notları

### Ders Öncesi Checklist

- [ ] Tüm container'lar test edildi
- [ ] Örnek veriler yüklendi
- [ ] GeoServer layer'ları yayında
- [ ] Web uygulaması çalışıyor
- [ ] Sunum hazır
- [ ] Yedek laptop hazır (network sorunları için)
- [ ] Ekran paylaşım yazılımı test edildi
- [ ] Ses sistemi çalışıyor

### Ders Sırasında Dikkat Edilecekler

- [ ] Her 15 dakikada kontrol noktası
- [ ] Yavaş ilerleyen katılımcıları takip et
- [ ] Kod örneklerini ekranda büyük fontla göster
- [ ] Terminal çıktılarını açıkla
- [ ] Hata mesajlarını panik yapmadan çöz

### Ders Sonrası

- [ ] Feedback topla
- [ ] GitHub repository'yi güncelle
- [ ] Sık sorulan soruları FAQ'e ekle
- [ ] Gelecek workshop için notlar al

---

**🎉 İyi dersler! 🎉**

**Bu ders notunu kullanarak Web GIS Vibe Workshop'unuzu başarıyla yönetebilirsiniz. Her adım, açıklama ve kod örneği katılımcıların sıfırdan uçtan uca Web CBS uygulaması geliştirmesini sağlar.**
