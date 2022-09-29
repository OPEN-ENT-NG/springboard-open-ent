#!/bin/bash

GROUPID=`grep 'modowner=' gradle.properties | sed 's/modowner=//'`
NAME=`grep 'modname=' gradle.properties | sed 's/modname=//'`
VERSION=`grep 'version=' gradle.properties | sed 's/version=//'`

case `uname -s` in
  MINGW*)
    USER_UID=1000
    GROUP_UID=1000
    ;;
  *)
    if [ -z ${USER_UID:+x} ]
    then
      USER_UID=`id -u`
      GROUP_GID=`id -g`
    fi
esac


buildFront() {
  set -e
  #prepare
  chmod -R 777 assets/ || true
  find assets/js/ -mindepth 1 -maxdepth 1 -not -name 'package.json' -not -name '.npmrc' -exec rm -rf {} \;
  find assets/themes/ -mindepth 1 -maxdepth 1 -not -name 'package.json' -not -name '.npmrc' -exec rm -rf {} \;
  find assets/widgets/ -mindepth 1 -maxdepth 1 -not -name 'package.json' -not -name '.npmrc' -exec rm -rf {} \;
  #run yarn install
  sed -i "s/BOWER_USERNAME/$BOWER_USERNAME/" assets/widgets/package.json
  sed -i "s/BOWER_PASSWORD/$BOWER_PASSWORD/" assets/widgets/package.json
  docker run -e NPM_TOKEN --rm -u "$USER_UID:$GROUP_GID" -v "$PWD":/home/node opendigitaleducation/node:16-alpine sh -c "cd /home/node/assets/themes && yarn install && chmod -R 777 node_modules && cd /home/node/assets/widgets && yarn install  && chmod -R 777 node_modules && cd /home/node/assets/js && yarn install  && chmod -R 777 node_modules"
  #clean
  find assets/js/ -mindepth 1 -maxdepth 1 -not -name 'node_modules' -exec rm -rf {} \;
  find assets/themes/ -mindepth 1 -maxdepth 1 -not -name 'node_modules' -exec rm -rf {} \;
  find assets/widgets/ -mindepth 1 -maxdepth 1 -not -name 'node_modules' -exec rm -rf {} \;
  #move artefact
  mv assets/widgets/node_modules/* assets/widgets/
  find ./assets/js/node_modules/ -mindepth 1 -maxdepth 2 -type d -name "dist" | sed -e "s/assets\/js\/node_modules\///"  | sed -e "s/dist//" | xargs -i mv ./assets/js/node_modules/{}dist/ ./assets/js/{}
  find ./assets/themes/node_modules/ -mindepth 1 -maxdepth 2 -type d -name "dist" | sed -e "s/assets\/themes\/node_modules\///"  | sed -e "s/dist//" | xargs -i mv ./assets/themes/node_modules/{}dist/ ./assets/themes/{}
  #clean node_modules
  rm -rf assets/js/node_modules assets/themes/node_modules assets/widgets/node_modules
}

archive() {
  #tar cfzh $NAME-static.tar.gz static
  tar cfzh ${NAME}.tar.gz assets/* conf.j2
}

publish() {
  case "$VERSION" in
    *SNAPSHOT) nexusRepository='snapshots' ;;
    *)         nexusRepository='releases' ;;
  esac
  mvn deploy:deploy-file -DgroupId=$GROUPID -DartifactId=$NAME -Dversion=$VERSION -Dpackaging=tar.gz -Dfile=${NAME}.tar.gz -DrepositoryId=wse -Durl=https://maven.opendigitaleducation.com/nexus/content/repositories/$nexusRepository/
}

for param in "$@"
do
  case $param in
    buildFront)
      buildFront
      ;;
    archive)
      archive
      ;;
    publish)
      publish
      ;;
    help)
      echo "
           buildFront : fetch wigets and themes using Bower and run Gulp build. (/!\ first run can be long becouse of node-sass's rebuild).
              archive : make an archive with folder /mods /assets /static
              publish : upload the archive on nexus
      "
    ;;
    *)
      echo "Invalid command : $param. Use one of next command [ help | clean | init | generateConf | run | stop | buildFront | archive | publish ]"
  esac
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
done

