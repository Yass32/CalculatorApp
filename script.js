//Create a function to calculate values
const calculate = (num1, operator, num2) => {
    // Turn string to integer
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    if (operator === "add") { return num1 + num2; }
    else if (operator === "subtract") { return num1 - num2; }
    else if (operator === "multiply") { return num1 * num2; }
    else if (operator === "divide") { return num1 / num2; }
    else { return "Error: Invalid Operator"; }
}


//We’re going to use jQuery to select the calculator and the keys.
$(document).ready(function() {
    //$(".calculator__keys").on("click", "button", function(){
    $("button").on("click", function(){
        // Select data action attribute of the key pressed
        let action = $(this).attr("data-action");

        //Select the button
        let key_pressed = $(this).html();

        //Use the .calculator__display class to select the calculator display.
        let numDisplayed = $(".calculator__display").html();

        // Remove .is-depressed class from all keys that were highlighted
        $("button").each(function(){
            if ($(this).hasClass("is-depressed")) {
                $(this).removeClass("is-depressed");
            }
        });

        //Create custom attribute to keep track of the previous button pressed
        const previousKeyType = $(".calculator").attr("data-previous-key-type");


        // When any key is pressed change AC (All Clear) to CE (Clear Entry)
        if (action !== "clear") {
            $("[data-action=clear]").html("CE");
        }
        
        //If key doesnt have a data-action attr then its a number key
        if ( !action ) { 
            //If calculator displays 0 change display to key pressed
            if (numDisplayed === "0" || previousKeyType === "operator") {
                $(".calculator__display").html(key_pressed); 
            }
            //If calculator displays anything else append the new key pressed to existing display 
            else {
                $(".calculator__display").html(numDisplayed + key_pressed);
            }
            //Assign number to the data-previous-key-type attribute we created
            $(".calculator").attr("data-previous-key-type", "number");  
        }

        // If key is operator
        else if (action === "add" || action === "subtract" || action === "multiply" || action === "divide") { 
            const firstValue = $(".calculator").attr("firstValue");
            const operator = $(".calculator").attr("operator");
            const secondValue = $(".calculator__display").html();
            
            //Allow calclator to make consecutive calculations
            if (firstValue && operator && previousKeyType !== "operator" && previousKeyType !== "calculate") {
                const calcValue = $(".calculator__display").html(calculate(firstValue, operator, secondValue));
                // Update calculated value as firstValue
                $(".calculator").attr("firstValue", calcValue);
            }
            else {
            // If there are no calculations, set displayedNum as the firstValue
            $(".calculator").attr("firstValue", numDisplayed); 
            }

            //Add new class so operator would be highlighted to show its active
            $(this).addClass("is-depressed"); 

            //Create custom attribute to keep track of the operator clicked
            $(".calculator").attr("operator", action);

            //Assign operator to the data-previous-key-type attribute we created to keep track of last key
            $(".calculator").attr("data-previous-key-type", "operator");
        }

        // If key is decimal
        else if (action === "decimal") {           
            //If theres no decimal in value displayed and decimal key (before an operator) is pressed add "." else nothing
            if (!numDisplayed.includes(".") && previousKeyType !== "operator") {
                $(".calculator__display").html(numDisplayed + ".");
            }
            //If decimal was pressed after operator
            else if (previousKeyType === "operator" || previousKeyType === "calculate") {
                $(".calculator__display").html("0.");
            }

            //Assign decimal to the data-previous-key-type attribute we created to keep track of last key
            $(".calculator").attr("data-previous-key-type", "decimal");
        }

        // If key is clear
        else if (action === "clear") { 
            //Clear the calculator
            if ($(this).html() === "AC") {
                //Reset all attributes
                $(".calculator").attr("firstValue", "");
                $(".calculator").attr("modValue", "");
                $(".calculator").attr("operator", "");
                $(".calculator").attr("data-previous-key-type", "");
            }
            else {
                $(this).html("AC");
            }    

            $(".calculator__display").html("0");
            
            //Assign clear to the data-previous-key-type attribute we created to keep track of last key
            $(".calculator").attr("data-previous-key-type", "clear");
        }

        // If key is calculate
        else if (action === "calculate") { 
            // Retrieve the first value entered that we assigned firstValue attribute to
            let firstValueEntered = $(".calculator").attr("firstValue");

            // Retrieve the operator type entered that we assigned operator attribute to     
            let operator = $(".calculator").attr("operator");

            // Retrieve the Second value entered which is also the value currently displayed
            let secondValueEntered = numDisplayed;

            //Once we have the three values we need, we can perform a calculation
            if (firstValueEntered) {
                if (previousKeyType === "calculate") {
                    firstValueEntered = numDisplayed;
                    secondValueEntered = $(".calculator").attr("modValue");
                }
                //Perform calculation and display on the calculator
                $(".calculator__display").html(calculate(firstValueEntered, operator, secondValueEntered));
            }

            // Set modValue attribute
            $(".calculator").attr("modValue", secondValueEntered);

            //Assign calculate to the data-previous-key-type attribute we created
            $(".calculator").attr("data-previous-key-type", "calculate");
        }       
    });
});