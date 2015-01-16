db.forum.categories.find({"shared.0" : { "$exists" : true }}, {"_id":1, "shared":1}).forEach(function(cat) {
  var string = JSON.stringify(cat);
  var obj = JSON.parse(string.replace(/fr\-wseduc/g, 'net-atos-entng'));
  db.forum.categories.update({"_id" : cat._id}, { $set : { "shared" : obj.shared}});
});
db.forum.subjects.find({"shared.0" : { "$exists" : true }}, {"_id":1, "shared":1}).forEach(function(sub) {
  var string = JSON.stringify(sub);
  var obj = JSON.parse(string.replace(/fr\-wseduc/g, 'net-atos-entng'));
  db.forum.subjects.update({"_id" : sub._id}, { $set : { "shared" : obj.shared}});
});