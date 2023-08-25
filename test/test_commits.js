const chai = require('chai')
const expect = chai.expect;
const chaihttp=require("chai-http")
const server= require("../app")
const { response } = require('express')
chai.should()
chai.use(chaihttp)
const cookie=require("./cookie")



describe('Commits API', () => {
    //for getting all the Commits of a given repo
    const owner="andreatranchina"
    const repo="GITnalysis-back-end"
    describe('GET ALL COMMITS',()=>{
        it("it should return a array of commits",(done)=>{
            chai.request(server).
            get(`/api/commits/${owner}/${repo}`).
            set('Cookie',`connect.sid=${cookie}`).
            end((err,res)=>{
                expect(res.body).to.not.be.null;
                expect(res.body).to.be.an("array");
                done();
            })
        })
    })
    
    describe('COUNT ALL COMMITS',()=>{
        it("it should return an object with a key commits and an integer value ",(done)=>{
            chai.request(server).
            get(`/api/commits/count/${owner}/${repo}`).
            set('Cookie',`connect.sid=${cookie}`).
            end((err,res)=>{
                expect(res.body.commits).to.not.be.null;
                expect(res.body.commits).to.be.a("number");
                done();
            })
        })
    })

    describe('COMMITS TIMELINE',()=>{
        it("it should return an object with keys containing dates and an integer value for each date",(done)=>{
            chai.request(server).
            get(`/api/commits/count/${owner}/${repo}`).
            set('Cookie',`connect.sid=${cookie}`).
            end((err,res)=>{
                expect(res.body).to.not.be.null;
                done();
            })
        })
    })
    
    
});
