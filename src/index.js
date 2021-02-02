var csvToJson = require('convert-csv-to-json');
var reducer = function (accumulator, currentValue) { return accumulator + currentValue; };
// Reading listings from a csv file
var listings_csv = './data/listings.csv';
var listings_json = csvToJson.formatValueByType().fieldDelimiter(',').getJsonFromCsv(listings_csv);
var listings = JSON.parse(JSON.stringify(listings_json).replace(/\\"/g, ""));
// Reading contacts from a csv file
var contacts_csv = './data/contacts.csv';
var contacts_json = csvToJson.formatValueByType().fieldDelimiter(',').getJsonFromCsv(contacts_csv);
var contacts = JSON.parse(JSON.stringify(contacts_json).replace(/\\"/g, ""));
// preprocessing contacts to extract count
// Distinct set of ids
var ids = Array.from(new Set(contacts.map(function (object) { return object.listing_id; })));
var listings_contact = [];
var _loop_1 = function (listing_id) {
    // Get the content objects given a listing id
    var listings_contacts = contacts.filter(function (object) { return object.listing_id === listing_id; });
    // Get the number of contacts per listing id
    var id_count = listings_contacts.length;
    // pushing results to a result array
    listings_contact.push({ id: listing_id, contacted: id_count });
};
for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
    var listing_id = ids_1[_i];
    _loop_1(listing_id);
}
// join the two listings
listings = listings.map(function (item, i) { return Object.assign({}, item, listings_contact[i]); });
listings.sort(function (a, b) {
    return b.contacted - a.contacted;
});
// prrocess datatime information
var listing_datetime = [];
for (var _a = 0, contacts_1 = contacts; _a < contacts_1.length; _a++) {
    var contact = contacts_1[_a];
    var date = new Date(contact.contact_date);
    // Process date information
    listing_datetime.push({ id: contact.listing_id, year: date.getFullYear(), month: date.getMonth() });
}
// R1: Average listing price per seller type
var seller_types = Array.from(new Set(listings.map(function (object) { return object.seller_type; })));
var average_listing_result = [];
var _loop_2 = function (type) {
    // Filtering listings by seller type
    var prices_array = listings.filter(function (object) { return object.seller_type == type; }).map(function (object) { return object.price; });
    // Computing average up to two decimal places
    var average = Number((prices_array.reduce(reducer) / prices_array.length).toFixed(2));
    // Appending row to the average listing array
    average_listing_result.push({ seller_type: type, average: average });
};
for (var _b = 0, seller_types_1 = seller_types; _b < seller_types_1.length; _b++) {
    var type = seller_types_1[_b];
    _loop_2(type);
}
console.log(average_listing_result);
// R2: Percentual distribution per car manufacturer
var car_manufacturers = Array.from(new Set(listings.map(function (x) { return x.make; })));
var percentual_distribution = [];
var _loop_3 = function (manufacturer) {
    // Filtering listings by make
    var manufacturer_occurence = listings.filter(function (object) { return object.make === manufacturer; }).length;
    // Computing percentage up to two decimal places
    var percentage = Number((manufacturer_occurence / listings.length).toFixed(2));
    // appending row to percentual_distribution array
    percentual_distribution.push({ make: manufacturer, percent: percentage });
};
for (var _c = 0, car_manufacturers_1 = car_manufacturers; _c < car_manufacturers_1.length; _c++) {
    var manufacturer = car_manufacturers_1[_c];
    _loop_3(manufacturer);
}
// Sorting the array in desc order
percentual_distribution.sort(function (a, b) {
    return b.percent - a.percent;
});
console.log(percentual_distribution);
// R3: Average price of the 30% most contacted listings
var most_contacted_indices = parseInt((listings.length * 0.3).toFixed(2));
var most_contacted_listings = [];
for (var i = 0; i <= most_contacted_indices; i++) {
    most_contacted_listings.push(listings[i]);
}
var listings_prices = most_contacted_listings.map(function (object) { return object.price; });
var avg_price = Number((listings_prices.reduce(reducer) / most_contacted_listings.length).toFixed(2));
console.log({ average_price: avg_price });
// R4: The Top 5 most contacted listings per Month
var years = Array.from(new Set(listing_datetime.map(function (object) { return object.year; })));
var months = Array.from(new Set(listing_datetime.map(function (object) { return object.month; })));
var _loop_4 = function (year) {
    var _loop_5 = function (month) {
        // get all postings per month per year
        var monthly_listings_ids = listing_datetime.filter(function (object) { return object.year === year && object.month === month; }).map(function (object) { return object.id; });
        // Counting duplicates
        var monthly_listings = [];
        // Declaring blank object to compute counts
        var duplicate_count = {};
        monthly_listings_ids.forEach(function (x) { duplicate_count[x] = (duplicate_count[x] || 0) + 1; });
        // Appending results to monthly_listings
        for (var _i = 0, _a = Object.entries(duplicate_count); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            monthly_listings.push({ id: Number(key), monthly_count: Number(value) });
        }
        // Sort and keep top 5 listings per month
        monthly_listings = monthly_listings.sort(function (a, b) { return b.monthly_count - a.monthly_count; }).slice(0, 5);
        console.log(monthly_listings);
    };
    for (var _i = 0, months_1 = months; _i < months_1.length; _i++) {
        var month = months_1[_i];
        _loop_5(month);
    }
};
for (var _d = 0, years_1 = years; _d < years_1.length; _d++) {
    var year = years_1[_d];
    _loop_4(year);
}
