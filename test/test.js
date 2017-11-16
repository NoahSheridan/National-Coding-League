var expect = require("chai").expect;
var AppCount = require('app-count')

describe('Member App Count', function(){
it("getSubtotal() should return 0 before a member saves any apps", function(){
	var appCount = new AppCount([]);
	expect(appCount.getSubtotal()).to.equal(0);
	});
});



