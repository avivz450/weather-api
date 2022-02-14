
import fetch from 'node-fetch';
class GenericFunctions {
    getRate = async(source_currency:string, destination_currency:string)=>{
      const base_url = `http://api.exchangeratesapi.io/latest`;
      const url = `${base_url}?base=${source_currency}&symbols=${destination_currency}&access_key=78ca52413fb26cdc4a99ec638fa21db7`;
      const response = await (await fetch(url)).json();
      console.log(response);
      return (response as any).rates[destination_currency];
    }
}

const genericFunctions = new GenericFunctions();
export default genericFunctions;
