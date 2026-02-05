# Ders 2: PostGIS ve Mekansal Veri (15 dakika)

> **Eğitmen Ders Notu** - PostgreSQL/PostGIS ile Mekansal Veri Sorgulama

---

## 📋 Ders Özeti

| Özellik | Detay |
|---------|-------|
| **Süre** | 15 dakika |
| **Zorluk** | Başlangıç-Orta |
| **Ön Gereksinim** | Ders 1 tamamlanmış, DBeaver veya QGIS kurulu |
| **Hedef Kitle** | SQL bilgisi olmayan ve GUI tercih eden katılımcılar |
| **Araçlar** | DBeaver (DB GUI) ve/veya QGIS (GIS görselleştirme) |

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

# 2. DBeaver (veya QGIS) kurulu mu?
# Windows: Başlat Menüsü → DBeaver
# veya
# Windows: Başlat Menüsü → QGIS

# 3. DBeaver'da PostgreSQL bağlantısı yapılandırılmış mı?
# Bağlantı Ayarları:
# - Host: localhost
# - Port: 5454  (değiştirilmiş port!)
# - Database: gis
# - Username: gis
# - Password: gis

# 4. QGIS kullanılacaksa, DB Manager plugin aktif mi?
# QGIS → Plugins → Manage and Install Plugins → "DB Manager" ara → Yüklü mı?
```

### Materyal Hazırlığı

- [ ] **DBeaver:** Kurulu ve PostgreSQL bağlantısı yapılandırılmış
- [ ] **QGIS:** (Opsiyonel) Kurulu ve DB Manager plugin'i aktif
- [ ] **Slayt:** PostGIS veri türleri diyagramı
- [ ] **İstanbul Haritası:** QGIS'te açılmış (görselleştirme için)
- [ ] **Proje:** `web-gis-vibe-workshop` DBeaver'da açılmış

### Öğretim Stratejisi

**Pedagojik Yaklaşım:**

1. **Görsel Keşfetme:** Terminal yerine GUI arayüz (daha kolay)
2. **Point-and-Click:** SQL yazmazlar, query builder kullanırlar
3. **Immediate Visualization:** QGIS'te noktaları harita üzerinde göster
4. **Real-World Tools:** Profesyonel DB yönetim araçları

---

## 🎬 Ders Akışı (15 dakika)

### Giriş: PostGIS Nedir? (2 dakika)

**🎤 Eğitmen Konuşması:**

> "İlk derste container'ları başlattık. Şimdi içindeki veriyi görsel araçlarla keşfedeceğiz!
>
> PostgreSQL dünyanın en gelişmiş açık kaynak veritabanıdır. PostGIS ise ona 'coğrafi süper güçler' ekleyen bir eklentidir.
>
> Normal veritabanları sayılar, metinler tutar. PostGIS ise **noktalar, çizgiler, poligonlar** tutar. Bugün bunu DBeaver ve QGIS ile göreceğiz!"

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

> "Bizim projemizde 17 nokta verisi var: Galata Kulesi, Kız Kulesi, stadyumlar, üniversiteler... Hepsi POINT türünde. Şimdi bu verileri görsel araçlarla sorgulayalım!"

---

### Adım 1: DBeaver ile PostgreSQL'e Bağlantı (3 dakika)

**🎤 Eğitmen der:**

> "DBeaver, database'leri yönetmek için profesyonel bir araç. Terminal yerine görseli tercih ediyoruz - daha kolay!"

#### DBeaver Kurulumu (ilk kez ise)

**Eğitmen eğer DBeaver kurulu değilse:**

```
1. https://dbeaver.io/download/ adresine git
2. "Download DBeaver Community" butonuna tıkla
3. Windows installer'ı indir (.exe)
4. Çalıştır, "Next" ile devam et, "Finish"
5. DBeaver açılır, birkaç saniye başlama süresi var
```

#### DBeaver'da Bağlantı Kurma

**👨‍🏫 Canlı Demo:**

**DBeaver açık ekranda:**

**Sol panel: "Database" sekmesi**

**Sağ tık → "New Database Connection"**

```
1. PostgreSQL seç
2. "Next"
3. Bağlantı ayarları doldur:
   - Name: gis-workshop (veya istediğin ad)
   - Host: localhost
   - Port: 5454  ⚠️ (değiştirilmiş port!)
   - Database: gis
   - Username: gis
   - Password: gis
