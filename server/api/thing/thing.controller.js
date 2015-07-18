/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var request = require('request');

// Get list of things
exports.index = function(req, res) {
};

exports.search = function(req, res) {
  var keywords = req.body.keywords;
  var api_key = "AIzaSyC_EwttoC73mHbGPAW1ChWBnxZw0Db3ZG0";
  var url = "https://ajax.googleapis.com/ajax/services/search/images";
  var params = "?v=1.0&hl=ja&key=" + api_key + "&q=" + encodeURIComponent(keywords) + "&rsz=8"

  var options = {
    url: url+params,
    json: true
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body.responseData.results);
      // console.log(body.responseData.cursor.pages);
      var results = body.responseData.results;
      var result_url = [];
      for (var i = 0; i < results.length; i++) {
        result_url.push(results[i]['url']);
      }
      res.json(result_url);
    } else {
      console.log('error: '+ response.statusCode);
    }
  });

};
