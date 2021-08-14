# Stock Trade Form

This is a plugin that helps you integrate a stock trading form to your financial application.

## Dependencies

- Bootstrap 3
- JQuery 2.1

## Installation

- Step 1: Add tradeModal.css to the HTML of the page

    ```
    <link href="tradeModal.css" rel="stylesheet" />
    ```

- Step 2: Add tradeModal.js to the HTML of the page after the jQuery javascript file

    ```
    <script src="tradeModal.js"></script>
    ```

## Running the example

Make sure npm is installed globally

- Step 1: Clone the plugin
```
    git clone https://github.com/sourabhbajaj/StockTradeForm.git
```

- Step 2: Enter the cloned directory

```
    cd StockTradeForm
```

- Step 3: checkout branch custom-for-tc

```
    git checkout custom-for-tc
```

- Step 4: install dependencies

```
    npm install
```

- Step 5: install http-server to spin up a quick local server

```
    npm install http-server
```

- Step 6: Run the server

```
    http-server
```

- Step 7: go to http://127.0.0.1:[PORT_NUMBER]/example.html in your browser


## Initialization
    
__JavaScript:__
```
    $(".buy-button").tradeModal();
```

__HTML:__
```
    <button 
        class="buy-button"
        data-symbol="ioc" 
        data-price="120" 
        data-trade-type="buy"
    >Buy</button>
```

## Options:

| Option | Description | Required | Accepted mode | Default |
|-------------|-------------|----------|---------------|---------|
| symbol | Symbol of the stock in question | Yes | Attribute in HTML | None |
| price | Price of the stock in question | Yes | Attribute in HTML | None |
| tradeType | buy or sell | Yes | Attribute in HTML | None |
| quantity | Default quantity of trade | No | HTML or JavaScript | 1 |
| product | cnc or mis | No | HTML or JavaScript | cnc |
| order | market, limit, sl or slm | No | HTML or JavaScript | market |
| trigger | Trigger price if SL or SLM is selected in previous option | No | HTML or JavaScript | 0 |
| stoploss | Stoploss percentage | No | HTML or JavaScript | 0 |
| target | Target percentage | No | HTML or JavaScript | 0 |
| variety | rglr, co or amo | No | HTML or JavaScript | rglr |
| validity | day or ioc | No | HTML or JavaScript | day |
| discQuantity | Disclosed quantity | No | HTML or JavaScript | same as quantity |
| slTrigger | Stoploss trigger, valid only in case of CO option in variety option | No | HTML or JavaScript | 0 |

## Events
| Event | Description | Data passed |
|-------------|-------------|----------|
| onSubmit | Event called at the time when user submits the form | Complete data selected by the user |


## Methods

| Method | Description | Parameters |
|-------------|-------------|----------|
| loading | Set modal in loading mode | 1. Boolean: to start or stop loading mode |
| close | Close opened trade modal | None |
| error | Show error message to the user | 1. String: Error message |
| success | Close modal with a success message alert | 1. String: text for success message |

