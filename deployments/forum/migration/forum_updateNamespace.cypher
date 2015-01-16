begin transaction
match (a:Action) SET a.name = replace(a.name, 'fr.wseduc.forum', 'net.atos.entng.forum');
commit