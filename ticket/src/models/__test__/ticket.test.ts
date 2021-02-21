import Ticket from '../ticket'

test('implement optimistic concurrency control', async(done) => {
    // create a ticket
    const ticket = await Ticket.build({ title: 'movie', price: 20, userId: 'randomUserId' }).save()

    // get 2 instance of a ticket
    const instanceOne = await Ticket.findById(ticket.id)
    const instaceTwo = await Ticket.findById(ticket.id)

    // update 2 ticket
    // khi update thì version của instance chưa được tăng lên
    instanceOne!.set({ price: 40 })
    instaceTwo!.set({ price: 40 })
    // console.log('instanceOne', instanceOne)
    // console.log('instaceTwo', instaceTwo)

    // save ticket 1 -> success
    // khi save mới thực hiện tăng version và kiểm tra version hợp lệ hay không
    await instanceOne!.save()

    // save ticket 2 -> error
    try {
        await instaceTwo!.save()
    } catch (error) {
        return done()
    }

    throw new Error('Should not reach this point')
})

test('increment the version number on multiple saves', async() => {
    const ticket = await Ticket.build({ title: 'movie', price: 20, userId: 'randomUserId' }).save()
    expect(ticket.version).toEqual(0)
    
    await ticket.save()
    expect(ticket.version).toEqual(1)

    await ticket.save()
    expect(ticket.version).toEqual(2)
})
