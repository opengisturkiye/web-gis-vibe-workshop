# 📚 Web GIS Vibe Workshop - Dersler Dizini

> Eğitmen için detaylı ders notları

---

## 📖 Ders Listesi

| Ders | Konu | Süre | Dosya |
|------|------|------|-------|
| **Kurulum Öncesi** | WSL2, Docker, Git Kurulumu | 30 dk (ön çalışma) | [../docs/kurulum-oncesi.md](../docs/kurulum-oncesi.md) |
| **Ders 1** | Docker Container Yönetimi | 15 dk | [ders1-docker-kurulum.md](ders1-docker-kurulum.md) |
| **Ders 2** | PostGIS ve Mekansal Veri | 15 dk | [ders2-postgis-mekansal-veri.md](ders2-postgis-mekansal-veri.md) |
| **Ders 3a** | GeoServer Bağlantı Yapılandırması | 20 dk | [ders3a-geoserver-baglanti.md](ders3a-geoserver-baglanti.md) |
| **Ders 3b** | GeoServer Katman Yayını | 20 dk | [ders3b-geoserver-katman.md](ders3b-geoserver-katman.md) |
| **Ders 3c** | BONUS: SLD ile Kategorik Stiller | 15 dk (opsiyonel) | [ders3c-bonus-sld-stiller.md](ders3c-bonus-sld-stiller.md) |
| **Ders 4** | OpenLayers Web Uygulaması | 30 dk | [ders4-openlayers-web-uygulamasi.md](ders4-openlayers-web-uygulamasi.md) |
| **Ders 5** | Çizim ve Ölçüm Araçları | 30 dk | [ders5-cizim-olcum-araclari.md](ders5-cizim-olcum-araclari.md) |
| **Ders 6** | Serbest Geliştirme ve GitHub | 45 dk | [ders6-serbest-gelistirme.md](ders6-serbest-gelistirme.md) |

**Ön Çalışma:** 30 dakika (workshop öncesi tamamlanmalı)  
**Workshop Süresi:** 3 saat 30 dakika (+ 20 dk molalar = **3.5 saat** toplam)

---

## 🎯 Her Ders Dosyasında

✅ Detaylı ders akışı (dakika dakika)
✅ Eğitmen konuşma metinleri
✅ Adım adım kod örnekleri
✅ Ekran görüntüleri (ASCII art)
✅ Kontrol noktaları
✅ Troubleshooting rehberi
✅ Kritik uyarılar
✅ Pedagojik notlar

---

## 📋 Eğitmen Workshop Akışı

```
ÖN ÇALIŞMA (1 gün önce)
  📧 Katılımcılara kurulum kılavuzu gönder
  docs/kurulum-oncesi.md (30 dakika)

WORKSHOP GÜNÜ (3.5 saat)
09:00-09:15  Ders 1: Docker Container Yönetimi
09:15-09:30  Ders 2: PostGIS Mekansal Veri
09:30-09:50  Ders 3a: GeoServer Bağlantı
09:50-10:10  Ders 3b: GeoServer Katman Yayını
10:10-10:20  ☕ MOLA (10 dk)
10:20-10:50  Ders 4: OpenLayers Web App
10:50-11:20  Ders 5: Çizim ve Ölçüm Araçları
11:20-11:30  ☕ MOLA (10 dk)
11:30-12:15  Ders 6: Serbest Geliştirme
12:15-12:30  Kapanış, GitHub Push & Soru-Cevap

(OPSİYONEL - İleri Seviye Katılımcılar)
  Ders 3c: SLD Kategorik Stiller (15 dk)
  Ders 3a-3b arası veya Ders 6'da yapılabilir
```

---

## 🔑 Kritik Başarı Faktörleri

### Ders 1 (Docker)
- ⚠️ Container'ların "Up" durumunda olması
- ⚠️ GeoServer'ın 2-3 dk beklemesi

### Ders 2 (PostGIS)
- ⚠️ `docker exec` komutunu doğru çalıştırma
- ⚠️ SQL syntax hatalarını önleme

### Ders 3a (GeoServer Bağlantı)
- ⚠️⚠️⚠️ **host = postgis** (EN ÖNEMLİ!)
- ⚠️ Docker network adreslemesi

### Ders 3b (GeoServer Katman)
- ⚠️ Bounding Box hesaplama
- ⚠️ CRS (EPSG:4326) doğrulama

### Ders 3c (SLD - Opsiyonel)
- ⚠️ Filter type değerleri (Tarihi, Stadyum, Üniversite)
- ⚠️ GeoServer cache temizleme

### Ders 4 (OpenLayers)
- ⚠️ Koordinat dönüşümü (EPSG:4326 → 3857)
- ⚠️ WMS URL yapısı

### Ders 5 (Çizim)
- ⚠️ Draw interaction lifecycle
- ⚠️ geography vs geometry

### Ders 6 (Serbest)
- ⚠️ Katılımcı motivasyonu
- ⚠️ Zaman yönetimi

---

## 📞 Acil Destek

Eğitmen workshop sırasında sorun yaşarsa:

1. **Kurulum sorunları** → [../docs/kurulum-oncesi.md](../docs/kurulum-oncesi.md) - Troubleshooting
2. **Container sorunları** → [ders1-docker-kurulum.md](ders1-docker-kurulum.md) - Troubleshooting
3. **SQL hataları** → [ders2-postgis-mekansal-veri.md](ders2-postgis-mekansal-veri.md) - Troubleshooting
4. **GeoServer bağlantı** → [ders3a-geoserver-baglanti.md](ders3a-geoserver-baglanti.md) - Troubleshooting
5. **GeoServer katman** → [ders3b-geoserver-katman.md](ders3b-geoserver-katman.md) - Troubleshooting
6. **SLD stiller** → [ders3c-bonus-sld-stiller.md](ders3c-bonus-sld-stiller.md) - Troubleshooting
7. **JavaScript hataları** → [ders4-openlayers-web-uygulamasi.md](ders4-openlayers-web-uygulamasi.md) - Troubleshooting

---

**🎓 İyi dersler!**
