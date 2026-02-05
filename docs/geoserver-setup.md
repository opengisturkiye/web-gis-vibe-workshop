# GeoServer Kurulum ve Yapılandırma Rehberi

Bu rehber, GeoServer'ı PostGIS veritabanı ile entegre etmeyi ve harita katmanları yayınlamayı adım adım anlatır.

---

## 📋 İçindekiler

1. [GeoServer'a Giriş](#1-geoservera-giriş)
2. [Workspace Oluşturma](#2-workspace-oluşturma)
3. [PostGIS Store Ekleme](#3-postgis-store-ekleme)
4. [Layer Yayınlama](#4-layer-yayınlama)
5. [Layer Önizleme](#5-layer-önizleme)
6. [CORS Ayarları](#6-cors-ayarları)
7. [SLD Stil Oluşturma](#7-sld-stil-oluşturma)

---

## 1. GeoServer'a Giriş

### Erişim Bilgileri

| Özellik | Değer |
|---------|-------|
| URL | http://localhost:8080/geoserver |
| Kullanıcı Adı | `admin` |
| Şifre | `geoserver` |

### Giriş Adımları

1. Tarayıcınızda **http://localhost:8080/geoserver** adresini açın
2. Sağ üst köşedeki **Login** butonuna tıklayın
3. Kullanıcı adı ve şifreyi girin
4. **Login** butonuna tıklayın

> ⏱️ **Not:** GeoServer'ın tamamen başlaması 2-3 dakika sürebilir. "HTTP 404" hatası alıyorsanız biraz bekleyin.

---

## 2. Workspace Oluşturma

Workspace, GeoServer'da layer ve store'ları organize etmek için kullanılır.

### Adımlar

1. Sol menüden **Data → Workspaces** seçin
2. **Add new workspace** butonuna tıklayın
3. Aşağıdaki değerleri girin:

| Alan | Değer |
|------|-------|
| Name | `workshop` |
| Namespace URI | `http://workshop.local` |
| Default Workspace | ✅ (işaretli) |

4. **Submit** butonuna tıklayın

### Ekran Görüntüsü

```
┌─────────────────────────────────────────────────┐
│ Create new workspace                            │
├─────────────────────────────────────────────────┤
│ Name:          [workshop              ]         │
│ Namespace URI: [http://workshop.local ]         │
│ Default:       [✅]                              │
├─────────────────────────────────────────────────┤
│                              [Cancel] [Submit]  │
└─────────────────────────────────────────────────┘
```

---

## 3. PostGIS Store Ekleme

Store, veritabanı bağlantısını tanımlar.

### Adımlar

1. **Data → Stores → Add new Store** seçin
2. **Vector Data Sources** altında **PostGIS** seçin
3. Bağlantı bilgilerini girin:

| Alan | Değer | Açıklama |
|------|-------|----------|
| Workspace | `workshop` | Oluşturduğunuz workspace |
| Data Source Name | `postgis_db` | İstediğiniz isim |
| host | `postgis` | ⚠️ **Container adı!** |
| port | `5432` | Varsayılan PostgreSQL portu |
| database | `gis` | Veritabanı adı |
| schema | `public` | Varsayılan schema |
| user | `gis` | Kullanıcı adı |
| passwd | `gis` | Şifre |

4. **Save** butonuna tıklayın

### ⚠️ Önemli Not

**host** değeri için `localhost` veya `127.0.0.1` kullanmayın! Docker container'ları birbirleriyle iletişim kurarken **container adını** kullanır.

```
❌ Yanlış: host = localhost
❌ Yanlış: host = 127.0.0.1
✅ Doğru:  host = postgis
```

---

## 4. Layer Yayınlama

### Adımlar

1. Store kaydedildikten sonra otomatik olarak **New Layer** sayfası açılır
2. `points` tablosunun yanındaki **Publish** butonuna tıklayın
3. **Data** sekmesinde:
   - **Name:** `points`
   - **Title:** `Ankara Noktaları`
   - **Native SRS:** `EPSG:4326` (otomatik gelir)
   - **Declared SRS:** `EPSG:4326`

4. **Bounding Boxes** bölümüne gidin:
   - **Compute from data** linkine tıklayın
   - **Compute from native bounds** linkine tıklayın

5. **Save** butonuna tıklayın

### Bounding Box Değerleri

Başarılı bir yapılandırmada şu değerleri görmelisiniz:

```
Native Bounding Box:
  Min X: 32.7775    Max X: 32.8646
  Min Y: 39.8917    Max Y: 39.9650

Lat/Lon Bounding Box:
  Min X: 32.7775    Max X: 32.8646
  Min Y: 39.8917    Max Y: 39.9650
```

---

## 5. Layer Önizleme

### Adımlar

1. **Data → Layer Preview** menüsüne gidin
2. `workshop:points` katmanını bulun
3. **OpenLayers** formatında önizleme açın

### Beklenen Sonuç

- ✅ Haritada 17 adet kırmızı nokta görmelisiniz
- ✅ Noktalar İstanbul çevresinde konumlanmış olmalı
- ✅ Haritayı yakınlaştırıp uzaklaştırabilmelisiniz

---

## 6. CORS Ayarları

Web uygulamasının GeoServer'a erişebilmesi için CORS ayarlarının yapılması gerekebilir.

### Docker Compose ile (Önerilen)

`docker-compose.yml` dosyasında CORS ayarları zaten yapılmıştır:

```yaml
geoserver:
  environment:
    CORS_ENABLED: "true"
    CORS_ALLOWED_ORIGINS: "*"
    CORS_ALLOWED_METHODS: "GET,POST,PUT,DELETE,HEAD,OPTIONS"
    CORS_ALLOWED_HEADERS: "*"
```

### Manuel Ayar (Gerekirse)

1. GeoServer → **Settings → Global** menüsüne gidin
2. **Enable CORS** seçeneğini `true` yapın
3. **Save** butonuna tıklayın
4. GeoServer'ı restart edin:

```bash
docker restart geoserver
```

---

## 7. SLD Stil Oluşturma

Varsayılan kırmızı nokta stilini özelleştirebilirsiniz.

### Adımlar

1. **Data → Styles → Add a new style** seçin
2. **Name:** `point_style`
3. **Workspace:** `workshop`
4. Aşağıdaki SLD kodunu yapıştırın:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <NamedLayer>
    <Name>workshop:points</Name>
    <UserStyle>
      <Title>Özel Nokta Stili</Title>
      <FeatureTypeStyle>
        <Rule>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#4f46e5</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#ffffff</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>12</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

5. **Validate** butonuyla doğrulayın
6. **Submit** butonuna tıklayın

### Stili Layer'a Uygulama

1. **Data → Layers → points** seçin
2. **Publishing** sekmesine gidin
3. **Default Style:** `workshop:point_style` seçin
4. **Save** butonuna tıklayın

---

## 🆘 Sorun Giderme

### "Connection Failed" Hatası

**Sebep:** Host adı yanlış girilmiş

**Çözüm:**
```
host = postgis (container adı)
```

### Layer Önizlemede Nokta Yok

**Sebep:** Bounding box hesaplanmamış

**Çözüm:**
1. Layer düzenleme sayfasına gidin
2. "Compute from data" linkine tıklayın
3. Kaydedin

### WMS İsteği 500 Hatası Veriyor

**Sebep:** PostGIS bağlantısı kopmuş

**Çözüm:**
```bash
docker restart postgis
docker restart geoserver
```

---

## ✅ Kontrol Listesi

- [ ] GeoServer çalışıyor (http://localhost:8080/geoserver)
- [ ] admin/geoserver ile giriş yapabiliyorum
- [ ] `workshop` workspace oluşturuldu
- [ ] `postgis_db` store oluşturuldu
- [ ] `points` layer yayınlandı
- [ ] Layer Preview'de noktalar görünüyor
- [ ] CORS ayarları yapıldı
