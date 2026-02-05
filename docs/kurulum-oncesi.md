# Workshop Öncesi Kurulum Kılavuzu (30 dakika)

> **Önemli:** Bu adımları workshop günü GELİNCE değil, en az 1 GÜN ÖNCE tamamlayın!

---

## 📋 Kurulum Özeti

| Gereksinim | Süre | Zorluk |
|------------|------|--------|
| WSL2 Kurulumu | 10 dakika | Kolay |
| Docker Desktop Kurulumu | 15 dakika | Kolay |
| Git Kurulumu ve Proje İndirme | 5 dakika | Çok Kolay |
| **Toplam** | **30 dakika** | |

---

## 🎯 Kurulum Sonunda Neler Hazır Olacak?

- [x] Windows'ta WSL2 (Linux alt sistemi) çalışır durumda
- [x] Docker Desktop kurulu ve test edilmiş
- [x] Workshop projesi bilgisayarınızda (`web-gis-vibe-workshop` klasörü)
- [x] Workshop günü sadece "docker compose up" komutuyla başlayabilirsiniz!

---

## ⚙️ ADIM 1: WSL2 Kurulumu (10 dakika)

### WSL2 Nedir?

**Windows Subsystem for Linux 2** - Windows içinde gerçek bir Linux kernel'i çalıştırır. Docker container'ları Linux tabanlı olduğu için gereklidir.

### Kurulum Adımları

#### 1.1. PowerShell'i Yönetici Olarak Açın

```
Başlat menüsünde "PowerShell" yazın
→ Sağ tık → "Run as Administrator" (Yönetici olarak çalıştır)
```

#### 1.2. Tek Komutla WSL2'yi Kurun (Windows 11 veya güncel Windows 10)

```powershell
# WSL2'yi kur
wsl --install

# Bilgisayarı yeniden başlat
Restart-Computer
```

**Beklenen Çıktı:**

```
Installing: Virtual Machine Platform
Installing: Windows Subsystem for Linux
Installing: Ubuntu
The requested operation is successful. Changes will not be effective until the system is rebooted.
```

#### 1.3. Yeniden Başlatma Sonrası Kontrol

```powershell
# PowerShell'i tekrar açın (yönetici olarak değil, normal açabilirsiniz)

# WSL2 yüklü mü kontrol et
wsl --status

# Beklenen çıktı:
# Default Distribution: Ubuntu
# Default Version: 2
```

**✅ Başarılı!** WSL2 kuruldu.

---

### ⚠️ Eski Windows Sürümleri İçin Manuel Kurulum

Eğer `wsl --install` çalışmazsa:

```powershell
# 1. WSL ve Virtual Machine Platform özelliklerini etkinleştir
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 2. Bilgisayarı yeniden başlat
Restart-Computer

# 3. Yeniden başlatma sonrası WSL2'yi varsayılan yap
wsl --set-default-version 2

# 4. Ubuntu dağıtımını yükle
wsl --install -d Ubuntu
```

---

### 1.4. Ubuntu İlk Kurulum

İlk kez Ubuntu açıldığında kullanıcı adı ve şifre soracak:

```bash
# Örnek:
Enter new UNIX username: workshop
New password: **** (güçlü şifre belirleyin)
Retype new password: ****

# Kurulum tamamlandı!
```

---

### 🐛 WSL2 Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| **"Virtualization disabled"** | BIOS'a girin, VT-x veya AMD-V özelliğini etkinleştirin |
| **"WSL 2 requires an update"** | https://aka.ms/wsl2kernel adresinden kernel'i güncelleyin |
| **`wsl --install` çalışmıyor** | Windows Update'i kontrol edin, sistemi güncelleyin |
| **"The system cannot find the file specified"** | Manuel kurulum yöntemini deneyin (yukarıda) |

---

## 🐳 ADIM 2: Docker Desktop Kurulumu (15 dakika)

### Docker Desktop Nedir?

Container'ları yönetmek için Windows'ta çalışan resmi Docker uygulamasıdır. Workshop boyunca PostgreSQL, GeoServer ve Web sunucusu container'larını bu uygulama ile çalıştıracağız.

### Kurulum Adımları

#### 2.1. Docker Desktop'ı İndirin

```
1. Tarayıcınızda https://www.docker.com/products/docker-desktop/ adresine gidin
2. "Download for Windows" butonuna tıklayın
3. DockerDesktopInstaller.exe dosyasını indirin (yaklaşık 500-600 MB)
```

#### 2.2. Docker Desktop'ı Kurun

