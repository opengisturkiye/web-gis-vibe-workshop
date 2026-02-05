-- PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Points tablosunu oluştur
CREATE TABLE IF NOT EXISTS points (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    description TEXT,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İstanbul Simge Mekanları
INSERT INTO points (name, type, description, geom) VALUES
    -- Tarihi Yerler
    ('Kız Kulesi', 'Tarihi', 'İstanbul Boğazı''nın simgesi, Üsküdar açıklarında yer alan tarihi kule', ST_GeomFromText('POINT(29.0041 41.0211)', 4326)),
    ('Galata Kulesi', 'Tarihi', 'Beyoğlu''nda yer alan Ceneviz döneminden kalma tarihi kule', ST_GeomFromText('POINT(28.9742 41.0256)', 4326)),
    ('Ayasofya Camii', 'Tarihi', 'Bizans döneminde inşa edilmiş, UNESCO Dünya Mirası listesindeki tarihi yapı', ST_GeomFromText('POINT(28.9800 41.0086)', 4326)),
    ('Topkapı Sarayı', 'Tarihi', 'Osmanlı padişahlarının yaşadığı tarihi saray kompleksi', ST_GeomFromText('POINT(28.9833 41.0115)', 4326)),
    ('Kapalıçarşı', 'Tarihi', 'Dünyanın en eski ve en büyük kapalı çarşılarından biri', ST_GeomFromText('POINT(28.9680 41.0107)', 4326)),
    
    -- Stadyumlar
    ('Vodafone Park', 'Stadyum', 'Beşiktaş JK''nın maçlarını oynadığı modern stadyum', ST_GeomFromText('POINT(29.0270 41.0392)', 4326)),
    ('Şükrü Saracoğlu Stadı', 'Stadyum', 'Fenerbahçe SK''nın maçlarını oynadığı tarihi stadyum', ST_GeomFromText('POINT(29.0367 40.9878)', 4326)),
    ('Nef Stadyumu', 'Stadyum', 'Galatasaray SK''nın maçlarını oynadığı modern stadyum', ST_GeomFromText('POINT(28.9947 41.1035)', 4326)),
    
    -- Alışveriş
    ('Forum İstanbul', 'AVM', 'İstanbul''un en büyük alışveriş ve eğlence merkezlerinden biri', ST_GeomFromText('POINT(28.8097 41.0556)', 4326)),
    
    -- Üniversiteler
    ('Boğaziçi Üniversitesi', 'Üniversite', 'Türkiye''nin en prestijli üniversitelerinden biri, Güney Kampüs', ST_GeomFromText('POINT(29.0449 41.0839)', 4326)),
    ('İstanbul Üniversitesi', 'Üniversite', 'Türkiye''nin en köklü üniversitesi, Beyazıt Kampüsü', ST_GeomFromText('POINT(28.9643 41.0119)', 4326)),
    ('İTÜ Ayazağa', 'Üniversite', 'İstanbul Teknik Üniversitesi Ana Kampüsü', ST_GeomFromText('POINT(29.0250 41.1050)', 4326)),
    ('YTÜ Davutpaşa', 'Üniversite', 'Yıldız Teknik Üniversitesi Davutpaşa Kampüsü', ST_GeomFromText('POINT(28.8920 41.0220)', 4326)),
    
    -- Semtler ve Meydanlar
    ('Ortaköy Meydanı', 'Semt', 'Boğaz kenarında tarihi cami ve popüler meydanıyla ünlü semt', ST_GeomFromText('POINT(29.0281 41.0482)', 4326)),
    
    -- Vapur İskeleleri
    ('Karaköy İskelesi', 'İskele', 'Tarihi yarımadaya bağlantı sağlayan önemli vapur iskelesi', ST_GeomFromText('POINT(28.9770 41.0217)', 4326)),
    ('Üsküdar İskelesi', 'İskele', 'Anadolu yakasının en işlek vapur iskelelerinden biri', ST_GeomFromText('POINT(29.0155 41.0263)', 4326)),
    ('Beşiktaş İskelesi', 'İskele', 'Beşiktaş semtinin merkezi vapur iskelesi', ST_GeomFromText('POINT(29.0237 41.0425)', 4326));

-- Polygons tablosunu oluştur (çizim kayıtları için)
CREATE TABLE IF NOT EXISTS polygons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    area_sq_km DECIMAL(10,4),
    geom GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lines tablosunu oluştur (ölçüm kayıtları için)
CREATE TABLE IF NOT EXISTS lines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    length_km DECIMAL(10,4),
    geom GEOMETRY(LineString, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spatial Index oluştur
CREATE INDEX IF NOT EXISTS idx_points_geom ON points USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_polygons_geom ON polygons USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_lines_geom ON lines USING GIST (geom);

-- Verileri kontrol et
SELECT 'PostgreSQL + PostGIS başarıyla kuruldu!' AS status;
SELECT 'Toplam nokta sayısı: ' || COUNT(*) AS points_count FROM points;
