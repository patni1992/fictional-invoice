# Invoice Generator

## Features

- Filter and generate invoices by carrier and date range.
- Download invoices in PDF format.

![Gui](https://github.com/patni1992/fictional-invoice/blob/main/images/gui.png?raw=true)
![Invoice](https://github.com/patni1992/fictional-invoice/blob/main/images/invoice.png?raw=true)

## Getting Started

### Prerequisites

- Node.js (version 12.x or later)
- MongoDB (version 4.x or later)
- MongoDB Compass (for database management)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/invoice-generator.git
cd invoice-generator
npm install
```

Seed the database using MongoDB Compass by importing `Carriers.json` and `Parcels.json` into the `carriers` and `parcels` collections respectively, within the `"invoice-db` database.

Start the application:

Navigate to `http://localhost:3000` in your browser.

## Usage

1. Select a carrier and specify a date range on the main page.
2. Click "Submit" to generate an invoice.
3. Download the generated PDF invoice.

## Running Tests
```bash
npm run test
```
