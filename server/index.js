const { client, createTables, createCustomer, createRestaurant, createReservation,
    fetchCustomers, fetchRestaurants, fetchReservations,
    deleteReservation } = require('./db');
const express = require('express');
const app = express();

app.use(express.json());

app.get("/api/customers", async (req, res, next) => {
    try {
        res.send(await fetchCustomers());
    } catch (err) {
        next(err);
    }
})
app.get("/api/restaurants", async (req, res, next) => {
    try {
        res.send(await fetchRestaurants());
    } catch (err) {
        next(err);
    }
})
app.get("/api/reservations", async (req, res, next) => {
    try {
        res.send(await fetchReservations());
    } catch (err) {
        next(err);
    }
})
app.post("/api/customers/:id/reservations", async (req, res, next) => {
    try {
        res.status(201).send(await createReservation(req.body));
    } catch (err) {
        next(err);
    }
})
app.delete("/api/customers/:customer_id/reservations/:id", async (req, res, next) => {
    try {
        await deleteReservation(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
})

async function init() {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [moe, lucy, ethyl, Olive_Garden, Applebees, TGIF, Red_Robin] = await Promise.all([
        createCustomer('moe'),
        createCustomer('lucy'),
        createCustomer('ethyl'),
        createRestaurant('Applebees'),
        createRestaurant('TGIF'),
        createRestaurant('Olive Garden'),
        createRestaurant('Red Robin')
    ]);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
    await Promise.all([
      createReservation({ customer_id: moe.id, restaurant_id: Applebees.id, party_count: 4, date: '04/01/2024'}),
      createReservation({ customer_id: moe.id, restaurant_id: Applebees.id, party_count: 4, date: '04/15/2024'}),
      createReservation({ customer_id: lucy.id, restaurant_id: TGIF.id, party_count: 4, date: '07/04/2024'}),
      createReservation({ customer_id: lucy.id, restaurant_id: Olive_Garden.id, party_count: 4, date: '10/31/2024'}),
    ]);
    console.log(await fetchReservations());
    const port = process.env.PORT || 3000
    app.listen(port), () => console.log(`listening on port ${port}`)
}

init()