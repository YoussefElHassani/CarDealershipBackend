// Dependencies
var index = require("../src/index")
  , Assert = require("assert")
  , Ul = require("ul")
  ;

describe('# Testing: index.parse_listing_CSV()', function() {

    it("should support a valid CSV file ", function (cb) {
        let expected_result = [{"id":1000,"make":"Audi","price":49717,"mileage":6500,"seller_type":"private"},{"id":1001,"make":"Mazda","price":22031,"mileage":7000,"seller_type":"private"},{"id":1002,"make":"BWM","price":17742,"mileage":6000,"seller_type":"dealer"},{"id":1003,"make":"Toyota","price":11768,"mileage":0,"seller_type":"dealer"},{"id":1004,"make":"Mazda","price":25219,"mileage":3000,"seller_type":"other"},{"id":1005,"make":"Audi","price":43667,"mileage":500,"seller_type":"private"},{"id":1006,"make":"Renault","price":47446,"mileage":7500,"seller_type":"other"},{"id":1007,"make":"VW","price":25633,"mileage":8000,"seller_type":"private"},{"id":1008,"make":"VW","price":26350,"mileage":500,"seller_type":"private"},{"id":1009,"make":"Audi","price":40070,"mileage":2500,"seller_type":"dealer"}]

        Assert.deepStrictEqual(index.parse_listing_CSV('./test/listing_test.csv'),expected_result);
        cb();
    });

})


describe('# Testing: index.parse_contacts_CSV()', function() {

    it("should support a valid CSV file ", function (cb) {
        let expected_result = [{"listing_id":1000,"contact_date":1592498493000},{"listing_id":1001,"contact_date":1582474057000},{"listing_id":1002,"contact_date":1579365755000},{"listing_id":1003,"contact_date":1585159440000},{"listing_id":1004,"contact_date":1583574198000},{"listing_id":1005,"contact_date":1586674958000},{"listing_id":1006,"contact_date":1588390278000},{"listing_id":1007,"contact_date":1584070396000},{"listing_id":1008,"contact_date":1588508838000},{"listing_id":1009,"contact_date":1581408419000},{"listing_id":1000,"contact_date":1580795020000},{"listing_id":1000,"contact_date":1591761952000},{"listing_id":1001,"contact_date":1582158776000},{"listing_id":1002,"contact_date":1585379517000},{"listing_id":1003,"contact_date":1592850063000},{"listing_id":1004,"contact_date":1589609951000},{"listing_id":1005,"contact_date":1588030368000},{"listing_id":1006,"contact_date":1584849954000},{"listing_id":1007,"contact_date":1580893831000},{"listing_id":1008,"contact_date":1582628564000},{"listing_id":1009,"contact_date":1589944141000},{"listing_id":1000,"contact_date":1590553239000},{"listing_id":1002,"contact_date":1587221099000},{"listing_id":1003,"contact_date":1591273824000},{"listing_id":1004,"contact_date":1581660779000},{"listing_id":1000,"contact_date":1587517756000},{"listing_id":1007,"contact_date":1581586621000},{"listing_id":1008,"contact_date":1590670736000},{"listing_id":1009,"contact_date":1587129979000},{"listing_id":1009,"contact_date":1579857774000},{"listing_id":1000,"contact_date":1591497948000},{"listing_id":1000,"contact_date":1582570437000},{"listing_id":1000,"contact_date":1581787627000}]
        Assert.deepStrictEqual(index.parse_contacts_CSV('./test/contact_test.csv'),expected_result);
        cb();
    });

})

