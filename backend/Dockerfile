FROM wordpress:latest

COPY apache-servername.conf /etc/apache2/conf-available/servername.conf

RUN a2enconf servername