4. "Test Connection" butonuna tıkla
```

**📊 Test Başarılı:**

```
Connected successfully ✓
```

**Eğer başarısız:**

```
ERROR: Connection refused

Çözüm:
1. PostgreSQL container çalışıyor mu? (docker ps)
2. Port 5454 doğru mu? (docker-compose.yml kontrol et)
3. Şifre doğru mu?
```

**🎤 Eğitmen açıklar:**

> "Bağlantı kuruldu! Şimdi verileri görebiliyoruz."

**"Finish" butonuna tıkla**

**📊 Beklenen Ekran:**

DBeaver sol panelinde:

```
Databases
└── gis-workshop
    ├── Schemas
    │   └── public
    │       └── Tables
    │           ├── points
    │           ├── polygons
    │           └── lines
    └── Other Objects
```

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes sol panelde `points`, `polygons`, `lines` tablolarını görüyor mu?"

---

### Adım 2: Tabloyu İnceleme (2 dakika)

**🎤 Eğitmen der:**

> "Şimdi tablo yapısına bakalım."

**👨‍🏫 Canlı Demo:**

**Sol panel → Tables → `points` tablosuna çift tıkla**

**📊 Açılan Pencere:**

```
┌─────────────────────────────────────────┐
│ points                                  │
├──────────────┬─────────┬────────────────┤
│ Column       │ Type    │ Not Null       │
├──────────────┼─────────┼────────────────┤
│ id           │ integer │ ✓              │
│ name         │ varchar │ ✓              │
│ type         │ varchar │                │
│ description  │ text    │                │
│ geom         │ geometry(Point,4326) │   │
│ created_at   │ timestamp │ default now()│
└──────────────┴─────────┴────────────────┘
```

**🎤 Eğitmen vurgular:**

> "`geom` sütununa dikkat! Türü `geometry(Point,4326)`:
> - **Point:** Geometri türü (nokta)
> - **4326:** EPSG kodu (WGS84 koordinat sistemi)"

---

### Adım 3: Verileri Görüntüleme (2 dakika)

**🎤 Eğitmen der:**

> "Şimdi tüm 17 noktayı göreceğiz."

**👨‍🏫 Canlı Demo:**

**Sol panel → Tables → `points` → Sağ tık → "View Data"**

**📊 Açılan Tablo:**

```
┌────┬──────────────────────┬──────────┬─────────────────────────────────┬────────────────┐
│ id │ name                 │ type     │ description                     │ geom (geometry)│
├────┼──────────────────────┼──────────┼─────────────────────────────────┼────────────────┤
│ 1  │ Kız Kulesi           │ Tarihi   │ İstanbul Boğazı'nın simgesi...  │ POINT (visible)
│ 2  │ Galata Kulesi        │ Tarihi   │ Beyoğlu'nda yer alan...         │ POINT (visible)
│ 3  │ Ayasofya Camii       │ Tarihi   │ Bizans döneminde...             │ POINT (visible)
│ 4  │ Topkapı Sarayı       │ Tarihi   │ ...                             │ POINT (visible)
│ 5  │ Kapalıçarşı          │ Tarihi   │ ...                             │ POINT (visible)
│ 6  │ Vodafone Park        │ Stadyum  │ ...                             │ POINT (visible)
│ 7  │ Şükrü Saracoğlu Std  │ Stadyum  │ ...                             │ POINT (visible)
│ 8  │ Nef Stadyumu         │ Stadyum  │ ...                             │ POINT (visible)
│ 9  │ Forum İstanbul       │ AVM      │ ...                             │ POINT (visible)
│10  │ Boğaziçi Üniversitesi│ Üniversite│...                             │ POINT (visible)
│11  │ İstanbul Üniversitesi│ Üniversite│...                             │ POINT (visible)
│12  │ İTÜ Ayazağa          │ Üniversite│...                             │ POINT (visible)
│13  │ YTÜ Davutpaşa        │ Üniversite│...                             │ POINT (visible)
│14  │ Ortaköy Meydanı      │ Semt     │ ...                             │ POINT (visible)
│15  │ Karaköy İskelesi     │ İskele   │ ...                             │ POINT (visible)
│16  │ Üsküdar İskelesi     │ İskele   │ ...                             │ POINT (visible)
│17  │ Beşiktaş İskelesi    │ İskele   │ ...                             │ POINT (visible)
└────┴──────────────────────┴──────────┴─────────────────────────────────┴────────────────┘
```

**🎤 Eğitmen açıklar:**

> "17 satır, 17 mekan! Her birinin geometrisi (geom sütunu) var. Sağda 'POINT (visible)' yazısı gösteriyor.
>
> Haritada görmek ister misiniz? QGIS'e geçelim!"

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes 17 satırı görebiliyor mu? Galata Kulesi, Kız Kulesi, stadyumlar, üniversiteler var mı?"

---

### Adım 4: QGIS ile Verileri Görselleştirme (5 dakika)

**🎤 Eğitmen der:**

> "DBeaver tablo görüntülüyor. QGIS harita gösteriyor. Noktaları harita üzerinde görelim!"

#### QGIS Kurulumu (ilk kez ise)

**Eğitmen eğer QGIS kurulu değilse:**

```
1. https://qgis.org/download/ adresine git
2. "QGIS x.x.x for Windows (OSGeo4W)" indir
3. OSGeo4W installer'ı çalıştır
4. "Advanced Install" seç
5. QGIS "Desktop" seç
6. "Finish"
```

#### QGIS'te PostGIS Verilerini Açma

**👨‍🏫 Canlı Demo:**

**QGIS açık:**

**Üst menu → Layer → Data Source Manager**

```
veya Ctrl+L
```

**Sol panel → "PostgreSQL" sekmesi**

**"New" butonuna tıkla:**

```
Name: gis-workshop
Host: localhost
Port: 5454  ⚠️ (değiştirilmiş port!)
Database: gis
User: gis
Password: gis
```

**"OK"**

**📊 Beklenen:**

Sol panelde "PostgreSQL" altında:

```
gis-workshop
└── public
    ├── points (Geometry)
    ├── polygons (Geometry)
    └── lines (Geometry)
