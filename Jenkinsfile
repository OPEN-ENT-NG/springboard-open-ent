#!/usr/bin/env groovy

pipeline {
  agent any
    stages {
      stage('Build Front') {
        steps {
          sh './build.sh buildFront'
        }
      }
      stage('Archive') {
        steps {
          sh './build.sh archive'
        }
      }
      stage('Publish') {
        steps {
          sh './build.sh publish'
        }
      }
    }
}