'use strict';

window.assert = chai.assert;

// LoginController.js
describe('LoginController', function() {
  var $rootScope,
    $controller;

  // Load openveo module
  beforeEach(module('ov'));

  // Dependencies injections
  beforeEach(inject(function(_$rootScope_, _$controller_) {
    $rootScope = _$rootScope_;
    $controller = _$controller_;
  }));

  // Sign in
  describe('Sign in', function() {
    var $httpBackend,
      $location,
      authRequestHandler,
      scope;

    // Dependencies injections
    beforeEach(inject(function(_$httpBackend_, _$location_) {
      $httpBackend = _$httpBackend_;
      $location = _$location_;
    }));

    // Initializes tests
    beforeEach(function() {
      scope = $rootScope.$new();
      $httpBackend.when('GET', /.*/).respond(200, '');
      authRequestHandler = $httpBackend.when('POST', '/be/authenticate');
    });

    // Checks if no HTTP request stays without response
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should set onError property when sign in fails', function() {
      scope.userEmail = 'openveo';
      scope.password = 'openveo';

      $controller('LoginController', {
        $scope: scope,
        $location: $location
      });

      authRequestHandler.respond(401, '');

      scope.signIn();
      $httpBackend.flush();

      // Expect onError to be true
      assert.ok(scope.onError);
      assert.equal(scope.userEmail, '');
      assert.equal(scope.password, '');
    });

    it('Should set location to /admin when user successfully signs in', function() {
      scope.userEmail = 'openveo';
      scope.password = 'openveo';

      authRequestHandler.respond(200, '');

      $controller('LoginController', {
        $scope: scope,
        $location: $location
      });

      scope.signIn();
      $httpBackend.flush();

      // Expect onError to be true
      assert.equal($location.path(), '/');
    });

  });

  // List of languages
  describe('Languages', function() {
    var scope;

    // Initializes tests
    beforeEach(function() {
      scope = $rootScope.$new();
      $controller('LoginController', {
        $scope: scope
      });
    });

    it('Should have a predefined language', function() {
      assert.isDefined(scope.language);
      assert.isNotNull(scope.language);
    });

    it('Should have a list of languages', function() {
      assert.isDefined(scope.languages);
      assert.isNotNull(scope.languages);
      assert.isArray(scope.languages);
    });

  });

});