```

**Çift tıkla `points` → Haritaya eklenir**

**📊 Beklenen Harita:**

```
┌──────────────────────────────────────┐
│                                      │
│  ╔════════════════════════════╗     │
│  ║  QGIS Harita               ║     │
│  ╟────────────────────────────╢     │
│  ║                            ║     │
│  ║      • (nokta 1)           ║     │
│  ║   •        •               ║     │
│  ║      •  •   • • •          ║     │
│  ║    •    •      • •         ║     │
│  ║       •   •                ║     │
│  ║                            ║     │
│  ║  [+] [-] → ↑ ↓ Pan zoom    ║     │
│  ╚════════════════════════════╝     │
│                                      │
│  Layers:                             │
│  ✓ points (17 features)              │
│                                      │
└──────────────────────────────────────┘
```

**🎤 Eğitmen heyecanla:**

> "İşte! 17 nokta harita üzerinde! İstanbul'un dört bir yanında dağılmışlar. Galata Kulesi, Kız Kulesi, stadyumlar, üniversiteler... hepsi görünüyor!
>
> Harita zoom ve pan yapabilir, noktaya tıklayıp özniteliklerini görebilirsiniz!"

**💡 Interaktif Keşfetme:**

**Eğitmen katılımcılarla:**

1. **Harita üzerinde zoom:** Scroll tekerlek
2. **Pan (kaydırma):** Sağ tık + sürükle
3. **Noktaya tıkla:** Popup açılır
4. **Öznitelikler:** Altta öznitelikleri görünt

---

### Adım 5: DBeaver'da SQL Sorgu - Mesafe Hesaplama (3 dakika)

**🎤 Eğitmen der:**

> "Şimdi en başarılı kısım: PostGIS'in mekansal fonksiyonlarını deneyelim!
>
> Soru: Kız Kulesi ile Galata Kulesi arası kaç kilometre?"

**👨‍🏫 Canlı Demo:**

**DBeaver'da sağ panelin üstündeki sekme:**

**"SQL Editor" sekmesini aç (veya SQL sekmesi)**

**Veya: Tools → SQL Editor → "SQL Editor"**

**Aşağıdaki sorguyu yaz:**

```sql
SELECT 
  a.name as nokta1,
  b.name as nokta2,
  ST_Distance(a.geom::geography, b.geom::geography) / 1000 as mesafe_km
