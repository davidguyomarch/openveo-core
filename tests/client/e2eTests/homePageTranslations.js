'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var HomePage = process.require('tests/client/e2eTests/pages/HomePage.js');

// Load assertion library
var assert = chai.assert;
chai.use(chaiAsPromised);

describe('Home page translations', function() {
  var page;

  before(function() {
    page = new HomePage();
    page.logAsAdmin();
    page.load();
  });

  after(function() {
    page.logout();
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

        // Open versions
        page.openVersions();

        // Verify translations
        assert.eventually.equal(page.getTitle(), page.translations.HOME.PAGE_TITLE);
        assert.eventually.equal(page.pageTitleElement.getText(), page.translations.HOME.TITLE);
        assert.eventually.equal(page.pageDescriptionElement.getText(), page.translations.HOME.DESCRIPTION);

        // Close versions
        return page.closeVersions();

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
