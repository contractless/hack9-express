const { Client } = require('pg');
require('dotenv').config();


const connectionString = process.env.CONN_STR;

async function getItemByPrefixAndDateFromPostgres(prefix, date) {
    // const client = await createClient();
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

    let res;

    try {
        const queryResult = await client.query(query);

        if (!resultHasData(queryResult)) {
            client.end();
            return null;
        }
        
        const { prefix, price, initial, increment, start_date } = queryResult.rows[0];
        client.end();

        return new CallingCode(prefix, price, initial, increment, start_date);
    } catch (error) {
        console.log(error);
        client.end();
        return null;
    }
    
}

const resultHasData = queryResult => !!queryResult.rowCount;

async function createClient() {
    const client = new Client({
        connectionString: connectionString
    });

    await client.connect();

    return client;
}

function CallingCode(prefix, price, initial, increment, start_date){
    this.prefix = prefix;
    this.price = price;
    this.initial = initial;
    this.increment = increment;
    this.start_date = start_date;
}


module.exports = {
    getItemByPrefixAndDateFromPostgres
}