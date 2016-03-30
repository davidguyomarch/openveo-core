'use strict';

module.exports = {
  routes: {
    public: {
      'get /getDictionary/:dictionary/:code': 'app/server/controllers/i18nController.getDictionaryAction'
    },
    private: {
      'get /login': 'app/server/controllers/defaultController.defaultAction',
      'post /authenticate': 'app/server/controllers/authenticationController.authenticateAction',
      '*': 'app/server/controllers/authenticationController.restrictAction',
      'post /logout': 'app/server/controllers/authenticationController.logoutAction',
      'get /getMenu': 'app/server/controllers/menuController.getMenuAction',
      'get /getDictionary/:dictionary/:code': 'app/server/controllers/i18nController.getAdminDictionaryAction',
      'get /permissions': 'app/server/controllers/authenticationController.getPermissionsAction',
      'get /ws/scopes': 'app/server/controllers/applicationController.getScopesAction',
      'get /crud/:type/:id': 'app/server/controllers/crudController.getEntityAction',
      'get /crud/:type': 'app/server/controllers/crudController.getEntitiesAction',
      'post /crud/:type/:id': 'app/server/controllers/crudController.updateEntityAction',
      'put /crud/:type': 'app/server/controllers/crudController.addEntityAction',
      'delete /crud/:type/:id': 'app/server/controllers/crudController.removeEntityAction',
      'get /getTaxonomy/:name': 'app/server/controllers/taxonomyController.getTaxonomyAction',
      'post /search/:type': 'app/server/controllers/searchController.searchEntitiesAction'
    },
    ws: {
      'get /taxonomy/:name': 'app/server/controllers/taxonomyController.getTaxonomyAction'
    }
  },
  entities: {
    application: 'app/server/models/ClientModel',
    user: 'app/server/models/UserModel',
    role: 'app/server/models/RoleModel'
  },
  webServiceScopes: [
    {
      id: 'taxonomy',
      name: 'WS_SCOPES.GET_TAXONOMY_NAME',
      description: 'WS_SCOPES.GET_TAXONOMY_DESCRIPTON',
      paths: [
        'get /taxonomy/*'
      ]
    }
  ],
  permissions: [
    {
      id: 'access-applications-page',
      name: 'PERMISSIONS.ACCESS_APPLICATION_PAGE_NAME'
    },
    {
      id: 'access-users-page',
      name: 'PERMISSIONS.ACCESS_USER_PAGE_NAME',
      paths: [
        'get /crud/roles'
      ]
    },
    {
      id: 'access-roles-page',
      name: 'PERMISSIONS.ACCESS_ROLES_PAGE_NAME'
    }
  ],
  backOffice: {
    menu: [
      {
        weight: 100,
        label: 'MENU.WEB_SERVICE',
        subMenu: [
          {
            label: 'MENU.APPLICATIONS',
            path: 'applications',
            permission: 'access-applications-page'
          }
        ]
      },
      {
        weight: 99,
        label: 'MENU.RIGHTS',
        subMenu: [
          {
            label: 'MENU.USERS',
            path: 'users',
            permission: 'access-users-page'
          },
          {
            label: 'MENU.ROLES',
            path: 'roles',
            permission: 'access-roles-page'
          }
        ]
      }
    ],
    scriptLibFiles: {
      base: [
        '/lib/api-check/dist/api-check.min.js',
        '/lib/angular/angular.min.js',
        '/lib/angular-animate/angular-animate.min.js',
        '/lib/angular-route/angular-route.min.js',
        '/lib/angular-cookies/angular-cookies.min.js',
        '/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        '/lib/angular-touch/angular-touch.min.js',
        '/lib/angular-sanitize/angular-sanitize.min.js',
        '/lib/angular-ui-tree/dist/angular-ui-tree.min.js',
        '/lib/angular-formly/dist/formly.min.js',
        '/lib/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.min.js',
        '/lib/checklist-model/checklist-model.js',
        '/lib/ng-jsonpath/dist/ng-jsonpath.min.js',
        '/lib/ng-tasty/ng-tasty-tpls.min.js'
      ],
      dev: [
        '/authentication/AuthenticationApp.js',
        '/storage/StorageApp.js',
        '/i18n/I18nApp.js',
        '/entity/EntityApp.js',
        '/alert/AlertApp.js',
        '/tableForm/tableForm.js'
      ],
      prod: [
        '/be/js/libOpenveo.js'
      ]
    },
    scriptFiles: {
      dev: [
        '/angular-temporary-fix-ie.js',
        '/ov/OvApp.js',
        '/ov/ErrorInterceptor.js',
        '/ov/MainController.js',
        '/ov/LoginController.js',
        '/ov/HomeController.js',
        '/ov/ApplicationController.js',
        '/ov/RoleController.js',
        '/ov/UserController.js',
        '/ov/ProfileController.js',
        '/ov/MenuService.js',
        '/ov/UserService.js',
        '/ov/ApplicationService.js',
        '/ov/TruncateFilter.js',
        '/ov/TagsDirective.js',
        '/ov/MultiCheckBoxDirective.js'
      ],
      prod: [
        '/be/js/openveo.js'
      ]
    },
    cssFiles: [
      '/be/css/bootstrap.css',
      '/lib/angular/angular-csp.css',
      '/lib/angular-bootstrap/ui-bootstrap-csp.css',
      '/lib/angular-ui-tree/dist/angular-ui-tree.min.css',
      '/be/css/style.css'
    ]
  },
  viewsFolders: [
    'app/client/admin/views'
  ],
  imageProcessing: {
    imagesFolders: [],
    imagesStyle: {}
  }
};
