# Deployment Guide for PDF Knife

This guide covers multiple ways to deploy PDF Knife as a website.

## Table of Contents
- [Quick Deploy Options](#quick-deploy-options)
- [GitHub Pages](#github-pages)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Custom Server](#custom-server)

## Quick Deploy Options

PDF Knife is a **100% client-side application** with no backend requirements. You can deploy it anywhere that serves static files.

### ✅ Requirements
- No build process needed
- No server-side code
- No database
- Just static files: HTML, CSS, JavaScript, and libraries

## GitHub Pages

Deploy directly from your GitHub repository.

### Steps:

1. **Push your code to GitHub** (if not already there)

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "GitHub Actions"

3. **The workflow is already configured** in `.github/workflows/deploy.yml`

4. **Push to main branch** and the site will automatically deploy

5. **Access your site** at: `https://yourusername.github.io/Pdf/`

### Manual Deployment (Alternative)

If you prefer manual deployment:
1. Go to Settings → Pages
2. Select "Deploy from a branch"
3. Choose your branch (usually `main`)
4. Select root directory `/`
5. Click Save

Your site will be live at: `https://yourusername.github.io/repository-name/`

## Netlify

One-click deployment to Netlify.

### Option 1: Deploy from Git (Recommended)

1. **Sign up** at [netlify.com](https://netlify.com)

2. **Click "Add new site" → "Import an existing project"**

3. **Connect your Git provider** (GitHub, GitLab, Bitbucket)

4. **Select your repository**

5. **Configure build settings:**
   - Build command: (leave empty)
   - Publish directory: `.`

6. **Click "Deploy site"**

The `netlify.toml` configuration file is already included and will be automatically detected.

### Option 2: Drag and Drop

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag your project folder
3. Your site is live!

### Custom Domain

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Vercel

Deploy with Vercel in seconds.

### Steps:

1. **Sign up** at [vercel.com](https://vercel.com)

2. **Click "Add New..." → "Project"**

3. **Import your Git repository**

4. **Configure project:**
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: `.`

5. **Click "Deploy"**

The `vercel.json` configuration is already included.

### Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
cd /path/to/Pdf
vercel
```

## Custom Server

### Using Node.js

```bash
# Install http-server globally
npm install -g http-server

# Run server
cd /path/to/Pdf
http-server -p 8080

# Visit: http://localhost:8080
```

### Using Python

```bash
# Python 3
cd /path/to/Pdf
python3 -m http.server 8080

# Visit: http://localhost:8080
```

### Using PHP

```bash
cd /path/to/Pdf
php -S localhost:8080

# Visit: http://localhost:8080
```

### Using NGINX

Create `/etc/nginx/sites-available/pdf-knife`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/pdf-knife;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/pdf-knife /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Using Apache

Create `.htaccess` in the project root:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Frame-Options "DENY"
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

## Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM nginx:alpine

# Copy files to nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t pdf-knife .
docker run -p 8080:80 pdf-knife
```

Visit: http://localhost:8080

## Environment Considerations

### CORS (Cross-Origin Resource Sharing)

If hosting on a domain different from your assets, ensure CORS is properly configured. PDF Knife loads PDF.js workers, which may require CORS headers.

### HTTPS

For production deployments, **always use HTTPS**:
- GitHub Pages: HTTPS by default
- Netlify: HTTPS by default  
- Vercel: HTTPS by default
- Custom servers: Use Let's Encrypt for free SSL certificates

### Performance Optimization

1. **Enable gzip compression** on your server
2. **Set proper cache headers** for static assets
3. **Use a CDN** for better global performance
4. **Enable HTTP/2** if possible

### Example nginx configuration for performance:

```nginx
server {
    # ... other config ...
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Testing Your Deployment

After deployment, test these features:

- [ ] Upload PDF files
- [ ] View page thumbnails
- [ ] Drag and drop to reorder pages
- [ ] Rotate pages
- [ ] Delete pages
- [ ] Duplicate pages
- [ ] Insert blank pages
- [ ] Rotate all pages
- [ ] Download combined PDF
- [ ] Clear all pages

## Troubleshooting

### PDFs don't load
- Check browser console for errors
- Ensure PDF.js libraries are loading correctly
- Verify CORS headers if hosting assets separately

### Download doesn't work
- Check if pop-up blocker is interfering
- Verify browser supports Blob/download APIs
- Test in different browsers

### Drag and drop doesn't work
- Ensure JavaScript is enabled
- Check for browser compatibility
- Test on different devices

## Support

For issues or questions:
1. Check the [README.md](README.md)
2. Review browser console for errors
3. Open an issue on GitHub

## Security Notes

- All PDF processing happens client-side
- No data is sent to any server
- PDFs never leave the user's browser
- No tracking or analytics by default

For production deployments, consider:
- Implementing Content Security Policy (CSP)
- Adding security headers (already in configs)
- Regular dependency updates
- Monitoring for vulnerabilities

## License

This project is open source under the MIT License. See LICENSE for details.
