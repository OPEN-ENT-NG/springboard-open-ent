#!/bin/sh
PID_ENT=$(ps -ef | grep "org.entcore~infra" | grep -v grep | sed 's/\s\+/ /g' | cut -d' ' -f2)
kill $PID_ENT