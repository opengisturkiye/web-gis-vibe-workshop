# Ders 1: Docker ve Ortam Kurulumu (15 dakika)

> **Eğitmen Ders Notu** - Docker Container'ları Başlatma ve Temel Kontroller

---

## 📋 Ders Özeti

| Özellik | Detay |
|---------|-------|
| **Süre** | 15 dakika (Kurulum hariç) |
| **Zorluk** | Başlangıç |
| **Ön Gereksinim** | WSL2 + Docker Desktop yüklü |
| **Hedef Kitle** | Tüm seviyeler |
| **Kurulum Süresi** | +30 dakika (ders öncesi yapılmalı) |

---

## 🎯 Ders Hedefleri

Bu dersin sonunda katılımcılar şunları yapabilecek:

- [ ] Docker Desktop'ı başlatmak ve durumunu kontrol etmek
- [ ] `docker compose` komutunu kullanarak servisleri başlatmak
- [ ] Container durumlarını `docker ps` ile kontrol etmek
- [ ] Temel Docker komutlarını anlamak
- [ ] Port yönlendirme kavramını kavramak
- [ ] Web tarayıcıdan servislere erişmek

---

## 📚 Eğitmen Ön Hazırlık

### ADIM 0: Windows WSL2 ve Docker Desktop Kurulumu (Ders Öncesi - 30 dakika)

> **Not:** Bu adımlar workshop'tan ÖNCE katılımcılara mail ile gönderilmeli veya ders başında yüklü olmayanlar için ayrılmalıdır.

#### WSL2 Kurulumu (Windows 10/11 için)

**🎤 Eğitmen der:**

> "Docker Desktop Windows'ta WSL2 (Windows Subsystem for Linux 2) üzerinde çalışır. Önce WSL2'yi kuracağız."

**Adım 1: WSL2 Kurulumu (Tek komutla - Windows 11 veya güncel Windows 10)**

```powershell
# PowerShell'i YÖNETİCİ olarak aç (sağ tık → Run as Administrator)

# WSL2'yi kur
wsl --install

# Bilgisayarı yeniden başlat
Restart-Computer
```

**📊 Beklenen Çıktı:**

```
Installing: Virtual Machine Platform
Installing: Windows Subsystem for Linux
Installing: Ubuntu
The requested operation is successful. Changes will not be effective until the system is rebooted.
```

**Adım 2: WSL2 Sürümünü Kontrol Et (Yeniden başlatma sonrası)**

```powershell
# WSL2 yüklü mü kontrol et
wsl --status

# Beklenen çıktı:
# Default Distribution: Ubuntu
# Default Version: 2
```

**⚠️ Eski Windows Sürümleri İçin Manuel Kurulum:**

```powershell
# 1. WSL ve Virtual Machine Platform özelliklerini etkinleştir
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 2. Bilgisayarı yeniden başlat
Restart-Computer

# 3. WSL2'yi varsayılan yap
wsl --set-default-version 2

# 4. Ubuntu dağıtımını yükle
wsl --install -d Ubuntu
```

**🎤 Eğitmen açıklar:**

> "WSL2 nedir? Windows içinde gerçek bir Linux kernel'i çalıştırır. Docker container'ları Linux tabanlı olduğu için gerekli."

**Adım 3: Ubuntu İlk Kurulum**

```bash
# İlk açılışta kullanıcı adı ve şifre sor
# Örnek:
# Username: workshop
# Password: ****
```

**💡 Troubleshooting:**

| Sorun | Çözüm |
|-------|-------|
| "Virtualization disabled" | BIOS'ta VT-x/AMD-V etkinleştir |
| "WSL 2 requires an update" | https://aka.ms/wsl2kernel - kernel güncelle |
| wsl --install çalışmıyor | Windows Update kontrol et, güncel olmalı |

---

#### Docker Desktop Kurulumu

**🎤 Eğitmen der:**

> "WSL2 hazır, şimdi Docker Desktop'ı indirip kuracağız."

**Adım 1: Docker Desktop İndirme**

```
İnternet tarayıcıda:
https://www.docker.com/products/docker-desktop/

→ "Download for Windows" butonuna tıkla
→ DockerDesktopInstaller.exe indir (yaklaşık 500-600 MB)
```

**📊 Ekran Göster:**

```
┌────────────────────────────────────────────────────┐
│   Docker Desktop Download Sayfası                  │
├────────────────────────────────────────────────────┤
│                                                    │
│   [🐳 Docker Desktop]                              │
│                                                    │
│   Windows | Mac | Linux                           │
│                                                    │
│   ╔════════════════════════════════╗              │
│   ║  Download for Windows          ║              │
│   ║  (Docker Desktop Installer.exe)║              │
│   ╚════════════════════════════════╝              │
│                                                    │
│   System Requirements:                            │
│   • Windows 10 64-bit (21H2 or higher)            │
│   • WSL 2 feature enabled                         │
│   • 4GB RAM minimum                               │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Adım 2: Docker Desktop Kurulum**

```
1. DockerDesktopInstaller.exe dosyasına çift tıkla
2. "Use WSL 2 instead of Hyper-V" seçeneği işaretli olmalı ✓
3. "Add shortcut to desktop" seçeneği işaretli (opsiyonel)
4. "Install" butonuna tıkla
5. Kurulum tamamlanınca "Close and restart" tıkla
6. Bilgisayar yeniden başlar
```

**📊 Kurulum Ekranı:**

```
┌────────────────────────────────────────────────────┐
│   Docker Desktop Installer                         │
├────────────────────────────────────────────────────┤
│                                                    │
│   Configuration                                    │
│                                                    │
│   ☑ Use WSL 2 instead of Hyper-V (recommended)    │
│   ☑ Add shortcut to desktop                       │
│                                                    │
│   Installation will require about 2.5 GB          │
│                                                    │
│   ┌──────────────────────────────┐                │
│   │         Install              │                │
│   └──────────────────────────────┘                │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Adım 3: İlk Çalıştırma ve Ayarlar**

