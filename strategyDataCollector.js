
$(".trigger-strategy-trade").click(function(e){
    e.preventDefault();
    const symbol=$(this).attr("data-symbol");
    const lotSize=$(this).attr("data-lot-size");
    const tr=$(".strategy-details-table tr");
    const apiObj=[];
    for(let i=1;i<tr.length;i++){
        const td=$(tr[i]).find("td");
        const obj={
            order_stock_cd: symbol,
            order_xchng_cd: "NFO",
            order_product:$(td[0]).text()=="FUTURES"?"F":"O",
            order_exp_date: $(td[1]).text(),
            order_strike_price: $(td[0]).text()=="FUTURES"?null:($(td[2]).text()*100), 
            order_type: "M",
            order_quantity: lotSize * $(td[5]).text(),
            order_rate: 0,
            order_flow: $(td[4]).text()=="Buy"?"B":"S",
            order_stp_loss_price: 0,
            order_disclosed_qty: 0,
            order_opt_exer_type: $(td[0]).text()=="FUTURES"?"*E":($(td[0]).text()=="CALL"?"CE":"PE")
        };
        apiObj.push(obj);
    }

    $.ajax({
        url:"/icici",
        context:$(this),
        data:{
            action:"foStrategyOrder",
            subAction:"placeFOOrder",
            JSONPostData: JSON.stringify(apiObj)
        },
        method:"post",
        complete:function(){
            $(this).tradeModal("loading", false);                            
        },
        success:function(response){
            for(let i=0;i<response.length; i++){
                const data=response[i];
                if(data.Status!="200"){
                    if(data.Status=="401"){
                        $(".options-strategy-order-help-block").append(
                            $("<div/>").addClass("text-red").append("Order "+(i+1)+": You're not authorised to perform this request. Please <a href='/?pageView=iciciLogin'>click here</a> to login and come back to this page.")
                        );
                    }else{
                        $(".options-strategy-order-help-block").append(
                            $("<div/>").addClass("text-red").append("Order "+(i+1)+": "+data.Error)
                        );
                    }
                }else{
                    $(".options-strategy-order-help-block").append(
                        $("<div/>").addClass("text-green").append("Order "+(i+1)+": Successfully placed order.")
                    );
                }    
            }
            setTimeout(function(){
                $(".options-strategy-order-help-block").empty("");
            }, 10000);
        }
    });
});
