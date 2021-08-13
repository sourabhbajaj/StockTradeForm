(function ( $ ) {
 
    $.fn.tradeModal = function(options, attr1, attr2) {
        if(typeof options=="string"){
            switch (options) {
                case "error":
                    
                break;
            
                case "success":
                    
                break;

                case "close":
                    
                break;
        
                default:
                    break;
            }
            return;
        }
        

        // Extending settings from passed options
        const settings=$.extend({
            // These are the defaults.
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

                if(!$(this).attr("data-price")||$(this).attr("data-price")==""){
                    console.error("Stock price not defined. Please define stock price in 'data-price' attribute of the trigger button.");
                    return;
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
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title stock-trade-symbol">ASHOKLEY</h4>
                                <input type="hidden" name="stock-trade-symbol-input" class="stock-trade-symbol-input"/>
                                <input type="hidden" name="stock-trade-type-input" class="stock-trade-type-input"/>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-xs-6">
                                        <div class="form-group">
                                            <label for="stock-trade-quantity">Quantity</label>
                                            <input type="number" step="1" min="0" class="form-control stock-trade-quantity" name="stock-trade-quantity" placeholder="Quantity" value="1" />
                                        </div>
                                    </div>
                                    <div class="col-xs-6">
                                        <div class="form-group">
                                            <label for="stock-trade-price">Price</label>
                                            <input type="number" step="0.01" min="0" class="form-control stock-trade-price" placeholder="Price" value="1" />
                                        </div>
                                    </div>
                                    <div class="col-xs-12">
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
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-order" class="stock-trade-order" value="sl"/> SL
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-order" class="stock-trade-order" value="slm"/> SLM
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                    <div class="col-xs-12 stoploss-input-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-stoploss" class="col-sm-3 control-label">Stoploss (%)</label>
                                                <div class="col-sm-9">
                                                    <input type="number" step="0.01" class="form-control stock-trade-stoploss" placeholder="Stoploss" value="1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 target-input-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-product" class="col-sm-3 control-label">Target (%)</label>
                                                <div class="col-sm-9">
                                                    <input type="number" step="0.01" max="100" min="0" class="form-control stock-trade-target" placeholder="Target" value="1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 m-t-2">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-variety" class="col-sm-2 control-label">Variety</label>
                                                <div class="col-sm-10">
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-variety" class="stock-trade-variety" value="rglr" checked/> RGLR
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-variety" class="stock-trade-variety" value="co"/> CO
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" name="stock-trade-variety" class="stock-trade-variety" value="sl"/> AMO
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
                                                        <input type="radio" name="stock-trade-validity" class="stock-trade-validity" value="ioc"/> IOC
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
        
            $("#stock-trade-modal input[name='stock-trade-product']:first").change();
            $("#stock-trade-modal input[name='stock-trade-order']:first").change();
            $("#stock-trade-modal input[name='stock-trade-variety']:first").change();
            $("#stock-trade-modal input[name='stock-trade-validity']:first").change();        

            // Collecting data back from the form
            $("#stock-trade-modal .stock-trade-form").submit(function(e){
                e.preventDefault();
                let tempSettings={...settings};
                delete tempSettings.onSubmit;
                tempSettings.symbol=$(this).find(".stock-trade-symbol-input").val();
                tempSettings.tradeType=$(this).find(".stock-trade-type-input").val();
                tempSettings.quantity=$(this).find(".stock-trade-quantity").val();
                tempSettings.price=$(this).find(".stock-trade-price").val();
                tempSettings.product=$(this).find(".stock-trade-product:checked").val();
                tempSettings.order=$(this).find(".stock-trade-order:checked").val();
                tempSettings.variety=$(this).find(".stock-trade-variety:checked").val();
                tempSettings.validity=$(this).find(".stock-trade-validity:checked").val();
                tempSettings.discQuantity=$(this).find(".stock-trade-disc-quantity").val();

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

                settings.onSubmit(tempSettings);
            });
        }        
        
        $(this).click(function(){            
            let tempSettings=settings;
            tempSettings.symbol=$(this).attr("data-symbol");
            tempSettings.tradeType=$(this).attr("data-trade-type");
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