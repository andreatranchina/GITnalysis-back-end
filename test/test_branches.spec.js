const chai = require('chai')
const expect = chai.expect;
const chaihttp=require("chai-http")
const server= require("../app")
const { response } = require('express')
chai.should()
chai.use(chaihttp)



describe('Branches API', () => {
    //for getting all the branches of a given repo
    const owner="andreatranchina"
    const repo="GITnalysis-back-end"
    describe('GET ALL BRANCHES',()=>{
        it("it should return a array of branches",(done)=>{
            chai.request(server).
            get(`/api/branches/${owner}/${repo}`).
            end((err,res)=>{
                expect(res.body.branches).to.be.an("array");
                done();
            })
        })
    })

    
});
