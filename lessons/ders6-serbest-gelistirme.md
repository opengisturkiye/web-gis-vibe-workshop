# Ders 6: Serbest Geliştirme ve Özelleştirme (45 dakika)

> **Eğitmen Ders Notu** - Pratik Yapma ve Problem Çözme

---

## 📋 Ders Özeti

| Özellik | Detay |
|---------|-------|
| **Süre** | 45 dakika |
| **Zorluk** | Çeşitli (Başlangıç-İleri) |
| **Format** | Serbest çalışma + Eğitmen desteği |
| **Hedef** | Pratik yaparak pekiştirme |

---

## 🎯 Ders Hedefleri

Bu dersin sonunda katılımcılar:

- [ ] Öğrenilen teknikleri uygulayarak pekiştirecek
- [ ] Kendi fikirlerini geliştirecek
- [ ] Problem çözme becerileri kazanacak
- [ ] Dokümantasyon okuma alışkanlığı edinecek
- [ ] İleri seviye özellikleri keşfedecek

---

## 📚 Eğitmen Ön Hazırlık

### Ders Öncesi Hazırlık (10 dakika önce)

```bash
# 1. Tüm servisler çalışıyor mu?
docker ps

# 2. Web uygulaması erişilebilir mi?
curl http://localhost:8081

# 3. GeoServer WMS çalışıyor mu?
curl http://localhost:8088/geoserver/wms?service=WFS&request=GetCapabilities

# 4. Örnek görevler hazır mı?
# Slayt/tahta hazır olmalı
```

### Materyal Hazırlığı

- [ ] **Görev Listesi:** Yazdırılmış veya ekranda
- [ ] **Kod Snippet'leri:** Hızlı erişim için hazır
- [ ] **Dokümantasyon Linkleri:** OpenLayers, GeoServer API
- [ ] **Yardımcı Materyaller:** İleri seviye örnekler

---

## 🎬 Ders Akışı (45 dakika)

### Giriş ve Görev Seçimi (5 dakika)

**🎤 Eğitmen Konuşması:**

> "Tebrikler! 4 derste Web CBS uygulamasının temellerini tamamladık. Şimdi en eğlenceli kısım: serbest çalışma!
>
> Sonraki 45 dakikada kendi projenizi geliştireceksiniz. Aşağıdaki görevlerden istediğinizi seçebilir, kendi fikirlerinizi de uygulayabilirsiniz.
>
> Ben etrafta dolaşacağım, takıldığınızda yardımcı olacağım. Çekinmeyin, soru sorun!"

**📊 Slayt/Tahta Göster: Önerilen Görevler**

