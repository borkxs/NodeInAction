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

Annotation in the book says:
"incorrect: node doesn't allow exports to be overwritten"

My suspicion is it's just setup as if the 
following is executed before your code:

var module = { exports: { } },
    exports = module.exports

*/