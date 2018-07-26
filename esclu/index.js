'use strict';

const fs = require('fs');
const request = require('request');
const program = require('commander');
const pkg = require('./package.json');

const fullUrl = (path = '') => {
  let url = `http://${program.host}:${program.port}/`;
  if (program.index) {
    url += program.index + '/';
    if (program.type) {
      url += program.type + '/';
      if (program.id) {
        url += program.id + '/';
      }
    }
  }
  return url + path.replace(/^\/*/, '');
};

const handleResponse = (err, res, body) => {
  if (program.json) {
    console.log(JSON.stringify(err || body));
  } else {
    if (err) throw err;
    console.log(body);
  }
};

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')
  .option('-o, --host <hostname>', 'hostname [localhost]', 'localhost')
  .option('-p, --port <number>', 'port number [9200]', '9200')
  .option('-j, --json', 'format output as JSON')
  .option('-i, --index <name>', 'which index to use')
  .option('-t, --type <type>', 'default type for bulk operations')
  .option('-f, --filter <filter>', 'source filter for query results')
  .option('-d, --id <id>', 'id of the document. Used for inserting single docs');

program
  .command('url [path]')
  .description('generate the URL for the options and path (default is /)')
  .action((path = '/') => console.log(fullUrl(path)));

program
  .command('get [path]')
  .description('perform an HTTP GET request for path (default is /)')
  .action((path = '/') => {
    const options = {
      url: fullUrl(path),
      json: program.json,
    };
    request(options, handleResponse);
  });

program
  .command('create-index')
  .description('create an index')
  .action(() => {
    if (!program.index) {
      const msg = 'No index specified! Use --index <name>';
      if (!program.json) throw Error(msg);
      return console.log(JSON.stringify({error: msg}));
    }
    request.put(fullUrl(), handleResponse);
  })

program
  .command('list-indices')
  .alias('li')
  .description('get a list of indices in this cluster')
  .action(() => {
    const path = program.json ? '_all' : '_cat/indices?v';
    request({url: fullUrl(path), json: program.json}, handleResponse);
  });

program
  .command('bulk <file>')
  .description('read and perform bulk options from the specified file')
  .action(file => {
    fs.stat(file, (err, stats) => {
      if (err) {
        if (program.json) {
          return console.log(JSON.stringify(err));
        }
        throw err;
      }

      const options = {
        url: fullUrl('_bulk'),
        json: true,
        headers: {
          'content-length': stats.size,
          'content-type': 'application/json',
        }
      };

      const req = request.post(options);

      const stream = fs.createReadStream(file);
      stream.pipe(req);
      req.pipe(process.stdout);
    });
  });

program
  .command('query [queries...]')
  .alias('q')
  .description('perform an Elasticsearch query')
  .action((queries = []) => {
    const options = {
      url: fullUrl('_search'),
      json: program.json,
      qs: {},
    };

    if (queries && queries.length) {
      options.qs.q = queries.join(' ');
    }

    if (program.filter) {
      options.qs._source = program.filter;
    }

    request(options, handleResponse);
  });

program
  .command('delete-index')
  .description('delete an index as specified with --index')
  .action((index) => {
    if (!program.index) {
      return console.log('Must specify index with --index option');
    }
    request.del({ url: fullUrl()}, handleResponse);
  });

program
  .command('put <source>')
  .description('insert a new source doc into the index')
  .action((source) => {
    if (!program.index || !program.type || !program.id) {
      return console.log('Must supply index, type and id');
    }

    fs.stat(source, (err, stats) => {
      if (err) {
        if (program.json) {
          return console.log(JSON.stringify(err));
        }
        throw err;
      }

      const options = {
        url: fullUrl(),
        headers: {
          'content-type': 'application/json',
          'content-length': stats.size,
        },
      };

      const req = request.put(options);
      fs.createReadStream(source).pipe(req);
      req.pipe(process.stdout);
    });
  });

program.parse(process.argv);

if (!program.args.filter(arg => typeof arg === 'object').length) {
  program.help();
}
