(function ( $ ) {

    $.fn.tradeDetailsModal=function(options, attr1, attr2){
        {
            console.log("Trade details modal created");
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

                if(!$(elms[i]).attr("data-instrument")||$(elms[i]).attr("data-instrument")==""){
                    console.error("Instrument not defined. Please define instrument in 'data-instrument' attribute of the trigger button.");
                    return;
                }
            }
        }

        if($("#stock-trade-details-modal").length==0){
            const modalHTML=`
            <div class="modal fade stock-trade-details-modal" id="stock-trade-details-modal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="loader hidden">
                            <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100"
                                enable-background="new 0 0 0 0" xml:space="preserve">
                                <path fill="#666"
                                    d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s"
                                        from="0 50 50" to="360 50 50" repeatCount="indefinite" />
                                </path>
                            </svg>
                        </div>
        
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                    aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title stock-trade-symbol"></h4>
                            <span class="text-muted small">(Order reference no. <span class="order-ref"></span>)</span>
                        </div>
        
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <div class="row">
                                            <label for="stock-trade-type" class="col-sm-4 control-label">Trade Type</label>
                                            <div class="col-sm-8 stock-trade-type"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12">
                                    <div class="form-group">
                                        <div class="row">
                                            <label for="stock-trade-instrument"
                                                class="col-sm-4 control-label">Instrument</label>
                                            <div class="col-sm-8 stock-trade-instrument"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12">
                                    <table class="table trade-modification-details">
                                        <thead>
                                            <tr>
                                                <th class="col-xs-1">#</th>
                                                <th class="col-xs-4">
                                                    Datetime
                                                </th>
                                                <th class="col-xs-7">
                                                    Details
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>                                    
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" data-dismiss="modal" aria-label="Close">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            $("body").append(modalHTML);
        }

        
        $(this).click(function(e){
            e.preventDefault();
            
            $("#stock-trade-details-modal .stock-trade-symbol").text($(this).attr("data-symbol"));
            $("#stock-trade-details-modal .stock-trade-type").text($(this).attr("data-trade-type").toUpperCase());
            $("#stock-trade-details-modal .stock-trade-instrument").text($(this).attr("data-instrument").toUpperCase());

            $("#stock-trade-details-modal .trade-modification-details tbody").empty();

            const ref=$(this).attr("data-id");
            let obj={};
            let url="dummydata/orderBookDetailEquity.json", action="", subAction="";
            $("#stock-trade-details-modal .order-ref").text(ref);
            if($(this).attr("data-instrument")=="FUTURES"||$(this).attr("data-instrument")=="OPTIONS"){
                url="/dummydata/orderBookDetailFnO.json";
                action="a";
                subAction="b";
                obj={
                    order_refernece: ref,
                    order_flow: $(this).attr("data-trade-type")=="buy"?"B":"S"
                }
            }else{
                action="c";
                subAction="d";
                obj={
                    ORDR_RFRNC: ref,
                }
            }

            $.ajax({
                url:url,
                data: {
                    action: action,
                    subAction: subAction,
                    JSONPostData: JSON.stringify(obj)
                },
                method:"get",
                context:$(this),
                complete: function () {
                },
                success: function (data) {
                    console.log(data);
                    /*if (data.Status != "200") {
                        if (data.Status == "tc-401") {
                            alert("You're not authorised to perform this request. Please login and come back to this page. We're not redirecting you to the login page.");
                            window.location.href = "/?pageView=iciciLogin";
                            return;
                        }
                        else {
                            alert(data.Error||data.Success.message);
                        }
                        return;
                    }*/

                    if($(this).attr("data-instrument")=="EQUITY"){
                        for(let i=0;i<data.length;i++){
                            let d=data[i];
                            let bodytr=$("<tr/>");
                            bodytr
                                .append(
                                    $("<td/>").text(d.order_modification_counter)
                                )
                                .append(
                                    $("<td/>").text(d.order_xchng_ack_tm)
                                );
                            let detailsTd=$("<td/>");
                            let row=$("<div/>").addClass("row");
                            let col=$("<div/>").addClass("col-xs-12");
                            col.append(
                                $("<div/>").addClass("row")
                                    .append(
                                        $("<label/>").addClass("col-sm-4 control-label").append("Price")
                                    )
                                    .append(
                                        $("<div/>").addClass("col-sm-8").append(d.order_rate)
                                    )
                            );
                            row.append(col);
                            col=$("<div/>").addClass("col-xs-12");
                            col.append(
                                $("<div/>").addClass("row")
                                    .append(
                                        $("<label/>").addClass("col-sm-4 control-label").append("Quantity")
                                    )
                                    .append(
                                        $("<div/>").addClass("col-sm-8").append(d.order_qty)
                                    )
                            );
                            row.append(col);
                            col=$("<div/>").addClass("col-xs-12");
                            col.append(
                                $("<div/>").addClass("row")
                                    .append(
                                        $("<label/>").addClass("col-sm-4 control-label").append("Stoploss Price")
                                    )
                                    .append(
                                        $("<div/>").addClass("col-sm-8").append(d.order_stp_loss_price)
                                    )
                            );
                            row.append(col);
                            col=$("<div/>").addClass("col-xs-12");
                            col
                                .append(
                                    $("<label/>").addClass("control-label").append("Remarks")
                                )
                                .append(
                                    $("<div/>").append(d.order_remarks)
                                );
                            row.append(col);
                            detailsTd.append(row);
                            bodytr.append(detailsTd);
                            $("#stock-trade-details-modal .trade-modification-details tbody").append(bodytr);
                        }
                    }else{
                                                
                        for(let i=0;i<data.length;i++){
                            let d=data[i];
                            let bodytr=$("<tr/>");
                            bodytr
                                .append(
                                    $("<td/>").text(d.ModificationNumber)
                                )
                                .append(
                                    $("<td/>").text(d.ExchangeAcknowledgementDate)
                                );
                            let detailsTd=$("<td/>");
                            let row=$("<div/>").addClass("row");
                            let col=$("<div/>").addClass("col-xs-12");
                            col.append(
                                $("<div/>").addClass("row")
                                    .append(
                                        $("<label/>").addClass("col-sm-4 control-label").append("Price")
                                    )
                                    .append(
                                        $("<div/>").addClass("col-sm-8").append(d.Price)
                                    )
                            );
                            row.append(col);
                            col=$("<div/>").addClass("col-xs-12");
                            col.append(
                                $("<div/>").addClass("row")
                                    .append(
                                        $("<label/>").addClass("col-sm-4 control-label").append("Quantity")
                                    )
                                    .append(
                                        $("<div/>").addClass("col-sm-8").append(d.Quantity)
                                    )
                            );
                            row.append(col);
                            col=$("<div/>").addClass("col-xs-12");
                            col.append(
                                $("<div/>").addClass("row")
                                    .append(
                                        $("<label/>").addClass("col-sm-4 control-label").append("SLTPPrice")
                                    )
                                    .append(
                                        $("<div/>").addClass("col-sm-8").append(d.SLTPPrice)
                                    )
                            );
                            row.append(col);
                            col=$("<div/>").addClass("col-xs-12");
                            col
                                .append(
                                    $("<label/>").addClass("control-label").append("Remarks")
                                )
                                .append(
                                    $("<div/>").append(d.Remarks)
                                );
                            row.append(col);
                            detailsTd.append(row);
                            bodytr.append(detailsTd);
                            $("#stock-trade-details-modal .trade-modification-details tbody").append(bodytr);
                        }
                        //$("#stock-trade-details-modal .trade-modification-details thead, #stock-trade-details-modal .trade-modification-details tbody").empty();

                    }
                    
                    $("#stock-trade-details-modal").modal("show");                    
                }                
            });



            
        });
    }
 
    $.fn.tradeModal = function(options, attr1, attr2) {
        if(typeof options=="string"){
            switch (options) {
                case "error":
                    $("#stock-trade-modal .help-block").html(attr1);
                    setTimeout(function(){
                        $("#stock-trade-modal .help-block").html("");
                    }, 30000);
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
            id: null,
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
            indstk:"S",          
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

                if(!$(elms[i]).attr("data-indstk")||$(elms[i]).attr("data-indstk")==""){
                    $(elms[i]).attr("data-indstk", settings.indstk);
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
                                <input type="hidden" name="stock-trade-id" class="stock-trade-id"/>
                                <input type="hidden" name="stock-trade-symbol-input" class="stock-trade-symbol-input"/>
                                <input type="hidden" name="stock-trade-fno-symbol-input" class="stock-trade-fno-symbol-input"/>
                                <input type="hidden" name="stock-trade-type-input" class="stock-trade-type-input"/>
                                <input type="hidden" name="stock-trade-lot-size-input" class="stock-trade-lot-size-input"/>
                                <input type="hidden" name="stock-trade-instrument" class="stock-trade-instrument"/>
                                <input type="hidden" name="stock-trade-indstk" class="stock-trade-indstk"/>
                                <input type="hidden" name="stock-trade-extra-params" class="stock-trade-extra-params"/>
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
                                    <div class="col-xs-12 stoploss-input-wrapper">
                                        <div class="form-group">
                                            <div class="row">
                                                <label for="stock-trade-stoploss" class="col-sm-3 control-label">Stoploss</label>
                                                <div class="col-sm-9">
                                                    <input type="number" step="0.01" class="form-control stock-trade-stoploss" placeholder="Stoploss" value="0" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                /*if($("#stock-trade-modal input[name='stock-trade-product']:checked").val()=="cnc"){                    
                    $("#stock-trade-modal .target-input-wrapper, #stock-trade-modal .stoploss-input-wrapper").removeClass("hidden");
                }else{
                    $("#stock-trade-modal .target-input-wrapper, #stock-trade-modal .stoploss-input-wrapper").addClass("hidden");
                }*/
            });
        
            $("#stock-trade-modal input[name='stock-trade-order']").change(function(e){
                if($("#stock-trade-modal input[name='stock-trade-order']:checked").val()=="sl"||$("#stock-trade-modal input[name='stock-trade-order']:checked").val()=="slm"){
                    $("#stock-trade-modal .trigger-input-wrapper").removeClass("hidden");
                    $("#stock-trade-modal .stoploss-input-wrapper").removeClass("hidden");
                }else{
                    $("#stock-trade-modal .stoploss-input-wrapper").addClass("hidden");
                }
        
                if($("#stock-trade-modal input[name='stock-trade-order']:checked").val()=="market"||$("#stock-trade-modal input[name='stock-trade-order']:checked").val()=="slm"){
                    $("#stock-trade-modal .stock-trade-price").prop("disabled", true);
                }else{
                    $("#stock-trade-modal .stock-trade-price").prop("disabled", false);
                }

                if($("#stock-trade-modal input[name='stock-trade-order']:checked").val()=="limit"){
                    $("#stock-trade-modal .stock-trade-last-traded-time").addClass("hidden");
                }else{
                    $("#stock-trade-modal .stock-trade-last-traded-time").removeClass("hidden");
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
                console.log("Change triggered.");
                if($("#stock-trade-modal .stock-trade-instrument").val()=="FUTURES"){
                    if(!$(this).prop("disabled")){
                        let ltp=$(this).find("option:selected").attr("data-ltp");
                        let ltt=$(this).find("option:selected").attr("data-last-traded-time");
    
                        $("#stock-trade-modal .stock-trade-price").val(ltp);
                        $("#stock-trade-modal .stock-trade-last-traded-time").text(ltt);    
                    }
                }else if($("#stock-trade-modal .stock-trade-instrument").val()=="OPTIONS"){
                    let json=JSON.parse($(this).find("option:selected").attr("data-json"));
                    $("#stock-trade-modal .stock-trade-strike-price").empty();

                    let strikePrice=null
                    if($("#stock-trade-modal .stock-trade-expiry option:selected").attr("data-strike-price")&&$("#stock-trade-modal .stock-trade-expiry option:selected").attr("data-strike-price")!=""){
                        strikePrice=$("#stock-trade-modal .stock-trade-expiry option:selected").attr("data-strike-price");
                    }

                    for(let i=0;i<json.length;i++){
                        let option=$("<option/>").val(json[i].strikePrice).append(json[i].strikePrice);
                        
                        if(strikePrice!=null){
                            if(strikePrice==json[i].strikePrice){
                                option.prop("selected", true);                                
                            }
                        }else if((i+1)==Math.ceil(json.length/2)){
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
                    if(!$(this).prop("disabled")){
                        $("#stock-trade-modal .stock-trade-price").val($("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-call-price"));
                        let ltt=$("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-last-traded-time");
                        $("#stock-trade-modal .stock-trade-last-traded-time").text(ltt);
                    }
                }else{
                    if(!$(this).prop("disabled")){
                        $("#stock-trade-modal .stock-trade-price").val($("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-put-price"));
                        let ltt=$("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-last-traded-time");
                        $("#stock-trade-modal .stock-trade-last-traded-time").text(ltt);
                    }
                }
            });

            $("#stock-trade-modal .stock-trade-option-type").change(function(){
                if($("#stock-trade-modal .stock-trade-option-type:checked").val()=="CE"){
                    $("#stock-trade-modal .stock-trade-price").val($("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-call-price"));
                }else{
                    $("#stock-trade-modal .stock-trade-price").val($("#stock-trade-modal .stock-trade-strike-price option:selected").attr("data-put-price"));
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
                tempSettings.id=$(this).find(".stock-trade-id").val();
                tempSettings.optionType=$(this).find(".stock-trade-option-type:checked").val();
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
                tempSettings.indstk=$(this).find(".stock-trade-indstk").val();
                tempSettings.stoploss=$(this).find(".stock-trade-stoploss").val();

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
                let extraParams=null;
                if($("#stock-trade-modal .stock-trade-extra-params").val()!=""){
                    extraParams=$("#stock-trade-modal .stock-trade-extra-params").val();                    
                    extraParams=JSON.parse(extraParams);
                }
                settings.onSubmit(tempSettings, extraParams);
            });
        }
    


        
        $(this).click(function(){
            $("#stock-trade-modal .loader").addClass("hidden");
            $("#stock-trade-modal .help-block").html("");
            $("#stock-trade-modal .stock-trade-instrument").val($(this).attr("data-instrument"));            
            $("#stock-trade-modal .stock-trade-indstk").val($(this).attr("data-indstk"));

                        

            let tempSettings=settings;
            tempSettings.symbol=$(this).attr("data-symbol");
            tempSettings.tradeType=$(this).attr("data-trade-type");

            if($(this).attr("data-id")&&$(this).attr("data-id")!=""){
                tempSettings.id=$(this).attr("data-id");
            }else{
                tempSettings.id=null;
            }

            $("#stock-trade-modal .stock-trade-expiry-wrapper, #stock-trade-modal .stock-trade-quantity-wrapper, #stock-trade-modal .stock-trade-lots-wrapper, #stock-trade-modal .stock-trade-strike-price-wrapper, #stock-trade-modal .stock-trade-option-type-wrapper, #stock-trade-modal .stock-trade-product-wrapper, #stock-trade-modal .stock-trade-spot-price").removeClass("hidden");
            $("#stock-trade-modal .stock-trade-expiry").empty();
            if($(this).attr("data-instrument")=="EQUITY"){                
                $("#stock-trade-modal .stock-trade-lots-wrapper, #stock-trade-modal .stock-trade-expiry-wrapper, #stock-trade-modal .stock-trade-strike-price-wrapper,  #stock-trade-modal .stock-trade-option-type-wrapper, #stock-trade-modal .stock-trade-spot-price").addClass("hidden");
            }else if($(this).attr("data-instrument")=="FUTURES"){
                if(tempSettings.id){
                    $(".stock-trade-expiry").prop("disabled", true);
                }else{
                    $(".stock-trade-expiry").prop("disabled", false);
                }

                $("#stock-trade-modal .stock-trade-quantity-wrapper, #stock-trade-modal .stock-trade-strike-price-wrapper, #stock-trade-modal .stock-trade-option-type-wrapper, #stock-trade-modal .stock-trade-product-wrapper").addClass("hidden");
                $.ajax({
                    url:"/dummydata/futures.json?action=getFuturesData&symbol="+tempSettings.symbol,
                    method:"get",
                    context:$(this),
                    success:function(response){                        
                        if(response.success){
                            let expiryDate=null;
                            if($(this).attr("data-expiry")&&$(this).attr("data-expiry")!=""){
                                expiryDate=$(this).attr("data-expiry");
                            }
                            for(let i=0;i<response.data.length;i++){
                                let option = $("<option/>")
                                    .val(response.data[i].expiryDate)
                                    .attr("data-ltp", response.data[i].ltp)
                                    .attr("data-last-traded-time", response.data[i].lastTradedTime)
                                    .append(response.data[i].expiryDate);

                                if(i==0){
                                    $("#stock-trade-modal .stock-trade-fno-symbol-input").val(response.data[i].iciciSymbol);
                                    $("#stock-trade-modal .stock-trade-lot-size-input").val(response.data[i].lotSize);                                    
                                }

                                if(expiryDate!=null&&response.data[i].expiryDate==expiryDate){
                                    option.prop("selected", true);
                                }
                                
                                $("#stock-trade-modal .stock-trade-expiry").append( option );
                            }

                            $("#stock-trade-modal .stock-trade-expiry").change();
                        }
                    }
                });
            }else {
                if(tempSettings.id){
                    $(".stock-trade-option-type, .stock-trade-expiry, .stock-trade-strike-price").prop("disabled", true);
                }else{
                    $(".stock-trade-option-type, .stock-trade-expiry, .stock-trade-strike-price").prop("disabled", false);
                }

                $("#stock-trade-modal .stock-trade-quantity-wrapper, #stock-trade-modal .stock-trade-product-wrapper").addClass("hidden");
                $.ajax({
                    url:"/dummydata/options.json?action=getOptionsData&symbol="+tempSettings.symbol,
                    method:"get",
                    context:$(this),
                    success:function(response){
                        if(response.success){
                            $("#stock-trade-modal .stock-trade-spot-price span").text(response.spotPrice);
                            let expiryDate=null, strikePrice=null;
                            if($(this).attr("data-expiry")&&$(this).attr("data-expiry")!=""){
                                expiryDate=$(this).attr("data-expiry");
                            }
                            if($(this).attr("data-strike-price")&&$(this).attr("data-strike-price")!=""){
                                strikePrice=$(this).attr("data-strike-price");
                            }
                            for(let i=0;i<response.data.length;i++){
                                let option=$("<option/>").val(response.data[i].expiryDate).attr("data-json", JSON.stringify(response.data[i].strikePrices)).append(response.data[i].expiryDate);
                                if(i==0){
                                    $("#stock-trade-modal .stock-trade-fno-symbol-input").val(response.data[i].iciciSymbol);
                                    $("#stock-trade-modal .stock-trade-lot-size-input").val(response.data[i].lotSize);
                                }
                                if(expiryDate!=null&&response.data[i].expiryDate==expiryDate){
                                    option.prop("selected", true);
                                    if(expiryDate!=null){
                                        option.attr("data-strike-price", strikePrice);
                                    }
                                }
                                $("#stock-trade-modal .stock-trade-expiry").append( option );
                            }
                            if($(this).attr("data-quantity")&&$(this).attr("data-quantity")!=""){
                                tempSettings.noOfLots=$(this).attr("data-quantity")/response.data[0].lotSize;
                                $("#stock-trade-modal .stock-trade-lots").val(tempSettings.noOfLots);
                            }
                            $("#stock-trade-modal .stock-trade-expiry").change();
                        }
                    }
                });
            }

            if($(this).attr("data-extra-params")&&$(this).attr("data-extra-params")!=""){
                $("#stock-trade-modal .stock-trade-extra-params").val($(this).attr("data-extra-params"));
            }

            if($(this).attr("data-quantity")&&$(this).attr("data-quantity")!=""){
                tempSettings.quantity=$(this).attr("data-quantity");
                tempSettings.discQuantity=tempSettings.quantity;
            }

            if($(this).attr("data-price")&&$(this).attr("data-price")!=""){
                tempSettings.price=$(this).attr("data-price");
            }

            if($(this).attr("data-option-type")&&$(this).attr("data-option-type")!=""){
                tempSettings.optionType=$(this).attr("data-option-type");
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
            $("#stock-trade-modal .stock-trade-id").val(tempSettings.id||"");

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
            $("#stock-trade-modal .stock-trade-option-type[value="+tempSettings.optionType+"]").prop("checked", true);
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