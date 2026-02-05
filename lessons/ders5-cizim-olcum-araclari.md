# Ders 5: Çizim ve Ölçüm Araçları (30 dakika)

> **Eğitmen Ders Notu** - OpenLayers Draw Interaction ile Sayısallaştırma

---

## 📋 Ders Özeti

| Özellik | Detay |
|---------|-------|
| **Süre** | 30 dakika |
| **Zorluk** | Orta-İleri |
| **Ön Gereksinim** | Ders 1-4 tamamlanmış, OpenLayers harita çalışıyor |
| **Hedef Kitle** | JavaScript temel bilgisi gerekli |

---

## 🎯 Ders Hedefleri

Bu dersin sonunda katılımcılar şunları yapabilecek:

- [ ] Vector layer ve source kavramını anlamak
- [ ] Draw interaction kullanmak (Polygon, LineString, Point)
- [ ] Polygon çizimi ve alan hesaplama
- [ ] LineString çizimi ve mesafe hesaplama
- [ ] ol.sphere modülünü kullanmak
- [ ] Çizim stilini özelleştirmek
- [ ] Çizimleri temizlemek
- [ ] Draw interaction lifecycle'ı yönetmek

---

## 📚 Eğitmen Ön Hazırlık

### Ders Öncesi Teknik Kontroller (5 dakika önce)

```bash
# 1. Web uygulaması çalışıyor mu?
curl http://localhost:8081

# 2. Harita görünüyor mu?
# Tarayıcıda test et

# 3. Console'da hata var mı?
# F12 → Console → Temiz olmalı
```

### Materyal Hazırlığı

- [ ] **VS Code:** app.js açık, Draw kodu hazır
- [ ] **Tarayıcı:** Developer Tools açık (Console)
- [ ] **Slayt:** Draw interaction lifecycle
- [ ] **Hesap Makinesi:** Alan/mesafe doğrulama için

---

## 🎬 Ders Akışı (30 dakika)

### Giriş: Sayısallaştırma Nedir? (2 dakika)

**🎤 Eğitmen Konuşması:**

> "Sayısallaştırma (digitization), coğrafi objeleri haritadan çizerek veri oluşturmaktır.
>
> Örnek kullanımlar:
> - Bina çizimi (arazi planlaması)
> - Yol ağı çizimi (navigasyon)
> - Tarla sınırları (tarım)
> - Rota planlama
>
> OpenLayers'ın Draw interaction'ı bunu kolaylaştırır!"

**📊 Slayt Göster: Çizim Türleri**

```
┌────────────────────────────────────────────────────┐
│         OPENLAYERS ÇİZİM TÜRLERİ                   │
├────────────────────────────────────────────────────┤
│                                                    │
│  Point (Nokta)         •                          │
│  Kullanım: POI, işaretçi                          │
│                                                    │
│  LineString (Çizgi)    •───•───•                  │
│  Kullanım: Yol, mesafe ölçümü                     │
│                                                    │
│  Polygon (Poligon)     ╱─────╲                    │
│                       │       │                    │
│                        ╲─────╱                     │
│  Kullanım: Bina, alan hesaplama                   │
│                                                    │
│  Circle (Daire)        ⚪                          │
│  Kullanım: Etki alanı, buffer                     │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

### Adım 1: Vector Layer Oluşturma (5 dakika)

**🎤 Eğitmen der:**

> "Çizimler nereye kaydedilecek? Vector layer'a!
>
> Şimdiye kadar Tile layer kullandık (raster). Şimdi Vector layer öğreneceğiz."

**VS Code'da app.js, WMS layer tanımından sonra ekle:**

```javascript
// ═══════════════════════════════════════════════════
//  VECTOR LAYER (Çizimler için)
// ═══════════════════════════════════════════════════

// Vector source (çizimlerin saklandığı yer)
const drawSource = new ol.source.Vector();

// Vector layer (çizimlerin gösterildiği katman)
const drawLayer = new ol.layer.Vector({
    source: drawSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)' // Beyaz şeffaf dolgu
        }),
        stroke: new ol.style.Stroke({
            color: '#3498db', // Mavi çizgi
            width: 3
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: '#3498db' }),
            stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
        })
    })
});