```
1. İndirilen DockerDesktopInstaller.exe dosyasına çift tıklayın
2. Kurulum ekranında şu seçeneğin işaretli olduğundan emin olun:
   ☑ Use WSL 2 instead of Hyper-V (ÖNERİLİR)
3. "Install" butonuna tıklayın
4. Kurulum bitince "Close and restart" tıklayın
5. Bilgisayar yeniden başlayacak
```

**Kurulum Ekranı:**

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
└────────────────────────────────────────────────────┘
```

#### 2.3. İlk Çalıştırma

```
1. Yeniden başlatma sonrası Docker Desktop otomatik açılır
2. "Accept" → Service Agreement'i kabul edin
3. Anket/login ekranını atlayabilirsiniz ("Skip" veya "Continue without signing in")
4. Docker Desktop'ın alt kısmında yeşil gösterge olmalı: 🟢 Docker is running
```

#### 2.4. Kurulum Testi

**Terminal (PowerShell veya CMD) açın:**

```powershell
# Docker versiyonu kontrol et
docker --version
# Beklenen: Docker version 24.0.x veya üzeri

# Docker Compose kontrol et
docker compose version
# Beklenen: Docker Compose version v2.x.x

# Test container'ı çalıştır
docker run hello-world
```

**Beklenen Çıktı:**

```
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
```

**✅ Başarılı!** "Hello from Docker!" mesajını gördüyseniz kurulum tamam.

---

### 🛠️ Docker Desktop Ayarları (Önerilen)

Docker Desktop'ı açın → Sağ üst köşedeki ⚙️ (Settings) ikonuna tıklayın:

#### General (Genel Ayarlar)

```
☑ Start Docker Desktop when you log in
  (Bilgisayar açıldığında Docker otomatik başlasın)

☑ Use the WSL 2 based engine
  (WSL2 motorunu kullan - zaten varsayılan)
```

#### Resources → Advanced (Kaynak Ayarları)

```
CPUs: 2-4 (bilgisayarınızın kapasitesine göre)
Memory: 4-8 GB (Workshop için minimum 4GB önerilir)
Swap: 1 GB
Disk image size: 64 GB (varsayılan)
```

**💡 Not:** Bilgisayarınızda 8GB RAM varsa Docker'a 4GB, 16GB RAM varsa 6-8GB verin.

---

### 🐛 Docker Desktop Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| **"Docker failed to start"** | `wsl --status` ile WSL2'yi kontrol edin |
| **"Hardware assisted virtualization"** | BIOS'ta VT-x/AMD-V özelliğini açın |
| **"Access denied"** | Kullanıcınızı "docker-users" grubuna ekleyin:<br>`net localgroup docker-users KULLANICI_ADINIZ /add` |
| **Docker çok yavaş çalışıyor** | Settings → Resources → Memory değerini 4GB+ yapın |
| **Port 5432 çakışması** | Yerel PostgreSQL servisini durdurun (Hizmetler → PostgreSQL → Durdur) |

---

## 📥 ADIM 3: Workshop Projesini İndirin (5 dakika)

### Git Kurulumu

#### 3.1. Git Kontrol

```powershell
# PowerShell veya CMD açın

# Git yüklü mü kontrol et
git --version

# Beklenen: git version 2.x.x
```

Eğer `git: command not found` hatası alırsanız:

#### 3.2. Git Kurulumu (Yüklü değilse)

```
1. https://git-scm.com/download/win adresine gidin
2. "Download for Windows" butonuna tıklayın
3. Git-x.x.x-64-bit.exe dosyasını indirin ve çalıştırın
4. Varsayılan ayarlarla kurulum yapın (Next, Next, Install)
5. Kurulum bitince terminal'i kapatıp yeniden açın
```

---

### 3.3. Projeyi İndirme

**PowerShell veya CMD açın:**

```powershell
# Masaüstüne gidelim (veya istediğiniz bir klasöre)
cd Desktop

# GitHub'dan workshop projesini indirin
git clone https://github.com/opengisturkiye/web-gis-vibe-workshop.git

# Beklenen çıktı:
# Cloning into 'web-gis-vibe-workshop'...
# remote: Enumerating objects: 50, done.
# remote: Counting objects: 100% (50/50), done.
# Receiving objects: 100% (50/50), done.
```

**Proje klasörüne girin:**

```powershell
cd web-gis-vibe-workshop

# İçeriği kontrol edin
dir   # (Windows CMD)
# veya
ls    # (PowerShell)

