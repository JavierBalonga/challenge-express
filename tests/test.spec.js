const { expect } = require('chai');
const session = require('supertest-session');
const {model, server} = require('../src/app.js');


describe('model ', function(){

    beforeEach(() => {
        if (model.reset) {
            model.reset();
        }
    });

    xit('must have a propertie `clients` as a object', function(){
        expect(model).to.have.property('clients').and.to.be.an('object');
    })

    describe('must have a reset method for resetting the model ', function(){
        xit('must be a function', function(){
            expect(model.reset).to.be.a('function');
        })
        xit('must reset clients to {}', function(){
            model.clients = {javier: 'https://github.com/JavierBalonga', comment: 'aca me podes heatear tranquilo ;)'}
            model.reset();
            expect(model.clients).to.be.deep.equal({});
        })
    })

    describe('must have an addAppointment method to add appointments to that client', function(){
        xit('must be a function', function(){
            expect(model.addAppointment).to.be.a('function');
        })
        xit('must add clients as a properties', function(){
            model.addAppointment('javier', {date:'22/10/2020 16:00'});
            expect(model.clients).to.have.property('javier')
        })
        xit('must add clients as an array', function(){
            model.addAppointment('javier', {date:'22/10/2020 16:00'});
            expect(model.clients).to.have.property('javier');
            expect(model.clients.javier instanceof Array).to.be.true;
        })
        xit('must be adding multiple appointments in the order as they are added, and must be handling multiple clients', function(){
            model.addAppointment('javier', {date:'22/10/2020 14:00'});
            expect(model.clients.javier[0]).to.have.property('date').to.be.equal('22/10/2020 14:00');
            model.addAppointment('javier', {date:'22/10/2020 16:00'});
            expect(model.clients.javier[1]).to.have.property('date').to.be.equal('22/10/2020 16:00');
            model.addAppointment('alejandro', {date:'22/10/2020 11:00'});
            expect(model.clients.alejandro[0]).to.have.property('date').to.be.equal('22/10/2020 11:00');
            model.addAppointment('alejandro', {date:'22/10/2020 12:00'});
            expect(model.clients.alejandro[1]).to.have.property('date').to.be.equal('22/10/2020 12:00');
        })
        xit('the appointments must have a initial status, and to be `pending`', function(){
            model.addAppointment('javier', {date:'22/10/2020 14:00'});
            model.addAppointment('javier', {date:'22/10/2020 16:00'});
            model.addAppointment('alejandro', {date:'22/10/2020 11:00'});
            model.addAppointment('alejandro', {date:'22/10/2020 12:00'});
            expect(model.clients.javier[0]).to.have.property('status').to.be.equal('pending');
            expect(model.clients.javier[1]).to.have.property('status').to.be.equal('pending');
            expect(model.clients.alejandro[0]).to.have.property('status').to.be.equal('pending');
            expect(model.clients.alejandro[1]).to.have.property('status').to.be.equal('pending');
        })
    })

    describe('Appointments must be able to change status using the attend, expire and cancel methods.', function(){
        
        beforeEach(() => {
            if (model.addAppointment) {
                model.addAppointment('javier',    {date:'22/10/2020 14:00'});
                model.addAppointment('javier',    {date:'22/10/2020 16:00'});
                model.addAppointment('alejandro', {date:'22/10/2020 11:00'});
                model.addAppointment('alejandro', {date:'22/10/2020 12:00'});
            }
        });

        xit('they must be functions', function(){
            expect(model.attend).to.be.a('function');
            expect(model.expire).to.be.a('function');
            expect(model.cancel).to.be.a('function');
        })
        xit('`attend` must receive a name and a date, and change the status to `attended`', function(){
            model.attend('javier',    '22/10/2020 14:00');
            model.attend('javier',    '22/10/2020 16:00');
            model.attend('alejandro', '22/10/2020 11:00');
            model.attend('alejandro', '22/10/2020 12:00');
            expect(model.clients.javier[0]).to.have.property('status').to.be.equal('attended');
            expect(model.clients.javier[1]).to.have.property('status').to.be.equal('attended');
            expect(model.clients.alejandro[0]).to.have.property('status').to.be.equal('attended');
            expect(model.clients.alejandro[1]).to.have.property('status').to.be.equal('attended');
        })
        xit('`expire` must receive a name and a date, and change the status to `expired`', function(){
            model.expire('javier',    '22/10/2020 14:00');
            model.expire('javier',    '22/10/2020 16:00');
            model.expire('alejandro', '22/10/2020 11:00');
            model.expire('alejandro', '22/10/2020 12:00');
            expect(model.clients.javier[0]).to.have.property('status').to.be.equal('expired');
            expect(model.clients.javier[1]).to.have.property('status').to.be.equal('expired');
            expect(model.clients.alejandro[0]).to.have.property('status').to.be.equal('expired');
            expect(model.clients.alejandro[1]).to.have.property('status').to.be.equal('expired');
        })
        xit('`cancel` must receive a name and a date, and change the status to `cancelled`', function(){
            model.cancel('javier',    '22/10/2020 14:00');
            model.cancel('javier',    '22/10/2020 16:00');
            model.cancel('alejandro', '22/10/2020 11:00');
            model.cancel('alejandro', '22/10/2020 12:00');
            expect(model.clients.javier[0]).to.have.property('status').to.be.equal('cancelled');
            expect(model.clients.javier[1]).to.have.property('status').to.be.equal('cancelled');
            expect(model.clients.alejandro[0]).to.have.property('status').to.be.equal('cancelled');
            expect(model.clients.alejandro[1]).to.have.property('status').to.be.equal('cancelled');
        })
        xit('must be able to handle multiple appointments with multiple states', function(){
            model.attend('javier',    '22/10/2020 16:00');
            model.expire('alejandro', '22/10/2020 11:00');
            model.cancel('alejandro', '22/10/2020 12:00');
            expect(model.clients.javier[0]).to.have.property('status').to.be.equal('pending');
            expect(model.clients.javier[1]).to.have.property('status').to.be.equal('attended');
            expect(model.clients.alejandro[0]).to.have.property('status').to.be.equal('expired');
            expect(model.clients.alejandro[1]).to.have.property('status').to.be.equal('cancelled');
        })
    })

    describe('must have erase metod for delete appointments', function(){
        beforeEach(() => {
            if (model.addAppointment) {
                model.addAppointment('javier',    {date:'22/10/2020 14:00'});
                model.addAppointment('javier',    {date:'22/10/2020 16:00'});
                model.addAppointment('alejandro', {date:'22/10/2020 11:00'});
                model.addAppointment('alejandro', {date:'22/10/2020 12:00'});
                model.attend('javier',    '22/10/2020 16:00');
                model.cancel('alejandro', '22/10/2020 11:00');
                model.cancel('alejandro', '22/10/2020 12:00');
            }
        });

        xit('must be a function', function(){
            expect(model.erase).to.be.a('function');
        })
        xit('it must receive a name and if receive a date must erase the appointment with that date', function(){
            model.erase('javier', '22/10/2020 14:00');
            expect(model.clients.javier).to.be.deep.equal([ { date: '22/10/2020 16:00', status: 'attended' } ]);
            model.erase('javier', '22/10/2020 16:00');
            expect(model.clients.javier).to.be.deep.equal([]);
            model.erase('alejandro', '22/10/2020 11:00');
            expect(model.clients.alejandro).to.be.deep.equal([ { date: '22/10/2020 12:00', status: 'cancelled' } ]);
            model.erase('alejandro', '22/10/2020 12:00');
            expect(model.clients.alejandro).to.be.deep.equal([]);
        })
        xit('it must receive a name and if receive a status must erase all the appointments whith that status', function(){
            model.erase('javier', 'attended');
            expect(model.clients.javier).to.be.deep.equal([ { date: '22/10/2020 14:00', status: 'pending' } ]);
            model.erase('alejandro', 'cancelled');
            expect(model.clients.alejandro).to.be.deep.equal([]);
        })
    })

    describe('must have a metod getAppointments, to view the appointments of a client', function(){
        beforeEach(() => {
            if (model.addAppointment) {
                model.addAppointment('javier',    {date:'22/10/2020 14:00'});
                model.addAppointment('javier',    {date:'22/10/2020 16:00'});
                model.addAppointment('alejandro', {date:'22/10/2020 11:00'});
                model.addAppointment('alejandro', {date:'22/10/2020 12:00'});
                model.attend('javier',    '22/10/2020 16:00');
                model.expire('alejandro', '22/10/2020 11:00');
                model.cancel('alejandro', '22/10/2020 12:00');
            }
        });

        xit('must be a function', function(){
            expect(model.getAppointments).to.be.a('function');
        })
        xit('must return an a array with the appointments of the client', function(){
            let appointments = model.getAppointments('javier');
            expect(appointments).to.be.deep.equal(
                [{ date: '22/10/2020 14:00', status: 'pending' },
                { date: '22/10/2020 16:00', status: 'attended' }]
            );
        })
        xit('if a status was passed, should only return the appointments with that status', function(){
            let appointmentsPending = model.getAppointments('javier', 'pending');
            let appointmentsAttended = model.getAppointments('javier', 'attended');
            let appointmentsExpired = model.getAppointments('alejandro', 'expired');
            let appointmentsCancelled = model.getAppointments('alejandro', 'cancelled');
            expect(appointmentsPending).to.be.deep.equal([ { date: '22/10/2020 14:00', status: 'pending' } ]);
            expect(appointmentsAttended).to.be.deep.equal([ { date: '22/10/2020 16:00', status: 'attended' } ]);
            expect(appointmentsExpired).to.be.deep.equal([ { date: '22/10/2020 11:00', status: 'expired' } ]);
            expect(appointmentsCancelled).to.be.deep.equal([ { date: '22/10/2020 12:00', status: 'cancelled' } ]);
        })
    })

    describe('must have a metod getClients', function(){
        xit('must be a function', function(){
            expect(model.getClients).to.be.a('function');
        })
        xit('must return an a array with the names of the clients', function(){
            model.addAppointment('javier', {date:'22/10/2020 14:00'});
            model.addAppointment('alejandro', {date:'22/10/2020 12:00'});
            let ret = model.getClients()
            expect(ret instanceof Array).to.be.true;
            expect(ret).to.be.deep.equal(['javier', 'alejandro']);
        })
    })
})

