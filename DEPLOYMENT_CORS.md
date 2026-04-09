# CORS fix for `api.sicheng55.com` (Nginx)

If frontend is served from `https://www.sicheng55.com` and backend from `https://api.sicheng55.com`, browser CORS must be enabled at the API layer.

Use this `location /` block inside your `server { server_name api.sicheng55.com; ... }` config:

```nginx
location / {
    # CORS allow-list (recommended)
    if ($http_origin ~* "^https://(www\\.)?sicheng55\\.com$") {
        add_header Access-Control-Allow-Origin $http_origin always;
    }

    add_header Access-Control-Allow-Credentials true always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;
    add_header Vary Origin always;

    # Preflight request
    if ($request_method = OPTIONS) {
        return 204;
    }

    proxy_pass http://localhost:8080;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket support
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

Then run:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Notes
- Do **not** use `Access-Control-Allow-Origin *` together with credentials.
- If frontend is on `https://sicheng55.com` (without `www`), this config already allows it.
- This repository's frontend now supports `VITE_API_BASE_URL` for environment-based API origin configuration.
