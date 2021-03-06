var FileUtils = require('../utils/FileUtils');
var Faces = require('../database/Faces');

var getGuessMode = function(modeName) {
  return require('../guessModes/'+modeName);
};

exports.all = function(req, res){
  Faces.find({}).then(function(faces) {
    res.send(faces);
  });
};

exports.random = function(req, res){
  var random = function(n) {
    return Math.floor(Math.random()*n);
  };

  var modes = ['chooseName', 'inputName', 'choosePhoto'];
  //var modes = ['inputName'];

  var guessMode = getGuessMode(modes[random(modes.length)]);

  var query = req.body;

  Faces.getRandom(1, query).done(function(documents) {
    var face = documents[0];
    var randomPhoto = Faces.getRandomPhotoPath(face);
    FileUtils.getImgBase64(randomPhoto).then(function(img64) {
      guessMode.questionData(face, query, function(mode, faceData, extraData){
        res.send({
          _id: face._id,
          photo: img64,
          mode: mode,
          face: faceData,
          extras: extraData
        });
      });
    });
  });
};

exports.check = function(req, res){
  Faces.get(req.body._id).then(function(face){
    var guessMode = getGuessMode(req.body.mode);
    guessMode.guess(face, req.body, function(response){
      res.send(response);
    });
  });
};

exports.find = function(req, res){
  Faces.find(req.body.query || {}, req.body.fields || {}, req.body.sorting).then(function(faces) {
    res.send(faces);
  });
};

exports.distinct = function(req, res){
  Faces.distinct(req.params.field).then(function(values) {
    res.send(values);
  });
};