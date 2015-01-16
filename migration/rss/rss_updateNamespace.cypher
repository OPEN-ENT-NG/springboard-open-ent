begin transaction
match (a:Action) SET a.name = replace(a.name, 'fr.wseduc.rss', 'net.atos.entng.rss');
commit