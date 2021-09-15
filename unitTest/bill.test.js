const request = require('supertest')

const server = require('../server')
const knex = require('../utils/dbConnection')
const productModel = require('../models/product.model')
const billModel = require('../models/bill.model')

describe("POST /add", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
		const allProducts = await productModel.findAll()

        const billListRespone = await request(server).post('/api/bill/add')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                accAddress: '123 Nguyễn Văn Cừ, Phường 10, Quận 5, TPHCM',
                                                priceShip: "1000",
                                                listProduct: [
                                                    {
                                                        prodId: allProducts[0].prod_id,
                                                        prodQuantity: 2
                                                    }
                                                ]
                                            })

        expect(billListRespone.statusCode).toBe(200)
    })
})

describe("POST /details", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const result = await billModel.findByAccId(data.user.accId)
        
        const billListRespone = await request(server).post('/api/bill/details')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                billId: result[0].bill_id
                                            })

        expect(billListRespone.statusCode).toBe(200)
    })
})

describe("POST /list", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const billListRespone = await request(server).post('/api/bill/list')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                page: 1,
                                                limit: 2
                                            })

        expect(billListRespone.statusCode).toBe(200)
    })
})

describe("POST /list/filter", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const billListRespone = await request(server).post('/api/bill/list/shipping')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                page: 1,
                                                limit: 2
                                            })

        expect(billListRespone.statusCode).toBe(200)
    })
})

describe("POST /cancel-bill", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

		const allBills = await billModel.findAll()

        const billListRespone = await request(server).post('/api/bill/cancel-bill')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                billId: allBills[0].bill_id
                                            })

        expect(billListRespone.statusCode).toBe(200)
    })
})

describe("POST /update-status", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

		const allBills = await billModel.findAll()

        const billListRespone = await request(server).post('/api/bill/update-status')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                billId: allBills[0].bill_id,
                                                status: "shipping"
                                            })

        expect(billListRespone.statusCode).toBe(200)
    })
})