FROM points a, points b
WHERE a.id = 1 AND b.id = 2;
```

**Sorguyu seç → Ctrl+Enter veya sağ tık → "Execute"**

**📊 Beklenen Çıktı:**

```
nokta1          | nokta2           | mesafe_km
─────────────────┼──────────────────┼──────────
Kız Kulesi      | Galata Kulesi    | 2.56
```

**🎤 Eğitmen vurgular:**

> "**2.56 kilometre!** PostGIS, dünya yüzeyinde gerçek mesafeyi hesapladı!
>
> Tek bir SQL sorgusuyla! DBeaver'da komutun yanı sıra sonuç hemen görünüyor."

**🗺️ QGIS'te Görselleştirme:**

**Eğitmen QGIS haritasında gösterir:**

```
Kız Kulesi (nokta 1)
    |
    |  2.56 km
    |
Galata Kulesi (nokta 2)
```

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes 2.56 km sonucunu gördü mü? DBeaver'da sorgu çalıştırabildi mi?"

---

### Adım 6: Başka Sorguları Deneme (2 dakika)

**🎤 Eğitmen der:**

> "Başka noktalar deneyelim!"

**Örnek 1: Boğaziçi Üni ile İTÜ arası:**

```sql
SELECT 
  a.name as nokta1,
  b.name as nokta2,
  ST_Distance(a.geom::geography, b.geom::geography) / 1000 as mesafe_km
FROM points a, points b
WHERE a.id = 10 AND b.id = 12;
```

**Sonuç: 2.88 km**

**Örnek 2: Belirli tipe ait noktaları listele:**

```sql
SELECT name, type, ST_AsText(geom) as koordinat
FROM points
WHERE type = 'Stadyum'
ORDER BY name;
```

**Sonuç:**

```
name                    | type    | koordinat
────────────────────────┼─────────┼──────────────────────
Nef Stadyumu            | Stadyum | POINT(28.9947 41.1035)
Şükrü Saracoğlu Stadı   | Stadyum | POINT(29.0367 40.9878)
Vodafone Park           | Stadyum | POINT(29.027 41.0392)
```

**🎤 Eğitmen açıklar:**

> "PostGIS SQL'i çok güçlü! Mesafe, filtreleme, geometri dönüşümü... hepsi tek platform'da!"

---

### Kapanış ve Özet (1 dakika)

**📊 Slayt Göster: Ders 2 Özeti**

```
✅ TAMAMLANAN GÖREVLER
─────────────────────────────────────────
✓ DBeaver PostgreSQL bağlantısı kuruldu
✓ Tablo yapısı (schema) incelendi
✓ 17 nokta verisi görüntülendi
✓ QGIS'te noktalar harita üzerinde gösterildi
✓ PostGIS mekansal sorguları çalıştırıldı
✓ ST_Distance() ile mesafe hesaplandı

