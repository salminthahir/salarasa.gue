## Deployment VPS & Nginx Wildcard Setup

Undangan Salarasa menggunakan multi-tenant architecture berdasarkan **subdomain**.
Artinya setiap undangan yang kamu buat (misal dengan slug `riqqa17`) dapat diakses lewat `riqqa17.salarasa.id`.

### 1. DNS Setup
Buat DNS record A di Cloudflare/Provider domain kamu dengan Type `A`, Name `*` (wildcard), menunjuk ke IP VPS kamu.

### 2. Nginx Configuration
Buat virtual host untuk menangkap semua traffic subdomain yang masuk dan diteruskan ke app NodeJS (TanStack Start).

```nginx
server {
    listen 80;
    server_name salarasa.id *.salarasa.id;

    location / {
        proxy_pass http://127.0.0.1:3000; # Port app TanStack Start
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Run Production
```bash
npm run build
NODE_ENV=production PORT=3000 npm run start
```
Atau menggunakan PM2:
```bash
pm2 start "npm run start" --name "salarasa"
```

Pastikan variabel environment `APP_BASE_DOMAIN="salarasa.id"` di set dengan benar!