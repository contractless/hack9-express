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
        where start_date <= '${date}' and '${prefixArg}' like concat(prefix, '%')
        order by sim desc, pl desc, start_date desc
        limit 1`;


        if(prefixArg == "54" || prefixArg == 54){
            console.log("query", query);
          }

    try {
        const queryResult = await client.query(query);
        client.end();

        if (!resultHasData(queryResult)) {
            return null;
        }

        if(prefixArg == "54" || prefixArg == 54){
            console.log("queryResult", queryResult);
          }
        
        const { prefix, price, initial, increment, start_date } = queryResult.rows[0];

        if(prefixArg.indexOf(prefix) == 0){
            if(prefixArg == "54" || prefixArg == 54){
                console.log("tu sam");
              }

            return { prefix, price, initial, increment, start_date };
        }

        return null;
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

async function createClient() {
    const client = new Client({
        connectionString: connectionString
    });

    await client.connect();

    return client;
}

module.exports = {
    getItemByPrefixAndDateFromPostgres,
    getListingCallingFromPostgres,
    storeCallRecordToPostgres
}