```
┌────────────────────────────────────────────────────┐
│         SERBEST GELİŞTİRME GÖREVLERİ               │
├────────────────────────────────────────────────────┤
│                                                    │
│  🟢 BAŞLANGIÇ SEVİYESİ (15-20 dk)                 │
│  ─────────────────────────────────                │
│  1. Harita merkezini değiştir                     │
│  2. Stil renklerini özelleştir                    │
│  3. Yeni nokta verileri ekle (PostGIS)            │
│  4. Base map değiştir (Stamen, CartoDB)          │
│  5. Zoom/Pan kontrolleri ekle                     │
│                                                    │
│  🟡 ORTA SEVİYE (25-30 dk)                        │
│  ─────────────────────────────────                │
│  6. Point çizim aracı ekle                        │
│  7. Ölçüm sonuçlarını haritada göster (Overlay)  │
│  8. Layer switch (radio button)                   │
│  9. Koordinat gösterme (mouse move)              │
│  10. Çizim kaydetme (localStorage)               │
│                                                    │
│  🔴 İLERİ SEVİYE (40+ dk)                         │
│  ─────────────────────────────────────            │
│  11. Heatmap (ısı haritası)                       │
│  12. Clustering (kümeleme)                        │
│  13. WFS-T veri kaydetme                          │
│  14. Custom SLD stili (GeoServer)                 │
│  15. Backend API (Node.js/Python)                 │
│                                                    │
│  💡 YARATICI FİKİRLER                             │
│  ─────────────────────────────────                │
│  • Kendi şehrinin haritası                       │
│  • Özel veri seti (üniversiteler, hastaneler)   │
│  • Çok katmanlı harita (nüfus, iklim)           │
│  • ...kendi fikriniz!                            │
│                                                    │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen der:**

> "Görev numaralarına takılmayın. Size uygun olanı seçin. Grup çalışması da yapabilirsiniz!"

**Katılımcı Seçimi (2 dakika):**

**Eğitmen el kaldırır:**

> "Kim başlangıç seviyesi görev yapmak istiyor?
> Kim orta seviye?
> Kim ileri seviye?
> Kim kendi fikrini geliştirmek istiyor?"

**Not alır: Hangi katılımcı hangi görevi seçti**

---

### Serbest Çalışma Dönemi (35 dakika)

**Eğitmen Rolleri:**

1. **Gözlemci:** Katılımcıları izle, kim neyle uğraşıyor?
2. **Danışman:** Takılanlara yardım et
3. **Motivator:** İlerleyenleri teşvik et
4. **Kaynak:** Dokümantasyona yönlendir

---

## 📝 Görev Çözümleri (Eğitmen İçin)

### 🟢 Görev 1: Harita Merkezini Değiştir

**Katılımcı sorar:** "Haritayı İzmir'e nasıl ortalayabilirim?"

**Eğitmen cevabı:**

```javascript
// app.js
const CONFIG = {
    center: [27.14, 38.42], // İzmir [lon, lat]
    zoom: 12
};
```

**Veya dinamik değiştirme:**

```javascript
// Butona ekle
document.getElementById('izmirBtn').onclick = function() {
    map.getView().animate({
        center: ol.proj.fromLonLat([27.14, 38.42]),
        zoom: 12,
        duration: 1000 // 1 saniye animasyon
    });
};
```

---

### 🟢 Görev 2: Stil Renklerini Özelleştir

**Katılımcı sorar:** "Sidebar'ı turuncu yapmak istiyorum."

**Eğitmen cevabı:**

```css
/* style.css */
:root {
    --primary-color: #d35400; /* Turuncu */
    --secondary-color: #e67e22;
}
```

**Veya Polygon stilini değiştir:**

```javascript
// app.js - drawLayer
fill: new ol.style.Fill({
    color: 'rgba(46, 204, 113, 0.3)' // Yeşil
}),
stroke: new ol.style.Stroke({
    color: '#27ae60',
    width: 4
})
```

---

### 🟢 Görev 3: Yeni Nokta Verileri Ekle

**Katılımcı sorar:** "Ankara'daki hastaneleri eklemek istiyorum."

**Eğitmen cevabı:**

**1. PostgreSQL'e veri ekle:**

```bash
docker exec -it postgis psql -U gis -d gis
```

```sql
INSERT INTO points (name, type, description, geom) VALUES
    ('Ankara Şehir Hastanesi', 'Hastane', '3566 yatak kapasiteli', ST_GeomFromText('POINT(32.7344 39.9923)', 4326)),
    ('Hacettepe Hastanesi', 'Hastane', 'Üniversite hastanesi', ST_GeomFromText('POINT(32.7335 39.8714)', 4326));
```

**2. GeoServer'da layer'ı yenile veya cache temizle**

**3. Web uygulamasını yenile**

---

### 🟢 Görev 4: Base Map Değiştir

**Katılımcı sorar:** "OpenStreetMap yerine başka harita kullanabilir miyim?"

**Eğitmen cevabı:**

**Stamen Terrain:**

```javascript
const osmLayer = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'terrain' // veya 'watercolor', 'toner'
    }),
    visible: true
});
```

**CartoDB:**

```javascript
const osmLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
    }),
    visible: true
});
```

---

### 🟡 Görev 6: Point Çizim Aracı

**Katılımcı sorar:** "Nokta çizim aracı nasıl eklenir?"

**Eğitmen cevabı:**

**HTML'e buton ekle:**

```html
<button id="pointBtn" class="tool-btn">
    <span class="icon">📍</span>
    Nokta Ekle
