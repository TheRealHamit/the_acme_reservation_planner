const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_db');
const uuid = require('uuid');


async function createTables() {
    const SQL = `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS restaurant;

    CREATE TABLE customers(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );

    CREATE TABLE restaurant(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );

    CREATE TABLE reservations(
        id UUID PRIMARY KEY,
        customer_id UUID REFERENCES customers(id) NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
        party_count INTEGER NOT NULL,
        date DATE NOT NULL
    );
    `;
    await client.query(SQL)
}

async function createCustomer(name) {
    const SQL = `
    INSERT INTO customers(id, name) VALUES($1, $2)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
}

async function createRestaurant(name) {
    const SQL = `
    INSERT INTO restaurant(id, name) VALUES($1, $2)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
}

async function createReservation({ date, customer_id, restaurant_id, party_count }) {
    const SQL = `
    INSERT INTO reservations(id, customer_id, restaurant_id, party_count, date) VALUES($1, $2, $3, $4, $5)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), customer_id, restaurant_id, party_count, date]);
    return response.rows[0];
}

async function fetchCustomers() {
    const SQL = `
    SELECT * FROM customers;
    `;
    const response = await client.query(SQL);
    return response.rows;
}

async function fetchRestaurants() {
    const SQL = `
    SELECT * FROM restaurant;
    `;
    const response = await client.query(SQL);
    return response.rows;
}

async function fetchReservations() {
    const SQL = `
    SELECT * FROM reservations;
    `;
    const response = await client.query(SQL);
    return response.rows;
}

async function deleteReservation(id) {
    const SQL = `
    DELETE FROM reservations
    WHERE id = $1
    `;
    const response = await client.query(SQL, [id]);
    return response.rows;
}

module.exports = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    createReservation,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    deleteReservation
};