```
1. Yeniden başlatma sonrası Docker Desktop otomatik açılır
2. "Accept" Service Agreement'i kabul et
3. "Skip" anket/login ekranını atla (opsiyonel)
4. Docker Desktop açılır, gösterge yeşil olmalı: 🟢 Docker is running
```

**Adım 4: Kurulum Testi**

```powershell
# PowerShell veya CMD aç

# Docker versiyonu kontrol et
docker --version
# Beklenen: Docker version 24.0.x, build xxxxxxx

# Docker Compose kontrol et
docker compose version
# Beklenen: Docker Compose version v2.x.x

# Test container'ı çalıştır
docker run hello-world

# Beklenen çıktı:
# Hello from Docker!
# This message shows that your installation appears to be working correctly.
```

**🎤 Eğitmen der:**

> "Eğer 'Hello from Docker!' mesajını gördüyseniz, kurulum başarılı! Docker çalışıyor."

**⚠️ Yaygın Kurulum Sorunları:**

| Sorun | Çözüm |
|-------|-------|
| "Docker failed to start" | WSL2 kontrol: `wsl --status` |
| "Hardware assisted virtualization" | BIOS'ta VT-x/AMD-V aç |
| "Access denied" | Kullanıcıyı "docker-users" grubuna ekle |
| Docker çok yavaş | Settings → Resources → Memory 4GB+ ver |

**Docker Desktop Settings (Önerilen Ayarlar):**

```
Docker Desktop → Settings (⚙️)

General:
☑ Start Docker Desktop when you log in
☑ Use the WSL 2 based engine

Resources → Advanced:
• CPUs: 2-4 (bilgisayar kapasitesine göre)
• Memory: 4-8 GB
• Disk image size: 64 GB (default)

Docker Engine:
(Varsayılan ayarlar yeterli, değiştirme)
```

**✅ Kurulum Tamamlandı Checklist:**

- [ ] WSL2 kurulu ve çalışıyor (`wsl --status`)
- [ ] Docker Desktop kurulu ve çalışıyor (🟢 green icon)
- [ ] `docker --version` çalışıyor
- [ ] `docker run hello-world` başarılı

**🎤 Eğitmen der:**

> "Docker kurulumu tamamlandı! Artık workshop'ın asıl kısmına geçebiliriz. Herkes hazır mı?"

---

### GitHub'dan Projeyi İndirme (Git Clone)

**🎤 Eğitmen der:**

> "Şimdi workshop projemizi GitHub'dan indireceğiz. Tüm dosyalar hazır: Docker yapılandırması, veritabanı, web uygulaması."

#### Git Kurulumu (Eğer yüklü değilse)

**Git Kontrol:**

```powershell
# Git yüklü mü kontrol et
git --version

# Beklenen: git version 2.x.x
```

**Eğer Git yüklü değilse:**

```
1. https://git-scm.com/download/win adresine git
2. "Download for Windows" butonuna tıkla
3. Git-x.x.x-64-bit.exe dosyasını indir ve kur
4. Varsayılan ayarlarla devam et (Next, Next, ...)
5. Kurulum bitince terminali yeniden aç
```

#### Projeyi İndirme

**Adım 1: Proje Klasörü Oluştur**

```powershell
# PowerShell veya CMD aç

# Çalışma dizinine git (örnek: Masaüstü)
cd Desktop

# Veya belgelerime
cd Documents

# Veya istediğiniz bir yer:
# cd D:\projects
```

**Adım 2: Git Clone**

```powershell
# GitHub repository'den projeyi indir
git clone https://github.com/opengisturkiye/web-gis-vibe-workshop.git

# Beklenen çıktı:
# Cloning into 'web-gis-vibe-workshop'...
# remote: Enumerating objects: 50, done.
# remote: Counting objects: 100% (50/50), done.
# remote: Compressing objects: 100% (35/35), done.
# remote: Total 50 (delta 10), reused 45 (delta 8)
# Receiving objects: 100% (50/50), 25.50 KiB | 2.55 MiB/s, done.
# Resolving deltas: 100% (10/10), done.
```

**📊 İndirme Sürecini Göster:**

```
┌────────────────────────────────────────────────────┐
│   Git Clone İşlemi                                 │
├────────────────────────────────────────────────────┤
│                                                    │
│   GitHub (Remote)                                  │
│   ┌──────────────────────────────┐                │
│   │ opengisturkiye/              │                │
│   │ web-gis-vibe-workshop        │                │
│   │                              │                │
│   │  📁 docker-compose.yml       │                │
│   │  📁 db/                      │                │
│   │  📁 web/                     │                │
│   │  📁 data/                    │                │
│   │  📄 README.md                │                │
│   └──────────────────────────────┘                │
│          │                                         │
│          │ git clone (indir)                       │
│          ↓                                         │
│   Yerel Bilgisayar                                │
│   ┌──────────────────────────────┐                │
│   │ Desktop/                     │                │
│   │ web-gis-vibe-workshop/       │                │
│   │                              │                │
│   │  ✓ Tüm dosyalar indirildi   │                │
│   └──────────────────────────────┘                │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Adım 3: Proje Klasörüne Gir**

```powershell
# İndirilen klasöre gir
cd web-gis-vibe-workshop