// Map'e ekle
map.addLayer(drawLayer);
```

**🎤 Eğitmen satır satır açıklar:**

**Line 1-2: Vector Source**

> "`ol.source.Vector()` → Çizilen feature'ları saklar. Bir array gibi düşünün."

**Line 4-25: Vector Layer**

> "`ol.layer.Vector()` → Source'taki feature'ları render eder.
>
> `style` → Çizim stili:
> - `fill` → Poligon dolgu rengi (şeffaf beyaz)
> - `stroke` → Çizgi rengi ve kalınlığı (mavi, 3px)
> - `image` → Nokta stili (daire, mavi)"

**Line 27: Map'e Ekle**

> "`map.addLayer(drawLayer)` → Layer'ı haritaya ekler."

**Dosyayı kaydet ve tarayıcıyı yenile**

**🎤 Eğitmen der:**

> "Henüz bir şey görmeyeceksiniz. Çünkü çizim yok! Şimdi Draw interaction ekleyeceğiz."

---

### Adım 2: Polygon Çizim Aracı (8 dakika)

**🎤 Eğitmen der:**

> "Polygon çizimi için Draw interaction kullanacağız. Sidebar'daki 'Çizim (Polygon)' butonuna fonksiyon bağlayalım."

**VS Code'da app.js, en alta ekle:**

```javascript
// ═══════════════════════════════════════════════════
//  POLYGON ÇİZİM ARACI
// ═══════════════════════════════════════════════════

let draw; // Global değişken (interaction'ı saklar)

document.getElementById('drawBtn').onclick = function() {
    // Önceki çizim varsa kaldır
    if (draw) {
        map.removeInteraction(draw);
    }
    
    // Yeni Draw interaction oluştur
    draw = new ol.interaction.Draw({
        source: drawSource, // Çizimlerin kaydedileceği source
        type: 'Polygon'     // Çizim türü: Polygon
    });
    
    // Çizim tamamlandığında (drawend event)
    draw.on('drawend', function(e) {
        const feature = e.feature;           // Çizilen feature
        const geometry = feature.getGeometry(); // Geometri
        
        // Alan hesaplama (metre kare)
        const area = ol.sphere.getArea(geometry);
        
        // Kilometrekareye çevir
        const areaKm2 = (area / 1000000).toFixed(2);
        
        console.log('Polygon alanı:', areaKm2, 'km²');
        alert(`Polygon alanı: ${areaKm2} km²`);
        
        // Interaction'ı kaldır (tek çizim)
        map.removeInteraction(draw);
        draw = null;
    });
    
    // Map'e interaction ekle
    map.addInteraction(draw);
};
```

**🎤 Eğitmen detaylı açıklar:**

**Line 1: Global Değişken**

> "`let draw;` → Interaction nesnesini saklar. Global olmalı ki başka fonksiyonlarda da erişelim."

**Line 3-4: Button Click Event**

> "`getElementById('drawBtn')` → HTML'deki butonu bulur.
> `onclick` → Butona tıklanınca tetiklenir."

**Line 5-7: Önceki Interaction'ı Kaldır**

> "Eğer zaten aktif bir draw varsa kaldır. Aynı anda sadece bir interaction olmalı!"

**Line 9-12: Draw Interaction Oluştur**

> "`new ol.interaction.Draw()` → Çizim interaction'ı.
>
> `source: drawSource` → Çizimler buraya kaydedilir.
> `type: 'Polygon'` → Polygon çizimi."

**Line 14-33: drawend Event**

> "`draw.on('drawend', ...)` → Çizim tamamlanınca tetiklenir.
>
> **Çizim nasıl tamamlanır?**
> - Çift tıklama (double-click)
> - Enter tuşu
> - İlk noktaya geri tıklama (kapalı poligon)"

**Line 15-16: Feature ve Geometry**

> "`e.feature` → Çizilen feature nesnesi.
> `feature.getGeometry()` → Geometri (koordinatlar)"

**Line 18-19: Alan Hesaplama**

> "`ol.sphere.getArea(geometry)` → Küresel yüzeyde alan hesaplar (metrekare).
>
> **Önemli:** `ol.sphere` modülü dünya yüzeyinde doğru hesaplama yapar!"

**Line 21-22: Kilometrekareye Çevir**

> "`area / 1000000` → m² → km²
> `.toFixed(2)` → 2 ondalık basamak"

**Line 24-25: Sonucu Göster**

> "`console.log()` → Developer Console'da göster.
> `alert()` → Popup ile göster."

**Line 27-29: Interaction'ı Kaldır**

> "Tek çizim yapılsın diye interaction'ı kaldırıyoruz. Tekrar çizmek için butona tekrar tıklanmalı."

**Line 32: Interaction'ı Ekle**

> "`map.addInteraction(draw)` → Haritaya interaction ekler. Artık çizim aktif!"

**Dosyayı kaydet ve tarayıcıyı yenile**

**👨‍🏫 Canlı Demo:**

1. **Çizim butonuna tıkla** (📐 Çizim)
2. **Haritada 4-5 nokta işaretle** (her tıklama bir köşe)
3. **Çift tıkla** (çizim tamamlanır)

**📊 Beklenen:**

- Mavi çizgili polygon oluşur
- Alert çıkar: "Polygon alanı: 12.34 km²"
- Console'da log: "Polygon alanı: 12.34 km²"

**🎤 Eğitmen heyecanla:**

> "İşte! Polygon çizdik ve alanı hesapladık! PostGIS'teki ST_Area() fonksiyonu gibi, ama tarayıcıda!"

**💡 Doğrulama:**

**Eğitmen der:**

> "Alanı doğrulayalım. Google Earth'te aynı bölgeyi çizin, alan değerlerini karşılaştırın!"

---

### Adım 3: LineString Ölçüm Aracı (7 dakika)

**🎤 Eğitmen der:**

> "Mesafe ölçümü için LineString çizeceğiz. Mantık aynı, sadece geometri türü ve hesaplama fonksiyonu farklı."

**VS Code'da app.js, Polygon kodundan sonra ekle:**

```javascript
// ═══════════════════════════════════════════════════
//  MESAFE ÖLÇÜM ARACI
// ═══════════════════════════════════════════════════