📚 ÖĞRENİLEN KAVRAMLAR
─────────────────────────────────────────
• PostGIS extension nedir?
• Geometri veri türleri (POINT, LINESTRING, POLYGON)
• DBeaver - GUI database yönetimi
• QGIS - GIS görselleştirme platformu
• Mekansal fonksiyonlar (ST_Distance, ST_AsText)
• geography vs geometry cast
• SQL SELECT, JOIN, WHERE kullanımı

🛠️ KULLANILAN ARAÇLAR
─────────────────────────────────────────
• DBeaver Community      → Database yönetimi
• QGIS 3.x              → Coğrafi görselleştirme
• DB Manager (QGIS)     → PostGIS bağlantısı
• SQL Editor (DBeaver)  → Sorgu yazma/çalıştırma
```

**🎤 Eğitmen vurgular:**

> "Artık mekansal veriyi hem tablo olarak (DBeaver) hem harita olarak (QGIS) görebiliyorsunuz! Sonraki derste bu verileri GeoServer'da WMS servisi olarak yayınlayacağız. Web tarayıcısından herkes görebilecek!"

---

## 📋 Eğitmen Kontrol Listesi

### Ders Başında

- [ ] postgis container "Up" durumunda
- [ ] DBeaver kurulu ve PostgreSQL bağlantısı yapılandırılmış
- [ ] QGIS kurulu (opsiyonel)
- [ ] Port 5454 kullanıldığı doğrulandı
- [ ] Bağlantı test edildi

### Ders Sırasında

- [ ] Her sorgu ekranda açık ve okunabilir
- [ ] QGIS haritası yeterince büyük gösterildi
- [ ] Katılımcılar takip edebiliyor
- [ ] Zaman yönetimi (15 dk)

### Ders Sonunda

- [ ] Herkes mesafe hesaplama sorgusunu çalıştırabildi
- [ ] Harita üzerinde noktalar görünüyor
- [ ] Sonraki ders için container'lar çalışıyor

---

## 🔧 Troubleshooting Rehberi

### 1. DBeaver PostgreSQL Bağlantısı Başarısız

**Hata: "Connection refused"**

**Çözüm:**

```
1. Port 5454 doğru mu?
   docker-compose.yml'de kontrol et:
   ports:
     - "5454:5432"

2. Container çalışıyor mu?
   docker ps | findstr postgis

3. Şifre doğru mu?
   Username: gis
   Password: gis

4. Bilgisayar firewall'u engellemiyor mu?
   → Windows Defender Firewall → Allow through firewall
```

### 2. QGIS DB Manager PostgreSQL Bağlantısı

**Hata: "Could not load the layer"**

**Çözüm:**

```
1. QGIS → Plugins → Manage and Install Plugins
2. "DB Manager" ara ve yüklü olduğunu doğrula
3. Bağlantı ayarları (Host, Port, Database, User, Password) kontrol et
4. Port 5454 mü yazıldı?
```

### 3. QGIS Harita Boş/Noktalar Görünmüyor

**Çözüm:**

```
1. Points layer sol panelde seçili mi?
2. Harita zoom seviyesi (Ctrl+0 → Fit)
3. Layer basit rengine ve stiline sahip mi?
   → Right-click layer → Properties → Symbology