</button>
```

**JavaScript:**

```javascript
document.getElementById('pointBtn').onclick = function() {
    if (draw) {
        map.removeInteraction(draw);
    }
    
    draw = new ol.interaction.Draw({
        source: drawSource,
        type: 'Point'
    });
    
    draw.on('drawend', function(e) {
        const coord = e.feature.getGeometry().getCoordinates();
        const lonlat = ol.proj.toLonLat(coord);
        
        alert(`Koordinat: ${lonlat[0].toFixed(4)}, ${lonlat[1].toFixed(4)}`);
        
        map.removeInteraction(draw);
        draw = null;
    });
    
    map.addInteraction(draw);
};
```

---

### 🟡 Görev 7: Ölçüm Sonuçlarını Haritada Göster

**Katılımcı sorar:** "Alert yerine harita üzerinde label gösterebilir miyim?"

**Eğitmen cevabı:**

```javascript
// Overlay oluştur
const measureOverlay = new ol.Overlay({
    element: document.createElement('div'),
    positioning: 'bottom-center',
    offset: [0, -10]
});
measureOverlay.getElement().className = 'measure-label';
map.addOverlay(measureOverlay);

// CSS
// .measure-label { background: white; padding: 5px; border-radius: 3px; }

// drawend içinde
draw.on('drawend', function(e) {
    const geometry = e.feature.getGeometry();
    const length = ol.sphere.getLength(geometry) / 1000;
    
    const lastCoord = geometry.getLastCoordinate();
    measureOverlay.setPosition(lastCoord);
    measureOverlay.getElement().innerHTML = length.toFixed(2) + ' km';
});
```

---

### 🟡 Görev 9: Koordinat Gösterme (Mouse Move)

**Katılımcı sorar:** "Mouse'un bulunduğu koordinatı gösterebilir miyim?"

**Eğitmen cevabı:**

**HTML'e ekle:**

```html
<div id="mouse-position"></div>
```

**CSS:**

```css
#mouse-position {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 3px;
    font-size: 12px;
}
```

**JavaScript:**

```javascript
map.on('pointermove', function(evt) {
    const coord = ol.proj.toLonLat(evt.coordinate);
    document.getElementById('mouse-position').innerHTML = 
        `Lon: ${coord[0].toFixed(4)}, Lat: ${coord[1].toFixed(4)}`;
});
```

---

### 🔴 Görev 11: Heatmap (Isı Haritası)

**Katılımcı sorar:** "Noktaları heatmap olarak gösterebilir miyim?"

**Eğitmen cevabı:**

**1. WFS ile noktaları al:**

```javascript
const vectorSource = new ol.source.Vector({
    url: 'http://localhost:8088/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=workshop:points&outputFormat=application/json',
    format: new ol.format.GeoJSON()
});
```

**2. Heatmap layer oluştur:**

```javascript
const heatmapLayer = new ol.layer.Heatmap({
    source: vectorSource,
    blur: 15,
    radius: 10,
    weight: function(feature) {
        return 1; // veya feature.get('population') gibi ağırlık
    }
});

map.addLayer(heatmapLayer);
```

**3. WMS layer'ı gizle (çakışma olmasın):**

```javascript
wmsLayer.setVisible(false);
```

---

### 🔴 Görev 12: Clustering (Kümeleme)

**Katılımcı sorar:** "Yakın noktaları gruplamak istiyorum."

**Eğitmen cevabı:**

```javascript
// Cluster source oluştur
const clusterSource = new ol.source.Cluster({
    distance: 40, // Piksel mesafe
    source: vectorSource // Yukarıdaki WFS source
});

// Cluster layer
const clusterLayer = new ol.layer.Vector({
    source: clusterSource,
    style: function(feature) {
        const size = feature.get('features').length;
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10 + (size * 2),
                fill: new ol.style.Fill({ color: '#3498db' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
            }),
            text: new ol.style.Text({
                text: size.toString(),
                fill: new ol.style.Fill({ color: '#fff' })
            })
        });
    }
});

