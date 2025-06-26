# Gunakan image resmi Nginx yang ringan
FROM nginx:alpine

# Salin semua file HTML/CSS ke folder root Nginx
COPY . /usr/share/nginx/html

# Expose port default Nginx
EXPOSE 80
