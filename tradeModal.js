(function ( $ ) {
 
    $.fn.tradeModal = function(options, attr1, attr2) {
        if(typeof options=="string"){
            switch (options) {
                case "error":
                    $("#stock-trade-modal .help-block").html(attr1);
                    setTimeout(function(){
                        $("#stock-trade-modal .help-block").html("");
                    }, 5000);
                break;
            
                case "success":
                    if(attr1){
                        alert(attr1);
                    }
                    $("#stock-trade-modal").modal("hide");
                break;

                case "close":
                    $("#stock-trade-modal").modal("hide");
                break;

                case "loading":
                    if(attr1){
                        $("#stock-trade-modal .loader").removeClass("hidden");
                    }else{
                        $("#stock-trade-modal .loader").addClass("hidden");
                    }             
                break;
        
                default:
                    break;
            }
            return;
        }
        

        // Extending settings from passed options
        const settings=$.extend({
            // These are the defaults.
            instrument:"EQUITY",
            symbol:null,
            quantity:1, 
            price:null,
            product:"cnc",
            order:"market",
            trigger:0,
            stoploss:0,
            target:0,
            variety:"rglr",
            validity:"day",
            discQuantity:1,
            slTrigger:0,
            tradeType:null,            
            onSubmit:function(data){
                console.log(data);
            }
        }, options );
        
        // Early error handling at the time of initialization in case any element doesn't have required attributes
        {
            let elms=$(this);
            for(let i=0;i<elms.length;i++){
                if(!$(elms[i]).attr("data-symbol")||$(elms[i]).attr("data-symbol")==""){
                    console.error("Stock symbol not defined. Please define stock symbol in 'data-symbol' attribute of the trigger button.");
                    return;
                }

                if(!$(elms[i]).attr("data-trade-type")||$(elms[i]).attr("data-trade-type")==""){
                    console.error("Stock trade type not defined. Please define stock symbol in 'data-trade-type' attribute of the trigger button.");
                    return;
                }

                if(!$(elms[i]).attr("data-price")||$(elms[i]).attr("data-price")==""){
                    console.error("Stock price not defined. Please define stock price in 'data-price' attribute of the trigger button.");
                    return;
                }

                if(!$(elms[i]).attr("data-quantity")||$(elms[i]).attr("data-quantity")==""){
                    $(elms[i]).attr("data-quantity", settings.quantity);
                }
        
                if(!$(elms[i]).attr("data-instrument")||$(elms[i]).attr("data-instrument")==""){
                    $(elms[i]).attr("data-instrument", settings.instrument);
                }
        
                if(!$(elms[i]).attr("data-product")||$(elms[i]).attr("data-product")==""){
                    $(elms[i]).attr("data-product", settings.product);
                }
        
                if(!$(elms[i]).attr("data-order")||$(elms[i]).attr("data-order")==""){
                    $(elms[i]).attr("data-order", settings.order);
                }
        
                if(!$(elms[i]).attr("data-trigger")||$(elms[i]).attr("data-trigger")==""){
                    $(elms[i]).attr("data-trigger", settings.trigger);
                }
        
                if(!$(elms[i]).attr("data-stoploss")||$(elms[i]).attr("data-stoploss")==""){
                    $(elms[i]).attr("data-stoploss", settings.stoploss);
                }
        
                if(!$(elms[i]).attr("data-target")||$(elms[i]).attr("data-target")==""){
                    $(elms[i]).attr("data-target", settings.target);
                }
        
                if(!$(elms[i]).attr("data-variety")||$(elms[i]).attr("data-variety")==""){
                    $(elms[i]).attr("data-variety", settings.variety);
                }
        
                if(!$(elms[i]).attr("data-validity")||$(elms[i]).attr("data-validity")==""){
                    $(elms[i]).attr("data-validity", settings.validity);
                }
        
                if(!$(elms[i]).attr("data-disc-quantity")||$(elms[i]).attr("data-disc-quantity")==""){
                    $(elms[i]).attr("data-disc-quantity", settings.discQuantity);
                }
        
                if(!$(elms[i]).attr("data-stoploss-trigger")||$(elms[i]).attr("data-stoploss-trigger")==""){
                    $(elms[i]).attr("data-stoploss-trigger", settings.slTrigger);
                }
            }
        }

        // If modal is already added in the body, no need to do it on initialization of every instance of the plugin
        if($("#stock-trade-modal").length==0){
            // HTML of modal to be opened
            const modalHTML=`<div class="modal fade stock-trade-modal stock-trade-modal" id="stock-trade-modal" tabindex="-1" role="dialog">
                <form class="stock-trade-form">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="loader hidden">
                                <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                    viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
                                    <path fill="#666" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                                        <animateTransform 
                                        attributeName="transform" 
                                        attributeType="XML" 
                                        type="rotate"
                                        dur="1s" 
                                        from="0 50 50"
                                        to="360 50 50" 
                                        repeatCount="indefinite" />
                                    </path>
                                </svg>
                            </div>

                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title stock-trade-symbol"></h4>
                                <div class="stock-trade-spot-price">Spot price: <span></span></div>
                                <input type="hidden" name="stock-trade-symbol-input" class="stock-trade-symbol-input"/>
                                <input type="hidden" name="stock-trade-fno-symbol-input" class="stock-trade-fno-symbol-input"/>
                                <input type="hidden" name="stock-trade-type-input" class="stock-trade-type-input"/>
                                <input type="hidden" name="stock-trade-lot-size-input" class="stock-trade-lot-size-input"/>
                                <input type="hidden" name="stock-trade-instrument" class="stock-trade-instrument"/>
                            </div>
                            
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-exchange" class="col-sm-2 control-label">Exchange</label>
                                                <div class="col-sm-10">
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-exchange" class="stock-trade-exchange" value="NSE" checked/> NSE
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-exchange"  class="stock-trade-exchange" value="BSE" disabled/> BSE
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 stock-trade-option-type-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-option-type" class="col-sm-2 control-label">Option Type</label>
                                                <div class="col-sm-10">
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-option-type" class="stock-trade-option-type" value="CE" checked/> Call
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-option-type"  class="stock-trade-option-type" value="PE"/> Put
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 stock-trade-expiry-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-expiry" class="col-sm-3 control-label">Expiry Date</label>
                                                <div class="col-sm-9">
                                                    <select class="form-control stock-trade-expiry" name="stock-trade-expiry">                                                        
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 stock-trade-strike-price-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-strike-price" class="col-sm-3 control-label">Strike Price</label>
                                                <div class="col-sm-9">
                                                    <select class="form-control stock-trade-strike-price" name="stock-trade-strike-price">                                                        
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-6 stock-trade-quantity-wrapper">
                                        <div class="form-group">
                                            <label for="stock-trade-quantity">Quantity</label>
                                            <input type="number" step="1" min="0" class="form-control stock-trade-quantity" name="stock-trade-quantity" placeholder="Quantity" value="1" />
                                        </div>
                                    </div>
                                    <div class="col-xs-6 stock-trade-lots-wrapper">
                                        <div class="form-group">
                                            <label for="stock-trade-lots">Number of Lots</label>
                                            <input type="number" step="1" min="0" class="form-control stock-trade-lots" name="stock-trade-quantity" placeholder="Number of lots" value="1" />
                                        </div>
                                    </div>
                                    <div class="col-xs-6">
                                        <div class="form-group">
                                            <label for="stock-trade-price">Price</label>
                                            <input type="number" step="0.01" min="0" class="form-control stock-trade-price" placeholder="Price" value="1" />
                                            <div class="stock-trade-last-traded-time"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">    
                                    <div class="col-xs-12 stock-trade-product-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-product" class="col-sm-2 control-label">Product</label>
                                                <div class="col-sm-10">
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-product" class="stock-trade-product" value="cnc" checked/> CNC
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-product"  class="stock-trade-product" value="mis"/> MIS
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 m-t-2">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-order" class="col-sm-2 control-label">Order</label>
                                                <div class="col-sm-10">
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-order" class="stock-trade-order" value="market" checked/> MARKET
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-order" class="stock-trade-order" value="limit"/> LIMIT
                                                    </label>
                                                    <!--<label class="radio-inline">
                                                        <input type="radio" name="stock-trade-order" class="stock-trade-order" value="sl"/> SL
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-order" class="stock-trade-order" value="slm"/> SLM
                                                    </label>-->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!--
                                    <div class="col-xs-12 trigger-input-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-trigger" class="col-sm-3 control-label">Trigger</label>
                                                <div class="col-sm-9">
                                                    <input type="number"  min="0" step="0.01" class="form-control stock-trade-trigger" placeholder="Trigger" value="1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    -->
                                    <!-- <div class="col-xs-12 stoploss-input-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-stoploss" class="col-sm-3 control-label">Stoploss (%)</label>
                                                <div class="col-sm-9">
                                                    <input type="number" step="0.01" class="form-control stock-trade-stoploss" placeholder="Stoploss" value="1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div> -->
                                    <!--<div class="col-xs-12 target-input-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-product" class="col-sm-3 control-label">Target (%)</label>
                                                <div class="col-sm-9">
                                                    <input type="number" step="0.01" max="100" min="0" class="form-control stock-trade-target" placeholder="Target" value="1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>-->
                                    <div class="col-xs-12 m-t-2">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-variety" class="col-sm-2 control-label">Variety</label>
                                                <div class="col-sm-10">
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-variety" class="stock-trade-variety" value="rglr" checked/> RGLR
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-variety" class="stock-trade-variety" value="co" disabled/> CO
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-variety" class="stock-trade-variety" value="sl" disabled/> AMO
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 m-t-2 validity-input-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-validity" class="col-sm-2 control-label">Validity</label>
                                                <div class="col-sm-10">
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-validity" class="stock-trade-validity" value="day" checked/> DAY
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-validity" class="stock-trade-validity" value="ioc" disabled/> IOC
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 disc-quantity-input-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-quantity" class="col-sm-3 control-label">Disc. Quantity</label>
                                                <div class="col-sm-9">
                                                    <input type="number" step="1" min="0" class="form-control stock-trade-disc-quantity" name="stock-trade-disc-quantity" placeholder="Disc. Quantity" value="1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 stoploss-trigger-input-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-stoploss-trigger" class="col-sm-3 control-label">SL Trigger</label>
                                                <div class="col-sm-9">
                                                    <input type="number" min="0" step="0.01" class="form-control stock-trade-stoploss-trigger" placeholder="Trigger" value="1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 text-center">
                                        <div class="help-block text-red"></div>
                                    </div>
                                </div>                                
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-success stock-trade-buy-button">Buy</button>
                                <button type="submit" class="btn btn-danger stock-trade-sell-button hidden">Sell</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>`;
            $("body").append(modalHTML);

            // Logics of trade modal
            $("#stock-trade-modal input[name='stock-trade-product']").change(function(e){
                if($("#stock-trade-modal input[name='stock-trade-product']:checked").val()=="cnc"){
                    $("#stock-trade-modal .target-input-wrapper, #stock-trade-modal .stoploss-input-wrapper").removeClass("hidden");
                }else{
                    $("#stock-trade-modal .target-input-wrapper, #stock-trade-modal .stoploss-input-wrapper").addClass("hidden");
                }
            });
        
            $("#stock-trade-modal input[name='stock-trade-order']").change(function(e){
                if($("#stock-trade-modal input[name='stock-trade-order']:checked").val()=="sl"||$("#stock-trade-modal input[name='stock-trade-order']:checked").val()=="slm"){
                    $("#stock-trade-modal .trigger-input-wrapper").removeClass("hidden");
                }else{
                    $("#stock-trade-modal .trigger-input-wrapper").addClass("hidden");
                }
        
                if($("#stock-trade-modal input[name='stock-trade-order']:checked").val()=="market"||$("#stock-trade-modal input[name='stock-trade-order']:checked").val()=="slm"){
                    $("#stock-trade-modal .stock-trade-price").prop("disabled", true);
                }else{
                    $("#stock-trade-modal .stock-trade-price").prop("disabled", false);
                }

                if($("#stock-trade-modal input[name='stock-trade-order']:checked").val()=="limit"){
                    $(".stock-trade-last-traded-time").addClass("hidden");
                }else{
                    $(".stock-trade-last-traded-time").removeClass("hidden");
                }
                
        
            });
        
            $("#stock-trade-modal input[name='stock-trade-validity']").change(function(e){
                if($("#stock-trade-modal input[name='stock-trade-validity']:checked").val()=="ioc"){
                    $("#stock-trade-modal .stock-trade-disc-quantity").prop("disabled", true);
                }else{
                    $("#stock-trade-modal .stock-trade-disc-quantity").prop("disabled", false);
                }
            });
        
            $("#stock-trade-modal input[name='stock-trade-variety']").change(function(e){
        
                if($("#stock-trade-modal input[name='stock-trade-variety']:checked").val()=="co"){
                    $("#stock-trade-modal .stock-trade-product[value=mis]").prop("checked", true).change();
                    $("#stock-trade-modal .stock-trade-product[value=cnc]").prop("disabled", true);
        
                    if($("#stock-trade-modal .stock-trade-order:checked").val()=="sl"||$("#stock-trade-modal .stock-trade-order:checked").val()=="slm"){
                        $("#stock-trade-modal .stock-trade-order[value='market']").prop("checked", true);
                    }

                    $("#stock-trade-modal .stock-trade-order:first").change();
                    $("#stock-trade-modal .stock-trade-order[value='sl'], #stock-trade-modal .stock-trade-order[value='slm']").prop("disabled", true);
        
        
                    $("#stock-trade-modal .validity-input-wrapper").addClass("hidden");
                    $("#stock-trade-modal .disc-quantity-input-wrapper").addClass("hidden");
                    $("#stock-trade-modal .stoploss-trigger-input-wrapper").removeClass("hidden");            
                }else{
                    $("#stock-trade-modal .stock-trade-product[value=cnc]").prop("disabled", false);
                    $("#stock-trade-modal .stock-trade-order[value='sl'], #stock-trade-modal .stock-trade-order[value='slm']").prop("disabled", false);
        
                    $("#stock-trade-modal .validity-input-wrapper").removeClass("hidden");
                    $("#stock-trade-modal .disc-quantity-input-wrapper").removeClass("hidden");
                    $("#stock-trade-modal .stoploss-trigger-input-wrapper").addClass("hidden");            
                }
            });

            $("#stock-trade-modal .stock-trade-expiry").change(function(e){
                e.preventDefault();
                if($("#stock-trade-modal .stock-trade-instrument").val()=="FUTURES"){
                    let ltp=$(this).find("option:selected").attr("data-ltp");
                    let ltt=$(this).find("option:selected").attr("data-last-traded-time");
                    $("#stock-trade-modal .stock-trade-price").val(ltp);
                    $("#stock-trade-modal .stock-trade-last-traded-time").text(ltt);

                }else if($("#stock-trade-modal .stock-trade-instrument").val()=="OPTIONS"){
                    let json=JSON.parse($(this).find("option:selected").attr("data-json"));
                    $("#stock-trade-modal .stock-trade-strike-price").empty();
                    for(let i=0;i<json.length;i++){
                        let option=$("<option/>").val(json[i].strikePrice).append(json[i].strikePrice);
                        if((i+1)==Math.ceil(json.length/2)){
                            option.prop("selected", true);
                        }
                        for(let j=0;j<json[i].putCallData.length;j++){
                            if(json[i].putCallData[j].optionType=="PE"){
                                option.attr("data-put-price", json[i].putCallData[j].ltp);
                                option.attr("data-last-traded-time", json[i].putCallData[j].lastTradedTime);
                            }else if(json[i].putCallData[j].optionType=="CE"){
                                option.attr("data-call-price", json[i].putCallData[j].ltp);
                                option.attr("data-last-traded-time", json[i].putCallData[j].lastTradedTime);
                            }
                        }                        
                        $("#stock-trade-modal .stock-trade-strike-price").append(option);
                    }
                    $("#stock-trade-modal .stock-trade-strike-price").change();                    
                }
            });

            $("#stock-trade-modal .stock-trade-strike-price").change(function(){
                if($("#stock-trade-modal .stock-trade-option-type:checked").val()=="CE"){
                    $(".stock-trade-price").val($("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-call-price"));
                    let ltt=$("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-last-traded-time");
                    $("#stock-trade-modal .stock-trade-last-traded-time").text(ltt);
                }else{
                    $(".stock-trade-price").val($("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-put-price"));
                    let ltt=$("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-last-traded-time");
                    $("#stock-trade-modal .stock-trade-last-traded-time").text(ltt);

                }
            });

            $("#stock-trade-modal .stock-trade-option-type").change(function(){
                if($("#stock-trade-modal .stock-trade-option-type:checked").val()=="CE"){
                    $(".stock-trade-price").val($("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-call-price"));
                }else{
                    $(".stock-trade-price").val($("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-put-price"));
                }
            });
        
            $("#stock-trade-modal input[name='stock-trade-product']:first").change();
            $("#stock-trade-modal input[name='stock-trade-order']:first").change();
            $("#stock-trade-modal input[name='stock-trade-variety']:first").change();
            $("#stock-trade-modal input[name='stock-trade-validity']:first").change();        

            // Collecting data back from the form
            $("#stock-trade-modal .stock-trade-form").submit(function(e){
                e.preventDefault();
                let tempSettings={...settings};
                delete tempSettings.onSubmit;
                tempSettings.optionType=$(this).find(".stock-trade-option-type").val();
                tempSettings.symbol=$(this).find(".stock-trade-symbol-input").val();
                tempSettings.instrument=$(this).find(".stock-trade-instrument").val();
                tempSettings.lotSize=$(this).find(".stock-trade-lot-size-input").val();
                tempSettings.expiry=$(this).find(".stock-trade-expiry").val();
                tempSettings.strikePrice=$(this).find(".stock-trade-strike-price").val();
                tempSettings.noOfLots=$(this).find(".stock-trade-lots").val();
                tempSettings.fnoSymbol=$(this).find(".stock-trade-fno-symbol-input").val();
                tempSettings.tradeType=$(this).find(".stock-trade-type-input").val();
                tempSettings.quantity=$(this).find(".stock-trade-quantity").val();
                tempSettings.price=$(this).find(".stock-trade-price").val();
                tempSettings.product=$(this).find(".stock-trade-product:checked").val();
                tempSettings.order=$(this).find(".stock-trade-order:checked").val();
                tempSettings.variety=$(this).find(".stock-trade-variety:checked").val();
                tempSettings.validity=$(this).find(".stock-trade-validity:checked").val();
                tempSettings.discQuantity=$(this).find(".stock-trade-disc-quantity").val();

                console.log("Order 0.1: ", {...tempSettings}, $(this).find(".stock-trade-order:checked").val());


                if(tempSettings.product=="cnc"){
                    tempSettings.stoploss=$(this).find(".stock-trade-stoploss").val();
                    tempSettings.target=$(this).find(".stock-trade-target").val();    
                }else{
                    delete tempSettings.stoploss;
                    delete tempSettings.target;
                }

                if(tempSettings.order=="sl"||tempSettings.order=="slm"){
                    tempSettings.trigger=$(this).find(".stock-trade-target").val();
                }else{
                    delete tempSettings.trigger;
                }

                if(tempSettings.variety=="co"){
                    delete tempSettings.validity;
                    delete tempSettings.discQuantity;
                    tempSettings.slTrigger=$(this).find(".stock-trade-stoploss-trigger").val()
                }else{
                    delete tempSettings.slTrigger;                   
                }

                console.log("Order: ", {...tempSettings}, $(this).find(".stock-trade-order:checked").val());

                settings.onSubmit(tempSettings);
            });
        }
    


        
        $(this).click(function(){
            $("#stock-trade-modal .loader").addClass("hidden");
            $("#stock-trade-modal .help-block").html("");
            $("#stock-trade-modal .stock-trade-instrument").val($(this).attr("data-instrument"));            

            let tempSettings=settings;
            tempSettings.symbol=$(this).attr("data-symbol");
            tempSettings.tradeType=$(this).attr("data-trade-type");

            $(".stock-trade-expiry-wrapper, .stock-trade-quantity-wrapper, .stock-trade-lots-wrapper, .stock-trade-strike-price-wrapper, .stock-trade-option-type-wrapper, .stock-trade-product-wrapper, .stock-trade-spot-price").removeClass("hidden");
            $("#stock-trade-modal .stock-trade-expiry").empty();
            if($(this).attr("data-instrument")=="EQUITY"){                
                $(".stock-trade-lots-wrapper, .stock-trade-expiry-wrapper, .stock-trade-strike-price-wrapper,  .stock-trade-option-type-wrapper, .stock-trade-spot-price").addClass("hidden");
            }else if($(this).attr("data-instrument")=="FUTURES"){
                $(".stock-trade-quantity-wrapper, .stock-trade-strike-price-wrapper, .stock-trade-option-type-wrapper, .stock-trade-product-wrapper").addClass("hidden");
                $.ajax({
                    url:"/dummydata/futures.json?action=getFuturesData&symbol="+tempSettings.symbol,
                    method:"get",
                    success:function(response){
                        console.log(response);
                        if(response.success){
                            for(let i=0;i<response.data.length;i++){
                                let option = $("<option/>")
                                    .val(response.data[i].expiryDate)
                                    .attr("data-ltp", response.data[i].ltp)
                                    .attr("data-last-traded-time", response.data[i].lastTradedTime)
                                    .append(response.data[i].expiryDate);

                                if(i==0){
                                    $(".stock-trade-fno-symbol-input").val(response.data[i].iciciSymbol);
                                    $(".stock-trade-lot-size-input").val(response.data[i].lotSize);                                    
                                }
                                
                                $("#stock-trade-modal .stock-trade-expiry").append(
                                    option
                                );
                            }
                            $("#stock-trade-modal .stock-trade-expiry").change();
                        }
                    }
                });
            }else {
                $(".stock-trade-quantity-wrapper, .stock-trade-product-wrapper").addClass("hidden");
                $.ajax({
                    url:"/dummydata/options.json?action=getOptionsData&symbol="+tempSettings.symbol,
                    method:"get",
                    context:$("#stock-trade-modal .stock-trade-expiry"),
                    success:function(response){
                        if(response.success){
                            $(".stock-trade-spot-price span").text(response.spotPrice);
                            for(let i=0;i<response.data.length;i++){                                
                                if(i==0){
                                    $(".stock-trade-fno-symbol-input").val(response.data[i].iciciSymbol);
                                    $(".stock-trade-lot-size-input").val(response.data[i].lotSize);
                                }
                                $("#stock-trade-modal .stock-trade-expiry").append(
                                    $("<option/>").val(response.data[i].expiryDate).attr("data-json", JSON.stringify(response.data[i].strikePrices)).append(response.data[i].expiryDate)
                                );
                            }
                            $("#stock-trade-modal .stock-trade-expiry").change();
                        }
                    }
                });
            }

            if($(this).attr("data-quantity")&&$(this).attr("data-quantity")!=""){
                tempSettings.quantity=$(this).attr("data-quantity");
                tempSettings.discQuantity=tempSettings.quantity;
            }

            if($(this).attr("data-price")&&$(this).attr("data-price")!=""){
                tempSettings.price=$(this).attr("data-price");
            }

            if($(this).attr("data-product")&&$(this).attr("data-product")!=""){
                tempSettings.product=$(this).attr("data-product");
            }

            if($(this).attr("data-order")&&$(this).attr("data-order")!=""){
                tempSettings.order=$(this).attr("data-order");
            }

            if($(this).attr("data-trigger")&&$(this).attr("data-trigger")!=""){
                tempSettings.trigger=$(this).attr("data-trigger");
            }

            if($(this).attr("data-stoploss")&&$(this).attr("data-stoploss")!=""){
                tempSettings.stoploss=$(this).attr("data-stoploss");
            }

            if($(this).attr("data-target")&&$(this).attr("data-target")!=""){
                tempSettings.target=$(this).attr("data-target");
            }

            if($(this).attr("data-variety")&&$(this).attr("data-variety")!=""){
                tempSettings.variety=$(this).attr("data-variety");
            }

            if($(this).attr("data-validity")&&$(this).attr("data-validity")!=""){
                tempSettings.validity=$(this).attr("data-validity");
            }            

            if($(this).attr("data-disc-quantity")&&$(this).attr("data-disc-quantity")!=""){
                tempSettings.discQuantity=$(this).attr("data-disc-quantity");
            }

            if($(this).attr("data-stoploss-trigger")&&$(this).attr("data-stoploss-trigger")!=""){
                tempSettings.slTrigger=$(this).attr("data-stoploss-trigger");
            }

            $("#stock-trade-modal .stock-trade-symbol").text(tempSettings.symbol);            
            $("#stock-trade-modal .stock-trade-symbol-input").val(tempSettings.symbol);
            $("#stock-trade-modal .stock-trade-type-input").val(tempSettings.tradeType);

            if(tempSettings.tradeType=="buy"){
                $("#stock-trade-modal .stock-trade-buy-button").removeClass("hidden");
                $("#stock-trade-modal .stock-trade-sell-button").addClass("hidden");
            }else{
                $("#stock-trade-modal .stock-trade-buy-button").addClass("hidden");
                $("#stock-trade-modal .stock-trade-sell-button").removeClass("hidden");
            }

            $("#stock-trade-modal .stock-trade-quantity").val(tempSettings.quantity);
            $("#stock-trade-modal .stock-trade-price").val(tempSettings.price);
            $("#stock-trade-modal .stock-trade-product[value="+tempSettings.product+"]").prop("checked", true);
            $("#stock-trade-modal .stock-trade-order[value="+tempSettings.order+"]").prop("checked", true);
            $("#stock-trade-modal .stock-trade-trigger").val(tempSettings.trigger);
            $("#stock-trade-modal .stock-trade-stoploss").val(tempSettings.stoploss);
            $("#stock-trade-modal .stock-trade-target").val(tempSettings.target);
            $("#stock-trade-modal .stock-trade-variety[value="+tempSettings.variety+"]").prop("checked", true);
            $("#stock-trade-modal .stock-trade-validity[value="+tempSettings.validity+"]").prop("checked", true);
            $("#stock-trade-modal .stock-trade-stoploss-trigger").val(tempSettings.slTrigger);
            $("#stock-trade-modal .stock-trade-disc-quantity").val(tempSettings.discQuantity);
            
            $("#stock-trade-modal input[name='stock-trade-product']:first").change();
            $("#stock-trade-modal input[name='stock-trade-order']:first").change();
            $("#stock-trade-modal input[name='stock-trade-variety']:first").change();
            $("#stock-trade-modal input[name='stock-trade-validity']:first").change();

            $(".stock-trade-modal").modal("show");
        });
    };
 
}( jQuery ));