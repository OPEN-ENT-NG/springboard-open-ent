begin transaction
match (a:Action) SET a.name = replace(a.name, 'fr.wseduc.actualites', 'net.atos.entng.actualites');
commit