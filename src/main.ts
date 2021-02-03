import index = require('./index');


// Reading listings from a csv file
let listings_csv : string = './data/listings.csv';
let listings : index.Listing[] = index.parse_listing_CSV(listings_csv);
// Reading contacts from a csv file
let contacts_csv : string = './data/contacts.csv';
let contacts : index.Contact[] = index.parse_contacts_CSV(contacts_csv);

// Preprocess the CSV data
listings = index.preprocess_listings(listings, contacts);
let listings_datetime : index.ContactDate[] = index.preprocess_contact_datetime(contacts);

// Req_1: Average Listing Selling Price per Seller Type
console.log('\nRequirement 1: average Listing Selling Price per Seller Type:');
console.log(JSON.stringify(index.average_price_seller(listings), null, 2));

// Req_2: Percentual Distribution of available cars by Make
console.log('\nRequirement 2: Percentual Distribution of available cars by Make:');
console.log(JSON.stringify(index.manufacturer_percentage(listings), null, 2));

// Req_3: Average price of the 30% most contacted listings
console.log('\nRequirement 3: Average price of the 30% most contacted listings:');
console.log(JSON.stringify(index.average_price(listings), null, 2));

// Req_4: The Top 5 most contacted listings per Month
console.log('\nRequirement 4: The Top 5 most contacted listings per Month:');
console.log(JSON.stringify(index.monthly_contacts(listings, listings_datetime), null, 2));
