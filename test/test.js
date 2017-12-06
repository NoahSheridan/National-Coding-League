var expect = require("chai").expect;
var assert = require('assert');
var base_url = "http://localhost:3000/";
var userTest = require("../userTest.js");
var routes = require("../routes");
var user = {name: "Test"};
var should = require('chai').should();
var supertest = require('supertest');
var api = supertest('http://localhost:3000');

describe('Database', function(){
	it('Should show that database is functional', function(){
		});
});


describe('Homepage', function(){
	it('should have name National Coding League', function(){
		expect(user).to.have.property('name');
	});
});

describe('Registration Page', function(){
	it('should return a 200 reponse', function(done){
		api.get('/routes/register.js')
		.set('Accept', 'app/package.json')
		.expect(200, done);
	});
});


		



