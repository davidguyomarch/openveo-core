#Dockerfile to
# to register, run
# $ docker build -t openveo/core:v1 ./
# Connect using
# $ docker run -it $IMAGE_UUID
# Where $IMAGE_UUID is the UUID ofthe produced image

FROM ubuntu:16.04
# As the openveo core was tested on Ubuntu 16.04

# TODO: put the config file in /etc/openveo/core.cfg
# TODO: put the log file in /var/log/

MAINTAINER David Guyomarch <david.guyomarch@gmail.com>

RUN \
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
  echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
  apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    git \
    mongodb-org

# Add nodejs repository
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -

RUN apt-get install -y nodejs

RUN npm install grunt-cli -g
RUN npm install bower -g

RUN groupadd -r openveo && useradd -r -g openveo openveo
RUN mkdir -p /home/openveo/core
RUN chown -R openveo:openveo /home/openveo

USER openveo
# COPY ./ /home/openveo/core

WORKDIR /home/openveo/core

# RUN npm install @openveo/core
# RUN node install.js
# CMD node server.js