# İçeriği kontrol et
dir  # (Windows CMD)
# veya
ls   # (PowerShell)

# Beklenen çıktı:
# Mode                 LastWriteTime         Length Name
# ----                 -------------         ------ ----
# d----          05/02/2026    10:00                data
# d----          05/02/2026    10:00                db
# d----          05/02/2026    10:00                docs
# d----          05/02/2026    10:00                lessons
# d----          05/02/2026    10:00                web
# -a---          05/02/2026    10:00           1234 docker-compose.yml
# -a---          05/02/2026    10:00           5678 README.md
```

**🎤 Eğitmen açıklar:**

> "Bu klasörde ne var?
> - `docker-compose.yml` → Tüm servislerin tanımı
> - `db/` → PostgreSQL veritabanı dosyaları
> - `web/` → Web uygulaması (HTML, CSS, JavaScript)
> - `data/` → Örnek coğrafi veriler
> - `docs/` → Dökümanlar
> - `lessons/` → Ders notları (sizin için hazırladık!)
> 
> Hepsi hazır, çalıştırmaya başlayabiliriz!"

**⚠️ Alternatif: Zip İndirme (Git yüklü değilse)**

```
Eğer Git kurulumu sorun çıkarırsa:

1. Tarayıcıda: https://github.com/opengisturkiye/web-gis-vibe-workshop
2. Yeşil "Code" butonuna tıkla
3. "Download ZIP" seç
4. web-gis-vibe-workshop-main.zip dosyasını indir
5. Dosyayı sağ tık → "Extract All" → Çıkart
6. Çıkarılan klasöre gir (web-gis-vibe-workshop-main)
7. PowerShell'de bu klasöre cd ile git
```

**💡 Troubleshooting:**

| Sorun | Çözüm |
|-------|-------|
| "git: command not found" | Git'i kur: https://git-scm.com/download/win |
| "Permission denied" | Farklı klasör dene (Desktop yerine Documents) |
| "fatal: destination path exists" | Klasör zaten var, `cd web-gis-vibe-workshop` yap |
| İndirme çok yavaş | Zip olarak indir (alternatif yöntem) |

**✅ Proje İndirme Checklist:**

- [ ] Git kurulu (`git --version` çalışıyor)
- [ ] Proje indirildi (`web-gis-vibe-workshop` klasörü var)
- [ ] Proje klasörüne girildi (`cd web-gis-vibe-workshop`)
- [ ] İçerik kontrol edildi (`docker-compose.yml` dosyası görünüyor)

**🎤 Eğitmen kontrol eder:**

> "Herkes `web-gis-vibe-workshop` klasörünün içinde mi? `docker-compose.yml` dosyasını görüyor musunuz? Görmeyenler el kaldırsın!"

---

### Ders Öncesi Teknik Kontroller (10 dakika önce)

> **Not:** Aşağıdaki komutlar docker kurulumu ve proje indirmesi tamamlandıktan sonra, ders başlamadan önce eğitmen tarafından yapılır.

```bash
# 1. Docker Desktop çalışıyor mu?
docker --version
# Beklenen: Docker version 20.10.x veya üzeri

# 2. Docker Compose çalışıyor mu?
docker compose version
# Beklenen: Docker Compose version v2.x.x

# 3. Proje dizininde miyiz?
pwd  # (PowerShell: Get-Location)
# Beklenen: .../web-gis-vibe-workshop

# 4. docker-compose.yml dosyası var mı?
ls docker-compose.yml
# Dosya görünmeli

# 5. Önceki container'ları temizle (varsa)
docker compose down

# 6. Container'ları test başlat
docker compose up -d

# 7. Container durumlarını kontrol et
docker ps
# Beklenen: 3 container "Up" durumunda

# 8. Servisleri test et
# - http://localhost:8081 (Web uygulaması)
# - http://localhost:8080/geoserver (GeoServer - 2-3 dk bekleyebilir)

