var q = require('q');
var Face = require('./entities/Face.js');
var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');


var getRandomDocument = function(){
  var count = q.denodeify(Face.count.bind(Face));
  return count({}).then(function(countOfDocuments) {
    if (!countOfDocuments) {
      return q.reject("Couldn't find any faces in collection.");
    }
    var shift = Math.floor(Math.random()*countOfDocuments);
    return Face.find().skip(shift).limit(1).exec().then(function(documents) {
      return documents[0];
    });
  });
};

var Faces = {};

Faces.getRandom = function(howMany){
  var promises = _.times(howMany || 1, function() {
    return getRandomDocument()
  });
  return q.all(promises);
};

Faces.get = function(id){
  var query = Face.find({_id: new ObjectID(id)});
  var findOne = q.denodeify(query.findOne.bind(query));
  return findOne();
};

Faces.getAll = function(){
	return Face.find().exec();
};

Faces.getRandomPhotoPath = function(face) {
  return 'public/images/faces/' + face.photos[Math.floor(Math.random() * face.photos.length)];
};


module.exports = Faces;