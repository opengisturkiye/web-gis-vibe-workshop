# Ders 3c: BONUS - SLD ile Kategorik Stiller (15 dakika)

> **Eğitmen Ders Notu** - İleri Seviye SLD Stil Düzenleme

---

## 📋 Ders Özeti

| Özellik | Detay |
|---------|-------|
| **Süre** | 15 dakika |
| **Zorluk** | İleri |
| **Ön Gereksinim** | Ders 3a ve 3b tamamlanmış, Layer yayınlanmış |
| **Hedef Kitle** | SLD öğrenmek isteyenler (Opsiyonel) |

---

## 🎯 Ders Hedefleri

Bu dersin sonunda katılımcılar şunları yapabilecek:

- [ ] SLD (Styled Layer Descriptor) editörünü kullanmak
- [ ] Kategorik stiller oluşturmak (türe göre renk)
- [ ] XML yapısını anlamak
- [ ] ogc:Filter ile koşullu kurallar yazmak
- [ ] Farklı şekiller kullanmak (circle, square, triangle)
- [ ] Stili layer'a uygulamak

---

## 📚 Ön Gereksinimler

### Ders 3a ve 3b Tamamlanmış Olmalı

**Kontrol:**
- ✅ `workshop:points` layer yayınlandı mı?
- ✅ Layer Preview'de 17 nokta görünüyor mu?
- ✅ Tüm noktalar kırmızı mi? (varsayılan stil)

**Eğer hayır:** Önce Ders 3a ve 3b'yi tamamlayın!

---

## 🎬 Ders Akışı (15 dakika)

### Giriş: SLD Nedir? (1 dakika)

**🎤 Eğitmen der:**

> "Şu anda tüm noktalar kırmızı görünüyor. Peki, nokta türlerine (type) göre farklı renkler vermek istersek? SLD (Styled Layer Descriptor) kullanırız!
>
> SLD, XML formatında stil tanımlarıdır. Harita katmanlarının nasıl görüneceğini belirler."

**📊 Örnekler:**
- **Tarihi yerler** → Kırmızı daire
- **Stadyumlar** → Mavi kare
- **Üniversiteler** → Yeşil üçgen
- **Diğer** → Gri daire

---

### Adım 1: SLD Stili Oluşturma (5 dakika)

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
│  [workshop_points_kategorik              ]         │
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

---

### Adım 2: SLD Kodu Yazma (5 dakika)

**📊 SLD Editor Sayfası (KOD EDITÖRÜ):**

**Varsayılan template görünür. Tüm kodu silin (Ctrl+A, Delete)**

**Yeni kodu yapıştırın:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld
  http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  
  <NamedLayer>
    <Name>workshop:points</Name>
    <UserStyle>
      <Title>Noktalar - Türe Göre Renkli</Title>
      <FeatureTypeStyle>
        
        <!-- KURAL 1: Tarihi Yerler - KIRMIZI DAIRE -->
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
                <Fill><CssParameter name="fill">#FF0000</CssParameter></Fill>
                <Stroke>
                  <CssParameter name="stroke">#CC0000</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        
        <!-- KURAL 2: Stadyumlar - MAVİ KARE -->
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
                <Fill><CssParameter name="fill">#0000FF</CssParameter></Fill>
                <Stroke>
                  <CssParameter name="stroke">#0000CC</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        
        <!-- KURAL 3: Üniversiteler - YEŞİL ÜÇGEN -->
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
                <Fill><CssParameter name="fill">#00AA00</CssParameter></Fill>
                <Stroke>
                  <CssParameter name="stroke">#008800</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        
        <!-- KURAL 4: Varsayılan - GRİ DAIRE (EN SONDA!) -->
        <Rule>
          <Name>Diğer</Name>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill><CssParameter name="fill">#888888</CssParameter></Fill>
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

### Adım 3: Stili Layer'a Uygulama (3 dakika)

**Sol menüden:**
```
Data → Layers
```

**Tıkla!**

**`workshop:points` satırında layer adına tıkla (Edit)**

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

### Adım 4: Sonucu Test Etme (3 dakika)

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
│       İSTANBUL HARİTASI (TÜRE GÖRE RENKLİ!)       │
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
> - **Kırmızı daire** (5 nokta): Tarihi yerler (Kız Kulesi, Galata Kulesi, Ayasofya, Topkapı, Kapalıçarşı)
> - **Mavi kare** (3 nokta): Stadyumlar (Vodafone Park, Şükrü Saracoğlu, Nef Stadyumu)
> - **Yeşil üçgen** (4 nokta): Üniversiteler (Boğaziçi, İ.Ü., İTÜ, YTÜ)
> - **Gri daire** (5 nokta): Diğer (Forum İstanbul AVM, Ortaköy Meydanı, Karaköy İskelesi, Üsküdar İskelesi, Beşiktaş İskelesi)
>
> Toplam = 17 nokta ✓"

---

### Kapanış ve İleri Seviye İpuçları (3 dakika)

**🎤 Eğitmen der:**

