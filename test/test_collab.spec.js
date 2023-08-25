const chai = require('chai')
const expect = chai.expect;
const chaihttp=require("chai-http")
const server= require("../app")
const { response } = require('express')
chai.should()
chai.use(chaihttp)
const cookie=require("./cookie")



describe('Collaborators API', () => {
    //for getting all the Collaborators of a given repo
    const owner="andreatranchina"
    const repo="GITnalysis-back-end"
    describe('GET ALL COLLABORATORS',()=>{
        it("it should return a array of collaborators",(done)=>{
            chai.request(server).
            get(`/api/collaborators/${owner}/${repo}`).
            set('Cookie',`connect.sid=${cookie}`).
            end((err,res)=>{
                expect(res.body.collaborators).to.not.be.null;
                expect(res.body.collaborators).to.be.an("array");
                done();
            })
        })
    })
    
    describe('COUNT ALL COLLABORATORS',()=>{
        it("it should return an object with a key collaborators and an integer value ",(done)=>{
            chai.request(server).
            get(`/api/collaborators/count/${owner}/${repo}`).
            set('Cookie',`connect.sid=${cookie}`).
            end((err,res)=>{
                expect(res.body.numCollaborators).to.not.be.null;
                expect(res.body.numCollaborators).to.be.a("number");
                done();
            })
        })
    })
    
});
