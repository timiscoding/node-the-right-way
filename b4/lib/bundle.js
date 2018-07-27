/**
 * Provides API endpoints for working with book bundles
 */

'use strict';
const express = require('express');
const rp = require('request-promise');

const getUserKey = ({user:{provider, id}}) => `${provider}-${id}`;

module.exports = es => {
  const url = `http://${es.host}:${es.port}/${es.bundles_index}/bundle`;
  const router = express.Router();

  /**
   * All of these APIs require the user to have authenticated
   */
  router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
      res.status(403).json({
        error: 'You must sign in to use this service',
      });
      return;
    }
    next();
  });

  /**
   * List bundles for the currently authenticated user
   */
  router.get('/list-bundles', async (req, res) => {
    try {
      const esReqBody = {
        size: 1000,
        query: {
          match: {
            userKey: getUserKey(req),
          },
        },
      };

      const options = {
        url: `${url}/_search`,
        json: true,
        body: esReqBody,
      };

      const esResBody = await rp(options);
      const bundles = esResBody.hits.hits.map(hit => ({
        id: hit._id,
        name: hit._source.name,
      }));
      res.status(200).json(bundles);
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });

  /**
   * Create a new bundle with the specified name
   */
  router.post('/bundle', async (req, res) => {
    try {
      const bundle = {
        name: req.query.name || '',
        userKey: getUserKey(req),
        books: [],
      };

      const esResBody = await rp.post({url, body: bundle, json: true});
      res.status(201).json(esResBody);
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  })

  /**
   * Retrieve a given bundle
   */
  router.get('/bundle/:id', async (req, res) => {
    try {
      const options = {
        url: `${url}/${req.params.id}`,
        json: true,
      };
      const { _source: bundle } = await rp(options);

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to view this bundle.',
        };
      }

      res.status(200).json({id: req.params.id, bundle});
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });

  return router;
};
