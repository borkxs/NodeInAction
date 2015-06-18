var Currency = function(canadianDollar) {
    this.canadianDollar = canadianDollar;
}

Currency.prototype.roundTwoDecimals = function (amount) {
    return Math.round(amount * 100) / 100
}
Currency.prototype.canadianToUS = function(canadian) {
    return this.roundTwoDecimals(canadian * this.canadianDollar)
}
Currency.prototype.USToCanadian = function(us) {
    return this.roundTwoDecimals(us / this.canadianDollar)
}

exports = Currency

/*

incorrect: node doesn't allow exports to be overwritten

it's like there's a 

var module = { exports: { } },
    exports = module.exports

*/