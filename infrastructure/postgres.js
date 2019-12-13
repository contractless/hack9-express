const { Client } = require('pg');
require('dotenv').config();


const connectionString = process.env.CONN_STR;

async function getItemByPrefixAndDateFromPostgres(prefix, date) {
    // const client = await createClient();
    console.log(connectionString);
    const client = new Client({
        connectionString: connectionString
    });
    await client.connect();

    const query = `
    select similarity(prefix, '${prefix}') as sim, length(prefix) as pl, prefix, price, increment, initial, start_date
    from public.calling_codes
    where start_date <= '${date}'
    order by sim desc, pl desc
    limit 1
    `;
    console.log(query);

    


    let res;

    try {
        res = await client.query(query);
        const { prefix, price, initial, increment, start_date } = res.rows[0];

        const cc = new CallingCode(prefix, price, initial, increment, start_date);
        console.log(cc);
        client.end();
        return cc;
    } catch (error) {
        console.log(error);
        client.end();
        return null;
    }
    
}

async function createClient() {
    const client = new Client({
        connectionString: connectionString
    });
    return await client.connect();
}


class CallingCode {
    constructor(prefix, price, initial, increment, start_date) {
        this.prefix = prefix;
        this.price = price;
        this.initial = initial;
        this.increment = increment;
        this.start_date = start_date;
    }
}


module.exports = {
    getItemByPrefixAndDateFromPostgres
}