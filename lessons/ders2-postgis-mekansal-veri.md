# Ders 2: PostGIS ve Mekansal Veri (15 dakika)

> **Eğitmen Ders Notu** - PostgreSQL/PostGIS ile Mekansal Veri Sorgulama

---

## 📋 Ders Özeti

| Özellik | Detay |
|---------|-------|
| **Süre** | 15 dakika |
| **Zorluk** | Başlangıç-Orta |
| **Ön Gereksinim** | Ders 1 tamamlanmış, PostgreSQL container çalışıyor |
| **Hedef Kitle** | SQL bilgisi olmayanlar da katılabilir |

---

## 🎯 Ders Hedefleri

Bu dersin sonunda katılımcılar şunları yapabilecek:

- [ ] PostgreSQL container'ına `docker exec` ile erişmek
- [ ] `psql` (PostgreSQL CLI) kullanmak
- [ ] PostGIS extension'ını anlamak
- [ ] Geometri veri türlerini kavramak (POINT, LINESTRING, POLYGON)
- [ ] Mekansal SQL sorguları yazmak
- [ ] `ST_Distance`, `ST_AsText` gibi PostGIS fonksiyonlarını kullanmak
- [ ] Coğrafi koordinat sistemi (WGS84/EPSG:4326) hakkında bilgi sahibi olmak

---

## 📚 Eğitmen Ön Hazırlık

### Ders Öncesi Teknik Kontroller (5 dakika önce)

```bash
# 1. PostgreSQL container çalışıyor mu?
docker ps | findstr postgis
# Beklenen: postgis container "Up" durumunda

# 2. Veritabanına erişim testi
docker exec -it postgis psql -U gis -d gis -c "SELECT COUNT(*) FROM points;"
# Beklenen çıktı: 17

# 3. PostGIS extension aktif mi?
docker exec -it postgis psql -U gis -d gis -c "SELECT PostGIS_version();"
# Beklenen: 3.3.x versiyonu

# 4. Örnek sorgu testi (mesafe hesaplama)
docker exec -it postgis psql -U gis -d gis -c "SELECT ST_Distance(ST_MakePoint(29.0041, 41.0211)::geography, ST_MakePoint(28.9742, 41.0256)::geography) / 1000;"
# Beklenen: ~2.93 km
```

### Materyal Hazırlığı

- [ ] **Terminal:** Büyük font, SQL syntax highlighting
- [ ] **Slayt:** PostGIS veri türleri diyagramı
- [ ] **İstanbul Haritası:** Noktaların konumlarını göster (google maps/OSM)
- [ ] **SQL Komutları Dökümanı:** Yazdır veya ekranda hazır tut

### Öğretim Stratejisi

**Pedagojik Yaklaşım:**

1. **Show, Don't Tell:** Sorguları önce çalıştır, sonra açıkla
2. **Baby Steps:** SQL bilmeyenleri kaybetme, temel komutlardan başla
3. **Visual Learning:** Geometrileri görselleştir (WKT formatı)
4. **Real-World Context:** İstanbul mekanları → somut örnekler

---

## 🎬 Ders Akışı (15 dakika)

### Giriş: PostGIS Nedir? (2 dakika)

**🎤 Eğitmen Konuşması:**

> "İlk derste container'ları başlattık. Şimdi içine girip ne olduğunu görelim!
>
> PostgreSQL dünyanın en gelişmiş açık kaynak veritabanıdır. PostGIS ise ona 'coğrafi süper güçler' ekleyen bir eklentidir.
>
> Normal veritabanları sayılar, metinler tutar. PostGIS ise **noktalar, çizgiler, poligonlar** tutar. Ve bunlarla **mekansal hesaplamalar** yapar."

**📊 Slayt Göster: PostGIS Veri Türleri**

