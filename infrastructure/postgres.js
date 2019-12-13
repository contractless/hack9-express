const { Client } = require('pg');
require('dotenv').config();


const connectionString = process.env.CONN_STR;

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

        return new CallingCode(prefix, price, initial, increment, start_date);
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
    getItemByPrefixAndDateFromPostgres,
    storeCallRecordToPostgres
}