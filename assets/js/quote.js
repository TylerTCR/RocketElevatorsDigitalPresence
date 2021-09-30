/*** How It Works ***
 * Once a building is selected it will show the respective fields.
 * 
 * If any field is changed, a call to elementChange() is made. 
 * That then checks the building type selected and calls the respective calculation function.
 * 
 * All building calculation functions, obtaining the amount of elevators needed. At the end, it contains a call to the getResults function
 * 
 * getResults() fetches the unit price and calculates all the totals.
*/

/* Variables */
const STANDARD_INSTALLATION_FEE = 0.1, PREMIUM_INSTALLATION_FEE = 0.13, EXCELIUM_INSTALLATION_FEE = 0.16;
const STANDARD_UNIT_PRICE = 7565, PREMIUM_UNIT_PRICE = 12345, EXCELIUM_UNIT_PRICE = 15400;
const BUILDING_TYPE = document.getElementById("building-type");
const RESIDENTIAL_TYPE = BUILDING_TYPE[1];
const COMMERCIAL_TYPE = BUILDING_TYPE[2];
const CORPORATE_TYPE = BUILDING_TYPE[3];
const HYBRID_TYPE = BUILDING_TYPE[4];
// Get the totals
var elevatorAmount = document.getElementById("elevator-amount").lastElementChild;
var elevatorUnitPrice = document.getElementById("elevator-unit-price").lastElementChild;
var elevatorTotalPrice = document.getElementById("elevator-total-price").lastElementChild;
var installationFee = document.getElementById("installation-fees").lastElementChild;
var finalPrice = document.getElementById("final-price").lastElementChild;
// Get the different questions.
var numOfApartments = document.getElementById("number-of-apartments");
var numOfCompanies = document.getElementById("number-of-companies");
var numOfCorps = document.getElementById("number-of-corporations");
var numOfFloors = document.getElementById("number-of-floors");
var numOfBasements = document.getElementById("number-of-basements");
var numOfElevators = document.getElementById("number-of-elevators");
var numOfParkingSpots = document.getElementById("number-of-parking-spots");
var maxOccupants = document.getElementById("maximum-occupancy");
var businessHours = document.getElementById("business-hours");
// Get the different product lines
var standardLine = document.getElementById("standard");
var premiumLine = document.getElementById("premium");
var exceliumLine = document.getElementById("excelium");
/* /variables */

/* Formatting for money results */
var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});


/* Detecting changes */
// Building type change...
BUILDING_TYPE.onchange = changeBuilding;
// Element changes...
numOfApartments.onchange = elementChange;
numOfCompanies.onchange = elementChange;
numOfCorps.onchange = elementChange;
numOfFloors.onchange = elementChange;
numOfBasements.onchange = elementChange;
numOfElevators.onchange = elementChange;
numOfParkingSpots.onchange = elementChange;
maxOccupants.onchange = elementChange;
businessHours.onchange = elementChange;
// Product line change...
standardLine.onchange = getResults;
premiumLine.onchange = getResults;
exceliumLine.onchange = getResults;
/* /Detecting Changes */


/** 
 * Show the appropriate section based on what's selected, making others hidden when not selected. 
*/
function changeBuilding() {
    if (RESIDENTIAL_TYPE.selected === true) {       // The residential building is selected
        // Show
        numOfApartments.hidden = false;
        numOfFloors.hidden = false;
        numOfBasements.hidden = false;
        // Hide the rest
        numOfCompanies.hidden = true;
        numOfCorps.hidden = true;
        numOfElevators.hidden = true;
        numOfParkingSpots.hidden = true;
        maxOccupants.hidden = true;
        businessHours.hidden = true;
        // Clear all fields
        clearFields();
    } else if (COMMERCIAL_TYPE.selected === true) { // The commercial building is selected
        // Show
        numOfCompanies.hidden = false;
        numOfFloors.hidden = false;
        numOfBasements.hidden = false;
        numOfParkingSpots.hidden = false;
        numOfElevators.hidden = false;
        // Hide the rest
        numOfApartments.hidden = true;
        numOfCorps.hidden = true;
        maxOccupants.hidden = true;
        businessHours.hidden = true;
        // Clear all fields
        clearFields();
    } else if (CORPORATE_TYPE.selected === true) {  // The corporate building is selected
        // Show
        numOfCorps.hidden = false;
        numOfFloors.hidden = false;
        numOfBasements.hidden = false;
        numOfParkingSpots.hidden = false;
        maxOccupants.hidden = false;
        // Hide the rest
        numOfApartments.hidden = true;
        numOfCompanies.hidden = true;
        numOfElevators.hidden = true;
        businessHours.hidden = true;
        // Clear all fields
        clearFields();
    } else if (HYBRID_TYPE.selected === true) {     // The hybrid building is selected
        // Show
        numOfCompanies.hidden = false;
        numOfFloors.hidden = false;
        numOfBasements.hidden = false;
        numOfParkingSpots.hidden = false;
        maxOccupants.hidden = false;
        businessHours.hidden = false;
        // Hide the rest
        numOfApartments.hidden = true;
        numOfCorps.hidden = true;
        numOfElevators.hidden = true;
        // Clear all fields
        clearFields();
    } else {    // If the default option is selected
        // Hide all
        numOfApartments.hidden = true;
        numOfFloors.hidden = true;
        numOfBasements.hidden = true;
        numOfCompanies.hidden = true;
        numOfCorps.hidden = true;
        numOfElevators.hidden = true;
        numOfParkingSpots.hidden = true;
        maxOccupants.hidden = true;
        businessHours.hidden = true;
        clearFields();
    }
}   // End of changeBuilding()


