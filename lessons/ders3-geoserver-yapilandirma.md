# Ders 3: GeoServer Yapılandırması (30 dakika)

> **Eğitmen Ders Notu** - GeoServer ile WMS Servisi Yayınlama

---

## 📋 Ders Özeti

| Özellik | Detay |
|---------|-------|
| **Süre** | 30 dakika |
| **Zorluk** | Orta |
| **Ön Gereksinim** | Ders 1-2 tamamlanmış, GeoServer ve PostGIS çalışıyor |
| **Hedef Kitle** | GeoServer bilmeyenler için |

---

## 🎯 Ders Hedefleri

Bu dersin sonunda katılımcılar şunları yapabilecek:

- [ ] GeoServer Admin Panel'e giriş yapmak
- [ ] Workspace kavramını anlamak ve oluşturmak
- [ ] PostGIS veri kaynağı (Store) eklemek
- [ ] Docker container network mantığını kavramak (host=postgis)
- [ ] Layer (katman) yayınlamak
- [ ] Koordinat sistemi (SRS) ayarlarını yapmak
- [ ] Bounding Box hesaplamak
- [ ] Layer Preview ile WMS servisini test etmek
- [ ] GetFeatureInfo ile öznitelik sorgulama yapmak

---

## 📚 Eğitmen Ön Hazırlık

### Ders Öncesi Teknik Kontroller (10 dakika önce)

```bash
# 1. GeoServer container çalışıyor mu?
docker ps | findstr geoserver
# Beklenen: "Up X minutes"

# 2. GeoServer erişilebilir mi?
curl http://localhost:8088/geoserver  # Port 8088 çakışma önü için
# Veya tarayıcıda test et

# 3. Login yapılabiliyor mu?
# admin / geoserver ile giriş yap

# 4. PostGIS connection test
# GeoServer'dan postgis:5432'ye erişim test et

# 5. Örnek workspace/store temizle (eğer varsa)
# Data → Workspaces → workshop → Delete (eğer önceden oluşturulmuşsa)
```

### Materyal Hazırlığı

- [ ] **GeoServer ekranları:** Screenshot'lar hazır
- [ ] **Slayt:** GeoServer mimarisi (Workspace → Store → Layer)
- [ ] **Not:** host=postgis vurgusu (ÇOKTANBAYILI!)
- [ ] **Tarayıcı:** 2 sekme (Admin panel + Layer Preview)

### Kritik Uyarılar Listesi

**⚠️ EN SIK YAPILAN HATA:**
```
❌ host = localhost
❌ host = 127.0.0.1
✅ host = postgis  (Docker container adı!)
```

**Eğitmen bu hatayı en az 3 kez vurgulayacak!**

---

## 🎬 Ders Akışı (30 dakika)

### Giriş: GeoServer Nedir? (2 dakika)

**🎤 Eğitmen Konuşması:**

> "Şimdiye kadar container başlattık, PostGIS'te verileri sorgularla. Ama bu veriler henüz 'web'e açık değil. Sadece SQL ile erişebiliyoruz.
>
> GeoServer, coğrafi verileri web servisleri olarak yayınlar. Böylece herhangi bir harita uygulaması bu verileri kullanabilir.
>
> Düşünün: Google Maps gibi, ama sizin verilerinizle, kendi sunucunuzda!"

**📊 Slayt Göster: GeoServer Mimarisi**

```
┌────────────────────────────────────────────────────┐
│           GEOSERVER MİMARİSİ                       │
├────────────────────────────────────────────────────┤
│                                                    │
│  1. Workspace (Çalışma Alanı)                     │
│     └─ İsim alanı (namespace)                     │
│                                                    │
│  2. Store (Veri Kaynağı)                          │
│     └─ PostGIS, Shapefile, GeoPackage            │
│                                                    │
│  3. Layer (Katman)                                │
│     └─ Tablo → Harita katmanı                     │
│                                                    │
│  4. Style (SLD)                                   │
│     └─ Görselleştirme kuralları                   │
│                                                    │
│  5. Service (WMS, WFS, WCS)                       │
│     └─ Web servisleri                             │
│                                                    │
│  Akış: Workspace → Store → Layer → Style → WMS   │
│                                                    │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen açıklar:**

> "GeoServer hiyerarşik yapıda çalışır:
> 
> **Workspace** → Projeniz (klasör gibi)
> **Store** → Veri kaynağınız (PostGIS bağlantısı)
> **Layer** → Yayınlanan katman (points tablosu)
> **Style** → Görünüm (kırmızı nokta, mavi çizgi)
> **Service** → Protokol (WMS, WFS)"

---

### Adım 1: GeoServer'a Giriş (3 dakika)

**🎤 Eğitmen der:**

> "İlk adım: Admin Panel'e giriş. Ders 1'de zaten test etmiştik, şimdi detaylı göreceğiz."

**👨‍🏫 Canlı Demo:**

**Tarayıcı aç:**
```
http://localhost:8088/geoserver
```

**📊 Beklenen: GeoServer Ana Sayfası**

**Eğitmen ekranı gösterir:**

```
┌─────────────────────────────────────────────────────┐
│  GeoServer  2.24.1                        [Login]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│      🗺️                                            │
│     GeoServer                                       │
│                                                     │
│  Open Source Geospatial Server                     │
│                                                     │
│  [Documentation]  [Tutorials]  [Community]         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Eğitmen sağ üst köşedeki [Login] butonuna tıklar**

**Login Formu:**

```
┌──────────────────────────────────┐
│  Username: [admin         ]      │
│  Password: [geoserver     ]      │
│            [Login]  [Cancel]     │
└──────────────────────────────────┘
```

**Eğitmen yavaşça yazar:**
- Username: `admin`
- Password: `geoserver`