```
┌────────────────────────────────────────────────────┐
│         POSTGIS GEOMETRİ TÜRLERİ                  │
├────────────────────────────────────────────────────┤
│                                                    │
│  POINT (Nokta)         •                          │
│  Örnek: Bir şehir, restoran, üniversite           │
│                                                    │
│  LINESTRING (Çizgi)    •───•───•                  │
│  Örnek: Yol, nehir, hat                           │
│                                                    │
│  POLYGON (Poligon)     ╱─────╲                    │
│                       │       │                    │
│                        ╲─────╱                     │
│  Örnek: Bina, ilçe sınırı, park                   │
│                                                    │
│  MULTIPOINT            • • •                       │
│  MULTILINESTRING       •──• •──•                  │
│  MULTIPOLYGON          ╱─╲ ╱─╲                    │
│                                                    │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen açıklar:**

> "Bizim projemizde 17 nokta verisi var: Galata Kulesi, Kız Kulesi, stadyumlar, üniversiteler... Hepsi POINT türünde. Şimdi bu verileri sorgulayalım!"

---

### Adım 1: PostgreSQL Container'ına Giriş (3 dakika)

**🎤 Eğitmen der:**

> "Container'ın içine girmek için `docker exec` komutunu kullanacağız. Bu, container'da komut çalıştırmamızı sağlar."

**👨‍🏫 Canlı Demo:**

**Terminal ekranında (büyük font):**

```powershell
docker exec -it postgis psql -U gis -d gis
```

**Komut açıklaması (Enter'dan önce):**

**🎤 Eğitmen der:**

> "Bu komutu parçalayalım:
> 
> `docker exec` → Container'da komut çalıştır
> `-it` → Interactive terminal (klavyeden girdi alabilir)
> `postgis` → Container adı
> `psql` → PostgreSQL CLI (Command Line Interface)
> `-U gis` → Kullanıcı adı: gis
> `-d gis` → Veritabanı adı: gis"

**Enter tuşuna bas!**

**📊 Beklenen Çıktı:**

```
psql (15.x)
Type "help" for help.

gis=#
```

**🎤 Eğitmen açıklar:**

> "Gördünüz mü `gis=#` promptunu? Artık PostgreSQL terminal içindeyiz. SQL sorguları yazabiliriz!
>
> `#` işareti, yönetici (superuser) yetkileriyle giriş yaptığımızı gösterir."

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes `gis=#` promptunu görüyor mu? Görmeyenler el kaldırsın!"

**Yaygın Sorun: "Error: No such container"**

```powershell
# Container adı doğru mu kontrol et
docker ps

# postgis container çalışıyor mu?
# Çalışmıyorsa:
docker compose restart postgis
```

---

### Adım 2: Tabloları Listeleme (2 dakika)

**🎤 Eğitmen der:**

> "İlk yapalım: Hangi tablolar var?"

**👨‍🏫 Canlı Demo:**

**psql terminalinde yaz:**

```sql
\dt
```

**📝 Not:** `\dt` bir psql komutu (meta-command), SQL değil. Backslash ile başlar.

**📊 Beklenen Çıktı:**

```
            List of relations
 Schema |   Name   | Type  | Owner
--------+----------+-------+-------
 public | points   | table | gis
 public | polygons | table | gis
 public | lines    | table | gis
(3 rows)
```

**🎤 Eğitmen açıklar:**

> "3 tablomuz var:
> 
> 1. **points** → Nokta verileri (ÇOK DOLU, 17 satır)
> 2. **polygons** → Poligon verileri (BOŞ, çizim için)
> 3. **lines** → Çizgi verileri (BOŞ, ölçüm için)
>
> Şimdi `points` tablosunu inceleyelim!"

**💡 Ek Bilgi (zaman varsa):**

```sql
-- Tablo yapısını göster
\d points
```

**Çıktı:**

```
                      Table "public.points"
   Column    |          Type          | Collation | Nullable | Default
-------------+------------------------+-----------+----------+---------
 id          | integer                |           | not null | nextval(...)
 name        | character varying(255) |           | not null |
 type        | character varying(100) |           |          |
 description | text                   |           |          |
 geom        | geometry(Point,4326)   |           |          |
 created_at  | timestamp              |           |          | now()
```

**Eğitmen vurgular:**

> "`geom` sütununa dikkat! Türü `geometry(Point,4326)`:
> - **Point:** Geometri türü
> - **4326:** EPSG kodu (WGS84 koordinat sistemi)"

---

### Adım 3: Nokta Verilerini Görüntüleme (3 dakika)

**🎤 Eğitmen der:**

> "Tüm noktaları listeleyelim. Klasik SQL sorgusu!"

**👨‍🏫 Canlı Demo:**

```sql
SELECT * FROM points;
```

**Enter tuşuna bas!**

