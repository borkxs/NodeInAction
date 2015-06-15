var Currency = require('./currency')
var canadianDollar = 0.91

var currency = new Currency(canadianDollar)
console.log('50 Canadian dollars equals this amount of US dollars:')
console.log(currency.canadianToUS(50))

var currency2 = new Currency(canadianDollar)
console.log('30 US dollars equals this amount of Canadian dollars:')
console.log(currency2.USToCanadian(30))