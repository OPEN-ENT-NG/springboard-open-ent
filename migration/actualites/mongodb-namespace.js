db.actualites.threads.find({"shared.0" : { "$exists" : true }}, {"_id":1, "shared":1}).forEach(function(doc) {
  var string = JSON.stringify(doc);
  var obj = JSON.parse(string.replace(/fr\-wseduc/g, 'net-atos-entng'));
  db.actualites.threads.update({"_id" : doc._id}, { $set : { "shared" : obj.shared}});
});
