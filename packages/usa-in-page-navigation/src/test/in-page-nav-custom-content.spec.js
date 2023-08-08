const assert = require("assert");
const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const behavior = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/in-page-nav-custom-content.template.html")
);
const PRIMARY_CONTENT_SELECTOR =
  ".usa-in-page-nav-container .usa-in-page-nav .usa-in-page-nav__list";

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "in page nav",
    selector: () => document.querySelector(".usa-in-page-nav"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`in-page navigation initialized at ${name}`, () => {
    const { body } = document;

    let theList;
    let listLinks;

    before(() => {
      const observe = sinon.spy();
      const mockIntersectionObserver = sinon.stub().returns({ observe });
      window.IntersectionObserver = mockIntersectionObserver;
    });

    beforeEach(() => {
      body.innerHTML = TEMPLATE;

      behavior.on(containerSelector());

      theList = document.querySelector(PRIMARY_CONTENT_SELECTOR);
      listLinks = Array.from(theList.getElementsByTagName("a"));
    });

    afterEach(() => {
      behavior.off(containerSelector(body));
      body.innerHTML = "";
      window.location.hash = "";
    });

    it("creates only one link item in the nav list", () => {
      assert.equal(listLinks.length === 1, true);
    });

    it("creates a link in the nav list for the header that is inside the custom content region", () => {
      const customRegionLink = listLinks.filter((link) =>
        link.href.includes("#header-in-content-region")
      );
      assert.equal(customRegionLink.length === 1, true);
    });

    it("does not create a link in the nav list for the header that is outside the custom content region", () => {
      const mainRegionLink = listLinks.filter((link) =>
        link.href.includes("#header-not-in-content-region")
      );
      assert.equal(mainRegionLink.length === 0, true);
    });
  });
});
