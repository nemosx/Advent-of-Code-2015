/**
 * Created by Michael Root on 12/3/2015.
 */
function House(address) {
    this.address = address.slice(0);
    this.presents = 0;
}

House.prototype.getAddress = function () {
    return this.address;
};

House.prototype.deliverPresent = function () {
    this.presents++;
    return this;
};

module.exports = House;
