const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === '/calc') {
    const operation = query.operation;
    const a = parseFloat(query.a);
    const b = parseFloat(query.b);

    let result;

    if (operation === 'add') {
      result = a + b;
    } else if (operation === 'sub') {
      result = a - b;
    } else if (operation === 'mul') {
      result = a * b;
    } else if (operation === 'div') {
      result = a / b;
    } else {
      res.statusCode = 400;
      res.end('Operation unknown');
      return;
    }

    res.statusCode = 200;
    res.end(String(result));
    return;
  }

  if (pathname === '/fs') {
    const operation = query.operation;
    const filename = query.filename;
    const text = query.text || '';

    const filePath = path.join(process.cwd(), filename || '');

    if (operation === 'create') {
      try {
        fs.writeFileSync(filePath, text, 'utf8');
        res.statusCode = 201;
        res.end(`${filename} was created`);
      } catch (err) {
        res.statusCode = 400;
        res.end('Error creating file');
      }
      return;
    }

    if (operation === 'read') {
      if (!filename || !fs.existsSync(filePath)) {
        res.statusCode = 400;
        res.end('File not found');
        return;
      }

      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.statusCode = 201; 
        res.end(fileContent);
      } catch (err) {
        res.statusCode = 400;
        res.end('File not found');
      }
      return;
    }

    res.statusCode = 400;
    res.end('Operation unknown');
    return;
  }

  res.statusCode = 400;
  res.end('Operation unknown');
});

module.exports = server;