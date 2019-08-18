const mysql = require("mysql");
const inquirer = require("inquirer");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});




// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to storefront.");
  launchStore();
});

function launchStore() {
  displayProducts();
};

//show products
function displayProducts() {
    //pull cli export
    connection.query("SELECT * FROM bamazon.products", function(err, dbResponse) {
        if (err) throw err;
        for (var i = 0; i < dbResponse.length; i++) {
          console.log("\n======================\n");
          console.log("Item " + dbResponse[i].item_id + ". " + dbResponse[i].product_name);
          console.log("Price: " + dbResponse[i].price);
          console.log("Number in Stock: " + dbResponse[i].stock_quantity);
      }
      promptUser(dbResponse);
    });    
}

//ask what they want
function promptUser(dbResponse) {

  inquirer.prompt([
    {
      name: "selectID",
      type: "input",
      message: "Welcome to BAMAZON, the world's largest most legally-distinct storefront!\nPlease type the ID of the product you wish to purchase: \n",
      validate: function(value) {
        // Input Validation
        var invalid = isNaN(parseFloat(value));
        if (invalid || parseInt(value) > dbResponse.length) {
            return "Please enter a valid ID number";
        }
        return true;
      }
    }
  ]).then(function(userChoice) {

    var item = userChoice.selectID;
    askQuantity(dbResponse, item); //now ask how much they want
        

    });
}
//ask how much they want
function askQuantity(dbResponse, item) {
  inquirer.prompt([{
        type: "input",
        message: "How many would you like to purchase?? Please enter number \n\n",
        name: "count"
    }]).then(function(data) {
        //take entry -> make number
        data.count = parseInt(data.count);
        //check if entry is a number
        if (isNaN(data.count) === false) {
            var quantity = parseInt(data.count);
            confirmOrder(dbResponse, item, quantity);
        }
        //if NaN have user try again
        else {
            console.log("PLEASE ENTER A NUMBER");
            askQuantity(dbResponse, item);
        }
    });
}
//verify order details
function confirmOrder(dbResponse, item, quantity) {

    var query = "SELECT product_name, price, stock_quantity FROM bamazon.products WHERE product_name = ?";

    connection.query(
      query, 
      [
        {
          product_name:dbResponse[item-1].product_name
        }
      ], 
      function(err, results) {


      if (err) throw err;

      // Total Price is the amount the user purchases, multiplied by the price of the item selected.
        var totalPrice = quantity * dbResponse[item-1].price;
        var response = "";
        inquirer.prompt({
                name: "confirmOrder",
                type: "confirm",

                message: "Please confirm you want to purchase " + quantity + " " + dbResponse[item-1].product_name + " for $" + totalPrice
            })
            .then(function(answer) {
                if (answer.confirmOrder === true) {
                  // if the amount requested is less than the current stock, we have enough units and we can process the order.
                    if (quantity <= dbResponse[item-1].stock_quantity) {

                        response = "\n\nAwesome! We are processing your order!\n.....\n.....\n.....\n.....\n.....\n";

                        // Set the new Quantity in the DB equal to the existing amount, minus ths amount that the user requested to purchase.
                        var updatedStock = dbResponse[item-1].stock_quantity - quantity;

                        var prodName = dbResponse[item-1].product_name;



                        updateDB(dbResponse, item, quantity, totalPrice, updatedStock);





                    } else {

                        response = "\n\nSorry, but you've requested more " + dbResponse[item-1].product_name + " than we have available.\n\n";
                        stopDb();

                    }
                    console.log(response);
                } else {
                    console.log("\n\Thank you for browsing at Bamazon! We hope to see you again later.");
                    stopDb();
                }
            });
    })
}


function updateDB(dbResponse, item, quantity, totalPrice, updatedStock) {
    connection.query(
        "UPDATE products SET ? WHERE ?", [
            { stock_quantity: updatedStock },
            { item_id: item }
        ],
        function(err) {
            if (err) throw err;
            console.log("Thank you for your purchase of: " + quantity + " " + dbResponse[item-1].product_name + " for $" + totalPrice);
            console.log("Your purchase will be delivered to you... someday.")
            stopDb();
        }
    )
}
//Disconnect the user
function stopDb() {
    connection.end(function(err) {
        if (err) { throw err; }
        console.log("Goodbye!");
        // console.log("Disconnected from database!\n\n\n\n");
    });
}


