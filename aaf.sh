#!/bin/bash

sed -i '{N; s|<attr name="ENTEtablissementStructRattachFctl"><value>4242</value></attr>\s*\n|| }' ENT_CRP*EtabEducNat_0000.xml
sed -i '{N; s|<id>4244</id></identifier>\s*<attributes>|<id>4244</id></identifier>\n<attributes>\n<attr name="ENTEtablissementStructRattachFctl"><value>4244</value></attr>| }' ENT_CRP*EtabEducNat_0000.xml
sed -i '{N; s|<id>4271</id></identifier>\s*<attributes>|<id>4271</id></identifier>\n<attributes>\n<attr name="ENTEtablissementStructRattachFctl"><value>4244</value></attr>| }' ENT_CRP*EtabEducNat_0000.xml
sed -i '{N; s|<id>4366</id></identifier>\s*<attributes>|<id>4366</id></identifier>\n<attributes>\n<attr name="ENTEtablissementStructRattachFctl"><value>4366</value></attr>| }' ENT_CRP*EtabEducNat_0000.xml
sed -i '{N; s|<id>4371</id></identifier>\s*<attributes>|<id>4371</id></identifier>\n<attributes>\n<attr name="ENTEtablissementStructRattachFctl"><value>4366</value></attr>| }' ENT_CRP*EtabEducNat_0000.xml