```

### 4. Türkçe Karakterler Bozuk

**DBeaver:**
```
Tools → Preferences → Database → Editors → SQL → Encoding: UTF-8
```

**QGIS:**
```
Settings → Options → Data Sources → Encoding: UTF-8
```

---

## 📚 Ek Kaynaklar

### DBeaver İpuçları

| Özellik | Kısayol | Açıklama |
|---------|---------|----------|
| SQL Editor Aç | Ctrl+L | Sorgu yazma |
| Sorgu Çalıştır | Ctrl+Enter | Seçili sorguyu execute et |
| Prettify SQL | Ctrl+Shift+P | SQL'i formatla |
| Bağlantı Kur | Ctrl+Alt+D | Yeni DB bağlantısı |
| Results Export | Sağ tık | CSV, JSON, SQL export |

### QGIS İpuçları

| Özellik | Kısayol | Açıklama |
|---------|---------|----------|
| Fit Harita | Ctrl+0 | Tüm layer'ları göster |
| Zoom In | + | İçeri zoom |
| Zoom Out | - | Dışarı zoom |
| Pan | Sağ tık | Harita kaydırma |
| Attribute Table | F6 | Seçili layer'ın tablısu |
| Identify | Ctrl+I | Tıklanan feature info |
| Refresh | F5 | Render'ı yenile |

### PostGIS Fonksiyonları (DBeaver SQL Editor'da)

```sql
-- Koordinatları WKT formatında göster
SELECT name, ST_AsText(geom) FROM points LIMIT 5;

-- Stadyumları listele
SELECT name, type FROM points WHERE type = 'Stadyum';

-- Tüm noktaları ID'lerine göre sırala
SELECT id, name, type FROM points ORDER BY id;

-- Sadece tarihi mekanlar
SELECT name, description FROM points WHERE type = 'Tarihi';

-- Koordinatları derece olarak göster
SELECT name, ST_X(geom) as lon, ST_Y(geom) as lat FROM points;

-- Noktaları centroid'lerine göre gruplayıp sayeleme
SELECT type, COUNT(*) as adet FROM points GROUP BY type ORDER BY adet DESC;
```

### SQL Temel Komutlar (DBeaver'da)

```sql
-- Tüm sütunları göster
SELECT * FROM points;

-- Belirli sütunları göster
SELECT name, type FROM points;

-- Satır sayısını sınırla
SELECT * FROM points LIMIT 5;

-- Filtreleme
SELECT * FROM points WHERE type = 'Tarihi';

-- Sıralama
SELECT * FROM points ORDER BY name ASC;  -- Alfabetik
SELECT * FROM points ORDER BY id DESC;   -- Tersine

-- Sayma
SELECT COUNT(*) as toplam FROM points;

-- Tip'e göre sayma
SELECT type, COUNT(*) FROM points GROUP BY type;

-- İki tabloyu birleştir (JOIN)
SELECT a.name, b.name, ST_Distance(a.geom::geography, b.geom::geography)/1000
FROM points a, points b
WHERE a.id < b.id
ORDER BY ST_Distance(a.geom::geography, b.geom::geography) DESC LIMIT 5;
```

---

## 🎯 Sonraki Ders Hazırlığı

**Ders 3'e Geçiş:**

> "PostGIS dersimiz bitti. Sonraki ders 30 dakika: GeoServer yapılandırması!
>
> Şimdi öğrendiğiniz bu nokta verilerini harita servisi olarak yayınlayacağız. Web tarayıcısından herkes görebilecek!"

**Katılımcılara Not:**

> "DBeaver ve QGIS açık bırakabilirsiniz. GeoServer'da tekrar bu verileri kullanacağız."

**Eğitmen Ders Arası Görevleri:**

- [ ] Herkes mesafe sorgusunu başarıyla çalıştırdı mı?
- [ ] PostGIS kavramları anlaşıldı mı? (hızlı soru-cevap)
- [ ] Ders 3 için GeoServer tamamen başladı mı kontrol et
- [ ] GeoServer login ekranını test et (port 8088)

---

**📝 Eğitmen Notu:** DBeaver ve QGIS, SQL yazma stresini kaldırıyor. Katılımcılar GIS ve coğrafi veri kavramlarına daha rahat odaklanabiliyor.

**🎉 Başarılar!**