**📊 Beklenen Çıktı (kısaltılmış):**

```
 id |          name           |    type    |           description            |                    geom                     |     created_at
----+-------------------------+------------+----------------------------------+--------------------------------------------+--------------------
  1 | Kız Kulesi              | Tarihi     | İstanbul Boğazı'nın simgesi...  | 0101000020E6100000D9CEF753E33D3D40...       | 2024-01-15 10:30:00
  2 | Galata Kulesi           | Tarihi     | Beyoğlu'nda yer alan...          | 0101000020E6100000713D0AD7A33C3D40...       | 2024-01-15 10:30:01
  3 | Ayasofya Camii          | Tarihi     | Bizans döneminde...              | 0101000020E6100000C3F5285C8F3C3D40...       | 2024-01-15 10:30:02
 ...
(17 rows)
```

**🎤 Eğitmen açıklar:**

> "17 satır gördünüz mü? Her satır bir mekan.
>
> Ama `geom` sütunu okunamıyor! `01010000...` gibi hex kodlar. Bu binary format. PostGIS dahili formatı. Biz insanlar için daha okunabilir bir formata çevirelim!"

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes 17 satır görüyor mu? Name sütununda 'Galata Kulesi', 'Kız Kulesi' gibi yerler var mı?"

---

### Adım 4: Geometriyi İnsan Okunabilir Formatta Gösterme (3 dakika)

**🎤 Eğitmen der:**

> "Şimdi PostGIS'in süper gücünü göreceğiz: `ST_AsText()` fonksiyonu!"

**👨‍🏫 Canlı Demo:**

```sql
SELECT id, name, type, ST_AsText(geom) as koordinat
FROM points;
```