describe('# Testing: index.preprocess_listings()', function() {

    it("should process objects parsed from valid csv files ", function (cb) {
        let expected_result = [{"id":1000,"make":"Audi","price":49717,"mileage":6500,"seller_type":"private","contacted":8},{"id":1009,"make":"Audi","price":40070,"mileage":2500,"seller_type":"dealer","contacted":4},{"id":1002,"make":"BWM","price":17742,"mileage":6000,"seller_type":"dealer","contacted":3},{"id":1003,"make":"Toyota","price":11768,"mileage":0,"seller_type":"dealer","contacted":3},{"id":1004,"make":"Mazda","price":25219,"mileage":3000,"seller_type":"other","contacted":3},{"id":1007,"make":"VW","price":25633,"mileage":8000,"seller_type":"private","contacted":3},{"id":1008,"make":"VW","price":26350,"mileage":500,"seller_type":"private","contacted":3},{"id":1001,"make":"Mazda","price":22031,"mileage":7000,"seller_type":"private","contacted":2},{"id":1005,"make":"Audi","price":43667,"mileage":500,"seller_type":"private","contacted":2},{"id":1006,"make":"Renault","price":47446,"mileage":7500,"seller_type":"other","contacted":2}]
        // Reading listings from a csv file
        let listings_csv = './test/listing_test.csv';
        let listings = index.parse_listing_CSV(listings_csv);
        // Reading contacts from a csv file
        let contacts_csv = './test/contact_test.csv';
        let contacts = index.parse_contacts_CSV(contacts_csv);

        Assert.deepStrictEqual(index.preprocess_listings(listings, contacts),expected_result);
        cb();
    });

})

describe('# Testing: index.preprocess_contact_datetime()', function() {

    it("should process objects parsed from a valid  contacts csv file ", function (cb) {
        let expected_result = [{"id":1000,"year":2020,"month":5},{"id":1001,"year":2020,"month":1},{"id":1002,"year":2020,"month":0},{"id":1003,"year":2020,"month":2},{"id":1004,"year":2020,"month":2},{"id":1005,"year":2020,"month":3},{"id":1006,"year":2020,"month":4},{"id":1007,"year":2020,"month":2},{"id":1008,"year":2020,"month":4},{"id":1009,"year":2020,"month":1},{"id":1000,"year":2020,"month":1},{"id":1000,"year":2020,"month":5},{"id":1001,"year":2020,"month":1},{"id":1002,"year":2020,"month":2},{"id":1003,"year":2020,"month":5},{"id":1004,"year":2020,"month":4},{"id":1005,"year":2020,"month":3},{"id":1006,"year":2020,"month":2},{"id":1007,"year":2020,"month":1},{"id":1008,"year":2020,"month":1},{"id":1009,"year":2020,"month":4},{"id":1000,"year":2020,"month":4},{"id":1002,"year":2020,"month":3},{"id":1003,"year":2020,"month":5},{"id":1004,"year":2020,"month":1},{"id":1000,"year":2020,"month":3},{"id":1007,"year":2020,"month":1},{"id":1008,"year":2020,"month":4},{"id":1009,"year":2020,"month":3},{"id":1009,"year":2020,"month":0},{"id":1000,"year":2020,"month":5},{"id":1000,"year":2020,"month":1},{"id":1000,"year":2020,"month":1}]
        // Reading contacts from a csv file
        let contacts_csv = './test/contact_test.csv';
        let contacts = index.parse_contacts_CSV(contacts_csv);

        Assert.deepStrictEqual(index.preprocess_contact_datetime(contacts),expected_result);
        cb();
    });

})

describe('# Testing: index.average_price_seller()', function() {

    it("should return average prices per sellers given correct objects ", function (cb) {
        let expected_result = [{"seller_type":"private","average":33479.6},{"seller_type":"dealer","average":23193.33},{"seller_type":"other","average":36332.5}]
        // Reading listings from a csv file
        let listings_csv = './test/listing_test.csv';
        let listings = index.parse_listing_CSV(listings_csv);
        // Reading contacts from a csv file
        let contacts_csv = './test/contact_test.csv';
        let contacts = index.parse_contacts_CSV(contacts_csv);
        listings = index.preprocess_listings(listings, contacts);

        Assert.deepStrictEqual(index.average_price_seller(listings),expected_result);
        cb();
    });

})

describe('# Testing: index.manufacturer_percentage()', function() {

    it("should return percentual distribution per manufacturer given correct objects ", function (cb) {
        let expected_result = [{"make":"Audi","percent":0.3},{"make":"Mazda","percent":0.2},{"make":"VW","percent":0.2},{"make":"BWM","percent":0.1},{"make":"Toyota","percent":0.1},{"make":"Renault","percent":0.1}]
        // Reading listings from a csv file
        let listings_csv = './test/listing_test.csv';
        let listings = index.parse_listing_CSV(listings_csv);
        // Reading contacts from a csv file
        let contacts_csv = './test/contact_test.csv';
        let contacts = index.parse_contacts_CSV(contacts_csv);
        listings = index.preprocess_listings(listings, contacts);

        Assert.deepStrictEqual(index.manufacturer_percentage(listings),expected_result);
        cb();
    });

})

