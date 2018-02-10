require(["dpz.template", "dpz.stjude"], function(template, stjude) {
    var DEFAULT_SERVICE_METHOD = "";
    var DEFAULT_OLD_STATUS = "default";
    var DEFAULT_STORE_ID = "";

    TrackerBar = (function() {
        var selector = ".tracker";
        var oldStatus = DEFAULT_OLD_STATUS;
        var oldServiceMethod = DEFAULT_SERVICE_METHOD;
        var oldStoreID = DEFAULT_STORE_ID;
        var tr = template.translate;
        var trackData;
        var tokenValue = {
            ManagerName: tr("tracker.our_expert_pizza_maker"),
            CsrName: tr("tracker.our_expert_customer_representative"),
            DriverName: tr("tracker.our_delivery_expert"),
            StartTime: "",
            OvenTime: "",
            RackTime: "",
            RouteTime: "",
            AdvancedOrderDate: "",
            AdvancedOrderTime: ""
        };

        var trackerPromise;
        var resolveTrackerPromise = function(promise, handle) {
            promise.resolve($(handle));
            $(handle.contentWindow).one("unload", function() {
                trackerPromise = undefined;
                oldStatus = DEFAULT_OLD_STATUS;
                oldServiceMethod = DEFAULT_SERVICE_METHOD;
            });
        };

        var trackerPromiseFactory = function() {
            var trackerIframeDetector;
            return $.Deferred(function(promise) {
                var trackerHandle = document.getElementById("tracker__handle");

                if (trackerHandle === null) {
                    trackerIframeDetector = function() {
                        $("#tracker__handle").one("load", function(event) {
                            resolveTrackerPromise(promise, event.target, 2);
                        });
                        jsDPZ.topic("trackerIframeReady").unsubscribe(trackerIframeDetector);
                    };

                    jsDPZ.topic("trackerIframeReady").subscribe(trackerIframeDetector);
                } else if (trackerHandle.contentDocument.body && (trackerHandle.contentDocument.body.innerHTML.length > 0 || trackerHandle.contentWindow.document.body.innerHTML.length > 0)) {
                    resolveTrackerPromise(promise, trackerHandle, 1);
                } else {
                    $("#tracker__handle").one("load", function(event) {
                        resolveTrackerPromise(promise, event.target, 3);
                    });
                }
            });
        };

        var sendUpdate = function(event, trackerData) {
            trackerPromise = trackerPromise || trackerPromiseFactory();

            trackerPromise.then(function($trackerHandle) {
                $trackerHandle.get(0).contentWindow.postMessage(JSON.stringify($.extend({
                    type: event,
                    lang: dpz.market.marketCode + "-" + dpz.market.activeLanguageCode,
                    direction: $("html").attr("dir") ? $("html").attr("dir") : "LTR",
                    width: $trackerHandle.width()
                }, trackerData)), window.location.origin);
            });
        };

        function formatDate(date) { // Format Date to MM/DD/YY
            return date ? moment(date.split(/T|\s/)[0], "YYYY-MM-DD").format(dpz.market.marketConfig.date.format.DATE) : "";
        }

        function capitalizeName(name) { // Capitalize Name ex: JOHN -> John
            return name ? name.charAt(0).toUpperCase() + name.substr(1).toLowerCase() : "";
        }

        function tokenize(n) {
            var keys = n.match(/\$\w*\$/g);
            var token;
            var val;
            var key;

            for (key in keys) {
                token = keys[key];
                if (typeof token === "string") {
                    val = token.replace(/\$/g, "");
                    n = n.replace(token, tokenValue[val]);
                }
            }

            return n;
        }

        function formatTime(time) { // Format time to hh:mm
            var morningSuffix = "AM";
            var nightSuffix = "PM";
            var tmpWhole;
            var tmpArray;
            var convertedTime = "";
            if (time && !dpz.market.marketConfig.date.format.MILITARY) {
                tmpWhole = time.split(/T|\s/);
                tmpArray = tmpWhole[1].split(":");

                if (tmpArray[0] > 12) {
                    convertedTime = (tmpArray[0] - 12) + ":" + tmpArray[1] + " " + nightSuffix;
                    if (tmpArray[0].charAt(0) === "0") {
                        tmpArray[0] = parseInt(tmpArray[0], 10);
                    }
                }
                if (tmpArray[0] === 12) {
                    convertedTime = tmpArray[0] + ":" + tmpArray[1] + " " + nightSuffix;
                }
                if (tmpArray[0] < 12) {
                    if (tmpArray[0].charAt(0) === "0") {
                        tmpArray[0] = parseInt(tmpArray[0], 10);
                    }
                    convertedTime = tmpArray[0] + ":" + tmpArray[1] + " " + morningSuffix;
                }
                if (tmpArray[0] === 00) {
                    convertedTime = "12:" + tmpArray[1] + " " + morningSuffix;
                }
                return convertedTime;
            } else if (time && dpz.market.marketConfig.date.format.MILITARY) {
                tmpWhole = time.split("T");
                return tmpWhole[1];
            } else {
                return "";
            }
        }

        function setOrderDetails(serviceMethod, storeId) {
            var orderDetails = {
                serviceMethod: serviceMethod ? serviceMethod.toUpperCase() : "",
                storeid: storeId
            };

            if (stjude.stjudeIsActive()) {
                orderDetails.stJudeHasDonated = stjude.donationInCart();
            }

            sendUpdate("setOrderDetails", orderDetails);
        }

        function setStatusLabels(serviceMethod) {
            var labels = {
                stage1: tr("tracker.order_placed"),
                stage2: tr("tracker.prep"),
                stage3: tr("tracker.bake"),
                stage4: tr("tracker.quality_check")
            };
            if (serviceMethod === "Delivery" || serviceMethod === "DELIVERY" || /* START HOTSPOTS */ serviceMethod === "HOTSPOT" || serviceMethod === "Hotspot" || /* END HOTSPOTS */ serviceMethod === undefined) {
                labels.stage5 = tr("tracker.out_for_delivery");
            } else if (serviceMethod === "DineIn" || serviceMethod === "DINEIN" || serviceMethod === "Dine-In") {
                labels.stage5 = tr("tracker.ready_for_dine_in");
            } else {
                labels.stage5 = tr("tracker.ready_for_pickup");
            }

            sendUpdate("setLabels", labels);
        }

        function setFlavorText(leftNum, rightNum) {
            sendUpdate("setFlavorText", { major: tokenize(leftNum), minor: rightNum ? tokenize(rightNum) : "" });
        }

        function setOrderStatus(orderStatus, serviceMethod) {
            var fallThroughCase = false;
            var isStageSet = false;
            // the new OrderStatus service returns order status in all caps with words separated by underscores.
            // the old service has title casing, separated by spaces. This next line is a way to normalize the two.
            orderStatus = orderStatus.split(/\s|_/).join("_").toUpperCase();

            if (serviceMethod !== undefined) {
                serviceMethod = serviceMethod.toUpperCase(); // normalize service method as well
            }

            if (oldStatus !== orderStatus) {
                // Adobe Analytics Calls
                dpz.utag.fire.link(undefined, {
                    event_name: orderStatus,
                    event_action: "update",
                    event_category: serviceMethod,
                    event_label: site.isConfirmationPage ? "tracker" : "phone tracker"
                });

                // This switch statement sets the data-attributes on the parent tracker element based on the current order status
                switch (orderStatus) {
                    case "COMPLETE" : // Falls through to Next Case
                        if (!isStageSet) {
                            sendUpdate("statusChange", { stage: "5", status: "complete" });
                            isStageSet = true;
                        }
                        if (serviceMethod === "Delivery" || serviceMethod === "DELIVERY") {
                            sendUpdate("setLabels", { stage5: tr("tracker.order_has_been_delivered") });
                            setFlavorText(tr("tracker.mmm_its_there"), tr("tracker.we_hope_youre_enjoying_your"));
                        } else {
                            setFlavorText(tr("tracker.mmm_its_all_yours"), tr("tracker.thanks_for_picking_up_your"));
                        }
                        fallThroughCase = true;
                        break;
                    case "OUT_THE_DOOR" : // Falls through to Next Case
                        if (!isStageSet) {
                            sendUpdate("statusChange", { stage: "4", status: "complete" });
                            isStageSet = true;
                        }

                        if (!fallThroughCase) {
                            sendUpdate("statusChange", { stage: "5", status: "pending" });
                            isStageSet = true;

                            setFlavorText(tr("tracker.were_on_the_way"), tr("tracker.drivername_left_the_store_with"));

                            fallThroughCase = true;
                        }
                        break;
                    case "ROUTING_STATION" : // Falls through to Next Case
                        if (serviceMethod === "Delivery" || serviceMethod === "DELIVERY") {
                            if (!fallThroughCase) {
                                sendUpdate("statusChange", { stage: "4", status: "pending" });
                                isStageSet = true;

                                setFlavorText(tr("tracker.perfection_check_complete"), tr("tracker.managername_double_checked_your_order"));
                                fallThroughCase = true;
                            }
                        } else { // Carry-out
                            if (!fallThroughCase) {
                                sendUpdate("statusChange", { stage: "5", status: "pending" });
                                isStageSet = true;

                                setFlavorText(tr("tracker.its_boxed_and_ready_to"), tr("We have your order ready for pickup as of $RackTime$."));
                                fallThroughCase = true;
                            }
                        }
                        break;
                    case "BEING_ASSIGNED" : // Falls through to Next Case
                        if (!isStageSet) {
                            sendUpdate("statusChange", { stage: "3", status: "complete" });
                            isStageSet = true;
                        }
                        if (!fallThroughCase) {
                            sendUpdate("statusChange", { stage: "4", status: "pending" });
                            isStageSet = true;

                            fallThroughCase = true;
                        }
                        break;
                    case "OVEN" : // Falls through to Next Case
                        if (!isStageSet) {
                            sendUpdate("statusChange", { stage: "2", status: "complete" });
                            isStageSet = true;
                        }
                        if (!fallThroughCase) {
                            sendUpdate("statusChange", { stage: "3", status: "pending" });
                            isStageSet = true;

                            setFlavorText(tr("tracker.your_order_is_in_the_oven"), tr("tracker.managername_put_your_order_in"));
                            fallThroughCase = true;
                        }
                        break;
                    case "MAKELINE" : // Falls through to Next Case
                        if (!isStageSet) {
                            sendUpdate("statusChange", { stage: "1", status: "complete" });
                            isStageSet = true;
                        }
                        if (!fallThroughCase) {
                            sendUpdate("statusChange", { stage: "2", status: "pending" });
                            isStageSet = true;

                            setFlavorText(tr("tracker.were_firing_it_up"), tr("tracker.managername_began_custom_making_your"));
                            fallThroughCase = true;
                        }
                        break;
                    case "BEING_TAKEN" :
                        if (!fallThroughCase) {
                            sendUpdate("statusChange", { stage: "1", status: "pending" });
                            isStageSet = true;

                            setFlavorText(tr("tracker.your_order_is_in"), tr("tracker.csrname_received_your_order_at"));
                            fallThroughCase = true;
                        }
                        break;
                    case "DEFAULT_ORDER_PLACED" :
                        if (!fallThroughCase) {
                            sendUpdate("statusChange", { stage: "1", status: "complete" });
                            isStageSet = true;

                            setFlavorText(tr("tracker.your_order_is_in"), tr("tracker.csrname_received_your_order"));
                            fallThroughCase = true;
                        }
                        break;
                    case "FUTURE" :
                        if (!isStageSet) {
                            sendUpdate("statusChange", { stage: "1", status: "complete" });
                            isStageSet = true;
                        }
                        setFlavorText(tr("tracker.your_future_order_is_in"), tr("tracker.well_have_your_order_ready"));
                        fallThroughCase = true;

                        break;
                    case "ABANDONED" :
                    case "BAD" :
                    case "VOID" :
                    default :
                        break;
                }
                oldStatus = orderStatus;
                // Add/remove class on parent element to trigger DOM repaint in non-HTML5 browsers
                $(selector).addClass("trkrp").removeClass("trkrp");
            }
        }

        function updateTrackerBar(TrackerData) {
            trackData = TrackerData;
            if (trackData) {
                if (trackData.ManagerName) { tokenValue.ManagerName = capitalizeName(trackData.ManagerName); }
                if (trackData.CsrName) { tokenValue.CsrName = capitalizeName(trackData.CsrName); }
                if (trackData.DriverName) { tokenValue.DriverName = capitalizeName(trackData.DriverName); }

                tokenValue.StartTime = formatTime(trackData.StartTime);
                tokenValue.OvenTime = formatTime(trackData.OvenTime);
                tokenValue.RackTime = formatTime(trackData.RackTime);
                tokenValue.RouteTime = formatTime(trackData.RouteTime);
                tokenValue.AdvancedOrderDate = formatDate(trackData.AdvancedOrderTime);
                tokenValue.AdvancedOrderTime = formatTime(trackData.AdvancedOrderTime);

                if (oldServiceMethod !== trackData.ServiceMethod) {
                    setOrderDetails(trackData.ServiceMethod, trackData.StoreID);
                    setStatusLabels(trackData.ServiceMethod);
                    oldServiceMethod = trackData.ServiceMethod;
                }
                if (oldStoreID !== trackData.StoreID) {
                    setOrderDetails(trackData.ServiceMethod, trackData.StoreID);
                }
                setOrderStatus(trackData.OrderStatus, trackData.ServiceMethod);
            } else {
                setOrderStatus("DEFAULT_ORDER_PLACED", "DELIVERY");
            }
        }

        // Sets all text on the Tracker not directly related to order status
        function setNonStatusText() {
            sendUpdate("setNonStatusText", {
                trackerDescription: tr("tracker.know_the_status_of_your"),
                patentText: tr("tracker.patent_pending"),
                num1: tr("general.stage1"),
                num2: tr("general.stage2"),
                num3: tr("general.stage3"),
                num4: tr("general.stage4"),
                num5: tr("general.stage5"),
                trackerHeader: jsDPZ.util.htmlUnEncode(tr("confirmation.dominos_tracker"))
            });
        }

        // Displays the error overlay. Accepts a string as its argument.
        function displayErrorMsg(error) {
            $(".errorOverlay", selector).text(tr(error));
            $(selector).addClass("error");
        }

        return { // Public Functions
            updateTrackerBar: updateTrackerBar,
            setNonStatusText: setNonStatusText,
            setStatusLabels: setStatusLabels,
            displayErrorMsg: displayErrorMsg
        };
    }());
});
