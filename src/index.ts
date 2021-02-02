const csvToJson = require('convert-csv-to-json');
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// Interface for a valid Listing
interface Listing {
    id : number;
    make : string;
    price : number;
    mileage : number;
    seller_type : string;
    contacted : number;
}

// Interface for a valid contact
interface Contact{
    listing_id : number;
    contact_date : number;
}

// Reading listings from a csv file
let listings_csv : string = './data/listings.csv';
let listings_json : JSON = csvToJson.formatValueByType().fieldDelimiter(',').getJsonFromCsv(listings_csv);
let listings: Listing [] = JSON.parse(JSON.stringify(listings_json).replace(/\\"/g, ""));

// Reading contacts from a csv file
let contacts_csv : string = './data/contacts.csv';
let contacts_json : JSON = csvToJson.formatValueByType().fieldDelimiter(',').getJsonFromCsv(contacts_csv);
let contacts: Contact [] = JSON.parse(JSON.stringify(contacts_json).replace(/\\"/g, ""));

// preprocessing contacts to extract count

// Distinct set of ids
let ids : number [] = Array.from(new Set(contacts.map(object => object.listing_id)));
let listings_contact : {id:number; contacted:number} [] = [];

for (let listing_id of ids){
    // Get the content objects given a listing id
    let listings_contacts : Contact []= contacts.filter((object) => object.listing_id === listing_id);
    // Get the number of contacts per listing id
    let id_count : number = listings_contacts.length;

    // pushing results to a result array
    listings_contact.push({ id : listing_id, contacted : id_count});
}
// join the two listings
listings = listings.map((item, i) => Object.assign({}, item, listings_contact[i]));
listings.sort(function (a, b) {
    return b.contacted - a.contacted;
});

// prrocess datatime information
let listing_datetime : {id : number; year : number; month : number} [] = []
for(let contact of contacts){
    let date = new Date(contact.contact_date);
    // Process date information
    listing_datetime.push({id : contact.listing_id, year : date.getFullYear(), month : date.getMonth()});
}

// R1: Average listing price per seller type

let seller_types : string [] = Array.from(new Set(listings.map(object => object.seller_type)));
let average_listing_result : {seller_type:string; average:number} [] = [];

for (let type of seller_types){
    // Filtering listings by seller type
    let prices_array : number [] = listings.filter(object => object.seller_type == type).map( object => object.price);
    // Computing average up to two decimal places
    let average : number = Number((prices_array.reduce(reducer) / prices_array.length).toFixed(2));
    // Appending row to the average listing array
    average_listing_result.push({ seller_type : type, average : average});
}

console.log(average_listing_result)


// R2: Percentual distribution per car manufacturer

let car_manufacturers : string [] = Array.from(new Set(listings.map(x => x.make)));
let percentual_distribution : { make:string; percent:number} [] = [];

for (let manufacturer of car_manufacturers){
    // Filtering listings by make
    let manufacturer_occurence : number = listings.filter((object) => object.make === manufacturer).length;
    // Computing percentage up to two decimal places
    let percentage : number = Number((manufacturer_occurence / listings.length).toFixed(2));
    // appending row to percentual_distribution array
    percentual_distribution.push({ make : manufacturer, percent : percentage});
}
// Sorting the array in desc order
percentual_distribution.sort(function (a, b) {
    return b.percent - a.percent;
});

console.log(percentual_distribution)

// R3: Average price of the 30% most contacted listings
let most_contacted_indices : number = parseInt((listings.length * 0.3).toFixed(2));
let most_contacted_listings : Listing [] = [];

for (let i=0; i <= most_contacted_indices; i++) {
    most_contacted_listings.push(listings[i]);
}

let listings_prices : number [] = most_contacted_listings.map( object => object.price);
let avg_price : number = Number((listings_prices.reduce(reducer)/most_contacted_listings.length).toFixed(2));

console.log({average_price : avg_price});

// R4: The Top 5 most contacted listings per Month

let years : number[] = Array.from(new Set(listing_datetime.map(object => object.year)));
let months : number[] = Array.from(new Set(listing_datetime.map(object => object.month)));

for(let year of years){
    for(let month of months){
        // get all postings per month per year
        let monthly_listings_ids : number []= listing_datetime.filter(object => object.year === year && object.month === month).map(object => object.id)
        // Counting duplicates
        let monthly_listings : {id:number; monthly_count: number}[]= [];
        // Declaring blank object to compute counts
        let duplicate_count = {};
        monthly_listings_ids.forEach(function(x) { duplicate_count[x] = (duplicate_count[x] || 0)+1; });
        // Appending results to monthly_listings
        for(let [key, value] of Object.entries(duplicate_count)){
            monthly_listings.push({id:Number(key), monthly_count: Number(value)})
        }
        // Sort and keep top 5 listings per month
        monthly_listings = monthly_listings.sort(function (a, b) {return b.monthly_count - a.monthly_count;}).slice(0,5);

        console.log(monthly_listings);
    }
}