/** Called each time an element's value is changed.
 *  Also determines which calculation to call based on the building type that is selected.
 */
function elementChange() {
    if (RESIDENTIAL_TYPE.selected === true) {
        calculateResidential();
    } else if (COMMERCIAL_TYPE.selected === true) {
        calculateCommercial();
    } else if (CORPORATE_TYPE.selected === true) {
        calculateCorporate();
    } else if (HYBRID_TYPE.selected === true) {
        calculateHybrid();
    }
}   // End of elementChange()


/** Simply clears all field values, only done when the user changes building type. */
function clearFields() {
    numOfApartments.lastElementChild.value = "";
    numOfFloors.lastElementChild.value = "";
    numOfBasements.lastElementChild.value = "";
    numOfCompanies.lastElementChild.value = "";
    numOfCorps.lastElementChild.value = "";
    numOfElevators.lastElementChild.value = "";
    numOfParkingSpots.lastElementChild.value = "";
    maxOccupants.lastElementChild.value = "";
    businessHours.lastElementChild.value = "";
    elevatorAmount.value = "";
    elevatorUnitPrice.value = "";
    elevatorTotalPrice.value = "";
    installationFee.value = "";
    finalPrice.value = "";
}

/*** Get/update the last 4 results. 
 * Is called after doing calculations or changing the product line.
*/
function getResults() {
    let numOfShafts = elevatorAmount.value;
    let unitPriceNum, totalPriceNum, installFeeNum;
   // Update results based on which product line is selected
   if (standardLine.checked === true) {
       elevatorUnitPrice.value = formatter.format(STANDARD_UNIT_PRICE);
       unitPriceNum = STANDARD_UNIT_PRICE;
       totalPriceNum = numOfShafts * unitPriceNum;
       elevatorTotalPrice.value = formatter.format(totalPriceNum);
       installFeeNum = (unitPriceNum * numOfShafts) * STANDARD_INSTALLATION_FEE
       installationFee.value = formatter.format(installFeeNum);
       finalPrice.value = formatter.format(totalPriceNum + installFeeNum);
   } else if (premiumLine.checked === true) {
       elevatorUnitPrice.value = formatter.format(PREMIUM_UNIT_PRICE);
       unitPriceNum = PREMIUM_UNIT_PRICE;
       totalPriceNum = numOfShafts * unitPriceNum;
       elevatorTotalPrice.value = formatter.format(totalPriceNum);
       installFeeNum = (unitPriceNum * numOfShafts) * PREMIUM_INSTALLATION_FEE
       installationFee.value = formatter.format(installFeeNum);
       finalPrice.value = formatter.format(totalPriceNum + installFeeNum);
   } else if (exceliumLine.checked === true) {
       elevatorUnitPrice.value = formatter.format(EXCELIUM_UNIT_PRICE);
       unitPriceNum = EXCELIUM_UNIT_PRICE;
       totalPriceNum = numOfShafts * unitPriceNum;
       elevatorTotalPrice.value = formatter.format(totalPriceNum);
       installFeeNum = (unitPriceNum * numOfShafts) * EXCELIUM_INSTALLATION_FEE
       installationFee.value = formatter.format(installFeeNum);
       finalPrice.value = formatter.format(totalPriceNum + installFeeNum);
   } 
}   // End of getResults()


/** Residential Calculation */
function calculateResidential() {
    let number_of_apartments = Number(numOfApartments.lastElementChild.value);
    let number_of_floors = Number(numOfFloors.lastElementChild.value);
    const STORIES_PER_COLUMN = 20;
    const APARTMENTS_PER_SHAFT = 6;
    let amountOfShafts = 0, AvgDoorsPerFloor = 0, columns = 0;

    // Check for decimal values, if there is one alert user and end function
    if (Number.isInteger(number_of_apartments) === false || Number.isInteger(number_of_floors) === false) {
        alert("Please make sure all values are whole numbers.");
        return;
    }

    // Checking if number of floors and apartments is greater than 0 to get proper calculation
    if (number_of_floors > 0 && number_of_apartments > 0) {
        // Get the average of door for each floor
        AvgDoorsPerFloor = number_of_apartments / number_of_floors;
    } else {AvgDoorsPerFloor = 0;}

    // Check how many shafts are needed
    if (AvgDoorsPerFloor > 0 && AvgDoorsPerFloor < APARTMENTS_PER_SHAFT) {
        amountOfShafts = 1;
    } else if (AvgDoorsPerFloor >= APARTMENTS_PER_SHAFT) {
        amountOfShafts = AvgDoorsPerFloor % APARTMENTS_PER_SHAFT;
    }

    // Check how many columns are needed, and double the amount of shafts for every 20 stories (or for each column)
    if (number_of_floors > STORIES_PER_COLUMN) {
        columns = number_of_floors / STORIES_PER_COLUMN;
        // Double the amount of shafts for each iteration
        for (let i = 0; i < columns; i++) {
            amountOfShafts *= 2;
        }
    } else if (number_of_floors > 0) {
        columns = 1;
    } else {columns = 0;}
    
    // Change the Amount of Elevators result
    elevatorAmount.value = Math.ceil(amountOfShafts);
    
    // Finally, call getResults()
    getResults();
} // End residential calculation