**🎤 Eğitmen der:**

> "Varsayılan kullanıcı adı `admin`, şifre `geoserver`. Production ortamında mutlaka değiştirin!"

**[Login] butonuna tıkla**

**📊 Beklenen: GeoServer Admin Dashboard**

```
┌────────────────────────────────────────────────────┐
│ GeoServer  2.24.1                     admin [Logout]│
├───────────────┬────────────────────────────────────┤
│ ≡ Menu        │  Welcome to GeoServer              │
│               │                                    │
│ ▼ Data        │  📊 Status                         │
│   Layer       │  Layers: 0                         │
│   Preview     │  Stores: 0                         │
│   Workspaces  │  Workspaces: 0                     │
│   Stores      │                                    │
│   Layers      │  🔧 Configuration                  │
│   Layer       │  Service Metadata: Incomplete      │
│   Groups      │                                    │
│   Styles      │  📁 Data Directory                 │
│               │  /opt/geoserver/data_dir           │
│ ▼ Services    │                                    │
│   WMS         │                                    │
│   WFS         │                                    │
│   WCS         │                                    │
│               │                                    │
└───────────────┴────────────────────────────────────┘
```

**🎤 Eğitmen ekranı tanıtır:**

> "Sol tarafta menü:
> - **Data** → Veri yönetimi (workspace, store, layer)
> - **Services** → WMS, WFS ayarları
> - **Settings** → Genel ayarlar
>
> Sağ tarafta özet bilgiler:
> - **Layers: 0** → Henüz layer yok
> - **Stores: 0** → Henüz veri kaynağı yok
> - **Workspaces: 0** → Henüz workspace yok
>
> Hepsini sıfırdan oluşturacağız!"

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes 'Welcome to GeoServer' yazısını görüyor mu? Sol menüde 'Data' var mı?"

---

### Adım 2: Workspace Oluşturma (5 dakika)

**🎤 Eğitmen der:**

> "İlk adım workspace oluşturmak. Workspace, layer ve store'ları organize eder. Her proje için ayrı workspace kullanabilirsiniz."

**👨‍🏫 Canlı Demo:**

**Sol menüden:**
```
Data → Workspaces
```

**Tıkla!**

**📊 Beklenen: Workspaces Sayfası**