describe('# Testing: index.average_price()', function() {

    it("should return the average price of the top 30% most contacted listings given correct objects ", function (cb) {
        let expected_result = {"average_price":29824.25}
        let listings_csv = './test/listing_test.csv';
        let listings = index.parse_listing_CSV(listings_csv);
        // Reading contacts from a csv file
        let contacts_csv = './test/contact_test.csv';
        let contacts = index.parse_contacts_CSV(contacts_csv);
        listings = index.preprocess_listings(listings, contacts);

        Assert.deepStrictEqual(index.average_price(listings),expected_result);
        cb();
    });

})

describe('# Testing: index.monthly_contacts()', function() {

    it("should return the top 5 most contacted listings per month given correct objects ", function (cb) {
        let expected_result = [{"year":2020,"month":1,"top_five":[{"id":1002,"make":"BWM","price":17742,"mileage":6000,"seller_type":"dealer","contacted":1},{"id":1009,"make":"Audi","price":40070,"mileage":2500,"seller_type":"dealer","contacted":1}]},{"year":2020,"month":2,"top_five":[{"id":1000,"make":"Audi","price":49717,"mileage":6500,"seller_type":"private","contacted":3},{"id":1001,"make":"Mazda","price":22031,"mileage":7000,"seller_type":"private","contacted":2},{"id":1007,"make":"VW","price":25633,"mileage":8000,"seller_type":"private","contacted":2},{"id":1004,"make":"Mazda","price":25219,"mileage":3000,"seller_type":"other","contacted":1},{"id":1008,"make":"VW","price":26350,"mileage":500,"seller_type":"private","contacted":1}]},{"year":2020,"month":3,"top_five":[{"id":1002,"make":"BWM","price":17742,"mileage":6000,"seller_type":"dealer","contacted":1},{"id":1003,"make":"Toyota","price":11768,"mileage":0,"seller_type":"dealer","contacted":1},{"id":1004,"make":"Mazda","price":25219,"mileage":3000,"seller_type":"other","contacted":1},{"id":1006,"make":"Renault","price":47446,"mileage":7500,"seller_type":"other","contacted":1},{"id":1007,"make":"VW","price":25633,"mileage":8000,"seller_type":"private","contacted":1}]},{"year":2020,"month":4,"top_five":[{"id":1005,"make":"Audi","price":43667,"mileage":500,"seller_type":"private","contacted":2},{"id":1000,"make":"Audi","price":49717,"mileage":6500,"seller_type":"private","contacted":1},{"id":1002,"make":"BWM","price":17742,"mileage":6000,"seller_type":"dealer","contacted":1},{"id":1009,"make":"Audi","price":40070,"mileage":2500,"seller_type":"dealer","contacted":1}]},{"year":2020,"month":5,"top_five":[{"id":1008,"make":"VW","price":26350,"mileage":500,"seller_type":"private","contacted":2},{"id":1000,"make":"Audi","price":49717,"mileage":6500,"seller_type":"private","contacted":1},{"id":1004,"make":"Mazda","price":25219,"mileage":3000,"seller_type":"other","contacted":1},{"id":1006,"make":"Renault","price":47446,"mileage":7500,"seller_type":"other","contacted":1},{"id":1009,"make":"Audi","price":40070,"mileage":2500,"seller_type":"dealer","contacted":1}]},{"year":2020,"month":6,"top_five":[{"id":1000,"make":"Audi","price":49717,"mileage":6500,"seller_type":"private","contacted":3},{"id":1003,"make":"Toyota","price":11768,"mileage":0,"seller_type":"dealer","contacted":2}]}]
        let listings_csv = './test/listing_test.csv';
        let listings = index.parse_listing_CSV(listings_csv);
        // Reading contacts from a csv file
        let contacts_csv = './test/contact_test.csv';
        let contacts = index.parse_contacts_CSV(contacts_csv);
        listings = index.preprocess_listings(listings, contacts);
        let listings_datetime = index.preprocess_contact_datetime(contacts);

        Assert.deepStrictEqual(index.monthly_contacts(listings, listings_datetime),expected_result);
        cb();
    });

})


