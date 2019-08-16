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


  // Store EEEEVEEERRYYTHIING in a gigantic JSON object of DOOM. Then we just run stuff on this object.
var bamazon = {
    init: function() {
      // this.startDb(); //start db connection
      this.displayProducts(); //show products
      this.promptUser(inquirer); //ask what they want
    },

    //show products
    displayProducts: function() {
        //pull cli export
        connection.query("SELECT * FROM bamazon.products", function(err, result) {
            if (err) throw err;
            
        });    
    },

    //ask what they want
    promptUser: function(inquirer) {
      connection.query("SELECT * FROM bamazon.products", function(err, results) {
        if (err) throw err;
        
    
      inquirer.prompt([
        {
          name: "item",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            
            var itemNames = [];
            for (var i = 0; i < results.length; i++) {
              // Taking the item name and the item price and putting them together so the user can see what the price is when they select an item.
              choiceArray.push(results[i].product_name + ": $" + results[i].price);
              itemNames.push(results[i].product_name);
            }
            // return itemNames;
            return choiceArray;
          },
          message: "Welcome to BAMAZON, the world's largest most legally-distinct storefront!\nPlease select a product to purchase: \n"
        }
      ]).then(function(data) {

        var item = data.item;
        bamazon.askQuantity(inquirer, item); //now ask how much they want
            

        });
      });
    },
    //ask how much they want
    askQuantity: function(inquirer, item) {
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
                bamazon.confirmOrder(inquirer, item, quantity);
            }
            //if NaN have user try again
            else {
                console.log("PLEASE ENTER A NUMBER");
                bamazon.askQuantity(inquirer, item);
            }
        });
    },
    //verify order details
    confirmOrder: function(inquirer, item, quantity) {
        var query = "SELECT product_name, price, stock_quantity FROM bamazon.products WHERE product_name = ?";
        connection.query(query, { item_id: item }, function(err, results) {
          // Total Price is the amount the user purchases, multiplied by the price of the item selected.
            var totalPrice = quantity * results[0].price;
            var response = "";
            inquirer.prompt({
                    name: "confirmOrder",
                    type: "confirm",
                    // On this line, results[0] is displaying the VERY FIRST THING in the table...instead of what the user actually selected. How to we make it so that is what is being picked?
                    message: "Please confirm you want to purchase " + quantity + " " + results[0].product_name + " for $" + totalPrice
                })
                .then(function(answer) {
                    if (answer.confirmOrder === true) {
                      // if the amount requested is less than the current stock, we have enough units and we can process the order.
                        if (quantity <= results[0].stock_quantity) {
                            response = "\n\nAwesome! We are processing your order!\n.....\n.....\n.....\n.....\n.....\n";
                            // Set the new Quantity in the DB equal to the existing amount, minus ths amount that the user requested to purchase.
                            var quantityNew = results[0].stock_quantity - quantity;
                            var prodName = results[0].product_name;
                            bamazon.createOrder(item, prodName, quantity, totalPrice, quantityNew);
                            bamazon.updateDB(item, quantityNew);
                        } else {
                            response = "\n\nSorry, but you've requested more " + results[0].product_name + " than we have available.\n\n";
                            bamazon.stopDb();
                        }
                        console.log(response);
                    } else {
                        console.log("\n\nOkay. See ya later");
                        bamazon.stopDb();
                    }
                });
        })
    },
    createOrder: function(item, prodName, quantity, totalPrice, quantityNew) {
        connection.query(
            "INSERT INTO orders SET ?", {
                item_id: item,
                product_name: prodName,
                quantity: quantity,
                total_price: totalPrice,
                remaining_stock: quantityNew
            },
            function(err) {
                if (err) throw err;
                console.log("your order has been processed");
                var tables = require("./tables.js");
                connection.query("SELECT * FROM orders", function(err, result, fields) {
                    if (err) throw err;
                    for (i = 0; i < result.length; i++) {
                        var data = result[i];
                        tables.makeTable.orders.push([data.order_id, data.item_id, data.product_name, data.quantity, data.total_price, data.remaining_stock]);
                    }
                    console.log(tables.makeTable.orders.toString() + "\n\n\n\n");
                });
            }
        );
    },
    //update the database to reflect confirmed order
    updateDB: function(item, quantityNew) {
        connection.query(
            "UPDATE products SET ? WHERE ?", [
                { stock_quantity: quantityNew },
                { item_id: item }
            ],
            function(err) {
                if (err) throw err;
                console.log("The database has been updated!");
                bamazon.stopDb();
            }
        )
    },
    //Disconnect the user
    stopDb: function() {
        connection.end(function(err) {
            if (err) { throw err; }
            console.log("Disconnected from database!\n\n\n\n");
        });
    }
}
//initalize program
bamazon.init();

});