# 9. Test sonrası durdur
docker compose down
```

### Materyal Hazırlığı

- [ ] **Sunum Slaytları:** Docker mimarisi, Container kavramı
- [ ] **Terminal:** Büyük font (16pt+), koyu tema
- [ ] **Tarayıcı:** Bookmark'lar hazır (localhost:8081, localhost:8080/geoserver)
- [ ] **Ekran Paylaşımı:** Test edildi
- [ ] **Yedek Plan:** Docker Desktop installer hazır (internet kesilirse)

### Yaygın Sorunlar için Hazırlık

| Sorun | Çözüm | Açıklama |
|-------|-------|----------|
| Docker başlamıyor | Bilgisayarı yeniden başlat | Windows'ta WSL2 sorunu olabilir |
| Port çakışması (5432) | PostgreSQL servisi durdur | Yerel PostgreSQL çalışıyor olabilir |
| GeoServer 404 hatası | 2-3 dakika bekle | GeoServer başlaması uzun sürer |
| "No space left on device" | Docker volume temizle | `docker system prune -a` |

---

## 🎬 Ders Akışı (15 dakika)

### Giriş ve Motivasyon (2 dakika)

**🎤 Eğitmen Konuşması:**

> "Günaydın! Bugün 3 saatlik Web CBS workshop'ımıza hoş geldiniz. İsmim [ADI], [UZMANLIK ALANI] üzerine çalışıyorum.
>
> Bugün sıfırdan bir Web Coğrafi Bilgi Sistemi geliştireceğiz. Harita görüntüleme, veri sorgulama, çizim ve ölçüm yapan profesyonel bir uygulama olacak.
>
> Kullanacağımız teknolojiler gerçek dünya projelerinde de kullanılıyor: Docker, PostgreSQL, GeoServer, OpenLayers. Yani bu workshop sonunda özgeçmişinize ekleyebileceğiniz beceriler kazanacaksınız!"

**📊 Slayt Göster:** Teknoloji Stack Diyagramı

```
┌─────────────────────────────────────────────────┐
│          WEB CBS WORKSHOP STACK                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  [OpenLayers]  ← Frontend (JavaScript)         │
│       ↓                                         │
│  [GeoServer]   ← Harita Servisleri (WMS/WFS)   │
│       ↓                                         │
│  [PostGIS]     ← Mekansal Veritabanı           │
│       ↓                                         │
│  [Docker]      ← Container Platformu            │
│                                                 │
└─────────────────────────────────────────────────┘
```

**🎤 Eğitmen der:**

> "Docker sayesinde herkes aynı ortamda çalışacak. 'Benim bilgisayarımda çalışıyordu' problemi olmayacak. Tüm servisler izole container'larda çalışacak."

**💡 Pedagojik Not:** Katılımcıların dikkatini çekmek için günlük hayattan örnek ver:
> "Docker, yazılım için kargo konteynerine benzer. Uygulamanızı ve tüm bağımlılıklarını bir kutuya koyar, her yerde aynı şekilde çalışır."

---

### Adım 1: Docker Desktop'ı Başlatma (2 dakika)

**🎤 Eğitmen der:**

> "İlk adım, Docker Desktop'ı başlatmak. Windows kullanıcıları masaüstünde Docker simgesini görecek."

**👨‍🏫 Canlı Demo:**

1. **Ekranda göster:** Windows masaüstünde Docker Desktop simgesi
2. **Çift tıkla** simgeye
3. **Göster:** Açılış ekranı (Loading...)
4. **Bekle:** Yeşil "Docker Desktop is running" durumu

**📊 Görsel Göster:**

```
Docker Desktop Durumları:
─────────────────────────────
🔴 Starting    → Bekle
🟡 Starting VM → Bekle (WSL2 başlatılıyor)
🟢 Running     → Hazır! ✓
```

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**
> "Herkes Docker Desktop'ta yeşil 'Running' durumunu görüyor mu? Görmeyenler el kaldırsın!"

**Yaygın Sorun 1: Docker başlamıyor**

```
Çözüm Adımları (Ekranda göster):
1. Docker Desktop'ı kapat (tamamen çık)
2. Görev Yöneticisi → Docker Desktop → İşlemi sonlandır
3. Docker Desktop'ı yeniden başlat
4. 1-2 dakika bekle

Hâlâ çalışmazsa:
- Bilgisayarı yeniden başlat
- WSL2 güncel mi kontrol et: wsl --update
```

**⏱️ Zaman Yönetimi:** 
- Çoğunluk hazırsa ilerle
- 2-3 kişi sorunluysa yardımcı ol, diğerleri beklesin
- 5+ kişi sorunluysa genel çözüm göster

---

### Adım 2: Proje Dizinine Gitme (1 dakika)

**🎤 Eğitmen der:**

> "Şimdi terminal açıp proje klasörüne gidelim. Windows PowerShell veya VS Code terminalini kullanabilirsiniz."

**👨‍🏫 Canlı Demo:**

**Terminal açılışı (ekranda büyük font):**

```powershell
# Windows PowerShell
PS C:\Users\username>
```

**Eğitmen komut yazar:**

```powershell
cd web-gis-vibe-workshop
```

**Enter tuşuna bas**

**Beklenen çıktı:**

```powershell
PS C:\Users\username\web-gis-vibe-workshop>
```

**🎤 Eğitmen açıklar:**

> "`cd` komutu 'change directory' demektir. Proje klasörüne geçiş yaptık. Burası `docker-compose.yml` dosyasının olduğu yer."

**📁 Dosya Yapısını Göster:**

```powershell
# Klasör içeriğini listele
ls

# Beklenen çıktı:
Mode    Name
----    ----
d----   data
d----   db
d----   docs
d----   web
-a---   docker-compose.yml
-a---   README.md
```

**🎤 Eğitmen vurgular:**

> "Bu dosyalar GitHub'dan indirdiğiniz proje. `docker-compose.yml` çok önemli, tüm servisleri tanımlıyor."

**💡 Ek Bilgi (zaman varsa):**

```yaml
# docker-compose.yml içeriğini kısaca göster (VS Code ile)
services:
  postgis:    # PostgreSQL + PostGIS veritabanı
  geoserver:  # GeoServer harita servisi
  web:        # Nginx web sunucusu
