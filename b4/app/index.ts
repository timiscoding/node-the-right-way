import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap';

import * as templates from './templates.ts';

import '../node_modules/bootstrap-social/bootstrap-social.css';
import '../node_modules/font-awesome/css/font-awesome.css';

/**
 * Convenience method to fetch and decode JSON
 */
const fetchJSON = async  (URL, method = 'GET') => {
  try {
    const response = await fetch(URL, {method, credentials: 'same-origin'});
    return response.json();
  } catch (error) {
    return {error};
  }
};

const getBundles = async () => {
  const bundles = await fetchJSON('/api/list-bundles');
  if (bundles.error) {
    throw bundles.error;
  }
  return bundles;
};

const addBundle = async (bundleName) => {
  const bundles = await getBundles();
  const resBody = await fetchJSON(`/api/bundle?name=${bundleName}`, 'POST');

  if (resBody.error) {
    throw resBody.error;
  }

  bundles.push({id: resBody._id, name: bundleName});
  listBundles(bundles);
  showAlert('Bundle created', 'success');
};

const listBundles = bundles => {
  const mainElement = document.body.querySelector('.b4-main');

  mainElement.innerHTML =
    templates.addBundleForm() + templates.listBundles({bundles});

  const form = mainElement.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.querySelector('input').value;
    addBundle(name);
  });
};

/**
 * Show an alert to the user.
 */
const showAlert = (message, type = 'danger') => {
  const alertsElement = document.body.querySelector('.b4-alerts');
  const html = templates.alert({type, message});
  alertsElement.insertAdjacentHTML('beforeend', html);
};

/**
 * Use Window location hash to show the specified view.
 */
const showView = async () => {
  const mainElement = document.body.querySelector('.b4-main');
  const [view, ...params] = window.location.hash.split('/');

  switch (view) {
    case '#welcome':
      const session = await fetchJSON('/api/session');
      mainElement.innerHTML = templates.welcome({session});
      if (session.error) {
        showAlert(session.error);
      }
      break;
    case '#list-bundles':
      try {
        const bundles = await getBundles();
        listBundles(bundles);
      } catch (err) {
        showAlert(err);
        window.location.hash = '#welcome';
      }
      break;
    default:
      // Unrecognized view.
      throw Error(`Unrecognized view: ${view}`);
  }
};

// Page setup.
(async () => {
  const session = await fetchJSON('/api/session');
  document.body.innerHTML = templates.main({session});
  window.addEventListener('hashchange', showView);
  showView().catch(err => window.location.hash = '#welcome');
})();
