FROM debian:stretch-slim

MAINTAINER Fajrul Akbar Zuhdi<fajrulaz@gmail.com>

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends --no-install-suggests \
    apt-utils \
    lsb-release \
    gnupg \
    autoconf \
    apt-transport-https \
    ca-certificates \
    dpkg-dev \
    file \
    g++ \
    gcc \
    libc-dev \
    make \
    pkg-config \
    re2c \
    curl \
    nano \
    wget \
    zip \
    unzip \
    cron \
    supervisor

ADD . /viloveul

WORKDIR /viloveul

RUN apt-get install -y --no-install-recommends --no-install-suggests nginx && \
    rm -f /etc/nginx/sites-enabled/* && \
    cp /viloveul/config/nginx.conf /etc/nginx/conf.d/default.conf && \
    mkdir -p /var/log/supervisor && \
    touch /viloveul/.env

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests nodejs

# WORK
RUN npm install --prefix /viloveul && \
    npm cache clean --force && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /tmp/* && \
    mkdir -p /viloveul/dist && \
    touch /viloveul/dist/index.html

EXPOSE 19912

CMD ["sh", "/viloveul/sbin/docker"]