```

---

### Adım 3: Container'ları Başlatma (3 dakika)

**🎤 Eğitmen der:**

> "Şimdi sihir başlıyor! Tek bir komutla 3 servisi birden başlatacağız."

**👨‍🏫 Canlı Demo:**

**Komutu yavaşça yaz (ekranda büyük font):**

```powershell
docker compose up -d
```

**Enter'dan önce açıkla:**

**🎤 Eğitmen der:**

> "`docker compose` → Docker Compose aracını çağırıyoruz
> `up` → Servisleri başlat
> `-d` → Detached mode, arka planda çalışsın (terminal bloklanmasın)"

**Enter tuşuna bas!**

**📊 Beklenen Çıktı (canlı göster):**

```
[+] Running 3/3
✔ Container postgis    Started    1.2s
✔ Container geoserver  Started    1.5s
✔ Container web        Started    0.8s
```

**🎤 Eğitmen açıklar:**

> "Yeşil tik işaretleri gördünüz mü? ✔ Bu, container'ların başarıyla başladığı anlamına gelir.
>
> Docker şu an 3 ayrı ortam oluşturdu:
> 1. **postgis** → PostgreSQL veritabanı + PostGIS eklentisi
> 2. **geoserver** → Java tabanlı harita sunucusu
> 3. **web** → Nginx ile statik dosya sunucusu"

**⚠️ İlk Çalıştırma Uyarısı:**

**🎤 Eğitmen uyarır:**

> "⏱️ İlk çalıştırmada Docker, image'ları internetten indirecek. Bu 2-5 dakika sürebilir. İndirme ilerlemesi göreceksiniz."

**İndirme ekranı örneği:**

```
[+] Running 10/10
⠿ postgis Pulling
⠿ geoserver Pulling
  ⠿ 7c3b88808835 Downloading [===========>    ] 15.2MB/31.4MB
  ⠿ 4c5b86d1a87b Downloading [====>           ] 8.1MB/45.2MB
```

**💡 Pedagojik Not:** İndirme sürerken anlatılacak konular:

**🎤 Eğitmen der (indirme sırasında):**

> "Docker image nedir? Bir şablondur. Uygulama, kütüphaneler, işletim sistemi - her şey paketlenmiş.
>
> Container nedir? Image'ın çalışan halidir. Aynı image'dan birden fazla container başlatabilirsiniz.
>
> Örnek: Image = Kek kalıbı, Container = Pişen kek."

---

### Adım 4: Container Durumunu Kontrol Etme (2 dakika)

**🎤 Eğitmen der:**

> "Container'lar başladı, ama gerçekten çalışıyorlar mı? Kontrol edelim!"

**👨‍🏫 Canlı Demo:**

```powershell
docker ps
```

**📊 Beklenen Çıktı (formatlanmış halde göster):**

```
CONTAINER ID   IMAGE                     STATUS         PORTS
xxxxxxxxxxxxx  postgis/postgis:15-3.3    Up 2 minutes   0.0.0.0:5432->5432/tcp
xxxxxxxxxxxxx  kartoza/geoserver:2.24.1  Up 2 minutes   0.0.0.0:8080->8080/tcp
xxxxxxxxxxxxx  nginx:alpine              Up 2 minutes   0.0.0.0:8081->80/tcp
```

**🎤 Eğitmen sütunları açıklar:**

**1. CONTAINER ID:**
> "Her container'ın benzersiz kimliği. `docker exec` gibi komutlarda kullanılır."

**2. IMAGE:**
> "Hangi image'dan oluşturuldu. 
> - `postgis/postgis:15-3.3` → PostgreSQL 15, PostGIS 3.3
> - `kartoza/geoserver:2.24.1` → GeoServer 2.24.1
> - `nginx:alpine` → Hafif Nginx image'ı"

**3. STATUS:**
> "**En önemli sütun!** 'Up X minutes' görmek zorundasınız.
> - `Up 2 minutes` ✅ Çalışıyor
> - `Restarting` ⚠️ Sorun var, yeniden başlıyor
> - `Exited (1)` ❌ Hata verdi, durdu"

**4. PORTS:**
> "Port yönlendirme:
> - `0.0.0.0:5432->5432` → Bilgisayarınızın 5432 portu → Container'ın 5432 portu
> - `0.0.0.0:8080->8080` → GeoServer
> - `0.0.0.0:8081->80` → Web sunucusu (container içi 80, dışarıya 8081)"

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes 3 satır görüyor mu? Her satırda 'Up X minutes' yazıyor mu?"

**Yaygın Sorun 2: Container sürekli yeniden başlıyor (Restarting)**

```powershell
# Logları kontrol et
docker compose logs geoserver

# Yaygın nedenler:
# - Port çakışması (başka bir uygulama aynı portu kullanıyor)
# - Bellek yetersiz (Docker'a 4GB+ RAM tahsis et)
# - Image bozuk (yeniden indir)

# Çözüm:
docker compose down
docker compose up -d
```

**Yaygın Sorun 3: Container hemen durdı (Exited)**

```powershell
# Neden durdu? Logları oku
docker compose logs postgis