/** Commercial Calculation */
function calculateCommercial() {
    let defaultAmountOfElevators = 0;

    // Check for decimal values, if there is one alert user and stop the calculation
    if (Number.isInteger(Number(numOfElevators.lastElementChild.value)) === false) {
        alert("Please make sure all values are whole numbers.");
        return;
    } 

    // Check if the number entered is greater than 1, if not, default to 0 elevators.
    if (numOfElevators.lastElementChild.value > 0) {
        elevatorAmount.value = Number(numOfElevators.lastElementChild.value);
    } else {elevatorAmount.value = defaultAmountOfElevators;}

    getResults();
} // End commercial calculation


/** Corporate Calculation */
function calculateCorporate() {
    const STORIES_PER_COLUMN = 20;
    let number_of_floors = Number(numOfFloors.lastElementChild.value);
    let number_of_basements = Number(numOfBasements.lastElementChild.value);
    let occupants_per_floor = Number(maxOccupants.lastElementChild.value);
    let amountOfStories = 0, totalOccupantsNum = 0, requiredElevators = 0, columns = 0, totalElevatorNum = 0; 

    // Check for decimal values, if there is one alert user and stop the calculation
    if (Number.isInteger(number_of_floors) === false || Number.isInteger(number_of_basements) === false || Number.isInteger(occupants_per_floor) === false) {
        alert("Please make sure all values are whole numbers.");
        return;
    }

    // If any of this is true, simply make elevatorAmount equal to 0 and complete results
    if (number_of_floors <= 0 || number_of_basements < 0 || occupants_per_floor <= 0) {
        elevatorAmount.value = totalElevatorNum;
        getResults();
    } else { // Otherwise, continue with the calculation
        // Get total number of occupants
        amountOfStories = number_of_floors + number_of_basements;
        totalOccupantsNum = occupants_per_floor * amountOfStories;
        
        // Get the amount of elevators required
        requiredElevators = totalOccupantsNum / 1000;

        // Get number of columns required and elevators per column
        columns = amountOfStories / STORIES_PER_COLUMN;
        
        /* Get total amount of elevators: divide number of elevators by the number of columns to
        get the amount of elevators per column, then multiply that by the amount of columns. */
        totalElevatorNum = ((requiredElevators / columns) * columns);

        // Change the Amount of Elevators result
        elevatorAmount.value = Math.ceil(totalElevatorNum);

        // Finally, call getResults()
        getResults();
    }
    
} // End corporate calculation


/** Hybrid Calculation */
function calculateHybrid() {
    const STORIES_PER_COLUMN = 20;
    let number_of_floors = Number(numOfFloors.lastElementChild.value);
    let number_of_basements = Number(numOfBasements.lastElementChild.value);
    let occupants_per_floor = Number(maxOccupants.lastElementChild.value);
    let amountOfStories = 0, totalOccupantsNum = 0, requiredElevators = 0, columns = 0, totalElevatorNum = 0; 

    // Check for decimal values, if there is one alert user and stop the calculation
    if (Number.isInteger(number_of_floors) === false || Number.isInteger(number_of_basements) === false || Number.isInteger(occupants_per_floor) === false) {
        alert("Please make sure all values are whole numbers.");
        return;
    }

    // If any of this is true, simply make elevatorAmount equal to 0 and complete results
    if (number_of_floors <= 0 || number_of_basements < 0 || occupants_per_floor <= 0) {
        elevatorAmount.value = totalElevatorNum;
        getResults();
    } else { // Otherwise, continue with the calculation
        // Get total number of occupants
        amountOfStories = number_of_floors + number_of_basements;
        totalOccupantsNum = occupants_per_floor * amountOfStories;

        // Get the amount of elevators required
        requiredElevators = totalOccupantsNum / 1000;

        // Get number of columns required and elevators per column
        columns = amountOfStories / STORIES_PER_COLUMN;
        
        /* Get total amount of elevators: divide number of elevators by the number of columns to
        get the amount of elevators per column, then multiply that by the amount of columns. */
        totalElevatorNum = ((requiredElevators / columns) * columns);

        // Change the Amount of Elevators result
        elevatorAmount.value = Math.ceil(totalElevatorNum);

        // Finally, call getResults()
        getResults();
    }
} // End hybrid calculation