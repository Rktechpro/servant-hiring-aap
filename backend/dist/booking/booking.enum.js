"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingStatus = void 0;
var bookingStatus;
(function (bookingStatus) {
    bookingStatus["PENDING"] = "PENDING";
    bookingStatus["ACCEPTED"] = "ACCEPTED";
    bookingStatus["REJECTED"] = "REJECTED";
    bookingStatus["CANCELLED"] = "CANCELLED";
    bookingStatus["COMPLETED"] = "COMPLETED";
})(bookingStatus || (exports.bookingStatus = bookingStatus = {}));
