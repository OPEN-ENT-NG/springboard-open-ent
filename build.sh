#!/bin/bash

GROUPID=`grep 'modowner=' gradle.properties | sed 's/modowner=//'`
NAME=`grep 'modname=' gradle.properties | sed 's/modname=//'`
VERSION=`grep 'version=' gradle.properties | sed 's/version=//'`
PORT=`grep 'skins=' conf.properties | grep -Eow "[0-9]+" | head -1 | awk '{ print $1 }'`

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

if [ -z ${BOWER_USERNAME:+x} ] && [ -e ~/.bower_credentials ]
then
  source ~/.bower_credentials
fi

clean () {
  rm -rf data scripts src ent*.json *.template deployments run.sh stop.sh *.tar.gz static default.properties bower_components traductions i18n
  if [ -e docker-compose.yml ]; then
    if [ "$USER_UID" != "1000" ] && [ -e mods ]; then
      docker run --rm -v "$PWD"/mods:/srv/springboard/mods opendigitaleducation/vertx-service-launcher:1.0.0 chmod -R 777 mods/*
    fi
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" gradle gradle clean
    stop && docker-compose rm -f
    docker volume ls -qf dangling=true | xargs -r docker volume rm
  fi
}

init() {
  if [ ! -e mods ]; then
    mkdir mods && chmod 777 mods
  fi
  if [ ! -e node_modules ]; then
    mkdir node_modules
  fi
  if [ -e "?/.gradle" ] && [ ! -e "?/.gradle/gradle.properties" ]
  then
    echo "odeUsername=$NEXUS_ODE_USERNAME" > "?/.gradle/gradle.properties"
    echo "odePassword=$NEXUS_ODE_PASSWORD" >> "?/.gradle/gradle.properties"
  fi
  docker run --rm -v "$PWD":/home/gradle/project -v ~/.m2:/home/gradle/.m2 -v ~/.gradle:/home/gradle/.gradle -w /home/gradle/project -u "$USER_UID:$GROUP_GID" gradle:4.5-alpine gradle init
  sed -i "s/8090:/$PORT:/" docker-compose.yml
  if [ -e bower.json ]; then
    sed -i "s/bower_username:bower_password/$BOWER_USERNAME:$BOWER_PASSWORD/" bower.json
  fi
  if [ ! -z ${MAVEN_REPOSITORIES:+x} ]
  then
    sed -i "s/#environment:/  environment:/" docker-compose.yml
    MVN_REPOS=`echo $MAVEN_REPOSITORIES | sed 's/"/\\\\"/g'`
    sed -i "s|#  MAVEN_REPOSITORIES: ''|    MAVEN_REPOSITORIES: '$MVN_REPOS'|" docker-compose.yml
  fi
  # TODO add translate
}

run() {
  docker-compose up -d neo4j
  docker-compose up -d postgres
  docker-compose up -d mongo
  sleep 10
  docker-compose up -d vertx
}

stop() {
  docker-compose stop
}

buildFront() {
  set -e
  #prepare
  chmod -R 777 assets/ || true
  find assets/js/ -mindepth 1 -maxdepth 1 -not -name 'package.json' -not -name '.npmrc' -exec rm -rf {} \;
  find assets/themes/ -mindepth 1 -maxdepth 1 -not -name 'package.json' -not -name '.npmrc' -exec rm -rf {} \;
  find assets/widgets/ -mindepth 1 -maxdepth 1 -not -name 'package.json' -not -name '.npmrc' -exec rm -rf {} \;
  #run npm install
  sed -i "s/BOWER_USERNAME/$BOWER_USERNAME/" assets/widgets/package.json
  sed -i "s/BOWER_PASSWORD/$BOWER_PASSWORD/" assets/widgets/package.json
  docker run -e NPM_TOKEN -u "$USER_UID:$GROUP_GID" --rm -v "$PWD":/home/node opendigitaleducation/node:16-alpine sh -c "cd /home/node/assets/themes && npm install && chmod -R 777 node_modules && cd /home/node/assets/widgets && npm install  && chmod -R 777 node_modules && cd /home/node/assets/js && npm install  && chmod -R 777 node_modules"
  #clean
  find assets/js/ -mindepth 1 -maxdepth 1 -not -name 'node_modules' -exec rm -rf {} \;
  find assets/themes/ -mindepth 1 -maxdepth 1 -not -name 'node_modules' -exec rm -rf {} \;
  find assets/widgets/ -mindepth 1 -maxdepth 1 -not -name 'node_modules' -exec rm -rf {} \;
  #move artefact
  mv assets/widgets/node_modules/* assets/widgets/
  find ./assets/js/node_modules/ -mindepth 1 -maxdepth 2 -type d -name "dist" | sed -e "s/assets\/js\/node_modules\///"  | sed -e "s/dist//" | xargs -i mv ./assets/js/node_modules/{}dist/ ./assets/js/{}
  find ./assets/themes/node_modules/ -mindepth 1 -maxdepth 2 -type d -name "dist" | sed -e "s/assets\/themes\/node_modules\///"  | sed -e "s/dist//" | xargs -i mv ./assets/themes/node_modules/{}dist/ ./assets/themes/{}
  #clean node_modules
  rm -rf assets/js/package.json assets/themes/package.json assets/widgets/package.json
  rm -rf assets/js/node_modules assets/themes/node_modules assets/widgets/node_modules
  #Retrocompatibilité avec les static
  bash -c 'for i in `ls -d mods/* | egrep -i -v "feeder|session|tests|json-schema|proxy|~mod|tracer"`; do DEST=$(echo $i | sed "s/[a-z\.\/]*~\([a-z\-]*\)~[A-Z0-9\-\.]*\(-[a-z]*\)*\(-SNAPSHOT\)*/\1/g"); mkdir static/`echo $DEST`; cp -r $i/public static/`echo $DEST`; done; exit 0'
  mv static/app-registry static/appregistry
  mv static/collaborative-editor static/collaborativeeditor
  mv static/scrap-book static/scrapbook
  mv static/fake-sso static/sso
  mv static/share-big-files static/sharebigfiles
  mv static/search-engine static/searchengine
  mv static/web-conference static/webconference
  mv static/gar-connector static/gar
  mv errors static/
  find static/help -type l -exec rename 's/index.html\?iframe\=true/index.html/' '{}' \;
  I18N_VERSION=`grep 'i18nVersion=' gradle.properties | sed 's/i18nVersion=//'`
  if [ -e i18n ] && [ ! -z "$I18N_VERSION" ]; then
    rm -rf assets/i18n
    mv i18n assets/
  fi
  COUNT_THEME=$(find assets/themes/*/skins/default -name theme.css | grep -v 'bootstrap' | wc -l)
  if [ "$COUNT_THEME" -eq "0" ]; then
    echo "Error: 0 theme.css build"
    exit 1
  else
    echo "$COUNT_THEME successful theme.css build"
  fi
}

archive() {
  #tar cfzh $NAME-static.tar.gz static
  tar cfzh ${NAME}.tar.gz mods/*.jar assets/* static
}

publish() {
  case "$VERSION" in
    *SNAPSHOT) nexusRepository='snapshots' ;;
    *)         nexusRepository='releases' ;;
  esac
  mvn deploy:deploy-file -DgroupId=$GROUPID -DartifactId=$NAME -Dversion=$VERSION -Dpackaging=tar.gz -Dfile=${NAME}.tar.gz -DrepositoryId=ode-$nexusRepository -Durl=https://maven.opendigitaleducation.com/nexus/content/repositories/ode-$nexusRepository/
 # mvn deploy:deploy-file -DgroupId=$GROUPID -DartifactId=$NAME -Dversion=$VERSION -Dpackaging=tar.gz -Dclassifier=static -Dfile=${NAME}-static.tar.gz -DrepositoryId=ode-$nexusRepository -Durl=https://maven.opendigitaleducation.com/nexus/content/repositories/ode-$nexusRepository/

}

generateConf() {
  docker-compose run --rm -u "$USER_UID:$GROUP_GID" gradle gradle generateConf
}

integrationTest() {
  BASE_CONTAINER_NAME=`basename "$PWD" | sed 's/-//g'`
  VERTX_IP=`docker inspect ${BASE_CONTAINER_NAME}_vertx_1 | grep '"IPAddress"' | head -1 | grep -Eow "[0-9\.]+"`
  sed -i "s|baseURL.*$|baseURL(\"http://$VERTX_IP:$PORT\")|" src/test/scala/org/entcore/test/simulations/IntegrationTest.scala
  docker-compose run --rm -u "$USER_UID:$GROUP_GID" gradle gradle integrationTest
}

for param in "$@"
do
  case $param in
    clean)
      clean
      ;;
    init)
      init
      ;;
    generateConf)
      generateConf
      ;;
    integrationTest)
      integrationTest
      ;;
    run)
      run
      ;;
    stop)
      stop
      ;;
    buildFront)
      buildFront
      ;;
    archive)
      archive
      ;;
    publish)
      publish
      ;;
    *)
      echo "Invalid argument : $param"
  esac
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
done
