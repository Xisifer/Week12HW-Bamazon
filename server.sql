-- Drops the bamazon if it exists currently --
DROP DATABASE IF EXISTS bamazon;
-- Creates the "bamazon" database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect bamazon --
USE bamazon;

-- Creates the table "products" within bamazon --
CREATE TABLE products (
-- item ID column, auto-incrementing
item_id INTEGER NOT NULL AUTO_INCREMENT,
-- Makes a Product Name column, allows 30 characters long
product_name VARCHAR(200),
-- Makes a Department Name column, allows 30 characters long
department_name VARCHAR(200),
-- Makes a price column, allows 10 digits for the dollars, and 2 decimals for the cents
price DECIMAL(10,2),
-- Makes a column for the quantity in stock, expressed as an integer
stock_quantity INTEGER,
-- Sets the primary key to item_id
PRIMARY KEY(item_id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
	("Wonder Woman Coffee Mug", "Kitchen & Dining", 6.50, 20),
	("LEGO Robot", "Toys & Games", 399.99, 4),
	("Nintendo Switch Game Console", "Electronics", 249.99, 15),
	("Stranger Things Box Set SUPER DUPER MEGAKILL ULTIMATE EXTREME EDITION", "TV & Movies", 79.99, 40),
	("Stainless Steel Tea Kettle", "Kitchen & Dining", 24.99, 10),
    ("USB Bluetooth 4.0 Adapter", "Electronics", 11.99, 20),
    ("Bluetooth Wireless Earbuds", "Electronics", 12.99, 50),
    ("1lb Sumatra Coffee Beans", "Kitchen & Dining", 11.99, 100),
    ("Ceramic Kitchen Knife Set", "Kitchen & Dining", 21.80, 20),
    ("Fuzzy Wool Slippers", "Apparel", 19.99, 50);