document.getElementById('measureBtn').onclick = function() {
    // Önceki çizim varsa kaldır
    if (draw) {
        map.removeInteraction(draw);
    }
    
    // LineString çizimi
    draw = new ol.interaction.Draw({
        source: drawSource,
        type: 'LineString' // Fark burada!
    });
    
    // Çizim tamamlandığında
    draw.on('drawend', function(e) {
        const feature = e.feature;
        const geometry = feature.getGeometry();
        
        // Mesafe hesaplama (metre)
        const length = ol.sphere.getLength(geometry);
        
        // Kilometreye çevir
        const lengthKm = (length / 1000).toFixed(2);
        
        console.log('Çizgi uzunluğu:', lengthKm, 'km');
        alert(`Çizgi uzunluğu: ${lengthKm} km`);
        
        // Interaction'ı kaldır
        map.removeInteraction(draw);
        draw = null;
    });
    
    map.addInteraction(draw);
};
```

**🎤 Eğitmen farkları vurgular:**

**Line 10: type: 'LineString'**

> "Polygon yerine LineString. Çizgi çizer."

**Line 19: ol.sphere.getLength()**

> "`getArea()` yerine `getLength()` kullanıyoruz. Metre cinsinden uzunluk."

**Line 22: / 1000**

> "Metreyi kilometreye çevir."

**Dosyayı kaydet ve tarayıcıyı yenile**

**👨‍🏫 Canlı Demo:**

1. **Ölçüm butonuna tıkla** (📏 Ölçüm)
2. **İki nokta arasını çiz** (örnek: Galata Kulesi → Kız Kulesi)
3. **Çift tıkla**

**📊 Beklenen:**

- Mavi çizgi oluşur
- Alert: "Çizgi uzunluğu: 2.93 km"

**🎤 Eğitmen karşılaştırır:**

> "Ders 2'de PostGIS ile 2.93 km hesaplamıştık. Aynı sonuç! İki araç da WGS84 spheroid kullanıyor."

---

### Adım 4: Temizle Butonu (3 dakika)

**🎤 Eğitmen der:**

> "Çizimler birikiyor. Temizle butonu ekleyelim."

**VS Code'da app.js:**

```javascript
// ═══════════════════════════════════════════════════
//  TEMİZLE BUTONU
// ═══════════════════════════════════════════════════