**📝 Açıklama (Enter'dan önce):**

**🎤 Eğitmen der:**

> "`ST_AsText()` → 'Spatial Type As Text'
> Geometriyi WKT (Well-Known Text) formatına çevirir.
>
> WKT formatı coğrafi verilerin standart metin gösterimidir. Örnek:
> `POINT(29.0041 41.0211)` → Boylam 29.00°, Enlem 41.02°"

**Enter tuşuna bas!**

**📊 Beklenen Çıktı:**

```
 id |          name           |    type    |         koordinat
----+-------------------------+------------+---------------------------
  1 | Kız Kulesi              | Tarihi     | POINT(29.0041 41.0211)
  2 | Galata Kulesi           | Tarihi     | POINT(28.9742 41.0256)
  3 | Ayasofya Camii          | Tarihi     | POINT(28.98 41.0086)
  4 | Topkapı Sarayı          | Tarihi     | POINT(28.9833 41.0115)
  5 | Kapalıçarşı             | Tarihi     | POINT(28.968 41.0107)
  6 | Vodafone Park           | Stadyum    | POINT(29.027 41.0392)
  7 | Şükrü Saracoğlu Stadı   | Stadyum    | POINT(29.0367 40.9878)
  8 | Nef Stadyumu            | Stadyum    | POINT(28.9947 41.1035)
  9 | Forum İstanbul          | AVM        | POINT(28.8097 41.0556)
 10 | Boğaziçi Üniversitesi   | Üniversite | POINT(29.0449 41.0839)
 11 | İstanbul Üniversitesi   | Üniversite | POINT(28.9643 41.0119)
 12 | İTÜ Ayazağa             | Üniversite | POINT(29.025 41.105)
 13 | YTÜ Davutpaşa           | Üniversite | POINT(28.892 41.022)
 14 | Ortaköy Meydanı         | Semt       | POINT(29.0281 41.0482)
 15 | Karaköy İskelesi        | İskele     | POINT(28.977 41.0217)
 16 | Üsküdar İskelesi        | İskele     | POINT(29.0155 41.0263)
 17 | Beşiktaş İskelesi       | İskele     | POINT(29.0237 41.0425)
(17 rows)
```

**🎤 Eğitmen vurgular:**

> "Harika! Artık koordinatları okuyabiliyoruz!
>
> Örneğin Galata Kulesi:
> `POINT(28.9742 41.0256)`
> 
> - **28.9742** → Boylam (Longitude, X ekseni, Doğu-Batı)
> - **41.0256** → Enlem (Latitude, Y ekseni, Kuzey-Güney)
>
> Bu koordinatlar **WGS84** sisteminde (EPSG:4326). GPS cihazlarının da kullandığı sistem!"

**📍 Görsel Açıklama:**

**Eğitmen harita gösterir (tarayıcıda):**

Google Maps veya OpenStreetMap'te koordinatları göster:

```
https://www.google.com/maps?q=41.0256,28.9742
```

**Eğitmen der:**

> "Bu koordinatı Google Maps'e yapıştırırsanız Galata Kulesi'ni göreceksiniz!"

**💡 İleri Seviye Not (zaman varsa):**

```sql
-- JSON formatında da gösterebiliriz
SELECT id, name, ST_AsGeoJSON(geom) as geojson
FROM points
LIMIT 3;
```

**Çıktı:**

```json
{"type":"Point","coordinates":[29.0041,41.0211]}
```

---

### Adım 5: Mekansal Sorgu - Mesafe Hesaplama (5 dakika)

**🎤 Eğitmen der:**

> "PostGIS'in asıl gücü şimdi ortaya çıkacak! İki nokta arası mesafeyi hesaplayalım.
>
> Soru: Kız Kulesi ile Galata Kulesi arası kaç kilometre?"

**👨‍🏫 Canlı Demo:**

**Sorguyu yavaşça yaz (her satırı açıklayarak):**

```sql
SELECT 
  a.name as nokta1,
  b.name as nokta2,
  ST_Distance(a.geom::geography, b.geom::geography) / 1000 as mesafe_km
FROM points a, points b
WHERE a.id = 1 AND b.id = 2;
```

**Satır Satır Açıklama (Enter'dan önce):**

**🎤 Eğitmen açıklar:**

**Satır 1-2:**
> "`a.name as nokta1` → İlk noktanın adı
> `b.name as nokta2` → İkinci noktanın adı
> Alias kullanıyoruz (`as`)"

**Satır 3:**
> "`ST_Distance(geom1, geom2)` → PostGIS mesafe fonksiyonu
>
> **ÇOK ÖNEMLİ:** `::geography` cast yapıyoruz!
>
> - **geometry:** Düz projeksiyon (metre değil, derece)
> - **geography:** Küresel yüzey (gerçek dünya, metre)
>
> Dünya düz değil, küreseldir! O yüzden `geography` kullanıyoruz.
>
> `/ 1000` → Metreyi kilometreye çevir"

**Satır 4:**
> "`FROM points a, points b` → Self-join (tabloyu kendisiyle birleştir)
> `a` ve `b` aynı tablo, farklı alias'lar"

**Satır 5:**
> "`WHERE a.id = 1 AND b.id = 2`
> - ID 1 → Kız Kulesi
> - ID 2 → Galata Kulesi"

**Enter tuşuna bas!**

**📊 Beklenen Çıktı:**

```
   nokta1    |    nokta2     | mesafe_km
-------------+---------------+------------
 Kız Kulesi  | Galata Kulesi |      2.93
(1 row)
```

**🎤 Eğitmen heyecanla:**

> "**2.93 kilometre!** Bu, kuş uçuşu mesafedir. PostGIS, dünya yüzeyinde gerçek mesafeyi hesapladı!
>
> İnanılmaz değil mi? Tek bir SQL sorgusuyla!"

**🗺️ Doğrulama:**

**Eğitmen tarayıcıda gösterir:**

Google Maps Distance Tool:

```
Kız Kulesi: 41.0211, 29.0041
Galata Kulesi: 41.0256, 28.9742

Mesafe: ~2.9 km ✓
```

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes 2.93 km sonucunu gördü mü? Farklı bir değer alanlar var mı?"

**💡 Deneysel Öğrenme:**

**Eğitmen der:**

> "Başka noktalar deneyelim! Mesela Boğaziçi Üniversitesi ile İTÜ arası?"

```sql
-- Boğaziçi Üni (id=10) ile İTÜ (id=12) arası
SELECT 
  a.name as nokta1,
  b.name as nokta2,
  ST_Distance(a.geom::geography, b.geom::geography) / 1000 as mesafe_km
FROM points a, points b
WHERE a.id = 10 AND b.id = 12;
```

**Çıktı:**

```
        nokta1          |    nokta2   | mesafe_km
------------------------+-------------+-----------
 Boğaziçi Üniversitesi  | İTÜ Ayazağa |     2.69
```

**🎤 Eğitmen der:**

> "2.69 km! Kampüsler birbirine çok yakınmış."

**📚 Diğer PostGIS Fonksiyonları (Hızlı Tanıtım):**

**Eğitmen slayt gösterir veya tahtaya yazar:**

```sql
-- Alan hesaplama (poligon için)
ST_Area(geom::geography)

-- Çizgi uzunluğu
ST_Length(geom::geography)

-- Nokta içinde mi? (Point in Polygon)
ST_Contains(polygon, point)

-- Kesişiyor mu?
ST_Intersects(geom1, geom2)

-- Buffer (etki alanı)
ST_Buffer(geom, distance)

-- Centroid (merkez nokta)
ST_Centroid(geom)
```

**🎤 Eğitmen der:**

> "PostGIS'te 300+ mekansal fonksiyon var! İleri derslerde daha fazlasını öğrenebilirsiniz."

---

### Adım 6: PostgreSQL Terminalinden Çıkış (1 dakika)

**🎤 Eğitmen der:**

> "Dersi bitirmeden önce çıkalım. psql'den çıkmak için:"

```sql
\q
```

**Enter tuşuna bas!**

**📊 Beklenen:**

Terminal normal PowerShell/Bash prompt'una döner:

```powershell
PS C:\Users\username\web-gis-vibe-workshop>
```

**🎤 Eğitmen açıklar:**

> "`\q` → quit (çık)
> PostgreSQL terminalinden çıktık, ama container hâlâ çalışıyor. Veriler kaybolmadı!"

---

### Kapanış ve Özet (1 dakika)

**🎤 Eğitmen der:**

> "Tebrikler! PostGIS'i keşfettik. Hızlı bir özet:"

**📊 Slayt Göster: Ders 2 Özeti**

```
✅ TAMAMLANAN GÖREVLER
─────────────────────────────────────────
✓ docker exec ile PostgreSQL container'ına girildi
✓ psql CLI kullanıldı
✓ Tablolar listelendi (\dt)
✓ 17 nokta verisi görüntülendi
✓ ST_AsText() ile WKT formatı öğrenildi
✓ ST_Distance() ile mesafe hesaplandı
✓ geography vs geometry farkı anlaşıldı

📚 ÖĞRENİLEN KAVRAMLAR
─────────────────────────────────────────
• PostGIS extension nedir?
• Geometri veri türleri (POINT, LINESTRING, POLYGON)
• WKT (Well-Known Text) formatı
• EPSG:4326 (WGS84) koordinat sistemi
• Mekansal fonksiyonlar (ST_Distance, ST_AsText)
• geography vs geometry cast
• Self-join kavramı

📐 KULLANILAN SQL KOMUTLARI
─────────────────────────────────────────
\dt                              → Tabloları listele
\d points                        → Tablo yapısı
SELECT * FROM points;            → Tüm kayıtlar
ST_AsText(geom)                  → WKT formatı
ST_Distance(g1, g2)              → Mesafe
geom::geography                  → Tip dönüşümü
\q                               → Çıkış
```

**🎤 Eğitmen vurgular:**

> "Artık mekansal veri sorgulayabiliyorsunuz! Sonraki derste bu verileri GeoServer'da WMS servisi olarak yayınlayacağız. Haritada görsel olarak göreceğiz!"

---

## 📋 Eğitmen Kontrol Listesi

### Ders Başında

- [ ] postgis container "Up" durumunda
- [ ] Terminal font büyük ve okunabilir
- [ ] Örnek koordinatlar tarayıcıda test edildi
- [ ] SQL komutları hazır (copy-paste için)

### Ders Sırasında

- [ ] Her SQL komutu çalıştırılmadan önce açıklandı
- [ ] Çıktılar ekranda yeterince uzun süre gösterildi
- [ ] Katılımcılar komutları takip edebiliyor
- [ ] Zaman yönetimi (15 dk)

### Ders Sonunda

- [ ] Herkes mesafe hesaplama sorgusunu çalıştırabildi
- [ ] \q komutuyla çıkış yapıldı
- [ ] Container hâlâ çalışıyor (Ders 3 için)

---

## 🔧 Troubleshooting Rehberi

### 1. "psql: FATAL: role 'gis' does not exist"

**Çözüm:**

```powershell
# Kullanıcı adını kontrol et
docker exec -it postgis psql -U gis -d gis

# -U gis kısmı önemli!
```

### 2. "ERROR: relation 'points' does not exist"

**Veri yüklenmemiş:**

```powershell
# Init script çalıştı mı kontrol et
docker compose logs postgis | findstr "PostgreSQL init process complete"

# Yoksa container'ı yeniden başlat
docker compose down
docker compose up -d
```

### 3. Türkçe Karakterler Bozuk

**psql'de encoding ayarla:**

```sql
\encoding UTF8
```

### 4. SQL Hatası: "syntax error at or near..."

**Yaygın hatalar:**

```sql
-- YANLIŞ: Noktalı virgül unutma
SELECT * FROM points

-- DOĞRU:
SELECT * FROM points;

-- YANLIŞ: Tek tırnak yerine çift tırnak
SELECT * FROM points WHERE name = "Galata";

-- DOĞRU:
SELECT * FROM points WHERE name = 'Galata Kulesi';
```

---

## 📚 Ek Kaynaklar

### PostGIS Fonksiyon Referansı (Temel)

| Fonksiyon | Açıklama | Örnek |
|-----------|----------|-------|
| `ST_AsText(geom)` | Geometriyi WKT formatına çevir | `POINT(29 41)` |
| `ST_AsGeoJSON(geom)` | GeoJSON formatı | `{"type":"Point",...}` |
| `ST_Distance(g1, g2)` | İki geometri arası mesafe | Metre cinsinden |
| `ST_Area(geom)` | Poligon alanı | Metrekare |
| `ST_Length(geom)` | Çizgi uzunluğu | Metre |
| `ST_Contains(g1, g2)` | g1, g2'yi içeriyor mu? | true/false |
| `ST_Intersects(g1, g2)` | Kesişiyorlar mı? | true/false |
| `ST_Buffer(geom, d)` | Etrafında buffer oluştur | Yeni poligon |

### WKT Format Örnekleri

```sql
-- Nokta
POINT(29.0041 41.0211)

-- Çizgi
LINESTRING(29.0 41.0, 29.1 41.1, 29.2 41.2)

-- Poligon (kapalı halka)
POLYGON((28.9 41.0, 29.0 41.0, 29.0 41.1, 28.9 41.1, 28.9 41.0))

-- Çoklu nokta
MULTIPOINT((29.0 41.0), (29.1 41.1), (29.2 41.2))
```

### EPSG Kodları (Sık Kullanılanlar)

| Kod | Sistem | Kullanım |
|-----|--------|----------|
| **4326** | WGS84 | GPS, coğrafi koordinatlar (derece) |
| **3857** | Web Mercator | Google Maps, OpenLayers |
| **32635** | UTM Zone 35N | Türkiye (derece yerine metre) |
| **5253** | ED50 / UTM Zone 35N | Eski Türkiye haritaları |

### psql Meta-Komutları

```sql
\dt            -- Tabloları listele
\d points      -- Tablo yapısı
\l             -- Veritabanlarını listele
\du            -- Kullanıcıları listele
\q             -- Çıkış
\?             -- Yardım
\h SELECT      -- SQL komut yardımı
```

---

## 🎯 Sonraki Ders Hazırlığı

**Ders 3'e Geçiş:**

> "15 dakikalık PostGIS dersimiz bitti. Sonraki ders 30 dakika: GeoServer yapılandırması!
>
> Şimdi öğrendiğiniz bu nokta verilerini harita servisi olarak yayınlayacağız. Web tarayıcısından herkes görebilecek!"

**Katılımcılara Not:**

> "Container'ları açık bırakın! GeoServer'da bu verileri kullanacağız."

**Eğitmen Ders Arası Görevleri:**

- [ ] Herkes mesafe sorgusunu başarıyla çalıştırdı mı?
- [ ] PostGIS kavramları anlaşıldı mı? (hızlı soru-cevap)
- [ ] Ders 3 için GeoServer tamamen başladı mı kontrol et
- [ ] GeoServer login ekranını test et

---

**📝 Eğitmen Notu:** SQL bilmeyen katılımcılar için çok detaylı anlatım yapıldı. Hızlı ilerleyen gruplarda "İleri Seviye Not" bölümlerini ekleyebilirsiniz.

**🎉 Başarılar!**
