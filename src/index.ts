const csvToJson = require('convert-csv-to-json');

const reducer = (accumulator, currentValue) => accumulator + currentValue;

/**
 * Interface for a valid Listing
 *
 * @export
 * @interface Listing
 */
export interface Listing {
    id : number;
    make : string;
    price : number;
    mileage : number;
    seller_type : string;
    contacted : number;
}

/**
 * Interface for a valid contact
 *
 * @export
 * @interface Contact
 */
export interface Contact{
    listing_id : number;
    contact_date : number;
}

/**
 * Interface for a valid contact datetime
 *
 * @export
 * @interface ContactDate
 */
export interface ContactDate{
    id : number;
    year : number;
    month : number;
}

/**
 * This function parses a csv file given its input and returns a listing object
 *
 * @export
 * @param {string} listings_csv_path
 * @return {*}  {Listing[]}
 */
export function parse_listing_CSV(listings_csv_path : string): Listing[]{
    // Check if a file path was provided
    if(listings_csv_path === null){
        throw new Error("No file path was provided for Listings"); 
    }

    let listings_json : JSON = csvToJson.formatValueByType().fieldDelimiter(',').getJsonFromCsv(listings_csv_path);
    let listings: Listing [] = JSON.parse(JSON.stringify(listings_json).replace(/\\"/g, ""));
    
    return listings;
}


/**
 * This function parses a csv file given its input and returns a contact object
 *
 * @export
 * @param {string} contacts_csv_path
 * @return {*}  {Contact[]}
 */
export function parse_contacts_CSV(contacts_csv_path : string): Contact[]{
    // Check if a file path was provided
    if(contacts_csv_path === null){
        throw new Error("No file path was provided for Contacts"); 
    }

    let contacts_json : JSON = csvToJson.formatValueByType().fieldDelimiter(',').getJsonFromCsv(contacts_csv_path);
    let contacts: Contact [] = JSON.parse(JSON.stringify(contacts_json).replace(/\\"/g, ""));
    
    return contacts;
}

/**
 * This function joins the listing information from a listing and a contact object on listing id. Additionaly, 
 * contacted listing information is aggregated and added as 'contacted' property.
 *
 * @export
 * @param {Listing[]} listings A listing object
 * @param {Contact[]} contacts A contact object
 * @return {*}  {Listing[]} Processed Listing object.
 */
export function preprocess_listings (listings : Listing[], contacts : Contact[]) : Listing[]{
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
    return listings;
}

/**
 * This function processes contact objects and extracts year and month from its datetime property
 *
 * @export
 * @param {Contact[]} contacts
 * @return {*}  {ContactDate []}
 */
export function preprocess_contact_datetime(contacts : Contact[]) : ContactDate []{
    // preprocess datatime information
    let listing_datetime : ContactDate[] = []
    for(let contact of contacts){
        let date = new Date(contact.contact_date);
        // Process date information
        listing_datetime.push({id : contact.listing_id, year : date.getFullYear(), month : date.getMonth()});
    }

    return listing_datetime;
}

/**
 * This function computes the average price of a listing given a seller type
 *
 * @export
 * @param {Listing[]} listings
 * @return {*}  {{seller_type:string; average:number} []}
 */
export function average_price_seller(listings : Listing[]) : {seller_type:string; average:number} [] {

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

    return average_listing_result;
}

/**
 * This function computes the percentual distribution of available cars by manufacturer
 *
 * @export
 * @param {Listing[]} listings
 * @return {*}  {{ make:string; percent:number } []}
 */
export function manufacturer_percentage(listings : Listing[]): { make:string; percent:number } []{
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
    
    return percentual_distribution
}

/**
 * This function computes average price of the 30% most contacted listings
 *
 * @export
 * @param {Listing[]} listings
 * @return {*}  {{average_price : number}}
 */
export function average_price (listings : Listing[]): {average_price : number} {
    // Listings is sorted by contacted listings (desc) by default
    let most_contacted_indices : number = parseInt((listings.length * 0.3).toFixed(2));
    let most_contacted_listings : Listing [] = [];

    for (let i=0; i <= most_contacted_indices; i++) {
        most_contacted_listings.push(listings[i]);
    }

    let listings_prices : number [] = most_contacted_listings.map( object => object.price);
    let avg_price : number = Number((listings_prices.reduce(reducer)/most_contacted_listings.length).toFixed(2));

    return({average_price : avg_price});
}

/**
 * This function computes the Top 5 most contacted listings per month
 *
 * @export
 * @param {Listing[]} listings
 * @param {ContactDate[]} listing_datetime
 * @return {*}  {{year: number; month: number; top_five : Listing[]}[]}
 */
export function monthly_contacts (listings : Listing[],  listing_datetime: ContactDate[]): {year: number; month: number; top_five : Listing[]}[]{
    // Get distinct year and month numbers
    let years : number[] = Array.from(new Set(listing_datetime.map(object => object.year)));
    let months : number[] = Array.from(new Set(listing_datetime.map(object => object.month)));

    let top_five_listings : {year: number; month: number; top_five : Listing[]}[] = [];
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
            monthly_listings = monthly_listings.sort(function (a, b) {return b.monthly_count - a.monthly_count;})
            if (monthly_listings.length > 5){
                monthly_listings = monthly_listings.slice(0,5);
            }
            let monthly_listings_full : Listing[] = [];
            for (let monthly_listing of monthly_listings){
                let listing_id = monthly_listing.id;
                // Querying listings collection for an id match
                const match : Listing = listings.filter(object => object.id === listing_id)[0];
                // Modify the aggregated contact counter to monthly counter
                let match_clone = JSON.parse(JSON.stringify(match));
                match_clone.contacted = monthly_listing.monthly_count;
                monthly_listings_full.push(match_clone);
            }
            monthly_listings_full.sort(function (a, b) {return b.contacted - a.contacted;})
            top_five_listings.push({year : year, month: month+1, top_five: monthly_listings_full});

        }
    }
    // Sort results
    top_five_listings = top_five_listings.sort(function (a, b) {return a.month - b.month;}).sort(function (a, b) {return b.year - a.year;});

    return top_five_listings;
}