document.getElementById('clearBtn').onclick = function() {
    // Tüm çizimleri sil
    drawSource.clear();
    
    // Aktif interaction varsa kaldır
    if (draw) {
        map.removeInteraction(draw);
        draw = null;
    }
    
    console.log('Tüm çizimler temizlendi');
};
```

**🎤 Eğitmen açıklar:**

**Line 2: drawSource.clear()**

> "Source'taki tüm feature'ları siler. Harita temizlenir."

**Line 4-7: Interaction Temizle**

> "Aktif çizim varsa onu da kaldır."

**Dosyayı kaydet ve tarayıcıyı yenile**

**👨‍🏫 Canlı Test:**

1. Birkaç polygon/çizgi çiz
2. Temizle butonuna tıkla (🗑️ Temizle)
3. Tüm çizimler kaybolur

---

### Adım 5: Çizim Stilini Özelleştirme (5 dakika)

**🎤 Eğitmen der:**

> "Çizim stilini değiştirmek isterseniz, layer tanımında style nesnesini düzenleyin."

**VS Code'da app.js, Vector Layer stilini değiştir:**

**Eski (varsayılan mavi):**
```javascript
const drawLayer = new ol.layer.Vector({
    source: drawSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
        stroke: new ol.style.Stroke({ color: '#3498db', width: 3 })
    })
});
```

**Yeni (kırmızı, kesik çizgi):**
```javascript
const drawLayer = new ol.layer.Vector({
    source: drawSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(231, 76, 60, 0.3)' // Kırmızı şeffaf
        }),
        stroke: new ol.style.Stroke({
            color: '#e74c3c', // Kırmızı
            width: 4,
            lineDash: [10, 5] // Kesik çizgi (10px çizgi, 5px boşluk)
        }),
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({ color: '#e74c3c' }),
            stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
        })
    })
});
```

**🎤 Eğitmen açıklar:**

**Line 5: lineDash**

> "`[10, 5]` → 10 piksel çizgi, 5 piksel boşluk. Kesik çizgi efekti."

**Line 10: image (Point stili)**

> "Vertex (köşe) noktalarının stili. Daha büyük daire (radius: 8)."

**Dosyayı kaydet ve tarayıcıyı yenile**

**Polygon çiz → Kırmızı, kesik çizgili görünür!**

---

### Adım 6: İleri Seviye - Dinamik Label (Bonus, 5 dakika)

**🎤 Eğitmen der:**

> "İleri seviye özellik: Çizim sırasında anlık ölçüm gösterme!"

**Kod (karmaşık, sadece göster, detaya girme):**

```javascript
// Çizim sırasında ölçüm gösterme
draw.on('drawstart', function(e) {
    const sketch = e.feature;
    
    sketch.getGeometry().on('change', function(evt) {
        const geom = evt.target;
        let output;
        
        if (geom instanceof ol.geom.Polygon) {
            output = ol.sphere.getArea(geom) / 1000000;
            output = output.toFixed(2) + ' km²';
        } else if (geom instanceof ol.geom.LineString) {
            output = ol.sphere.getLength(geom) / 1000;
            output = output.toFixed(2) + ' km';
        }
        
        console.log('Anlık ölçüm:', output);
    });
});
```

**🎤 Eğitmen der:**

> "Bu kod, çizim sırasında her değişiklikte (yeni nokta eklenince) ölçümü günceller. Profesyonel uygulamalarda kullanılır."

---

### Kapanış ve Özet (2 dakika)

**📊 Slayt: Ders 5 Özeti**

```
✅ TAMAMLANAN GÖREVLER
─────────────────────────────────────────
✓ Vector layer ve source oluşturuldu
✓ Polygon çizim aracı eklendi
✓ Alan hesaplama yapıldı (ol.sphere.getArea)
✓ LineString ölçüm aracı eklendi
✓ Mesafe hesaplama yapıldı (ol.sphere.getLength)
✓ Temizle butonu eklendi
✓ Çizim stili özelleştirildi

📚 ÖĞRENİLEN KAVRAMLAR
─────────────────────────────────────────
• ol.source.Vector ve ol.layer.Vector
• ol.interaction.Draw
• Draw lifecycle (drawstart, drawend)
• ol.sphere modülü (getArea, getLength)
• ol.style.Style (fill, stroke, image, lineDash)
• Interaction yönetimi (add/remove)
• Feature ve Geometry nesneleri

🔑 KRİTİK NOKTALAR
─────────────────────────────────────────
❗ draw global değişken olmalı
❗ Önceki interaction'ı kaldır (removeInteraction)
❗ ol.sphere kullan (düz mesafe değil!)
❗ drawend event'te interaction kaldır
❗ / 1000000 (m² → km²), / 1000 (m → km)
```

---

## 📋 Eğitmen Kontrol Listesi

### Ders Sonunda

- [ ] Polygon çizimi çalışıyor
- [ ] Alan hesaplama doğru
- [ ] Mesafe ölçümü çalışıyor
- [ ] Temizle butonu çalışıyor

---

**🎉 Başarılar!**
