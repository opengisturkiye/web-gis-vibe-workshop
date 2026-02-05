# 🚀 İleri Seviye Özellikler

Bu rehber, workshop'u tamamladıktan sonra geliştirebileceğiniz ileri seviye özellikleri içerir.

---

## 📋 İçindekiler

1. [Sayısallaştırma Sonuçlarını Kaydetme](#1-sayısallaştırma-sonuçlarını-kaydetme)
2. [WFS-T Veri Düzenleme](#2-wfs-t-veri-düzenleme)
3. [Heatmap (Isı Haritası)](#3-heatmap-isı-haritası)
4. [Clustering (Kümeleme)](#4-clustering-kümeleme)
5. [Custom SLD Stilleri](#5-custom-sld-stilleri)
6. [Backend API Oluşturma](#6-backend-api-oluşturma)
7. [Gerçek Zamanlı Güncellemeler](#7-gerçek-zamanlı-güncellemeler)

---

## 1. Sayısallaştırma Sonuçlarını Kaydetme

Kullanıcının çizdiği polygon ve çizgileri PostGIS veritabanına kaydedin.

### Frontend - Kaydet Butonu

```javascript
// HTML'e ekle
<button id="saveBtn" class="tool-btn success">
    <span class="icon">💾</span>
    Kaydet
</button>

// JavaScript
document.getElementById('saveBtn').onclick = async function() {
    const features = drawSource.getFeatures();
    
    if (features.length === 0) {
        alert('Kaydedilecek çizim yok!');
        return;
    }
    
    const geojson = new ol.format.GeoJSON().writeFeatures(features, {
        featureProjection: 'EPSG:3857',
        dataProjection: 'EPSG:4326'
    });
    
    try {
        const response = await fetch('http://localhost:3000/api/drawings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: geojson
        });
        
        if (response.ok) {
            alert('✅ Çizimler kaydedildi!');
        } else {
            alert('❌ Kaydetme hatası!');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
};
```

### Backend - Node.js Express

```javascript
// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'gis',
    user: 'gis',
    password: 'gis'
});

app.post('/api/drawings', async (req, res) => {
    try {
        const geojson = req.body;
        
        for (const feature of geojson.features) {
            const geomType = feature.geometry.type;
            const geomJson = JSON.stringify(feature.geometry);
            
            if (geomType === 'Polygon') {
                await pool.query(`
                    INSERT INTO polygons (name, geom)
                    VALUES ($1, ST_GeomFromGeoJSON($2))
                `, ['User Drawing', geomJson]);
            } else if (geomType === 'LineString') {
                await pool.query(`
                    INSERT INTO lines (name, geom)
                    VALUES ($1, ST_GeomFromGeoJSON($2))
                `, ['User Measurement', geomJson]);
            }
        }
        
        res.json({ success: true, count: geojson.features.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('API running on :3000'));
```

---

## 2. WFS-T Veri Düzenleme

GeoServer WFS-T (Transactional) servisini kullanarak doğrudan veritabanını güncelleyin.

### GeoServer WFS-T Ayarları

1. **Data → Layers → points** seçin
2. **Publishing** sekmesine gidin
3. **WFS Settings:**
   - Service Level: `Transactional`
4. **Save**

### JavaScript Kodu

```javascript
const formatWFS = new ol.format.WFS();
const formatGML = new ol.format.GML({
    featureNS: 'http://workshop.local',
    featureType: 'points',
    srsName: 'EPSG:4326'
});

// Yeni feature ekle
function insertFeature(name, type, lon, lat) {
    const feature = new ol.Feature({
        geometry: new ol.geom.Point([lon, lat]),
        name: name,
        type: type
    });
    
    const transaction = formatWFS.writeTransaction(
        [feature],  // insert
        null,       // update
        null,       // delete
        formatGML
    );
    
    const xml = new XMLSerializer().serializeToString(transaction);
    
    fetch('http://localhost:8080/geoserver/wfs', {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: xml
    })
    .then(response => response.text())
    .then(data => {
        console.log('Feature eklendi:', data);
        wmsLayer.getSource().refresh();
    });
}

// Kullanım
insertFeature('Yeni Nokta', 'Test', 32.85, 39.92);
```

### Feature Güncelleme

```javascript
function updateFeature(featureId, newName) {
    const feature = new ol.Feature({
        name: newName
    });
    feature.setId('points.' + featureId);
    
    const transaction = formatWFS.writeTransaction(
        null,       // insert
        [feature],  // update
        null,       // delete
        formatGML
    );
    
    // ... fetch isteği
}
```

### Feature Silme

```javascript
function deleteFeature(featureId) {
    const feature = new ol.Feature();
    feature.setId('points.' + featureId);
    
    const transaction = formatWFS.writeTransaction(
        null,       // insert
        null,       // update
        [feature],  // delete
        formatGML
    );
    
    // ... fetch isteği
}
```

---

## 3. Heatmap (Isı Haritası)

Nokta yoğunluğunu renk geçişleriyle gösterin.

```javascript
// GeoJSON kaynak
const heatmapSource = new ol.source.Vector({
    url: 'data/sample_data.geojson',
    format: new ol.format.GeoJSON()
});

// Heatmap katmanı
const heatmapLayer = new ol.layer.Heatmap({
    source: heatmapSource,
    blur: 15,
    radius: 10,
    gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
    weight: function(feature) {
        // Her feature'a ağırlık ver
        const type = feature.get('type');
        switch(type) {
            case 'Anıt': return 1.0;
            case 'Park': return 0.7;
            default: return 0.5;
        }
    }
});

map.addLayer(heatmapLayer);

// Sidebar kontrolü ekle
document.getElementById('heatmapToggle').onchange = (e) => {
    heatmapLayer.setVisible(e.target.checked);
};
```

### Blur ve Radius Kontrolleri

```html
<div class="slider-control">
    <label>Blur: <span id="blurValue">15</span></label>
    <input type="range" id="blurSlider" min="5" max="30" value="15">
</div>

<div class="slider-control">
    <label>Radius: <span id="radiusValue">10</span></label>
    <input type="range" id="radiusSlider" min="5" max="30" value="10">
</div>
```

```javascript
document.getElementById('blurSlider').oninput = (e) => {
    heatmapLayer.setBlur(parseInt(e.target.value));
    document.getElementById('blurValue').textContent = e.target.value;
};

document.getElementById('radiusSlider').oninput = (e) => {
    heatmapLayer.setRadius(parseInt(e.target.value));
    document.getElementById('radiusValue').textContent = e.target.value;
};
```

---

## 4. Clustering (Kümeleme)

Yakın noktaları gruplandırarak performansı artırın.

```javascript
// Cluster kaynağı
const clusterSource = new ol.source.Cluster({
    distance: 50,  // piksel cinsinden mesafe
    minDistance: 20,
    source: new ol.source.Vector({
        url: 'data/sample_data.geojson',
        format: new ol.format.GeoJSON()
    })
});

// Dinamik stil fonksiyonu
const clusterStyle = function(feature) {
    const size = feature.get('features').length;
    
    // Tek nokta
    if (size === 1) {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({ color: '#4f46e5' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
            })
        });
    }
    
    // Küme
    const radius = Math.min(8 + (size * 3), 30);
    
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: radius,
            fill: new ol.style.Fill({
                color: size > 5 ? '#ef4444' : '#06b6d4'
            }),
            stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
        }),
        text: new ol.style.Text({
            text: size.toString(),
            font: 'bold 14px sans-serif',
            fill: new ol.style.Fill({ color: '#fff' })
        })
    });
};

const clusterLayer = new ol.layer.Vector({
    source: clusterSource,
    style: clusterStyle
});

map.addLayer(clusterLayer);
```

### Kümeye Tıklayınca Zoom

```javascript
map.on('click', function(e) {
    clusterLayer.getFeatures(e.pixel).then(function(features) {
        if (features.length > 0) {
            const clusterFeatures = features[0].get('features');
            
            if (clusterFeatures.length > 1) {
                // Kümenin extent'ine zoom
                const extent = ol.extent.createEmpty();
                clusterFeatures.forEach(f => {
                    ol.extent.extend(extent, f.getGeometry().getExtent());
                });
                
                map.getView().fit(extent, {
                    duration: 500,
                    padding: [50, 50, 50, 50]
                });
            }
        }
    });
});
```

---

## 5. Custom SLD Stilleri

### Tip'e Göre Renk

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>workshop:points</Name>
    <UserStyle>
      <Title>Type-based Style</Title>
      <FeatureTypeStyle>
        <!-- Anıt = Kırmızı -->
        <Rule>
          <Name>Anıt</Name>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>type</ogc:PropertyName>
              <ogc:Literal>Anıt</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>star</WellKnownName>
                <Fill><CssParameter name="fill">#ef4444</CssParameter></Fill>
              </Mark>
              <Size>16</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        
        <!-- Park = Yeşil -->
        <Rule>
          <Name>Park</Name>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>type</ogc:PropertyName>
              <ogc:Literal>Park</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill><CssParameter name="fill">#10b981</CssParameter></Fill>
              </Mark>
              <Size>12</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
        
        <!-- Diğer = Mavi -->
        <Rule>
          <Name>Default</Name>
          <ElseFilter/>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill><CssParameter name="fill">#4f46e5</CssParameter></Fill>
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

### Label Ekleme

```xml
<TextSymbolizer>
  <Label>
    <ogc:PropertyName>name</ogc:PropertyName>
  </Label>
  <Font>
    <CssParameter name="font-family">Arial</CssParameter>
    <CssParameter name="font-size">12</CssParameter>
  </Font>
  <Fill>
    <CssParameter name="fill">#333333</CssParameter>
  </Fill>
  <LabelPlacement>
    <PointPlacement>
      <AnchorPoint>
        <AnchorPointX>0.5</AnchorPointX>
        <AnchorPointY>0</AnchorPointY>
      </AnchorPoint>
      <Displacement>
        <DisplacementX>0</DisplacementX>
        <DisplacementY>-12</DisplacementY>
      </Displacement>
    </PointPlacement>
  </LabelPlacement>
  <Halo>
    <Radius>2</Radius>
    <Fill><CssParameter name="fill">#ffffff</CssParameter></Fill>
  </Halo>
</TextSymbolizer>
```

---

## 6. Backend API Oluşturma

### Proje Yapısı

```
backend/
├── package.json
├── server.js
├── routes/
│   ├── points.js
│   ├── polygons.js
│   └── analysis.js
└── Dockerfile
```

### package.json

```json
{
  "name": "webgis-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "cors": "^2.8.5"
  }
}
```

### docker-compose.yml'e Ekle

```yaml
services:
  api:
    build: ./backend
    container_name: api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://gis:gis@postgis:5432/gis
    depends_on:
      - postgis
    networks:
      - gis-network
```

---

## 7. Gerçek Zamanlı Güncellemeler

### WebSocket ile Canlı Güncelleme

```javascript
// Server (Node.js)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8082 });

wss.on('connection', function(ws) {
    console.log('Client connected');
    
    // Veritabanı değişikliklerini dinle (LISTEN/NOTIFY)
    pool.query('LISTEN point_changes');
    
    pool.on('notification', (msg) => {
        ws.send(JSON.stringify({
            type: 'update',
            data: msg.payload
        }));
    });
});
```

```javascript
// Client
const ws = new WebSocket('ws://localhost:8082');

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'update') {
        console.log('Harita güncellendi!');
        wmsLayer.getSource().refresh();
    }
};
```

### PostgreSQL Trigger

```sql
CREATE OR REPLACE FUNCTION notify_point_change()
RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify('point_changes', 
        json_build_object(
            'action', TG_OP,
            'id', NEW.id
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER point_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON points
FOR EACH ROW EXECUTE FUNCTION notify_point_change();
```

---

## 📚 Ek Kaynaklar

- [OpenLayers Examples](https://openlayers.org/en/latest/examples/)
- [GeoServer REST API](https://docs.geoserver.org/latest/en/user/rest/)
- [PostGIS Functions](https://postgis.net/docs/reference.html)
- [OGC WFS-T Specification](https://www.ogc.org/standard/wfs/)

---

**Bu özellikleri uygulamada yardıma ihtiyacınız olursa sormaktan çekinmeyin! 🚀**