```
┌────────────────────────────────────────────────────┐
│  Workspaces                                        │
├────────────────────────────────────────────────────┤
│  [Add new workspace]                              │
│                                                    │
│  No workspaces found.                             │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Eğitmen [Add new workspace] butonuna tıklar**

**New Workspace Formu:**

```
┌────────────────────────────────────────────────────┐
│  Create new workspace                              │
├────────────────────────────────────────────────────┤
│                                                    │
│  Name: *                                          │
│  [workshop                              ]          │
│                                                    │
│  Namespace URI: *                                 │
│  [http://workshop.local                 ]          │
│                                                    │
│  ☑ Default Workspace                              │
│     Make this the default workspace               │
│                                                    │
│  Isolated Workspace:                              │
│  ☐ Enabled                                        │
│                                                    │
│  [Submit]  [Cancel]                               │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Eğitmen formu doldurur (adım adım):**

**Alan 1: Name**

**🎤 Eğitmen der:**

> "`Name` alanı workspace adı. Küçük harf, boşluksuz, tire veya alt çizgi kullanabilirsiniz."

**Yazar:**
```
workshop
```

**Alan 2: Namespace URI**

**🎤 Eğitmen der:**

> "`Namespace URI` benzersiz bir tanımlayıcı. URL formatında olmalı ama gerçek bir URL olması gerekmez. Bu, WMS servislerinde layer adlarını ayırt etmek için kullanılır."

**Yazar:**
```
http://workshop.local
```

**Alan 3: Default Workspace**

**🎤 Eğitmen der:**

> "`Default Workspace` işaretleyin. Bu, varsayılan workspace olacak. Yeni layer'lar otomatik buraya eklenecek."

**Checkbox'ı işaretle:**
```
☑ Default Workspace
```

**Isolated Workspace boş bırak (işaretsiz)**

**🎤 Eğitmen açıklar:**

> "`Isolated Workspace` güvenlik özelliğidir. Workspace'lerin birbirinden izole edilmesini sağlar. Şimdilik gerek yok."

**[Submit] butonuna tıkla!**

**📊 Beklenen: Başarı Mesajı**

```
┌────────────────────────────────────────────────────┐
│  ✅ Workspace 'workshop' successfully created      │
└────────────────────────────────────────────────────┘
```

**Ve workspace listesi:**

```
┌────────────────────────────────────────────────────┐
│  Workspaces                    [Add new workspace] │
├────────────────────────────────────────────────────┤
│  Name      │ URI                   │ Default       │
│  workshop  │ http://workshop.local │ ✓ (default)   │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen vurgular:**

> "Harika! `workshop` workspace'i oluşturduk. 'Default' sütununda tik var. Şimdi bu workspace'e veri kaynağı ekleyeceğiz!"

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes `workshop` workspace'ini görüyor mu? Default sütununda tik var mı?"

---

### Adım 3: PostGIS Store (Veri Kaynağı) Ekleme (10 dakika)

**🎤 Eğitmen der:**

> "Şimdi en kritik adım! PostGIS veritabanına bağlanacağız. **BURADA EN ÇOK HATA YAPILIYOR!** Dikkatli olun!"

**⚠️ BÜYÜK UYARI SLAYTIgöster:**

```
┌────────────────────────────────────────────────────┐
│  ⚠️ ÇOK ÖNEMLİ! EN SIK YAPILAN HATA!               │
├────────────────────────────────────────────────────┤
│                                                    │
│  Docker container'ları birbirleriyle               │
│  iletişim kurarken CONTAINER ADINI kullanır!      │
│                                                    │
│  ❌ YANLIŞ: host = localhost                       │
│  ❌ YANLIŞ: host = 127.0.0.1                       │
│  ✅ DOĞRU:  host = postgis                         │
│                                                    │
│  Neden? docker-compose.yml'de servis adı:         │
│  postgis:                                          │
│    image: postgis/postgis:15-3.3                  │
│                                                    │
│  GeoServer container'ı "postgis" adıyla           │
│  PostgreSQL container'ını bulur!                  │
│                                                    │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen 3 kez tekrarlar:**

> "host = `postgis`"
> "host = `postgis`"
> "host = `postgis`"
> "Lütfen `localhost` yazmayın!"

**👨‍🏫 Canlı Demo:**

**Sol menüden:**
```
Data → Stores
```

**Tıkla!**

**📊 Stores Sayfası:**

```
┌────────────────────────────────────────────────────┐
│  Stores                         [Add new Store]   │
├────────────────────────────────────────────────────┤
│  No stores found.                                 │
└────────────────────────────────────────────────────┘
```

**[Add new Store] butonuna tıkla**

**📊 New data source Sayfası:**

**Çok sayıda veri kaynağı türü gösterilir:**

```
┌────────────────────────────────────────────────────┐
│  New data source                                   │
├────────────────────────────────────────────────────┤
│  Vector Data Sources:                             │
│                                                    │
│  [Shapefile]  [GeoPackage]  [PostGIS]            │
│  [WFS]  [GeoJSON]  ...                            │
│                                                    │
│  Raster Data Sources:                             │
│  [GeoTIFF]  [WorldImage]  ...                     │
│                                                    │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen der:**

> "Birçok veri kaynağı türü var. Shapefile, GeoPackage, GeoTIFF... Bizim PostGIS kullanmamız gerekiyor."

**[PostGIS] butonuna tıkla!**

**📊 New PostGIS Store Formu (UZUN FORM):**

```
┌────────────────────────────────────────────────────┐
│  Add PostGIS data store                            │
├────────────────────────────────────────────────────┤
│                                                    │
│  Basic Store Info                                 │
│  ─────────────────                                │
│  Workspace: *                                     │
│  [workshop        ▼]  (dropdown)                  │
│                                                    │
│  Data Source Name: *                              │
│  [postgis_db                              ]        │
│                                                    │
│  Description:                                     │
│  [PostGIS Database                        ]        │
│                                                    │
│  Enabled: ☑                                       │
│                                                    │
│  ─────────────────                                │
│  Connection Parameters                            │
│  ─────────────────                                │
│                                                    │
│  dbtype: * [postgis  ▼]  (otomatik seçili)       │
│                                                    │
│  host: * [postgis                         ]  ⚠️   │
│                                                    │
│  port: * [5432                            ]        │
│                                                    │
│  database: * [gis                         ]        │
│                                                    │
│  schema: * [public                        ]        │
│                                                    │
│  user: * [gis                             ]        │
│                                                    │
│  passwd: [gis                             ]        │
│                                                    │
│  ... (diğer alan Advanced)                        │
│                                                    │
│  [Save]  [Cancel]                                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Eğitmen formu adım adım doldurur:**

**Alan 1: Workspace**

**🎤 Eğitmen der:**

> "Dropdown'dan `workshop` seçin. Zaten default olduğu için otomatik seçili olabilir."

**Seçer:**
```
Workspace: workshop
```

**Alan 2: Data Source Name**

**🎤 Eğitmen der:**

> "`Data Source Name` istediğiniz isim olabilir. Ben `postgis_db` yazıyorum. Siz de aynısını yazın."

**Yazar:**
```
Data Source Name: postgis_db
```

**Alan 3: Description (opsiyonel)**

**Yazar:**
```
Description: PostGIS Database
```

**Alan 4: Enabled**

**Checkbox işaretli olmalı:**
```
Enabled: ☑
```

**🎤 Eğitmen der:**

> "Enabled işaretli olmalı ki store aktif olsun."

**─── Connection Parameters ───**

**🎤 Eğitmen BÜYÜK UYARI:**

> "⚠️ ŞİMDİ ÇOK DİKKATLİ OLUN! Bağlantı parametrelerini giryoruz. HATA YAPMAYACAĞIZ!"

**Alan 5: dbtype**

**Otomatik seçili:**
```
dbtype: postgis
```

**🎤 Eğitmen der:**

> "`dbtype` otomatik seçili. Dokunmayın."

**Alan 6: host** (KRİTİK!)

**🎤 Eğitmen EKRANI BÜYÜTÜR ve DER:**

> "⚠️⚠️⚠️ EN ÖNEMLİ ALAN!
>
> `host` alanına `postgis` yazacağız.
> `localhost` DEĞİL!
> `127.0.0.1` DEĞİL!
> `postgis`!
>
> Docker container adı!"

**Yavaşça yazar (ekranda büyük font):**
```
host: postgis
```

**Eğitmen tahtaya/slayta büyük harflerle yazar:**

```
HOST = POSTGIS
```

**🎤 Eğitmen katılımcılara sorar:**

> "Herkes `postgis` yazdı mı? Yan taraftaki arkadaşınızın ekranını kontrol edin!"

**(Katılımcılar birbirlerini kontrol eder - 30 saniye)**

**Alan 7: port**

**🎤 Eğitmen der:**

> "`port` PostgreSQL'in varsayılan portu: 5432. Değiştirmeyin."

**Yazar:**
```
port: 5432
```

**Alan 8: database**

**🎤 Eğitmen der:**

> "`database` adı `gis`. Ders 2'de kullandığımız veritabanı."

**Yazar:**
```
database: gis
```

**Alan 9: schema**

**🎤 Eğitmen der:**

> "`schema` PostgreSQL'de tablolar organize etmek için kullanılır. Varsayılan schema `public`."

**Yazar:**
```
schema: public
```

**Alan 10: user**

**🎤 Eğitmen der:**

> "`user` kullanıcı adı: `gis`"

**Yazar:**
```
user: gis
```

**Alan 11: passwd**

**🎤 Eğitmen der:**

> "`passwd` şifre: `gis`. Basit bir şifre, sadece workshop için!"

**Yazar:**
```
passwd: gis
```

**Diğer alanlar varsayılan bırakılır (scroll down gerekebilir)**

**🎤 Eğitmen özet yapar:**

> "Formu doldurduk. Tekrar kontrol edelim:
> 
> Workspace: workshop ✓
> Name: postgis_db ✓
> host: postgis ✓✓✓
> port: 5432 ✓
> database: gis ✓
> user: gis ✓
> passwd: gis ✓
>
> Herkes aynı değerleri yazdı mı?"

**[Save] butonuna tıkla!**

**📊 İki Olasılık:**

**Başarılı Olursa ✅:**

```
┌────────────────────────────────────────────────────┐
│  ✅ New PostGIS data store successfully added      │
└────────────────────────────────────────────────────┘
```

**Ve otomatik olarak "New Layer chooser" sayfası açılır!**

**Başarısız Olursa ❌:**

```
┌────────────────────────────────────────────────────┐
│  ❌ Error creating data store                      │
│                                                    │
│  Error obtaining connection:                      │
│  Could not create connection to database server.  │
│  Attempted reconnect 3 times. Giving up.          │
│                                                    │
│  [Back]                                            │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen hata alırsa (sakin kalarak):**

> "Hata aldıysak, muhtemelen `host` yanlış yazılmıştır. Geri dönüp kontrol edelim."

**Troubleshooting:**

1. [Back] butonuna tıkla
2. Store'ları listele: Data → Stores
3. postgis_db varsa → Edit
4. `host` alanını kontrol et: `postgis` mi?
5. Save → Test et

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes başarı mesajını gördü mü? 'New Layer chooser' sayfası açıldı mı?"

---

### Adım 4: Layer (Katman) Yayınlama (7 dakika)

**🎤 Eğitmen der:**

> "Store başarıyla eklendi! Şimdi GeoServer otomatik olarak hangi tabloların yayınlanabileceğini gösteriyor."

**📊 New Layer Chooser Sayfası:**

```
┌────────────────────────────────────────────────────┐
│  New Layer                                         │
├────────────────────────────────────────────────────┤
│  Add layer from store: postgis_db                 │
│                                                    │
│  Available layers:                                │
│                                                    │
│  Layer Name        │ Action                       │
│  ───────────────────────────────────               │
│  points            │ [Publish]  [Configure...]    │
│  polygons          │ [Publish]  [Configure...]    │
│  lines             │ [Publish]  [Configure...]    │
│                                                    │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen açıklar:**

> "3 tablo görünüyor: points, polygons, lines. Ders 2'de gördüğümüz tablolar!
>
> - `points` → 17 nokta verisi (DOLU)
> - `polygons` → Boş (çizim için)
> - `lines` → Boş (ölçüm için)
>
> `points` tablosunu yayınlayalım."

**`points` satırında [Publish] butonuna tıkla!**

**📊 Edit Layer Sayfası (ÇOKUZUN FORM):**

**Sekmeler:**
- Data
- Publishing
- Dimensions
- Tile Caching

**Varsayılan olarak "Data" sekmesi açık**

```
┌────────────────────────────────────────────────────┐
│  Edit Layer: points                                │
├────────────────────────────────────────────────────┤
│  [Data] [Publishing] [Dimensions] [Tile Caching]  │
│                                                    │
│  ═════════════════════════════════════            │
│  Data                                             │
│  ═════════════════════════════════════            │
│                                                    │
│  Name: * [workshop:points                  ]       │
│  Title:  [points                           ]       │
│  Abstract: [                               ]       │
│                                                    │
│  ───────────────────────────────────              │
│  Coordinate Reference Systems                     │
│  ───────────────────────────────────              │
│                                                    │
│  Native SRS: *                                    │
│  [EPSG:4326                            ] [Find]   │
│                                                    │
│  Declared SRS: *                                  │
│  [EPSG:4326                            ] [Find]   │
│                                                    │
│  SRS Handling: *                                  │
│  ○ Keep native                                    │
│  ● Force declared                                 │
│  ○ Reproject native to declared                   │
│                                                    │
│  ───────────────────────────────────              │
│  Bounding Boxes                                   │
│  ───────────────────────────────────              │
│                                                    │
│  Native Bounding Box:                             │
│  Min X: [          ] Max X: [          ]          │
│  Min Y: [          ] Max Y: [          ]          │
│  [Compute from data] [Compute from SRS bounds]    │
│                                                    │
│  Lat/Lon Bounding Box:                            │
│  Min X: [          ] Max X: [          ]          │
│  Min Y: [          ] Max Y: [          ]          │
│  [Compute from native bounds]                     │
│                                                    │
│  ...                                              │
│                                                    │
│  [Save]  [Cancel]                                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Eğitmen scroll yukarı yapar ve baştan açıklar:**

**Bölüm 1: Basic Info**

**🎤 Eğitmen der:**

> "`Name` otomatik `workshop:points` oldu. Workspace + tablo adı.
> `Title` ve `Abstract` opsiyonel. Boş bırakabilirsiniz."

**Bölüm 2: Coordinate Reference Systems (CRS)**

**🎤 Eğitmen der:**

> "Koordinat sistemi ayarları. PostGIS'te EPSG:4326 kullanmıştık, aynısını burada da kullanacağız."

**Native SRS:**

**Eğer boşsa:**

**Yazar:**
```
EPSG:4326
```

**Eğer dolu ve farklıysa değiştirir**

**🎤 Eğitmen açıklar:**

> "`Native SRS` verinin kendi koordinat sistemi. PostGIS'te 4326 olarak kaydetmiştik."

**Declared SRS:**

**Aynı değeri yazar:**
```
EPSG:4326
```

**🎤 Eğitmen açıklar:**

> "`Declared SRS` GeoServer'ın kullanacağı koordinat sistemi. Genelde native ile aynı."

**SRS Handling:**

**Radio button seç:**
```
● Force declared
```

**🎤 Eğitmen açıklar:**

> "`Force declared` seçin. Bu, native ve declared SRS aynı olduğunda önerilir."

**Bölüm 3: Bounding Boxes (EN ÖNEMLİ!)**

**🎤 Eğitmen VURGULAR:**

> "⚠️ Bounding Box verinin coğrafi kapsamıdır. Harita hangi bölgeyi gösterecek? Bu alanları doldurmadan layer yayınlanamaz!"

**Native Bounding Box:**

**🎤 Eğitmen der:**

> "`Native Bounding Box` verinin gerçek sınırlarıdır. GeoServer bunu otomatik hesaplayabilir."

**[Compute from data] butonuna tıkla!**

**📊 Beklenen: Alanlar otomatik dolar**

```
Native Bounding Box:
Min X: 28.8097    Max X: 29.0449
Min Y: 40.9878    Max Y: 41.1050
```

**🎤 Eğitmen açıklar:**

> "Harika! GeoServer tüm noktaları taradı ve sınırları buldu.
> 
> Min X: 28.8097 → En batıdaki nokta (Forum İstanbul)
> Max X: 29.0449 → En doğudaki nokta (Boğaziçi Üni)
> Min Y: 40.9878 → En güneydeki nokta (Şükrü Saracoğlu)
> Max Y: 41.1050 → En kuzeydeki nokta (İTÜ Ayazağa)
>
> Bu değerler İstanbul'un bir bölümünü kapsıyor!"

**Lat/Lon Bounding Box:**

**🎤 Eğitmen der:**

> "`Lat/Lon Bounding Box` WGS84 (EPSG:4326) sisteminde sınırlardır. Native'den türetebiliriz."

**[Compute from native bounds] butonuna tıkla!**

**📊 Beklenen: Aynı değerler (çünkü native zaten 4326)**

```
Lat/Lon Bounding Box:
Min X: 28.8097    Max X: 29.0449
Min Y: 40.9878    Max Y: 41.1050
```

**Eğitmen scroll aşağı yapar**

**Diğer alanları varsayılan bırakır**

**⚠️ Kontrol:**

**Eğitmen özet yapar:**

> "Kontrol edelim:
> - Native SRS: EPSG:4326 ✓
> - Declared SRS: EPSG:4326 ✓
> - Native Bounding Box: Dolu ✓
> - Lat/Lon Bounding Box: Dolu ✓
>
> Hazırız! Kaydet!"

**[Save] butonuna tıkla!**

**📊 Başarı Mesajı:**

```
┌────────────────────────────────────────────────────┐
│  ✅ Layer 'workshop:points' successfully saved     │
└────────────────────────────────────────────────────┘
```

**Ve Layers listesi gösterilir:**

```
┌────────────────────────────────────────────────────┐
│  Layers                           [Add new Layer]  │
├────────────────────────────────────────────────────┤
│  Name              │ Store      │ Workspace         │
│  workshop:points   │ postgis_db │ workshop          │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen sevinçle:**

> "Tebrikler! İlk layer'ınızı yayınladınız! Artık `workshop:points` bir WMS servisi olarak erişilebilir!"

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes başarı mesajını gördü mü? Layers listesinde `workshop:points` var mı?"

---

### Adım 5: Layer Preview (Test Etme) (5 dakika)

**🎤 Eğitmen der:**

> "Son adım: Layer'ı test edelim! Gerçekten çalışıyor mu görelim."

**👨‍🏫 Canlı Demo:**

**Sol menüden:**
```
Data → Layer Preview
```

**Tıkla!**

**📊 Layer Preview Sayfası:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer Preview                                 🔍 [Search...]   │
├─────────────────────────────────────────────────────────────────┤
│  Layer Name        │ Title  │ Type   │ Common Formats          │
│  ─────────────────────────────────────────────────────────────  │
│  workshop:points   │ points │ Vector │ [OpenLayers] [GeoJSON]  │
│                    │        │        │ [PNG] [KML] ...         │
└─────────────────────────────────────────────────────────────────┘
```

**🎤 Eğitmen açıklar:**

> "`Layer Preview` yayınlanan layer'ları test etmek için kullanılır. Birçok format gösterilir:
> - OpenLayers → Harita önizlemesi
> - GeoJSON → Vektör veri
> - PNG → Görüntü
> - KML → Google Earth formatı"

**`workshop:points` satırında [OpenLayers] linkine tıkla!**

**📊 Yeni sekme açılır: OpenLayers Haritası**

```
┌─────────────────────────────────────────────────────┐
│  GeoServer Layer Preview                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│         İSTANBUL HARİTASI                          │
│                                                     │
│        • • •                                        │
│       • Noktalar •                                 │
│        • • •                                        │
│                                                     │
│  [+] [-]  Zoom kontrolleri                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**🎤 Eğitmen heyecanla:**

> "İŞTE! 17 kırmızı nokta görüyorsunuz! Bunlar PostGIS'teki veriler!
>
> Zoom yapabilir, haritayı kaydırabilirsiniz. Noktalara tıklayıp bilgi alabilirsiniz!"

**Eğitmen haritada gezinir:**

1. **Zoom In** → Boğaz bölgesine yakınlaştır
2. **Noktaları göster** → Galata Kulesi, Kız Kulesi
3. **Tıklama** → Bir noktaya tıkla

**Popup açılır:**

```
┌─────────────────────────────────────┐
│  Feature Info                       │
├─────────────────────────────────────┤
│  id: 1                              │
│  name: Kız Kulesi                   │
│  type: Tarihi                       │
│  description: İstanbul Boğazı'nın   │
│               simgesi...            │
│  geom: POINT(29.0041 41.0211)       │
│  created_at: 2024-01-15T10:30:00Z   │
└─────────────────────────────────────┘
```

**🎤 Eğitmen vurgular:**

> "GetFeatureInfo çalışıyor! Noktaya tıklayınca tüm özellikleri görüyoruz. Bu WMS standardının bir parçası."

**WMS URL'sini göster:**

**Eğitmen tarayıcı adres çubuğunu gösterir:**

```
http://localhost:8080/geoserver/workshop/wms?service=WMS&version=1.1.0&request=GetMap&layers=workshop:points&bbox=28.8097,40.9878,29.0449,41.1050&width=768&height=768&srs=EPSG:4326&format=image/png
```

**🎤 Eğitmen açıklar:**

> "Bu WMS isteğidir! URL'de:
> - `service=WMS` → Web Map Service
> - `layers=workshop:points` → Layer adı
> - `bbox=...` → Bounding Box (görüntülenecek alan)
> - `srs=EPSG:4326` → Koordinat sistemi
> - `format=image/png` → Çıktı formatı
>
> Bu URL'yi herhangi bir harita uygulamasında kullanabilirsiniz!"

**⚠️ Son Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes 17 kırmızı nokta görüyor mu? Noktaya tıklayınca popup açılıyor mu?"

---

### Adım 6: SLD ile Kategorik Stil Düzenleme (8 dakika) - BONUS

**🎤 Eğitmen der:**

> "Tüm noktalar kırmızı görünüyor. Peki, nokta türlerine (type) göre farklı renkler vermek istersek? SLD (Styled Layer Descriptor) kullanırız!"

**⚠️ Opsiyonel Adım:**

> "Bu bölüm ders 3 sonrasında kalan zamanınız varsa yapabilirsiniz. Ders 5'te (Çizim Araçları) da stil düzenleme vardır."

---

**👨‍🏫 Canlı Demo: SLD Editörü**

**Sol menüden:**
```
Data → Styles
```

**Tıkla!**

**📊 Styles Sayfası:**

```
┌────────────────────────────────────────────────────┐
│  Styles                              [Add new style]
├────────────────────────────────────────────────────┤
│  Name            │ Workspace  │ Format  │ Date      │
│                  │            │         │           │
│  (Önceden tanımlı stiller)                         │
│  point           │ (default)  │ SLD     │ ...       │
│  line            │ (default)  │ SLD     │ ...       │
│  polygon         │ (default)  │ SLD     │ ...       │
│  raster          │ (default)  │ SLD     │ ...       │
│                  │            │         │           │
└────────────────────────────────────────────────────┘
```

**[Add new style] butonuna tıkla!**

**📊 New Style Sayfası:**

```
┌────────────────────────────────────────────────────┐
│  Add new style                                     │
├────────────────────────────────────────────────────┤
│                                                    │
│  Name: *                                          │
│  [workshop_points_style              ]             │
│                                                    │
│  Workspace:                                       │
│  [(default)              ▼]                        │
│                                                    │
│  Format:                                          │
│  [SLD             ▼]  (SLD seçili)                │
│                                                    │
│  [Create Style]  [Cancel]                         │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Eğitmen formu doldurur:**

**Alan 1: Name**

**Yazar:**
```
Name: workshop_points_kategorik
```

**Alan 2: Workspace**

**Seç:**
```
Workspace: (default)
```

**Alan 3: Format**

**Zaten seçili:**
```
Format: SLD
```

**[Create Style] butonuna tıkla!**

**📊 SLD Editor Sayfası (KOD EDITÖRÜ):**

```
┌────────────────────────────────────────────────────┐
│  Edit Style: workshop_points_kategorik             │
│                                                    │
│  [← Back] [Preview] [Validate] [Save]             │
│                                                    │
│  ────────────────────────────────────────────────  │
│                                                    │
│  <?xml version="1.0" encoding="UTF-8"?>           │
│  <StyledLayerDescriptor version="1.0.0"           │
│    xsi:schemaLocation="http://www.opengis.net... │
│    xmlns="http://www.opengis.net/sld"            │
│    xmlns:ogc="http://www.opengis.net/ogc"        │
│    xmlns:xlink="http://www.w3.org/1999/xlink"    │
│    xmlns:xsi="http://www.w3.org/2001/XMLSchema..." │
│  >                                                 │
│                                                    │
│    <NamedLayer>                                    │
│      <Name>workshop:points</Name>                 │
│      <UserStyle>                                  │
│        <FeatureTypeStyle>                         │
│          <Rule>                                   │
│            <ogc:Filter>                           │
│              <ogc:PropertyIsEqualTo>              │
│                <ogc:Function name="strSubstring">│
│                  <ogc:PropertyName>type</ogc... │
│                </ogc:Function>                    │
│                <ogc:Literal>T</ogc:Literal>       │
│              </ogc:PropertyIsEqualTo>             │
│            </ogc:Filter>                          │
│            <PointSymbolizer>                      │
│              <Graphic>                            │
│                <Mark>                             │
│                  <WellKnownName>circle</...       │
│                  <Fill>                           │
│                    <CssParameter name="fill">     │
│                      #FF0000                      │
│                    </CssParameter>                │
│                  </Fill>                          │
│                </Mark>                            │
│                <Size>8</Size>                     │
│              </Graphic>                           │
│            </PointSymbolizer>                     │
│          </Rule>                                  │
│        </FeatureTypeStyle>                        │
│      </UserStyle>                                 │
│    </NamedLayer>                                  │
│                                                    │
│  </StyledLayerDescriptor>                          │
│                                                    │
│  ────────────────────────────────────────────────  │
│                                                    │
│  [Save]  [Cancel]                                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen açıklar:**

> "SLD XML dilinde yazılır. Karışık görünüyor, ama yapısı basit:
> 
> 1. **NamedLayer** → Stil hangi layer için?
> 2. **Rule** → Kurallar (eğer type='Tarihi' ise kırmızı)
> 3. **PointSymbolizer** → Nokta nasıl çizilecek?
> 4. **Graphic** → Grafik elemanı
> 5. **Mark** → Şekil (circle, square, triangle...)
> 6. **Fill** → Renk doldurma"

**⚠️ ÖNEMLİ NOT:**

> "SLD'de kullanacağımız type değerleri veritabanındakilerle **TAM OLARAK** eşleşmelidir:
> - `Tarihi` → Tarihi yerler
> - `Stadyum` → Futbol stadyumları
> - `Üniversite` → Eğitim kurumları
> - Diğer → AVM, İskele, Semt vb"

**Tüm kodu sil ve kategorik stil ekle:**

**Eğitmen tüm metni seçer (Ctrl+A) ve siler**

**Yeni kod yazar:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <NamedLayer>
    <Name>workshop:points</Name>
    <UserStyle>
      <Title>Noktalar - Türe Göre Renkli</Title>
      <FeatureTypeStyle>

        <!-- KURAL 1: Tarihi Yerler - KIRMIZI -->
        <Rule>
          <Name>Tarihi</Name>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>type</ogc:PropertyName>
              <ogc:Literal>Tarihi</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#FF0000</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#CC0000</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>

        <!-- KURAL 2: Stadyumlar - MAVİ -->
        <Rule>
          <Name>Stadyum</Name>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>type</ogc:PropertyName>
              <ogc:Literal>Stadyum</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>square</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#0000FF</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#0000CC</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>

        <!-- KURAL 3: Üniversiteler - YEŞİL -->
        <Rule>
          <Name>Üniversite</Name>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>type</ogc:PropertyName>
              <ogc:Literal>Üniversite</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>triangle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#00AA00</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#008800</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>

        <!-- KURAL 4: Varsayılan - GRİ (AVM, İskele, Semt vb) -->
        <Rule>
          <Name>Diğer</Name>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#888888</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#555555</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>8</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>

      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>

</StyledLayerDescriptor>
```

**🎤 Eğitmen açıklar:**

> "SLD yapısı:
> 
> **Rule 1:** `type = 'Tarihi'` → Kırmızı daire (circle), boyut 10
>   Kız Kulesi, Galata Kulesi, Ayasofya vb.
> 
> **Rule 2:** `type = 'Stadyum'` → Mavi kare (square), boyut 10
>   Vodafone Park, Şükrü Saracoğlu, Nef Stadyumu
> 
> **Rule 3:** `type = 'Üniversite'` → Yeşil üçgen (triangle), boyut 10
>   Boğaziçi Üni, İstanbul Üni, İTÜ, YTÜ
> 
> **Rule 4:** Diğer türler → Gri daire, boyut 8 (varsayılan)
>   Forum İstanbul (AVM), Ortaköy (Semt), İskeleler vb.
>
> ⚠️ **ÖNEMLİ:** Rule'lar sırayla değerlendirilir. İlk eşleşen rule uygulanır. 
> Varsayılan rule (filter'sız) MUTLAKA EN SONDA olmalı!"

**[Validate] butonuna tıkla (Hata kontrolü):**

**📊 Beklenen:**

```
✅ SLD validated successfully.
```

**[Save] butonuna tıkla!**

**📊 Başarı Mesajı:**

```
┌────────────────────────────────────────────────────┐
│  ✅ Style 'workshop_points_kategorik' successfully  │
│     saved                                          │
└────────────────────────────────────────────────────┘
```

---

**Adım 2: Stili Layer'a Uygula**

**Sol menüden:**
```
Data → Layers
```

**Tıkla!**

**`workshop:points` satırında [Layer'ı Edit] veya linkine tıkla**

**Edit Layer sayfasında:**

**[Publishing] sekmesine tıkla!**

**📊 Publishing Sekmesi:**

```
┌────────────────────────────────────────────────────┐
│  [Data] [Publishing] [Dimensions] [Tile Caching]  │
│                                                    │
│  ───────────────────────────────────              │
│  WMS Settings                                     │
│  ───────────────────────────────────              │
│                                                    │
│  Styles:                                          │
│  Available Styles:                                │
│  [point (default)]  [line]  [polygon]  [raster]  │
│  [workshop_points_kategorik]  ← YENİ STİL!       │
│                                                    │
│  Default Style:                                   │
│  [workshop_points_kategorik  ▼]  ← Seç!          │
│                                                    │
│  ───────────────────────────────────              │
│  WMS Server Settings                              │
│  ───────────────────────────────────              │
│  ...                                              │
│                                                    │
│  [Save]  [Cancel]                                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Eğitmen açıklar:**

> "Available Styles'ta yeni `workshop_points_kategorik` stili görünüyor! Default Style olarak seç!"

**Dropdown'dan seç:**

```
Default Style: workshop_points_kategorik
```

**[Save] butonuna tıkla!**

**📊 Başarı:**

```
✅ Layer successfully saved
```

---

**Adım 3: Sonucu Test Et**

**Sol menüden:**
```
Data → Layer Preview
```

**`workshop:points` → [OpenLayers] tıkla!**

**📊 Harita Güncellendi!**

```
┌─────────────────────────────────────────────────────┐
│  GeoServer Layer Preview                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│       İSTANBUL HARİTASI (TÜREGÖREİ RENKLİ!)       │
│                                                     │
│   ◼ ← Mavi kare (Stadyumlar)                        │
│  △ ← Yeşil üçgen (Üniversiteler)                    │
│   ● ← Kırmızı daire (Tarihi yerler)                 │
│   ● ← Gri daire (Diğer: AVM, İskele, Semt)         │
│                                                     │
│  [+] [-]  Zoom kontrolleri                         │
│                                                    │
└─────────────────────────────────────────────────────┘
```

**🎤 Eğitmen sevinçle:**

> "MÜKEMMEL! Noktalar artık renkli ve kategoriye göre organize!
>
> - **Kırmızı** (5 nokta): Tarihi yerler (Kız Kulesi, Galata Kulesi, Ayasofya, Topkapı, Kapalıçarşı)
> - **Mavi** (3 nokta): Stadyumlar (Vodafone Park, Şükrü Saracoğlu, Nef Stadyumu)
> - **Yeşil** (4 nokta): Üniversiteler (Boğaziçi, İ.Ü., İTÜ, YTÜ)
> - **Gri** (5 nokta): Diğer (Forum İstanbul AVM, Ortaköy Meydanı, Karaköy İskelesi, Üsküdar İskelesi, Beşiktaş İskelesi)
>
> Toplam = 17 nokta ✓
>
> Kategorik stilin avantajları:
> - **Veri anlama kolaylaşır** → Renkler anlamı temsil eder
> - **Harita okunabilirliği artar** → Farklı türleri hızlı görebilirsiniz
> - **Production ortamına uygun** → Gerçek uygulamalarda böyle kullanılır"

**⚠️ Bonus: Başka Şekiller**

**Eğitmen açıklar:**

> "SLD'de diğer şekiller de kullanabilirsiniz:
> - `circle` → Daire
> - `square` → Kare
> - `triangle` → Üçgen
> - `star` → Yıldız
> - `cross` → Artı işareti
> - `x` → X işareti
>
> Ayrıca harici PNG/SVG ikonları da ekleyebilirsiniz. Advanced kullanım için GeoServer dokümantasyonu!"

**⚠️ Bonus: Dinamik Boyut (Feature Attribute'a Göre)**

**Eğitmen gösterir:**

> "Size'i sabit değil, dinamik yapabilirsiniz. Örneğin, ziyaretçi sayısına göre boyut değişebilir:
>
> ```xml
> <Size>
>   <ogc:Mul>
>     <ogc:Literal>0.002</ogc:Literal>
>     <ogc:PropertyName>visitor_count</ogc:PropertyName>
>   </ogc:Mul>
> </Size>
> ```
>
> Fazla ziyaretçi → Daha büyük nokta!"

---

### Kapanış ve Özet (2 dakika)

**🎤 Eğitmen der:**

> "Harika! 30 dakikada GeoServer'ı kurduk ve ilk layer'ı yayınladık!"

**📊 Slayt: Ders 3 Özeti**

```
✅ TAMAMLANAN GÖREVLER
─────────────────────────────────────────
✓ GeoServer Admin Panel'e giriş yapıldı
✓ Workspace oluşturuldu (workshop)
✓ PostGIS Store eklendi (postgis_db)
✓ Layer yayınlandı (workshop:points)
✓ Koordinat sistemi ayarlandı (EPSG:4326)
✓ Bounding Box hesaplandı
✓ Layer Preview ile test edildi
✓ WMS servisi çalışıyor
✓ **(BONUS)** SLD kategorik stili oluşturuldu

📚 ÖĞRENİLEN KAVRAMLAR
─────────────────────────────────────────
• GeoServer mimarisi (Workspace → Store → Layer)
• Docker container network (host=postgis)
• WMS (Web Map Service) protokolü
• Koordinat sistemi (SRS)
• Bounding Box kavramı
• GetFeatureInfo isteği
• Layer yayınlama süreci
• SLD (Styled Layer Descriptor) - Stil tanımı
• Kategorik stil (ogc:Filter ile kurallar)
• PointSymbolizer, Mark, Fill, Stroke
• Şekil seçimi (circle, square, triangle...)

⚠️ KRİTİK NOKTALAR
─────────────────────────────────────────
❗ host = postgis (localhost değil!)
❗ Bounding Box hesapla (Compute from data)
❗ EPSG:4326 koordinat sistemi
❗ Force declared SRS handling
❗ SLD'de XML söz dizimi doğru olmalı (Validate!)
❗ ogc:Filter ile koşullu stiller oluşturabilirsiniz
```

**🎤 Eğitmen vurgular:**

> "Sonraki derste OpenLayers ile web uygulaması geliştireceğiz. Bu WMS servisini kullanacağız!"

---

## 📋 Eğitmen Kontrol Listesi

### Ders Sonunda

- [ ] Tüm katılımcılar workspace oluşturdu
- [ ] Tüm katılımcılar store ekledi (host=postgis!)
- [ ] Tüm katılımcılar layer yayınladı
- [ ] Layer Preview'de 17 nokta görünüyor
- [ ] Popup çalışıyor
- [ ] **(BONUS)** SLD stili oluşturuldu ve kategorik renkler gösterildi

### Yaygın Sorunlar

| Sorun | Çözüm |
|-------|-------|
| Store eklenemiyor | host=postgis kontrol et |
| Bounding Box boş | Compute from data tıkla |
| Layer görünmüyor | Enabled checkbox işaretli mi? |

---

**🎉 Başarılar!**
