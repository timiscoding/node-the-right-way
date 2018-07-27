import * as Handlebars from '../node_modules/handlebars/dist/handlebars.js';

export const main = Handlebars.compile(`
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed"
            data-toggle="collapse" data-target=".navbar-collapse"
            aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#welcome">B4</a>
      </div>
      {{#if session.auth}}
      <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav navbar-right">
          <li><a href="#list-bundles">My Bundles</a></li>
          <li><a href="/auth/signout">Sign out</a></li>
        </ul>
      </div><!-- /.navbar-collapse -->
      {{/if}}
    </div><!-- /.container-fluid -->
  </nav>
  <div class="container">
    <div class="b4-alerts"></div>
    <div class="b4-main"></div>
  </div>
`);

export const welcome = Handlebars.compile(`
  <div class="jumbotron">
    <h1>Welcome!</h1>
    <p>B4 is an application for creating book bundles.</p>

    {{#if session.auth}}
    <p>View your <a href="#list-bundles">bundles</a>.</p>
    {{else}}
    <p>Sign in with any of these services to begin.</p>
    <div class="row">
      <div class="col-sm-6">
        <a href="/auth/facebook" class="btn btn-block btn-social btn-facebook">
          Sign in with Facebook
          <span class="fa fa-facebook"></span>
        </a>
        <a href="/auth/twitter" class="btn btn-block btn-social btn-twitter">
          Sign in with Twitter
          <span class="fa fa-twitter"></span>
        </a>
        <a href="/auth/google" class="btn btn-block btn-social btn-google">
          Sign in with Google
          <span class="fa fa-google"></span>
        </a>
      </div>
    </div>
    {{/if}}
  </div>
`);

export const alert = Handlebars.compile(`
  <div class="alert alert-{{type}} alert-dismissible fade in" role="alert">
    <button class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    {{message}}
  </div>
`);

export const listBundles = Handlebars.compile(`
  <div class="panel panel-default">
    <div class="panel-heading">Your Bundles</div>
    {{#if bundles.length}}
      <table class="table">
        <tr>
          <th>Bundle Name</th>
          <th>Actions</th>
        </tr>
        {{#each bundles}}
        <tr>
          <td>
            <a href="#view-bundle/{{id}}">{{name}}</a>
          </td>
          <td>
            <button class="btn delete" data-bundle-id="{{id}}">Delete</button>
          </td>
        </tr>
        {{/each}}
      </table>
    {{else}}
      <div class="panel-body">
        <p>None yet!</p>
      </div>
    {{/if}}
  </div>
`);

export const addBundleForm = Handlebars.compile(`
  <div class="panel panel-default">
    <div class="panel-heading">Create a new bundle.</div>
    <div class="panel-body">
      <form>
        <div class="input-group">
          <input class="form-control" placeholder="Bundle Name" />
          <span class="input-group-btn">
            <button class="btn btn-primary" type="submit">Create</button>
          </span>
        </div>
      </form>
    </div>
  </div>
`);

export const viewBundle = Handlebars.compile(`
  <h2>{{bundle.name}}</h2>

  <div class="panel panel-default">
    <div class="panel-heading">Add a book to this Bundle</div>
    <div class="panel-body">
      <form>
        <div class="input-group">
          <input class="form-control" list="results" placeholder="Search..." />
          <datalist id="results"></datalist>
          <span class="input-group-btn">
            <button class="btn btn-primary" type="submit">Search</button>
          </span>
        </div>
      </form>
    </div>
    <div class="search-results"></div>
  </div>

  <div class="panel panel-default">
    <div class="panel-heading">Books in this Bundle</div>
    {{#if bundle.books.length}}
      <table class="table">
        <thead>
          <tr>
            <th>Book Title</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {{#each bundle.books}}
          <tr>
            <td>
              <a href="#view-book/{{this.id}}">{{this.title}}</a>
            </td>
            <td>
              <button class="btn delete" data-id="{{this.id}}"
                  data-title="{{this.title}}">Delete</button>
            </td>
          </tr>
          {{/each}}
        </tbody>
      </table>

    {{else}}
      <div class="panel-body">
        <p>None yet!</p>
      </div>
    {{/if}}
  </div>
`);