# PostgreSQL şifresi yanlış olabilir
# docker-compose.yml dosyasını kontrol et
```

---

### Adım 5: Servislere Erişim Testi (5 dakika)

**🎤 Eğitmen der:**

> "Container'lar çalışıyor, ama web'den erişebiliyor muyuz? Test zamanı!"

#### 5.1 Web Uygulaması Testi (2 dakika)

**👨‍🏫 Canlı Demo:**

**Tarayıcı aç (Chrome/Edge önerilir)**

**Adres çubuğuna yaz:**
```
http://localhost:8081
```

**Enter tuşuna bas**

**📊 Beklenen Görünüm:**

```
┌────────────────────────────────────────────────┐
│ Sidebar        │  Harita (OpenStreetMap)       │
│                │                                │
│ Layer Control  │         🗺️                    │
│ ☑ OSM          │      ┌─────────┐              │
│ ☑ WMS          │      │ Ankara  │              │
│                │      └─────────┘              │
│ Tools          │                                │
│ [📐 Çizim]     │  (Merkez: TBMM, Zoom: 12)     │
│ [📏 Ölçüm]     │                                │
│                │                                │
└────────────────┴────────────────────────────────┘
```

**🎤 Eğitmen açıklar:**

> "Gördünüz mü? Profesyonel bir harita uygulaması! 
>
> Sol tarafta kontroller var:
> - Layer Control → Katmanları aç/kapat
> - Tools → Çizim ve ölçüm araçları
>
> Sağda OpenStreetMap haritası. Zoom yapabilirsiniz, sürükleyebilirsiniz."

**👆 İnteraktif Test:**

**Eğitmen haritada gezinir:**

1. **Zoom In (+)** → Yakınlaştır
2. **Zoom Out (-)** → Uzaklaştır
3. **Pan (sürükle)** → Haritayı kaydır
4. **Checkbox** → OSM katmanını kapat/aç

**⚠️ Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes haritayı görüyor mu? Zoom yapabiliyor musunuz?"

**Yaygın Sorun 4: Sayfa yüklenmiyor (Connection refused)**

```
Çözüm:
1. Container çalışıyor mu kontrol et: docker ps
2. Web container "Up" durumunda mı?
3. Tarayıcı cache temizle: Ctrl+Shift+R (Hard Refresh)
4. Farklı tarayıcı dene (Firefox, Edge)
```

#### 5.2 GeoServer Admin Panel Testi (3 dakika)

**🎤 Eğitmen der:**

> "Şimdi en kritik servis: GeoServer! Harita servislerini buradan yayınlayacağız."

**⏱️ ÇOK ÖNEMLİ UYARI:**

**🎤 Eğitmen vurgular:**

> "⚠️ DİKKAT! GeoServer'ın tamamen başlaması 2-3 dakika sürer. İlk girişte '404 Not Found' hatası alırsanız panik yapmayın! Sabırla bekleyin."

**Tarayıcı aç (yeni sekme)**

**Adres çubuğuna yaz:**
```
http://localhost:8080/geoserver
```

**Enter tuşuna bas**

**📊 Olası Durumlar:**

**Durum 1: GeoServer Hazır ✅**

```
┌─────────────────────────────────────────┐
│         GeoServer                       │
│  ┌──────────────────────────┐           │
│  │                          │           │
│  │    🗺️ GeoServer Logo    │           │
│  │                          │           │
│  │  Version 2.24.1          │  [Login] │
│  │                          │           │
│  └──────────────────────────┘           │
└─────────────────────────────────────────┘
```

**Eğitmen der:**
> "Harika! GeoServer hazır. 'Login' butonuna tıklayın."

**Durum 2: 404 Hatası ⏱️**

```
┌─────────────────────────────────────────┐
│  HTTP Status 404 – Not Found            │
│                                         │
│  The origin server did not find a       │
│  current representation for the         │
│  target resource...                     │
└─────────────────────────────────────────┘
```

**Eğitmen sakin kalır:**

> "Normal! GeoServer Java uygulaması, başlaması zaman alıyor. Terminale bakalım."

**Terminal göster:**

```powershell
docker compose logs -f geoserver
```

**Logları canlı izle:**

```
geoserver | INFO: Starting Servlet engine: [Apache Tomcat/9.0.x]
geoserver | INFO: Loading Spring context...
geoserver | INFO: GeoServer is starting up...
geoserver | ⠿ Loading catalog... [████████░░] 80%
```

**Eğitmen açıklar:**

> "Katalog yükleniyor. %100 olunca hazır olacak. 1-2 dakika bekleyin."

**⏱️ Bekleme sırasında anlatılacaklar:**

**🎤 Eğitmen der (bekleme sırasında):**

> "GeoServer nedir? Açık kaynaklı harita sunucusudur. Coğrafi verileri WMS, WFS gibi standart protokollerle yayınlar.
>
> WMS (Web Map Service): Harita görüntüleri (PNG, JPEG)
> WFS (Web Feature Service): Vektör verileri (GeoJSON, GML)
>
> Örnek: Google Maps API gibi, ama kendi sunucunuzda, tamamen sizin kontrolünüzde!"

**✅ GeoServer Hazır Olduğunda:**

**Sağ üst köşede **Login** butonu tıkla**

**Login Formu:**

```
┌─────────────────────────────────────┐
│  Username: [admin            ]      │
│  Password: [geoserver        ]      │
│             [Login]                 │
└─────────────────────────────────────┘
```

**Kullanıcı adı:** `admin`
**Şifre:** `geoserver`

**Login tıkla**

**📊 Beklenen: GeoServer Admin Paneli**

```
┌──────────────────────────────────────────────┐
│  GeoServer                          [Logout] │
├──────────────────────────────────────────────┤
│ ≡ Menu           │  Welcome                  │
│                  │                            │
│ ▼ Data           │  Layers: 0                 │
│   Workspaces     │  Stores: 0                 │
│   Stores         │  ...                       │
│   Layers         │                            │
│                  │                            │
└──────────────────┴────────────────────────────┘
```

**🎤 Eğitmen başarıyla giriş yaptıktan sonra:**

> "Tebrikler! GeoServer admin paneline girdik. Sol menüde 'Data' altında Workspaces, Stores, Layers var. Sonraki derste buradan layer yayınlayacağız."

**⚠️ Son Kritik Kontrol Noktası:**

**Eğitmen sorar:**

> "Herkes GeoServer admin panelini görüyor mu? 'Welcome' yazısı var mı?"

---

### Kapanış ve Özet (2 dakika)

**🎤 Eğitmen der:**

> "Harika! İlk dersi tamamladık. Hızlı bir özet yapalım."

**📊 Slayt Göster: Ders 1 Özeti**

```
✅ TAMAMLANAN GÖREVLER
─────────────────────────────────────────
✓ Docker Desktop başlatıldı
✓ docker compose up -d komutu çalıştırıldı
✓ 3 container başarıyla başlatıldı:
  • postgis (PostgreSQL + PostGIS)
  • geoserver (GeoServer 2.24.1)
  • web (Nginx)