# Beklenen dosyalar:
# - docker-compose.yml (tüm servislerin tanımı)
# - data/ (örnek coğrafi veriler)
# - db/ (veritabanı başlangıç dosyaları)
# - web/ (web uygulaması)
# - docs/ (dökümanlar)
# - lessons/ (ders notları)
# - README.md
```

**✅ Başarılı!** Proje indirildi.

---

### ⚠️ Alternatif: Zip İndirme (Git olmadan)

Eğer Git kurulumu sorun çıkarırsa:

```
1. Tarayıcıda https://github.com/opengisturkiye/web-gis-vibe-workshop adresine gidin
2. Yeşil "Code" butonuna tıklayın
3. "Download ZIP" seçeneğini seçin
4. web-gis-vibe-workshop-main.zip dosyasını indirin
5. Dosyayı sağ tık → "Extract All" → Çıkart
6. Çıkarılan klasöre girin (web-gis-vibe-workshop-main)
7. PowerShell'de bu klasöre cd ile gidin
```

---

## ✅ Kurulum Kontrol Listesi

Workshop gününe hazır olduğunuzdan emin olmak için tüm maddeleri kontrol edin:

### WSL2

- [ ] `wsl --status` komutu çalışıyor
- [ ] Default Version: 2 olarak görünüyor
- [ ] Ubuntu dağıtımı kurulu

### Docker Desktop

- [ ] Docker Desktop açılıyor
- [ ] Alt kısımda "🟢 Docker is running" görünüyor
- [ ] `docker --version` çalışıyor (24.0.x+)
- [ ] `docker compose version` çalışıyor (v2.x.x+)
- [ ] `docker run hello-world` başarıyla çalıştı

### Workshop Projesi

- [ ] Git kurulu (`git --version` çalışıyor)
- [ ] Proje indirildi (`web-gis-vibe-workshop` klasörü var)
- [ ] Proje klasörüne girildi (`cd web-gis-vibe-workshop`)
- [ ] `docker-compose.yml` dosyası görünüyor

---

## 🚀 Final Test (Opsiyonel ama Önerilir)

Workshop öncesi container'ları bir kez başlatıp test etmek isterseniz:

```powershell
# Proje klasöründe olduğunuzdan emin olun
cd Desktop/web-gis-vibe-workshop

# Container'ları başlat
docker compose up -d

# Çıktı:
# [+] Running 3/3
#  ✔ Container postgis      Started
#  ✔ Container geoserver    Started
#  ✔ Container web          Started

# Container durumlarını kontrol et
docker ps

# Beklenen: 3 container "Up" durumunda

# 2-3 dakika bekleyin (GeoServer başlaması uzun sürer)

# Tarayıcınızda test edin:
# http://localhost:8081        → Web uygulaması
# http://localhost:8088/geoserver → GeoServer (admin/geoserver)
```

**Her şey çalışıyorsa:**

```powershell
# Container'ları durdurun (workshop gününe kadar)
docker compose down

# Çıktı:
# [+] Running 3/3
#  ✔ Container geoserver    Removed
#  ✔ Container web          Removed
#  ✔ Container postgis      Removed
```

**✅ Mükemmel!** Workshop gününe hazırsınız.

---

## 📞 Sorun mu Yaşıyorsunuz?

Kurulum sırasında takılırsanız:

### 1. Troubleshooting Dokümanını İnceleyin

```
docs/troubleshooting.md dosyasını açın
Yaygın sorunlar ve çözümleri bulacaksınız
```

### 2. GitHub Issues'a Bakın

```
https://github.com/opengisturkiye/web-gis-vibe-workshop/issues
Başkalarının yaşadığı sorunlar ve çözümleri
```

### 3. Workshop Ekibiyle İletişime Geçin

```
Email: [WORKSHOP_EMAIL]
Slack/Discord: [LINK]
Telefon: [İLETİŞİM]
```

**⚠️ Önemli:** Workshop günü geldiğinizde kurulum sorunlarıyla uğraşmayın! En az 1 gün önce bu adımları tamamlayın.

---

## 🎯 Sonraki Adım

Kurulumlar tamamlandı! Workshop gününde şunları yapacağız:

1. **Ders 1:** Docker container'ları başlatma (15 dk)
2. **Ders 2:** PostgreSQL ve mekansal veri (15 dk)
3. **Ders 3a:** GeoServer bağlantı yapılandırması (20 dk)
4. **Ders 3b:** GeoServer katman yayını (20 dk)
5. **Ders 4:** OpenLayers web uygulaması (30 dk)
6. **Ders 5:** Çizim ve ölçüm araçları (30 dk)
7. **Ders 6:** Serbest geliştirme (45 dk)

**Toplam:** 3.5 saat eğitim + molalar

---

**🎉 Görüşmek üzere!**

Workshop gününde görüşmek üzere. Kurulumlar sorunsuz tamamlandıysa hazırsınız!