> "Kategorik stilin avantajları:
> - **Veri anlama kolaylaşır** → Renkler anlamı temsil eder
> - **Harita okunabilirliği artar** → Farklı türleri hızlı görebilirsiniz
> - **Production ortamına uygun** → Gerçek uygulamalarda böyle kullanılır"

**📊 SLD Yapısı Özeti:**

```
SLD Hiyerarşisi:
├─ StyledLayerDescriptor (XML root)
│  └─ NamedLayer (hangi layer?)
│     └─ UserStyle (kullanıcı stili)
│        └─ FeatureTypeStyle (feature stili)
│           └─ Rule (kurallar)
│              ├─ Name (kural adı)
│              ├─ ogc:Filter (koşul)
│              └─ PointSymbolizer (sembolizer)
│                 └─ Graphic
│                    ├─ Mark (şekil)
│                    │  ├─ WellKnownName (circle, square...)
│                    │  ├─ Fill (dolgu rengi)
│                    │  └─ Stroke (çerçeve)
│                    └─ Size (boyut)
```

**İleri Seviye İpuçları:**

**🎤 Eğitmen açıklar:**

> "**Başka Şekiller:**
> - `circle` → Daire
> - `square` → Kare
> - `triangle` → Üçgen
> - `star` → Yıldız
> - `cross` → Artı işareti
> - `x` → X işareti
>
> **Dinamik Boyut (Attribute'a Göre):**
> ```xml
> <Size>
>   <ogc:Mul>
>     <ogc:Literal>0.002</ogc:Literal>
>     <ogc:PropertyName>visitor_count</ogc:PropertyName>
>   </ogc:Mul>
> </Size>
> ```
>
> Fazla ziyaretçi → Daha büyük nokta!
>
> **Harici İkonlar:**
> PNG/SVG dosyaları da kullanabilirsiniz. GeoServer dokümantasyonuna bakın!"

---

## 🔧 Troubleshooting

### Sorun 1: Tüm Noktalar Hala Gri/Kırmızı Gözüküyor

**Çözüm:**

**Tarayıcı cache'ini temizle:**
```
Ctrl+Shift+Delete → Tüm geçmiş temizle
```

**Veya incognito/private mode'da test et**

**Layer'ı refresh et:**
```
Data → Layers → workshop:points → [Publishing]
→ Default Style: workshop_points_kategorik olduğunu doğrula
→ Save
```

---

### Sorun 2: SLD Validation Hatası

**Çözüm:**

**Basitleştirilmiş Versiyon (ElseFilter ile):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld
  http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">

  <NamedLayer>
    <Name>workshop:points</Name>
    <UserStyle>
      <FeatureTypeStyle>

        <!-- Tarihi Yerler - Kırmızı -->
        <Rule>
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
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>

        <!-- Stadyumlar - Mavi -->
        <Rule>
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
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>

        <!-- Üniversiteler - Yeşil -->
        <Rule>
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
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>

        <!-- Varsayılan - Gri -->
        <Rule>
          <ElseFilter/>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#888888</CssParameter>
                </Fill>
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

**[Validate] → [Save]**

---

### Sorun 3: GeoServer Cache Problemi

**Tile Cache Temizle:**

```
Tile Caching → Tile Layers → workshop:points
→ [Truncate Layer] (eğer varsa)
```

**Sonra Layer Preview'i refresh et (F5)**

---

## 📋 Eğitmen Kontrol Listesi

### Ders Sonunda

- [ ] SLD stili oluşturuldu
- [ ] Kategorik renkler gösterildi (kırmızı, mavi, yeşil, gri)
- [ ] Farklı şekiller gösterildi (circle, square, triangle)
- [ ] Layer Preview'de doğru görünüyor

---

## 📚 Öğrenilen Kavramlar

```
✅ TAMAMLANAN GÖREVLER
─────────────────────────────────────────
✓ SLD kategorik stili oluşturuldu
✓ XML söz dizimi öğrenildi
✓ ogc:Filter ile koşullu kurallar yazıldı
✓ Farklı şekiller kullanıldı (circle, square, triangle)
✓ Fill ve Stroke renkleri ayarlandı
✓ Stil layer'a uygulandı

📚 ÖĞRENİLEN KAVRAMLAR
─────────────────────────────────────────
• SLD (Styled Layer Descriptor) - Stil tanımı
• Kategorik stil (ogc:Filter ile kurallar)
• PointSymbolizer, Mark, Fill, Stroke
• WellKnownName (şekil seçimi)
• CssParameter (CSS parametreleri)
• Rule sıralaması (varsayılan en sonda!)

⚠️ KRİTİK NOKTALAR
─────────────────────────────────────────
❗ SLD'de XML söz dizimi doğru olmalı (Validate!)
❗ ogc:PropertyName ile attribute'a erişim
❗ Varsayılan rule en sonda (ElseFilter)
❗ Browser cache temizleme gerekebilir
```

---

## 🎯 Sonraki Adımlar

**Ders 4 - OpenLayers Web Uygulaması**

SLD stilini oluşturdunuz! Artık web uygulamasında bu renkli haritayı kullanabilirsiniz.

---

**🎉 Tebrikler! İleri seviye stil düzenlemeyi öğrendiniz!**
