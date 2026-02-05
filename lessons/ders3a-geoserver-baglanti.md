# Ders 3a: GeoServer PostGIS Bağlantısı (20 dakika)

> **Eğitmen Ders Notu** - GeoServer ile PostGIS Bağlantısı Kurulumu

---

## 📋 Ders Özeti

| Özellik | Detay |
|---------|-------|
| **Süre** | 20 dakika |
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
- [ ] **Not:** host=postgis vurgusu (ÇOK ÖNEMLİ!)
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

## 🎬 Ders Akışı (20 dakika)

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

**⚠️ BÜYÜK UYARI SLAYT göster:**

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

> "⚠️ ŞİMDİ ÇOK DİKKATLİ OLUN! Bağlantı parametrelerini giriyoruz. HATA YAPMAYACAĞIZ!"

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

### Kapanış ve Sonraki Adım (2 dakika)

**🎤 Eğitmen der:**

> "Harika! PostGIS bağlantısını başarıyla kurduk! Store oluşturduk ve veritabanına bağlandık."

**📊 Slayt: Ders 3a Özeti**

```
✅ TAMAMLANAN GÖREVLER
─────────────────────────────────────────
✓ GeoServer Admin Panel'e giriş yapıldı
✓ Workspace oluşturuldu (workshop)
✓ PostGIS Store eklendi (postgis_db)
✓ Bağlantı testi başarılı

📚 ÖĞRENİLEN KAVRAMLAR
─────────────────────────────────────────
• GeoServer mimarisi (Workspace → Store → Layer)
• Docker container network (host=postgis)
• Workspace (çalışma alanı) kavramı
• Store (veri kaynağı) kavramı
• PostGIS bağlantı parametreleri

⚠️ KRİTİK NOKTALAR
─────────────────────────────────────────
❗ host = postgis (localhost değil!)
❗ Container'lar birbirine container adıyla bağlanır
❗ Workspace namespace benzersiz olmalı
```

**🎤 Eğitmen vurgular:**

> "Sonraki adım: Layer (katman) yayınlayacağız ve haritada göstereceğiz!"

---

## 📋 Eğitmen Kontrol Listesi

### Ders Sonunda

- [ ] Tüm katılımcılar workspace oluşturdu
- [ ] Tüm katılımcılar store ekledi (host=postgis!)
- [ ] Store bağlantı testi başarılı
- [ ] "New Layer chooser" sayfası göründü

### Yaygın Sorunlar

| Sorun | Çözüm |
|-------|-------|
| Store eklenemiyor | host=postgis kontrol et |
| Connection timeout | PostGIS container çalışıyor mu? docker ps kontrol et |
| Authentication failed | user=gis, passwd=gis doğru mu? |

---

## 🎯 Sonraki Adım

**Ders 3b - GeoServer Katman Yayını**

Şimdi hazırız! PostGIS bağlantısı kuruldu, sırada layer yayınlama var!

---

**🎉 Başarılar!**
