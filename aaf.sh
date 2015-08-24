#!/bin/bash

DATE=`date +"%Y%m%d"`
cd /home/wse
rm aaf/*.xml *.zip
sftp -i .ssh/picardie ent_crp@aaf-ent.ac-amiens.fr << EOF
  get *.zip .
EOF
sftp -o port=115 -i .ssh/picardie picardie@exportent.educagri.fr << EOF
  get /xml/SDET4/picardie_AGRICOLE_Complet_${DATE}_export.zip .
EOF
jar xvf picardie_AGRICOLE_Complet_${DATE}_export.zip
mv picardie_AGRICOLE_Complet_${DATE}_export/* /home/wse/aaf/
rmdir picardie_AGRICOLE_Complet_${DATE}_export

cd /home/wse/aaf
jar xvf ../ENT_CRP*.zip
sed -i '{N; s|<attr name="ENTEtablissementStructRattachFctl"><value>4242</value></attr>\s*\n|| }' ENT_CRP*EtabEducNat_0000.xml
sed -i '{N; s|<id>4244</id></identifier>\s*<attributes>|<id>4244</id></identifier>\n<attributes>\n<attr name="ENTEtablissementStructRattachFctl"><value>4244</value></attr>| }' ENT_CRP*EtabEducNat_0000.xml
sed -i '{N; s|<id>4271</id></identifier>\s*<attributes>|<id>4271</id></identifier>\n<attributes>\n<attr name="ENTEtablissementStructRattachFctl"><value>4244</value></attr>| }' ENT_CRP*EtabEducNat_0000.xml
sed -i '{N; s|<id>4366</id></identifier>\s*<attributes>|<id>4366</id></identifier>\n<attributes>\n<attr name="ENTEtablissementStructRattachFctl"><value>4366</value></attr>| }' ENT_CRP*EtabEducNat_0000.xml
sed -i '{N; s|<id>4371</id></identifier>\s*<attributes>|<id>4371</id></identifier>\n<attributes>\n<attr name="ENTEtablissementStructRattachFctl"><value>4366</value></attr>| }' ENT_CRP*EtabEducNat_0000.xml
chmod -R 777 ~/aaf