✓ docker ps ile durum kontrol edildi
✓ http://localhost:8081 - Web uygulaması erişildi
✓ http://localhost:8080/geoserver - GeoServer erişildi

📚 ÖĞRENİLEN KAVRAMLAR
─────────────────────────────────────────
• Docker Container nedir?
• Docker Compose nedir?
• Port yönlendirme (8080:8080, 5432:5432)
• Detached mode (-d)
• Container durumu (Up, Restarting, Exited)
```

**🎤 Eğitmen vurgular:**

> "Artık tam çalışan bir Web CBS ortamınız var! 3 servis birlikte çalışıyor. Sonraki derste PostGIS veritabanına gireceğiz, İstanbul'daki 17 nokta verisini inceleyeceğiz."

**⏱️ Zaman Kontrolü:**

- Ders plana göre gidiyor mu? (15 dk)
- Geride kalanlar var mı? (1-2 dk ek süre ver)
- Herkes hazır mı? (sonraki derse geçiş)

**💬 Soru-Cevap (opsiyonel, 1 dakika)**

**Yaygın Sorular:**

**S1: "Container'ları nasıl durdurabilirim?"**

```powershell
docker compose down

# Tüm container'lar güvenli şekilde kapanır
```

**S2: "Container'lar bilgisayarı yavaşlatır mı?"**

> "Hayır! Docker, kaynakları verimli kullanır. Ama çok fazla container çalıştırırsanız RAM tükenebilir. Bu workshop için 3 container yeterli."

**S3: "Verileri silersem ne olur?"**

> "Container'ları `docker compose down` ile durdursanız bile veriler kalır. Docker volume kullanıyoruz. Sadece `docker compose down -v` komutu volume'leri siler."

---

## 📋 Eğitmen Kontrol Listesi

### Ders Başında

- [ ] Projeksiyon çalışıyor
- [ ] Terminal font büyüklüğü uygun (16pt+)
- [ ] Tüm katılımcılar duyabiliyor
- [ ] Docker Desktop açık ve hazır
- [ ] Proje dizini doğru

### Ders Sırasında

- [ ] Her adım sonrası kontrol noktası
- [ ] Yavaş ilerleyenlere yardım
- [ ] Kod/komutları yavaş yaz
- [ ] Hata mesajlarını panik yapmadan çöz
- [ ] Zaman yönetimi (15 dk)

### Ders Sonunda

- [ ] Tüm container'lar "Up" durumunda
- [ ] Web uygulaması erişilebilir
- [ ] GeoServer login yapılabilir
- [ ] Katılımcılar sonraki derse hazır

### Sorun Takibi

| Katılımcı | Sorun | Çözüm | Durum |
|-----------|-------|-------|-------|
|           |       |       |       |

---

## 🔧 Troubleshooting Rehberi (Detaylı)

### 1. Docker Desktop Başlamıyor

**Semptomlar:**
- Docker simgesi gri
- "Docker Desktop failed to start" hatası
- Sonsuz "Starting..." döngüsü

**Çözüm Adımları:**

```powershell
# 1. Docker'ı tamamen kapat
# Sistem tepsisinde Docker simgesi → Sağ tık → Quit

# 2. Görev Yöneticisi'nden kontrol et
# Ctrl+Shift+Esc → "Docker Desktop" varsa → End Task

# 3. WSL2'yi yeniden başlat
wsl --shutdown
wsl --list --verbose

# 4. Docker Desktop'ı yeniden aç
# Masaüstünden simgeye çift tıkla

# 5. Hâlâ çalışmazsa: Bilgisayarı yeniden başlat
```

**Derin Sorun (Windows):**

```powershell
# WSL2 güncelleme gerekebilir
wsl --update

# Hyper-V aktif mi kontrol et (PowerShell Admin)
Get-WindowsOptionalFeature -FeatureName Microsoft-Hyper-V-All -Online

# Sonuç "Enabled" olmalı
```

### 2. Port Çakışması Hataları

**Hata Mesajı:**
```
Error starting userland proxy: listen tcp4 0.0.0.0:5432: bind: address already in use
```

**Çözüm:**

```powershell
# Hangi uygulama portu kullanıyor?
netstat -ano | findstr :5432

