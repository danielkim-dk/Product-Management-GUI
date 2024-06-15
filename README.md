# Product-Management-GUI

A simple GUI to track inventory for the LPD bucket

## Tech Stack
- Javascript
- React
- Node.js
- Express.js
- Chart.js
- Git
- PostgreSQL

## Core features

1. Visualizes your inventory for cross reference
2. Search functionality - can find items with keywords or upc code
3. Sort functionality - can display items by category
4. Updates LPD Inventory to keep track of what is in stock
5. Visualizes the quantity on hand per category
6. Easily transfer inventory to 'Process' bucket
7. Can donate the rest of inventory and reset current inventory counts

## Getting Started

Before running the application, make sure to have the following installed:

- Node.js

### Installation

1. Clone the repository

```bash
git clone https://github.com/danielkim-dk/waldenGUI.git
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file in root directory
4. Start the server

```bash
npm start
```

## Project Summary

This GUI helps manage LPD inventory. 
Initially, products are scanned into the system and categorized into various types such as boneless beef, chicken, bone-in pork, etc. 
This categorization is based on the current methods. 

1. Inventory Management: 
- After the initial scan, products are divided into two primary buckets: 'Loss' for items to be discarded and 'Inventory' for good items.
- Items are marked as 'processed' once they are assigned to a specific category.
- This doesn't mean they are processed into goods yet, but rather that they have been sorted and categorized.

2. Transaction Handling: 
- Each time items are moved from the 'Inventory' bucket for processing or donation, a transaction is recorded. 
- This session records the change in status from 'Inventory' to either 'Process' or 'Donate', depending on the action taken.

3. Rebalancing Feature:
- Items are transferred from the 'Inventory' to 'Process' as needed. 
- When it’s time to donate, the remaining items in 'Inventory' are tagged as 'Donate', and all current transactions are archived (each transaction has an archived column set initially to false).

4. GUI Features: 
- The GUI offers real-time inventory level display, functionalities to manage (process or donate) inventory items, and the capability to reset inventory counts.
- It retains data for future analysis, ensuring traceability and efficient inventory management.
