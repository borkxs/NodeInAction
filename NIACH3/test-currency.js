var Currency = require('./currency')

console.log(Currency) // => the exported constructor function

var canadianDollar = 0.91

var currency = new Currency(canadianDollar)
console.log('50 Canadian dollars equals this amount of US dollars:')
console.log(currency.canadianToUS(50))

var currency2 = new Currency(canadianDollar)
console.log('30 US dollars equals this amount of Canadian dollars:')
console.log(currency2.USToCanadian(30))



///////

var BrokenCurrency = require('./currency_broken')

console.log(BrokenCurrency) // => empty object

try { 
    var currency = new BrokenCurrency(canadianDollar)
} catch ( e ) {
    console.log( 'this is an empty exports objct )
}