# Çıktı:
# TCP    0.0.0.0:5432    0.0.0.0:0    LISTENING    1234

# PID 1234 numaralı process'i kontrol et
tasklist | findstr 1234

# PostgreSQL.exe çıkarsa → PostgreSQL servisi durdurumalı
# Hizmetler → PostgreSQL → Durdur
```

**Alternatif Çözüm: Port Değiştir**

`docker-compose.yml` dosyasını düzenle:

```yaml
postgis:
  ports:
    - "5433:5432"  # 5432 yerine 5433 kullan
```

Sonra:

```powershell
docker compose down
docker compose up -d
```

### 3. GeoServer Sürekli Yeniden Başlıyor

**Logları İncele:**

```powershell
docker compose logs geoserver | more

# Yaygın hatalar:
# - Java heap space → RAM yetersiz
# - Permission denied → Volume izin sorunu
# - Connection refused → PostgreSQL hazır değil
```

**Çözüm: RAM Artır**

Docker Desktop → Settings → Resources → Memory → 6GB

**Çözüm: Bekleme Süresi Ekle**

`docker-compose.yml` dosyasında:

```yaml
geoserver:
  depends_on:
    postgis:
      condition: service_healthy
  restart: on-failure
```

### 4. "No Space Left on Device" Hatası

**Docker Disk Dolmuş:**

```powershell
# Disk kullanımını kontrol et
docker system df

# Çıktı:
# TYPE            TOTAL     ACTIVE    SIZE
# Images          15        3         8.5GB
# Containers      20        3         1.2GB
# Local Volumes   10        3         2GB

# Kullanılmayan kaynakları temizle
docker system prune -a

# Uyarı! Tüm container'lar ve image'lar silinecek (çalışanlar hariç)
```

### 5. Web Uygulaması Boş Sayfa

**Tarayıcı Developer Console Kontrol:**

```
F12 tuşu → Console sekmesi
```

**Yaygın Hatalar:**

```javascript
// CORS hatası
Access to fetch at 'http://localhost:8080/geoserver/wms' blocked by CORS

// OpenLayers yüklenemedi
Failed to load resource: net::ERR_NAME_NOT_RESOLVED

// JavaScript syntax hatası
Uncaught SyntaxError: Unexpected token
```

**Çözüm:**

```powershell
# Web container'ını yeniden başlat
docker compose restart web

# Cache temizle
Ctrl+Shift+R (Hard Refresh)
```

---

## 📚 Ek Kaynaklar

### Docker Komutları Cheat Sheet

```powershell
# Container'ları başlat
docker compose up -d

# Container'ları durdur
docker compose down

# Container durumunu görüntüle
docker ps
docker ps -a  # Duran container'lar da

# Logları görüntüle
docker compose logs
docker compose logs -f  # Canlı takip
docker compose logs geoserver  # Sadece bir servis

# Container'a gir (interaktif shell)
docker exec -it postgis bash

# Container'ı yeniden başlat
docker compose restart geoserver

# Volume'leri de sil
docker compose down -v

# Sistem temizliği
docker system prune -a
```

### Faydalı Docker Desktop Özellikleri

**1. Container'ları GUI'den Yönetme:**

Docker Desktop → Containers/Apps → web-gis-vibe-workshop

- ▶️ Start/Stop butonları
- 📊 Stats (CPU, RAM kullanımı)
- 📜 Logs sekmesi
- 🖥️ Terminal sekmesi

**2. Volume'leri İnceleme:**

Docker Desktop → Volumes → geoserver_data

- Dosyaları görüntüle
- Yedek al

**3. Image'ları Yönetme:**

Docker Desktop → Images

- Hangi image'lar indirilmiş?
- Boyutları ne kadar?
- Sil / Yeniden indir

### Port Yönlendirme Görsel Açıklaması

```
┌──────────────────────────────────────────────────────────────┐
│                    DOCKER PORT FORWARDING                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Bilgisayarınız               Docker Container              │
│                                                              │
│  localhost:8081  ─────────>  nginx:80                       │
│  (Tarayıcınız)               (Web sunucusu)                 │
│                                                              │
│  localhost:8080  ─────────>  geoserver:8080                 │
│  (GeoServer)                 (Java Tomcat)                  │
│                                                              │
│  localhost:5432  ─────────>  postgis:5432                   │
│  (PostgreSQL)                (Veritabanı)                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 Sonraki Ders Hazırlığı

**Ders 2'ye Geçiş:**

> "15 dakikalık ilk dersimiz bitti. 1-2 dakika soluklanın. Sonraki derste PostgreSQL container'ına gireceğiz, SQL sorguları yazacağız. Heyecan verici!"

**Katılımcılara Not:**

> "Container'ları kapatmayın! Açık bırakın. Ders 2'de kullanmaya devam edeceğiz."

**Eğitmen Ders Arası Görevleri:**

- [ ] Herkesin container'ları çalışıyor mu kontrol et
- [ ] Geride kalanlarla ilgilen
- [ ] Ders 2 materyalini hazırla (PostgreSQL CLI gösterimi)
- [ ] Terminal ekranını temizle

---

**📝 Eğitmen Notu:** Bu ders notu çok detaylı hazırlandı. Her adımı takip ederseniz katılımcılar başarılı olacaktır. Sabırlı olun, özellikle GeoServer başlangıcında!

**🎉 Başarılar!**
