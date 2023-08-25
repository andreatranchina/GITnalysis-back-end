const chai = require('chai')
const expect = chai.expect;
const chaihttp=require("chai-http")
const server= require("../app")
const { response } = require('express')
chai.should()
chai.use(chaihttp)
const cookie=require("./cookie")



describe('Branches API', () => {
    //for getting all the branches of a given repo
    const owner="andreatranchina"
    const repo="GITnalysis-back-end"
    describe('GET ALL BRANCHES',()=>{
        it("it should return a array of branches",(done)=>{
            chai.request(server).
            get(`/api/branches/${owner}/${repo}`).
            set('Cookie',`connect.sid=${cookie}`).
            end((err,res)=>{
                expect(res.body.branches).to.not.be.null;
                expect(res.body.branches).to.be.an("array");
                done();
            })
        })
    })
    
    describe('COUNT ALL BRANCHES',()=>{
        it("it should return an object with a key branches and an integer value ",(done)=>{
            chai.request(server).
            get(`/api/branches/count/${owner}/${repo}`).
            set('Cookie',`connect.sid=${cookie}`).
            end((err,res)=>{
                expect(res.body.branches).to.not.be.null;
                expect(res.body.branches).to.be.a("number");
                done();
            })
        })
    })

    describe('DATA FOR A SINGLE BRANCH',()=>{
        const branch="main"
        it("should return the correct branch information",(done)=>{
            chai.request(server).
            get(`/api/branches/singleBranch/${owner}/${repo}/${branch}`).
            set('Cookie',`connect.sid=${cookie}`).
            end((err,res)=>{
                expect(res.body.branch).to.not.be.null;
                expect(res.body.branch).to.be.an("object");
                expect(res.body.branch.name).equals(branch)
                done();
            })
        })
    })

    
});
