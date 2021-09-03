$(document).ready(function(){
    $.fn.tradeConfirmationModal=function(options, attr1, attr2){
        if($("#trade-confirmation-modal").length==0){
            const modalHTML=`
            <div class="modal" id="trade-confirmation-modal">
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
                        <div class="modal-body">
                            <h2>The following trades will be placed on confirmation.</h2>
                            <div class="">
                                <table style="width:100%;" class="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Symbol</th>                                
                                            <th>Quantity</th>
                                            <th>Close</th>
                                            <th>Investment Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success place-trade-button">Confirm</button>
                        </div>
                    </div>            
                </div>
            </div>
            `;
            $("body").append(modalHTML);

            $("#trade-confirmation-modal .place-trade-button").click(function(e){
                e.preventDefault();
                const rows=$("#trade-confirmation-modal table tbody tr");
                const trades=[];
                for(let i=0;i<rows.length-1;i++){
                    const columns=$(rows[i]).find("td");
                    const obj={
                        "Basket_ORD_STCK_CD":$(columns[0]).find("a").text(),
                        "Basket_ORD_XCHNG_CD":"NSE",
                        "Basket_ORD_PRDCT_TYP":"C",
                        "Basket_ORD_ORDR_FLW":"B",
                        "Basket_ORD_EXCTD_QTY":$(columns[1]).text(),
                        "Basket_ORD_TYP":"M",
                        "Basket_ORD_EXCTD_RT":"0",
                        "Basket_ORD_STP_LSS":"0",
                        "Basket_GMS_CSH_PRDCT_PRCNTG":"0",
                        "Basket_ORD_DSCLSD_QTY":"0",
                        "Basket_RQST_TYP":"",
                        "Basket_POINT_TYPE":"T",
                        "Basket_SQ_FLAG":"",
                        "MsgTyp":null,
                        "Remark":null
                    };
                    trades.push(obj);
                }
                const obj={
                    _inputListData:trades
                }

                $.ajax({
                    url:"/icici",
                    data:{
                        action:"cashOrder",
                        subAction: "placeBasketOrder",
                        JSONPostData:JSON.stringify(obj)
                    },
                    method:"post",
                    beforeSend:function(){
                        $("#stock-trade-modal .loader").removeClass("hidden");
                    },
                    complete:function(){
                        $("#stock-trade-modal .loader").addClass("hidden");
                    },
                    success:function(data){
                        console.log(data);
                    }
                });
            });
        }

        $(this).click(function(e){
            e.preventDefault();
            console.log("Button clicked");
            const tableRef=$($(this).attr("data-trade-details-table"));
            $("#trade-confirmation-modal table tbody").empty();
            $("#trade-confirmation-modal table tbody").append(
                $(tableRef).find("tbody").html()
            );

            const rows=$("#trade-confirmation-modal table tbody tr");
            let totalValue=0;
            for(let i=0;i<rows.length;i++){
                const columns=$(rows[i]).find("td");
                const invValue=parseFloat($(columns[3]).text());
                totalValue+=invValue;
            }
            $("#trade-confirmation-modal table tbody").append(
                $("<tr/>").append(
                    $("<td/>").attr("colspan", 3).append("Total Investment Value")
                ).append(
                    $("<td/>").append(totalValue)
                )
            );
            $("#trade-confirmation-modal").modal("show");
        });
    };
});