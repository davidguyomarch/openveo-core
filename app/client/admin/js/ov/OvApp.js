'use strict';

/**
 * Main OpenVeo module.
 *
 * Loads all AngularJS dependencies and plugins modules. It also initializes formly and define routes exposed
 * by OpenVeo core.
 *
 * @module ov
 * @main ov
 */

(function(angular) {

  var moduleDependencies = [
    'ngRoute',
    'ov.authentication',
    'ov.storage',
    'ov.i18n',
    'ov.entity',
    'ov.alert',
    'ov.tableForm',
    'ov.utilService',
    'ui.bootstrap',
    'ui.tree',
    'ngTasty',
    'formly',
    'formlyBootstrap',
    'ngJSONPath',
    'ngAnimate',
    'checklist-model'
  ];

  // Loads all openveo sub plugins as dependencies of the module "ov"
  if (typeof plugins !== 'undefined') {
    angular.forEach(plugins, function(pluginToLoad) {

      // If a module exists for a sub plugin
      // e.g ov.plugin1
      // Load it.
      angular.module('ov.' + pluginToLoad);
      moduleDependencies.push('ov.' + pluginToLoad);

    });
  }

  var app = angular.module('ov', moduleDependencies);
  app.run(['formlyConfig', '$filter', function(formlyConfig, $filter) {

    // Formly wrappers
    formlyConfig.setWrapper({
      name: 'collapse',
      templateUrl: 'ov-core-collapse.html'
    });
    formlyConfig.setWrapper({
      name: 'horizontalBootstrapLabel',
      templateUrl: 'ov-core-horizontal-bootstrap-label.html'
    });
    formlyConfig.setWrapper({
      name: 'horizontalBootstrapLabelOnly',
      templateUrl: 'ov-core-horizontal-bootstrap-label-only.html'
    });
    formlyConfig.setWrapper({
      name: 'editableWrapper',
      templateUrl: 'ov-core-editable-wrapper.html'
    });

    // Formly types
    formlyConfig.setType({
      name: 'tags',
      templateUrl: 'ov-core-formly-tags.html',
      defaultOptions: {
        validation: {
          show: true
        }
      }
    });
    formlyConfig.setType({
      name: 'emptyrow',
      templateUrl: 'ov-core-empty-row.html',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });
    formlyConfig.setType({
      extends: 'input',
      name: 'editableInput',
      link: function(scope, element, attrs) {
        scope.show = function() {
          scope.isEmpty = scope.model[scope.options.key] ? false : true;
          return scope.model[scope.options.key] || 'CORE.UI.EMPTY';
        };
      }
    });
    formlyConfig.setType({
      extends: 'select',
      name: 'editableSelect',
      link: function(scope, element, attrs) {
        scope.show = function() {
          var labels = [];
          var values;

          if (Object.prototype.toString.call(scope.model[scope.options.key]) === '[object Array]')
            values = scope.model[scope.options.key];
          else
            values = [scope.model[scope.options.key]];

          // Find selected option label
          scope.to.options.forEach(function(option) {
            values.forEach(function(value) {
              if (option.value === value)
                labels.push(option.name);
            });
          });

          scope.isEmpty = labels.length ? false : true;
          return labels.length ? labels.join(', ') : 'CORE.UI.EMPTY';
        };
      }
    });
    formlyConfig.setType({
      name: 'editableTags',
      extends: 'tags',
      wrapper: ['editableTagsWrapper'],
      link: function(scope, element, attrs) {
        scope.show = function() {
          var tags = scope.model[scope.options.key];
          scope.isEmpty = tags && tags.length ? false : true;
          return tags && tags.join(', ') || 'CORE.UI.EMPTY';
        };
      }
    });
    formlyConfig.setType({
      name: 'ovMultiCheckBox',
      templateUrl: 'ov-core-formly-multi-check-box.html'
    });
    formlyConfig.setType({
      name: 'ovEditableMultiCheckBox',
      extends: 'ovMultiCheckBox',
      link: function(scope) {
        scope.show = function() {
          var selected = [];
          angular.forEach(scope.to.options, function(s) {
            if (scope.model[scope.options.key] && scope.model[scope.options.key].indexOf(s.id) >= 0) {
              selected.push(s.name);
            }
          });
          scope.isEmpty = selected.length ? false : true;
          return selected.length ? selected.join(', ') : 'CORE.UI.EMPTY';
        };
      }
    });
    formlyConfig.setType({
      extends: 'checkbox',
      name: 'editableCheckbox',
      link: function(scope, element, attrs) {
        scope.show = function() {
          scope.isEmpty = false;
          return scope.model[scope.options.key] && 'CORE.UI.TRUE' || 'CORE.UI.FALSE';
        };
      }
    });
    formlyConfig.setType({
      name: 'horizontalInput',
      extends: 'input',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });
    formlyConfig.setType({
      name: 'horizontalEditableInput',
      extends: 'editableInput',
      wrapper: ['editableWrapper', 'horizontalBootstrapLabel', 'bootstrapHasError']
    });
    formlyConfig.setType({
      name: 'horizontalSelect',
      extends: 'select',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });
    formlyConfig.setType({
      name: 'horizontalEditableSelect',
      extends: 'editableSelect',
      wrapper: ['editableWrapper', 'horizontalBootstrapLabel', 'bootstrapHasError']
    });
    formlyConfig.setType({
      name: 'horizontalMultiCheckbox',
      extends: 'ovMultiCheckBox',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });
    formlyConfig.setType({
      name: 'horizontalEditableMultiCheckbox',
      extends: 'ovEditableMultiCheckBox',
      wrapper: ['editableWrapper', 'horizontalBootstrapLabel', 'bootstrapHasError']
    });
    formlyConfig.setType({
      name: 'horizontalTags',
      extends: 'tags',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });
    formlyConfig.setType({
      name: 'horizontalEditableTags',
      extends: 'editableTags',
      wrapper: ['editableWrapper', 'horizontalBootstrapLabel', 'bootstrapHasError']
    });
    formlyConfig.setType({
      name: 'horizontalCheckbox',
      extends: 'checkbox',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });
    formlyConfig.setType({
      name: 'horizontalEditableCheckbox',
      extends: 'editableCheckbox',
      wrapper: ['editableWrapper', 'horizontalBootstrapLabel', 'bootstrapHasError']
    });

  }]);

  /**
   * Configures application main routes and set location mode to HTML5.
   */
  app.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {

      // Register / route with authentication
      $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController',
        title: 'CORE.HOME.PAGE_TITLE'
      });

      // Register /login route without authentication
      $routeProvider.when('/login', {
        title: 'CORE.LOGIN.PAGE_TITLE',
        templateUrl: 'views/login.html',
        controller: 'LoginController',
        resolve: {
          i18nCommon: ['i18nService', function(i18nService) {
            return i18nService.addDictionary('common');
          }],
          i18nLogin: ['i18nService', function(i18nService) {
            return i18nService.addDictionary('login');
          }]
        }
      }).otherwise('/');

      // Register /applications route with authentication
      // Also retrieve the list of applications
      $routeProvider.when('/applications-list', {
        templateUrl: 'views/applications.html',
        controller: 'ApplicationController',
        title: 'CORE.APPLICATIONS.PAGE_TITLE',
        access: 'core-access-applications-page',
        resolve: {
          scopes: ['applicationService', function(applicationService) {
            return applicationService.loadScopes();
          }]
        }
      });

      // Register /users route with authentication
      // Also retrieve the list of roles
      $routeProvider.when('/users-list', {
        templateUrl: 'views/users.html',
        controller: 'UserController',
        title: 'CORE.USERS.PAGE_TITLE',
        access: 'core-access-users-page',
        resolve: {
          roles: ['userService', function(userService) {
            return userService.loadRoles();
          }]
        }
      });

      // Register /profiles route with authentication
      // Also retrieve the user profile
      $routeProvider.when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileController',
        title: 'CORE.PROFILES.PAGE_TITLE',
        resolve: {
          user: ['authenticationService', function(authenticationService) {
            return authenticationService.getUserInfo();
          }]
        }
      });

      // Register /roles route with authentication
      // Also retrieve the list of permissions
      $routeProvider.when('/roles-list', {
        templateUrl: 'views/roles.html',
        controller: 'RoleController',
        title: 'CORE.ROLES.PAGE_TITLE',
        access: 'core-access-roles-page',
        resolve: {
          permissions: ['userService', function(userService) {
            return userService.loadPermissions();
          }]
        }
      });

      // Register /groups route with authentication
      $routeProvider.when('/groups-list', {
        templateUrl: 'views/groups.html',
        controller: 'GroupController',
        title: 'CORE.GROUPS.PAGE_TITLE',
        access: 'core-access-groups-page'
      });

      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('errorInterceptor');

      // Remove the 300ms delay on touch device
      /* global FastClick */
      FastClick.attach(document.body);
    }]);

  // Replace "classic" spaces with non-breaking-spaces
  app.filter('noBreakSpace', function() {
    return function(value) {
      return value.replace(/ /g, '\u00A0');
    };
  });

})(angular);
