# Ders 3b: GeoServer Katman Yayını (20 dakika)

> **Eğitmen Ders Notu** - Layer Yayınlama ve WMS Test

---

## 📋 Ders Özeti

| Özellik | Detay |
|---------|-------|
| **Süre** | 20 dakika |
| **Zorluk** | Orta |
| **Ön Gereksinim** | Ders 3a tamamlanmış, PostGIS Store bağlantısı kurulmuş |
| **Hedef Kitle** | GeoServer bilmeyenler için |

---

## 🎯 Ders Hedefleri

Bu dersin sonunda katılımcılar şunları yapabilecek:

- [ ] Layer (katman) yayınlamak
- [ ] Koordinat sistemi (SRS) ayarlarını yapmak
- [ ] Bounding Box hesaplamak
- [ ] Layer Preview ile WMS servisini test etmek
- [ ] GetFeatureInfo ile öznitelik sorgulama yapmak

---

## 📚 Ders Öncesi Kontrol

### Ön Gereksinimler

**Ders 3a'da tamamlanmış olmalı:**
- ✅ GeoServer'a login yapıldı
- ✅ `workshop` workspace oluşturuldu
- ✅ `postgis_db` store eklendi
- ✅ PostGIS bağlantısı başarılı

**Kontrol için:**
```
Data → Stores → postgis_db görünüyor mu?
```

---

## 🎬 Ders Akışı (20 dakika)

### Kısa Özet: Neredeyiz? (1 dakika)

**🎤 Eğitmen der:**

> "Ders 3a'da PostGIS bağlantısını kurduk. Store eklendi, veritabanına bağlandık.
>
> Şimdi bu veritabanındaki `points` tablosunu layer olarak yayınlayacağız. Böylece web haritalarında kullanılabilir hale gelecek!"

---

### Adım 4: Layer (Katman) Yayınlama (10 dakika)

**🎤 Eğitmen der:**

> "Store başarıyla eklendi! Şimdi GeoServer otomatik olarak hangi tabloların yayınlanabileceğini gösteriyor."

**📊 New Layer Chooser Sayfası:**

**Eğer açık değilse:**
```
Data → Stores → postgis_db → [Publish]
```

**Veya:**
```
Data → Layers → [Add new layer]
→ postgis_db seç
```

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

**📊 Edit Layer Sayfası (ÇOK UZUN FORM):**

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

### Adım 5: Layer Preview (Test Etme) (7 dakika)

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

### Kapanış ve Özet (2 dakika)

**🎤 Eğitmen der:**

> "Harika! Layer'ı yayınladık ve test ettik! WMS servisi çalışıyor!"

**📊 Slayt: Ders 3b Özeti**

```
✅ TAMAMLANAN GÖREVLER
─────────────────────────────────────────
✓ Layer yayınlandı (workshop:points)
✓ Koordinat sistemi ayarlandı (EPSG:4326)
✓ Bounding Box hesaplandı
✓ Layer Preview ile test edildi
✓ WMS servisi çalışıyor
✓ GetFeatureInfo testi yapıldı

📚 ÖĞRENİLEN KAVRAMLAR
─────────────────────────────────────────
• Layer (katman) yayınlama süreci
• Koordinat sistemi (SRS)
• Bounding Box kavramı
• WMS (Web Map Service) protokolü
• GetFeatureInfo isteği
• OpenLayers önizleme

⚠️ KRİTİK NOKTALAR
─────────────────────────────────────────
❗ Bounding Box hesapla (Compute from data)
❗ EPSG:4326 koordinat sistemi
❗ Force declared SRS handling
❗ WMS URL yapısı
```

**🎤 Eğitmen vurgular:**

> "Sonraki derste (Ders 4) OpenLayers ile web uygulaması geliştireceğiz. Bu WMS servisini kullanacağız!"

---

## 📋 Eğitmen Kontrol Listesi

### Ders Sonunda

- [ ] Tüm katılımcılar layer yayınladı
- [ ] Layer Preview'de 17 nokta görünüyor
- [ ] Popup çalışıyor
- [ ] WMS URL'si anlaşıldı

### Yaygın Sorunlar

| Sorun | Çözüm |
|-------|-------|
| Bounding Box boş | Compute from data tıkla |
| Layer görünmüyor | Enabled checkbox işaretli mi? |
| Popup açılmıyor | GetFeatureInfo enabled mı kontrol et |

---

## 🎯 Opsiyonel İleri Seviye

**Ders 3c - BONUS: SLD ile Kategorik Stiller**

Zamanınız varsa ve ileri seviye stil düzenleme öğrenmek istiyorsanız, Ders 3c'ye geçebilirsiniz. Burada noktaları türlerine göre farklı renk ve şekillerde göstermeyi öğreneceksiniz!

---

**🎉 Başarılar!**
