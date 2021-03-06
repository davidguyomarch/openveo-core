'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var MenuPage = process.require('tests/client/e2eTests/pages/MenuPage.js');

// Load assertion library
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('Left menu translations', function() {
  var page;

  // Prepare page
  before(function() {
    page = new MenuPage();
    page.logAsAdmin();
    page.load();
  });

  // Logout after tests
  after(function() {
    page.logout();
  });

  // Reload page after each test
  afterEach(function() {
    page.refresh();
  });

  /**
   * Checks translations.
   *
   * @param {Number} [index] Index of the language to test in the list of languages
   * @return {Promise} Promise resolving when translations have been tested
   */
  function checkTranslations(index) {
    index = index || 0;
    var languages = page.getLanguages();

    if (index < languages.length) {
      return page.selectLanguage(languages[index]).then(function() {
        var coreTranslations = page.translations.CORE;

        // Open left menu
        page.openMenu();

        // Check rights label
        page.getLevel1MenuItems(coreTranslations.MENU.RIGHTS).then(function(menuItems) {
          assert.eventually.equal(menuItems[0].element(by.xpath('./a')).getText(), coreTranslations.MENU.RIGHTS);
        });

        // Check web service label
        page.getLevel1MenuItems(coreTranslations.MENU.WEB_SERVICE).then(function(menuItems) {
          assert.eventually.equal(menuItems[0].element(by.xpath('./a')).getText(), coreTranslations.MENU.WEB_SERVICE);
        });

        // Open rights sub menu
        page.openSubMenu(coreTranslations.MENU.RIGHTS);

        // Check rights sub menu
        page.getLevel1MenuItems(coreTranslations.MENU.RIGHTS).then(function(menuItems) {
          menuItems[0].all(by.css('.sub-menu > li > a')).each(function(element, index) {
            switch (index) {
              case 0:
                assert.eventually.equal(element.getText(), coreTranslations.MENU.USERS);
                break;
              case 1:
                assert.eventually.equal(element.getText(), coreTranslations.MENU.ROLES);
                break;
              default:
                break;
            }
          });
        });

        // Open web service sub menu
        page.openSubMenu(coreTranslations.MENU.WEB_SERVICE);

        // Check web service sub menu
        page.getLevel1MenuItems(coreTranslations.MENU.WEB_SERVICE).then(function(menuItems) {
          menuItems[0].all(by.css('.sub-menu > li > a')).each(function(element, index) {
            switch (index) {
              case 0:
                assert.eventually.equal(element.getText(), coreTranslations.MENU.APPLICATIONS);
                break;
              default:
                break;
            }
          });
        });

        // Close left menu
        return page.closeMenu();

      }).then(function() {
        return checkTranslations(++index);
      });
    } else {
      return protractor.promise.fulfilled();
    }
  }

  it('should be available in different languages', function() {
    return checkTranslations();
  });

});
