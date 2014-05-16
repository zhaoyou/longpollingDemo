var http = require('http'),
    url = require('url'),
    fs = require('fs');

var messages = ['test'];
var clients = [];

http.createServer(function(req, res) {
  var urlobj = url.parse(req.url);

  if (urlobj.pathname == '/') {
    fs.readFile('index.html', function(error, data) {
      res.end(data);
    });
  } else if (urlobj.pathname.substr(0, 5) == '/poll') {
    var count = urlobj.pathname.replace(/[^0-9]*/, '');
    if (messages.length > count) {
        res.end(JSON.stringify({
          'count': messages.length,
          'append': messages.slice(count).join('\n') + '\n'
        }));
    } else {
      clients.push(res);
    }
  } else if (urlobj.pathname.substr(0, 5) == '/msg/') {
    var msg = unescape(urlobj.pathname.substr(5));
    messages.push(msg);
    console.log(msg);
    while(clients.length > 0) {
      var client = clients.pop();
      //client.charset = 'utf-8';
      client.end(JSON.stringify({
        'count': messages.length,
        'append': msg + '\n'
      }));
    }
    res.end('send success');
  } else if (urlobj.pathname.substr(0, 10) == '/jquery.js') {
    fs.readFile('jquery.js', function(error, data) {
      res.end(data);
    });
  }
}).listen(8000, 'localhost');
console.log('server start localhost:8000');