const agent = session(server);
describe('server', () => {
    beforeEach(() => {
        if (model.reset && model.addAppointment) {
            model.reset();
            model.addAppointment('javier', {date:'22/10/2020 14:00'});
            model.addAppointment('javier', {date:'22/10/2020 16:00'});
        }
    });

    describe('GET /api', function(){
        xit('responds with the object clients', () => {
            return agent.get('/api')
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.deep.equal({
                    javier: [
                        { date: '22/10/2020 14:00', status: 'pending' },
                        { date: '22/10/2020 16:00', status: 'pending' }]
                });
            });
        });
    })

    describe('POST /api/Appointments', () => {
        xit('responds with a status 400 (bad request) and a string message, if the client was not passed', ()=>{
            return agent.post('/api/Appointments')
            .send({Appointment: {date:'22/10/2020 11:00'}})
            .expect(400)
            .expect((res) => {
                expect(res.text).to.be.equal('the body must have a client property')
            });
        })
        xit('responds with a status 400 (bad request) and a string message, if the client was not a string', ()=>{
            return agent.post('/api/Appointments')
            .send({client: 5, appointment: {date:'22/10/2020 11:00'}})
            .expect(400)
            .expect((res) => {
                expect(res.text).to.be.equal('client must be a string')
            });
        })
        xit('add a appointment to a client', () => {
            return agent.post('/api/Appointments')
            .send({client: 'alejandro', appointment: {date:'22/10/2020 11:00'}})
            .expect(200)
            .expect(() => {
                expect(model.clients.alejandro).to.be.deep.equal([ { date: '22/10/2020 11:00', status: 'pending' } ])
            });
        });
        xit('responds the appointment after the addition', () => {
            return agent.post('/api/Appointments')
            .send({client: 'alejandro', appointment: {date:'22/10/2020 12:00'}})
            .expect(200)
            .expect((res)=>{
                expect(res.body).to.be.deep.equal({ date: '22/10/2020 12:00', status: 'pending' })
            })
        });
    })

    describe('GET /api/Appointments/:name?date=xxx&option=xxx', () => {
        xit('responds with a status 400 (bad request) and a string message, if the client does not exist', ()=>{
            return agent.get('/api/Appointments/pepe?date=22/10/2020%2014:00&option=attend')
            .expect(400)
            .expect((res) => {
                expect(res.text).to.be.equal('the client does not exist')
            })
        })
        xit('responds with a status 400 (bad request) and a string message, if the client does not have a appointment for this date', ()=>{
            return agent.get('/api/Appointments/javier?date=23/10/2020%2014:00&option=attend')
            .expect(400)
            .expect((res) => {
                expect(res.text).to.be.equal('the client does not have a appointment for that date')
            })
        })
        xit('responds with a status 400 (bad request) and a string message, if the option is not attend, expire or cancel', ()=>{
            return agent.get('/api/Appointments/javier?date=22/10/2020%2014:00&option=wrongOption')
            .expect(400)
            .expect((res) => {
                expect(res.text).to.be.equal('the option must be attend, expire or cancel')
            })
        })
        xit('attend a appointment if the option passed by query is `attend`', ()=>{
            return agent.get('/api/Appointments/javier?date=22/10/2020%2014:00&option=attend')
            .expect(200)
            .expect((res) => {
                expect(model.clients.javier[0])
                .to.be.deep.equal({ date: '22/10/2020 14:00', status: 'attended' })
            })
        })
        xit('expire a appointment if the option passed by query is `expire`', ()=>{
            return agent.get('/api/Appointments/javier?date=22/10/2020%2016:00&option=expire')
            .expect(200)
            .expect((res) => {
                expect(model.clients.javier[1])
                .to.be.deep.equal({ date: '22/10/2020 16:00', status: 'expired' })
            })
        })
        xit('cancel a appointment if the option passed by query is `cancel`', ()=>{
            return agent.get('/api/Appointments/javier?date=22/10/2020%2014:00&option=cancel')
            .expect(200)
            .expect((res) => {
                expect(model.clients.javier[0])
                .to.be.deep.equal({ date: '22/10/2020 14:00', status: 'cancelled' })
            })
        })
        xit('respods the modified appointment', ()=>{
            return agent.get('/api/Appointments/javier?date=22/10/2020%2014:00&option=cancel')
            .expect(200)
            .expect((res) => {
                expect(res.body).to.be.deep.equal({ date: '22/10/2020 14:00', status: 'cancelled' });
            })
        })
    })

    
    describe('GET /api/Appointments/:name/erase', function(){
        xit('responds with a status 400 (bad request) and a string message, if the client does not exist', ()=>{
            return agent.get('/api/Appointments/pepe/erase?date=22/10/2020%2014:00')
            .expect(400)
            .expect((res) => {
                expect(res.text).to.be.equal('the client does not exist')
            })
        })
        xit('erase a appointment', () => {
            return agent.get('/api/Appointments/javier/erase?date=22/10/2020%2014:00')
            .expect(200)
            .expect((res)=>{
                expect(model.clients.javier).to.be.deep.equal([ { date: '22/10/2020 16:00', status: 'pending' } ])
            })
        });
        xit('erase all appointments of a certain status', () => {
            model.expire('javier', '22/10/2020 14:00');
            return agent.get('/api/Appointments/javier/erase?date=expired')
            .expect(200)
            .expect((res)=>{
                expect(model.clients.javier).to.be.deep.equal([ { date: '22/10/2020 16:00', status: 'pending' } ])
            })
        });
        xit('responds the array of erased appointments', () => {
            model.expire('javier', '22/10/2020 14:00');
            return agent.get('/api/Appointments/javier/erase?date=expired')
            .expect(200)
            .expect((res)=>{
                expect(res.body).to.be.deep.equal([ { date: '22/10/2020 14:00', status: 'expired' } ])
            })
        });
    })

    describe('GET /api/Appointments/getAppointments/:name', function(){
        xit('responds with the array of appointments with that status', () => {
            return agent.get('/api/Appointments/getAppointments/javier?status=pending')
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.deep.equal([
                    { date: '22/10/2020 14:00', status: 'pending' },
                    { date: '22/10/2020 16:00', status: 'pending' }
                ])
            });
        });
    })

    describe('GET /api/Appointments/clients', function(){
        xit('responds with an array of the list of clients', () => {
            return agent.get('/api/Appointments/clients')
            .expect(200)
            .then((res) => {
                expect(res.body).to.be.deep.equal([ 'javier' ])
            });
        });
    })

})