map.addLayer(clusterLayer);
```

---

## 🎯 Eğitmen Aktiviteleri (35 dakika boyunca)

### İlk 10 Dakika: Gözlem

- Herkes başladı mı?
- Kim hangi görevi yapıyor?
- Sorun yaşayanlar var mı?

### 10-25 Dakika: Aktif Destek

- Masa masa dön
- "Nasıl gidiyor?" diye sor
- Kod hatalarını spot-fix yap
- Takılanları dokümantasyona yönlendir

### 25-35 Dakika: Teşvik ve Örnekler

- İlerlemiş projeleri ekranda göster
- "X arkadaşınız harika bir şey yaptı, görelim!"
- Başarılı çözümleri tüm sınıfla paylaş

### Son 5 Dakika: Gönüllü Sunumlar

**Eğitmen sorar:**

> "Kim yaptığını paylaşmak ister? Ekranda gösterelim!"

**2-3 katılımcı sunar (her biri 1-2 dk)**

---

## 📋 Eğitmen Kontrol Listesi

### Serbest Çalışma Sırasında

- [ ] Tüm katılımcılar aktif mi?
- [ ] Takılanlar tespit edildi mi?
- [ ] Dokümantasyon linkleri paylaşıldı mı?
- [ ] Başarılı örnekler kaydedildi mi?

### Yaygın Sorunlar ve Hızlı Çözümler

| Sorun | Hızlı Çözüm |
|-------|-------------|
| "Kod çalışmıyor" | F12 → Console → Hata mesajı oku |
| "Layer görünmüyor" | `setVisible(true)` kontrol et |
| "PostGIS'e veri ekleyemedim" | SQL syntax kontrol, `\q` ile çık |
| "Stil değişmiyor" | Cache temizle (Ctrl+Shift+R) |

---

## 🎉 Kapanış (Son 5 dakika - Ders 6 Sonunda)

**🎤 Eğitmen Konuşması:**

> "Harika çalışma! 45 dakikada çok şey başardınız. Bazılarınız basit özellikler ekledi, bazılarınız kompleks projeler geliştirdi. Hepsi değerli!
>
> Web CBS geliştirme böyle bir şey: sürekli öğrenme ve deneme. Bugün öğrendikleriniz temel, bunun üzerine inşa edebilirsiniz."

**📊 Final Özet Slayt:**

```
┌────────────────────────────────────────────────────┐
│         WORKSHOP TAMAMLANDI! 🎉                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  ✅ Docker container yönetimi                      │
│  ✅ PostGIS mekansal veri işleme                   │
│  ✅ GeoServer WMS/WFS servisleri                   │
│  ✅ OpenLayers harita geliştirme                   │
│  ✅ Sayısallaştırma ve ölçüm araçları              │
│  ✅ Serbest proje geliştirme                       │
│                                                    │
│  🌟 KAZANILAN BECERİLER                            │
│  ─────────────────────────────                    │
│  • Full-stack Web CBS uygulaması                  │
│  • Backend (PostGIS, GeoServer)                   │
│  • Frontend (OpenLayers, JavaScript)              │
│  • DevOps (Docker, Compose)                       │
│                                                    │
│  📚 SONRAKI ADIMLAR                                │
│  ─────────────────────────────                    │
│  1. docs/ klasöründe advanced-tasks.md            │
│  2. OpenLayers dokümantasyonu                     │
│  3. Gerçek dünya projesi geliştir                 │
│  4. GitHub'da paylaş!                             │
│                                                    │
│  🔗 KAYNAKLAR                                      │
│  ─────────────────────────────                    │
│  • GitHub Repo: opengisturkiye/web-gis-vibe       │
│  • OpenLayers: openlayers.org                     │
│  • GeoServer: geoserver.org                       │
│  • PostGIS: postgis.net                           │
│                                                    │
└────────────────────────────────────────────────────┘
```

**🎤 Eğitmen teşekkür eder:**

> "Katılımınız için teşekkürler! Sorularınız olursa GitHub Issues'da veya LinkedIn'den ulaşabilirsiniz.
>
> Başarılarınızı duymak isterim. Projelerinizi geliştirip paylaşın!"

**📧 İletişim Bilgileri Paylaş:**

- GitHub Repository
- LinkedIn profili
- Email adresi

---

## 📝 Feedback Toplama (Opsiyonel)

**Eğitmen kısa anket yapabilir:**

**Sorular:**

1. Workshop temposu nasıldı? (Yavaş / İyi / Hızlı)
2. En çok hangi dersi beğendiniz?
3. En zor kısım neydi?
4. Önerileriniz?

---

**🎓 Workshop Tamamlandı!**

**Eğitmen Notu:** 3 saatlik yoğun program tamamlandı. Katılımcıları tebrik edin, başarılarını kutlayın. Ders materyallerini GitHub'da güncel tutun!

**🎉 Başarılar!**
