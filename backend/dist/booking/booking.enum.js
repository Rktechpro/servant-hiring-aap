export var bookingStatus;
(function (bookingStatus) {
    bookingStatus["PENDING"] = "PENDING";
    bookingStatus["ACCEPTED"] = "ACCEPTED";
    bookingStatus["REJECTED"] = "REJECTED";
    bookingStatus["CANCELLED"] = "CANCELLED";
    bookingStatus["COMPLETED"] = "COMPLETED";
})(bookingStatus || (bookingStatus = {}));
