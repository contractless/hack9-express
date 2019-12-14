const { Client } = require('pg');
require('dotenv').config();


const connectionString = process.env.CONN_STR;

async function truncateTables() {
    const client = await createClient();
    const query = `TRUNCATE public.invoices, public.call_history;`
    try {
        await client.query(query);
        return true;
    } catch (e) {
        console.log(e)
        return null;
    }
} 

async function getItemByPrefixAndDateFromPostgres(prefixArg, date) {
    const client = await createClient();

    const query = `
        select similarity(prefix, '${prefixArg}') as sim, length(prefix) as pl, prefix, price, increment, initial, start_date
        from public.calling_codes
        where start_date <= '${date}'
        order by sim desc, pl desc
        limit 1`;

    try {
        const queryResult = await client.query(query);
        client.end();

        if (!resultHasData(queryResult)) {
            return null;
        }
        
        const { prefix, price, initial, increment, start_date } = queryResult.rows[0];

        if(prefixArg.indexOf(prefix) == -1){
            return null;
        }

        return { prefix, price, initial, increment, start_date };
    } catch (error) {
        console.log(error);
        client.end();
        return null;
    }
    
}

async function storeCallRecordToPostgres(calling, called, start, duration, rounded, price, cost) {
    const client = await createClient();
    const query = `INSERT INTO public.call_history (calling, called, start, duration, rounded, price, cost) VALUES ('${calling}', '${called}', '${start}', '${duration}', '${rounded}', '${price}', '${cost}');`;

    try{
        const queryResult = await client.query(query);
        if(queryResult.rowCount) {
            client.end();
            return true;
        }
    } catch(e) {
        client.end();
        console.log(e)
    }
    
    return null;
}

const resultHasData = queryResult => !!queryResult.rowCount;

const getListingCallingFromPostgres = async (calling, from, to) => {
    const client = await createClient();

    const query = `
        select calling, called, start, duration, rounded, price, cost
        from public.call_history
        where calling = ${calling} and start between '${from}' and '${to}'`;

    try {
        const queryResult = await client.query(query);
        client.end();

        if (!resultHasData(queryResult)) {
            return null;
        }

        const calls = [];

        queryResult.rows.forEach(({ calling, called, start, duration, rounded, price, cost }) => {
            calls.push({ calling, called, start, duration, rounded, price, cost });
        });

        return {
            calling,
            calls
        };
    } catch (error) {
        console.log(error);
        client.end();
        return null;
    }
}

async function generateInvoiceQuery(start, end, callback) {
    const client = await createClient();

    const query = `
        INSERT INTO invoices(calling, sum, count, start_date, end_date) 
        SELECT calc.*, '${start}' as start_date, '${end}' as end_date
        FROM
        (SELECT calling, SUM(cost) as sum, COUNT(*) as count 
        FROM call_history
        WHERE start BETWEEN '${start}' AND '${end}'
        GROUP BY calling) calc
    `;

    const queryPromise = client.query(query);
    return [client, queryPromise];
}

async function getInvoiceFromDb(invoiceId) {
    const client = await createClient();

    const query = `
        SELECT id, calling, start_date, end_date, sum, count
        FROM invoices
        WHERE id = '${invoiceId}'
    `;

    const queryResult = await client.query(query);
    client.end();

    if (!resultHasData(queryResult)) {
        return null;
    }

    const { id, calling, start_date, end_date, sum, count } = queryResult.rows[0];
    return { id, calling, start_date, end_date, sum, count };
    
}

async function getInvoicesFromDb(start, end) {
    const client = await createClient();
    const query = `
        SELECT *
        FROM invoices
        WHERE start_date = '${start}' AND end_date = '${end}'
    `;

    const queryResult = await client.query(query);
    client.end();

    const invoices = [];

    queryResult.rows.forEach(({ id, calling, start_date, end_date, sum, count }) => {
        invoices.push({ id, calling, start: start_date, end: end_date, sum, count });
    });

    return invoices;
}

async function createClient() {
    const client = new Client({
        connectionString: connectionString
    });

    await client.connect();

    return client;
}

module.exports = {
    getInvoiceFromDb,
    getInvoicesFromDb,
    generateInvoiceQuery,
    getItemByPrefixAndDateFromPostgres,
    getListingCallingFromPostgres,
    storeCallRecordToPostgres
}