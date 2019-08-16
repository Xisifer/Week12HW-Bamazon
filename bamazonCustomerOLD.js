




function start() {

  // query the database for all items being sold
  connection.query("SELECT * FROM bamazon.products", function (err, results) {
    // console.log("Data received from Database:\n");
    // console.log(results);
    // console.log("Data has finished! Beginning Inquirer Prompt: \n");
    if (err) throw err;
    // for (var i = 0; i < results.length; i++) {
    //     console.log(results[i]);
    // }

    // EBAY CODE: once you have the items, prompt the user for which they'd like to bid on



    // FIRST SECTION: List the items available for sale
    function showProducts() {

    };


// ============================================================================================

    inquirer.prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: function () {
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
    ])
    // ============================================================================================
      .then(function (answer) {
        // Taking what the user chose, and splitting it up again so we can get the Item Name for the thing they chose.
        var itemName = answer.choice.split(":")[0];
        

        function selectAmount() {
        // We use this Item Name as the catalyst for another Database Query now that we know exactly what the user is looking for.
        connection.query("SELECT * FROM bamazon.products WHERE product_name = ?", itemName, function (err, results) {
          console.log("The results of the database query are: " + JSON.stringify(results));


          inquirer.prompt([
            {
              name: "quantity",
              type: "input",
              message: "There are " + results[0].stock_quantity + " units remaining. Please enter amount to purchase: \n"
            }
          ])
          .then(function (quantity) {

            // Verifying Order Details

            // Take the user's input and turn it into a number
            answer.quantity = parseInt(answer.quantity);
            // Make sure it's a number
            if (isNaN(answer.quantity) === false) {
              var amount = parseInt(answer.quantity);

              // PROCEEDING WITH ORDER CONFIRMATION






            } else {
              console.log("PLEASE ENTER A NUMBER");
            }



              // The user's choice is the result of a database query, stored into an array and spat out into the Inquirer prompt.

          })

        // END OF SELECTAMOUNT
        }


        );
        }
        selectAmount(itemName);

        function processOrder() {
          
          for (var i = 0; i < results.length; i++) {
            if (results[i].product_name === answer.choice) {
              chosenItem = results[i];

              // Simple debug message throwing out what got picked.
              console.log("You picked: " + chosenItem);
            }
          }

          if (answer.stock_quantity > 0) {
            // EBAY CODE: bid was high enough, so update db, let the user know, and start over
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: stock_quantity - 1
                },
                {
                  product_id: chosenItem.product_id
                }
              ],
              function (error) {
                if (error) throw err;
                console.log("Bid placed successfully!");
                start();
              }
            );
          }
          else {
            // EBAY CODE: bid wasn't high enough, so apologize and start over
            console.log("Your bid was too low. Try again...");
            start();
          }

        }
        processOrder(itemName);
      });

  }
  )
};

// Select Product and Select Amount are different functions!
// You can't know what the user picked until they pick it, so place the message INSIDE the .then function.