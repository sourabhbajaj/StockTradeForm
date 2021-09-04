const addChartButtons=(container, data)=>{
    const newButtonId=Math.floor(Math.random() * 100);
    const buyButton=$("<button/>").addClass("btn btn-success trade-button-"+newButtonId).append("Buy").attr("data-trade-type", "buy");
    buyButton.attr({
        "data-symbol":"NIFTY",
        "data-instrument":"FUTURES"
    });
    const sellButton=$("<button/>").addClass("btn btn-danger trade-button-"+newButtonId).append("Sell").attr("data-trade-type", "sell");
    sellButton.attr({
        "data-symbol":"NIFTY",
        "data-instrument":"FUTURES"
    });

    $(container).append(buyButton).append(sellButton);
    $(".trade-button-"+newButtonId).tradeModal();
}