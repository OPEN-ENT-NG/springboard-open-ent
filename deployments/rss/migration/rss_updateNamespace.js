db.rss.channels.find({"shared.0" : { "$exists" : true }}, {"_id":1, "shared":1}).forEach(function(rss) {
var string = JSON.stringify(rss);
var obj = JSON.parse(string.replace(/fr\-wseduc/g, 'net-atos-entng'));
db.rss.channels.update({"_id" : rss._id}, { $set : { "shared" : obj.shared}});
});