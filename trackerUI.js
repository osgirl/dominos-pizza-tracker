window.orderData = orderData = {};

var trackerSource = urlConfig.assets + "/flash/";
var imgSource = "";

var storeInfo = {};
var TrackerUI = {
    shoutoutQuestions: [],
    shoutoutQuestion: {},
    orderingExperienceQuestions: [],
    teamMemberQuestions: [],
    tellUsMoreQuestions: [],
    freeFormQuestions: []
};

// Helper Functions
function parseURLParams () {
    var url = document.location.hash;
    var paramsObj = {};
    if (url.indexOf("#") != -1) {
        var queryString = url.split("/");
        for (var i = 1; i < queryString.length; i += 2) {
            var key = queryString[i];
            var value = queryString[i + 1];
            paramsObj[key] = value;
        }
    }
    return paramsObj;
}

// ////////////////////////
//	Feedback Page
// ////////////////////////
var text = {
    technicalDifficulties: "We're Sorry, our service is experiencing technical difficulties. Please try again at a later time.",
    leaveNoteOfEncouragement: "Leave a note of encouragement to the team making your order.",
    youGotSomethingToSay: "You got something to say? You got our undivided attention.",
    pleaseEnterAMessage: "Please enter a message before submitting.",
    weCannotLoadYourStore: "We cannot load your stores info at this time",
    pleaseAnswerAfterReceiving: "Please answer after receiving your order."
};

var rtOrder = RealtimeProxy.Data.Orders[0];
var rtStoreInfo = RealtimeProxy.Data.StoreInfo;
var rtFeedback = RealtimeProxy.Data.Feedback;

// This is called by the flash/satellite, it must be global
window.getOrder = function() {
    require(["simplr"], function(simplr) {
        var urlParams = parseURLParams();
        if (!dpz.util.isEmpty(urlParams.order) && !dpz.util.isEmpty(urlParams.StoreID)) {
            RealtimeProxy.Ajax.OrderLookup({
                data: {
                    OrderKey: urlParams.order,
                    StoreID: urlParams.StoreID,
                    Lang: $("body").attr("lang") || "en"
                },
                success: function(data) {
                    if (!dpz.util.isEmpty(data.OrderStatuses.data)) {
                        RealtimeProxy.Ajax.Feedback({
                            data: {
                                OrderKey: urlParams.order,
                                StoreID: urlParams.StoreID,
                                Lang: $("body").attr("lang") || "en"
                            },
                            success: function(data) {
                                // Populate Order Table
                                rtOrder = RealtimeProxy.Data.Orders[0];


                                if (data) {
                                    doInterval(function() {
                                        var status = rtOrder.OrderStatus; // TrackerData.getOrderStatus();
                                        if (status == "Abandoned" || status == "Void" || status == "Bad" || status == "GiftCardPurchase") {
                                            document.location = "/pages/tracker.jsp";
                                        }
                                    }, 10000);

                                    var url = "/power/store/" + rtOrder.StoreID + "/profile";
                                    $.getJSON(url, function(data) {
                                        storeInfo = data;

                                        //									initQuestions();
                                        //									initShoutoutOptions();
                                        //									initTellUsMore();
                                        //									initOrderDetails();
                                        //									initYourStore();
                                        //									initDeliveryTime();
                                        //									initStarRatings();
                                        //
                                        //									blockQuestions();

                                        $(".main-content").show();
                                    });
                                } else {
                                    alert(text.technicalDifficulties);
                                }

                                // Update Order Status Interval
                                var orderStatusInterval = doInterval(function() {
                                    if (rtOrder.OrderStatus == "Complete") {
                                        clearInterval(orderStatusInterval);
                                    }
                                    var urlParams = parseURLParams();
                                    if (urlParams.order != undefined) {
                                        RealtimeProxy.Ajax.OrderLookup({
                                            data: {
                                                OrderKey: urlParams.order,
                                                StoreID: urlParams.StoreID,
                                                Lang: $("body").attr("lang") || "en"
                                            },
                                            success: function() {}
                                        });
                                    }
                                }, 5000);
                            }
                        });
                    } else {
                        simplr.controller.mRouteAndExecute("/order/");
                    }
                }
            });
        }
    });
};

function initQuestions () {
    var tokenizedQuestions = getTokenizedQuestions();

    function createQuestionHTML (questionArr) {
        var questionsHTML = "";
        for (var i = 0; i < questionArr.length; i++) {
            questionsHTML += "<li id='question-" + questionArr[i].Code + "'><span class='question'>" + questionArr[i].Text + "</span><span class='rating'><span title='LOWEST'>&#x272D;</span><span>&#x272D;</span><span>&#x272D;</span><span>&#x272D;</span><span title='HIGHEST'>&#x272D;</span></span></li>";
        }
        return questionsHTML;
    }

    // Bucket the questions
    if (TrackerUI.shoutoutQuestions.length == 0) {
        for (var i = 0; i < tokenizedQuestions.length; i++) {
            var question = tokenizedQuestions[i];
            if (question.Category == "Product" || (question.Category == "Route" && question.CategoryMethod == rtOrder.ServiceMethod)) {
                TrackerUI.teamMemberQuestions.push(question);
            } else if (question.Question == "Ultimate") {
                TrackerUI.tellUsMoreQuestions.push(question);
            } else if (question.Type == "COMMENT") {
                TrackerUI.freeFormQuestions.push(question);
                TrackerUI.freeFormDefault = question.Text;
            } else if (question.Type == "SHOUTOUT") {
                TrackerUI.shoutoutQuestion = question;
                questions = question.Text.split("|");
                TrackerUI.shoutoutQuestions.push(text.leaveNoteOfEncouragement);
                TrackerUI.shoutoutQuestions = TrackerUI.shoutoutQuestions.concat(questions);
            } else if (question.Category == "Order" && question.CategoryMethod == rtOrder.OrderSourceCode) {
                TrackerUI.orderingExperienceQuestions.push(question);
            }
        }
    }

    // Render The Questions
    $("#orderingExperienceWrapper ul").html(createQuestionHTML(TrackerUI.orderingExperienceQuestions));
    $("#teamMemberWrapper ul").html(createQuestionHTML(TrackerUI.teamMemberQuestions));
    $("#tellUsMoreWrapper ul").prepend(createQuestionHTML(TrackerUI.tellUsMoreQuestions));

    // Remove any containers that don't have questions
    $("ul.content:empty").closest(".container").remove();

    if (TrackerUI.teamMemberQuestions.length == 0) {
        $("#teamMemberWrapper").remove();
    }
}

function initShoutoutOptions () {
    var optionsHTML = "";
    $.each(TrackerUI.shoutoutQuestions, function(i, value) {
        if (i != 0) {
            optionsHTML += "<option value='" + escape(value) + "'>" + value + "</option>";
        } else {
            optionsHTML += "<option value='" + 0 + "'>" + value + "</option>";
        }
    });
    $("#shoutoutWrapper select").html(optionsHTML);

    $("#submitShoutout").click(function(e) {
        e.preventDefault();
        if ($("#shoutoutWrapper select").val() != 0) {
            RealtimeProxy.Ajax.PutFeedback({
                data: {
                    StoreID: rtOrder.StoreID,
                    OrderID: rtOrder.OrderID,
                    OrderKey: rtOrder.OrderKey,
                    QuestionID: TrackerUI.shoutoutQuestion.Code,
                    QuestionType: TrackerUI.shoutoutQuestion.Type,
                    TeamMemberID: null,
                    TeamMemberName: null,
                    TeamMemberPosition: null,
                    FeedbackResponse: $("#shoutoutWrapper select").val()
                },
                success: function(data) {
                    $("#shoutoutWrapper select, #shoutoutWrapper button").remove();
                    $("#shoutoutWrapper p").show();
                    // analytics.func.trackEvent('Tracker','Shout-Outs',data.FeedbackResponse);
                }
            });
        } else {
            alert("Please Choose a Value");
        }
    });

    var shoutOutInterval = doInterval(function() {
        var orderStatus = rtOrder.OrderStatus;
        if (orderStatus == "Route Station" || orderStatus == "Complete") {
            $("#shoutoutWrapper .layerBlocker").remove();
            $("#shoutoutWrapper").append($("<div/>").addClass("layerBlocker").css({
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                position: "absolute",
                "background-color": "#fff",
                opacity: "0.6",
                filter: "alpha(opacity=60)"
            }));
            clearInterval(shoutOutInterval);
        }
    }, 5000);
}

function initTellUsMore () {
    // Setup the free-form textarea
    $("#tellUsMoreWrapper textarea").val(TrackerUI.freeFormDefault).focus(function() {
        if ($(this).val() == TrackerUI.freeFormDefault) {
            $(this).val("");
        }
    }).keyup(function() {
        if ($(this).val().length > 150) {
            $(this).val($(this).val().slice(0, 150));
        }
    });

    $("#sendFreeForm").click(function(e) {
        e.preventDefault();

        var question = TrackerUI.freeFormQuestions[0];
        var data = {
            StoreID: rtOrder.StoreID,
            OrderID: rtOrder.OrderID,
            OrderKey: rtOrder.OrderKey,
            QuestionID: question.Code,
            QuestionType: question.Type,
            TeamMemberID: null,
            TeamMemberName: null,
            TeamMemberPosition: null,
            FeedbackResponse: $("#tellUsMoreWrapper textarea").val()
        };

        if (data.FeedbackResponse != text.youGotSomethingToSay && data.FeedbackResponse != "") {
            // Our normal feedback service
            RealtimeProxy.Ajax.PutFeedback({
                data: data,
                success: function(data) {
                    // Hide textarea and button after submit
                    $("#tellUsMoreWrapper textarea, #tellUsMoreWrapper button").remove();
                    $("#tellUsMoreWrapper p").show().children("span").text(rtStoreInfo.Phone);
                }
            });
        } else {
            alert(text.pleaseEnterAMessage);
        }
    });
}

function initOrderDetails () {
    var html = "";
    if (rtOrder.OrderDescription) {
        var orderDetailItems = $.trim(rtOrder.OrderDescription).split("\n");
        for (var i = 0, iL = orderDetailItems.length; i < iL; i++) {
            html += "<tr class='" + (i % 2 == 0 ? "even" : "") + "'><td>" + orderDetailItems[i] + "</td></tr>";
        }
    }
    $("#orderDetailsWrapper tbody").html(html);
    $("#orderDetailsWrapper h3 span").text("#" + rtOrder.OrderID.split("#")[1]);
}

function initYourStore () {
    var url = "/power/store/" + rtOrder.StoreID + "/profile";
    $.getJSON(url, function(data) {
        rtStoreInfo = data;

        if (typeof rtStoreInfo.StreetName !== "undefined") {
            var addressHTML = rtStoreInfo.StreetName + "<br />" + rtStoreInfo.City + ", " + rtStoreInfo.Region + "<br />" + rtStoreInfo.Phone;

            $(".js-managerName").html(rtStoreInfo.ManagerName);
            $(".js-storePhone").html(rtStoreInfo.Phone);
            $(".js-storeAddress").html(addressHTML);
        } else {
            var eleLi = document.createElement("li");
            eleLi.textContent = text.weCannotLoadYourStore;
            $("#yourStoreWrapper .content").appendChild(eleLi);
        }
    });
}

function initDeliveryTime () {
    var waitText = "Approximately " + rtStoreInfo.EstimatedWaitMinutes + " minutes";
    if (rtStoreInfo.EstimatedWaitMinutes && rtOrder.ServiceMethod == "Delivery") {
        $("#deliveryTimeWrapper li").html(waitText);
        $("#deliveryTimeWrapper").show();
    } else if (rtStoreInfo.EstimatedCarryoutWaitMinutes && rtOrder.ServiceMethod == "Carry-Out") {
        $("#carryoutTimeWrapper li").html(waitText);
        $("#carryoutTimeWrapper").show();
    }
}

function initStarRatings () {
    $(".rating span").off().hover(function() {
        var i = $(this).parent().children("span").index(this) + 1;
        $(this).parent().children().slice(0, i).css({ color: "#f00" });
    }, function() {
        $(this).parent().children().removeAttr("style");
    }).click(function(e) {
        // Display Thank you message
        $(this).closest("li").children(".receivedMessage").remove();
        $(this).closest("li").append("<p class='receivedMessage'>" + $("#ratingThankYou").text() + "</p>");
        setTimeout(function() {
            $(e.target).closest("li").children(".receivedMessage").fadeOut(function() { $(this).remove(); });
        }, 5000);

        $(this).parent().children("span").removeClass("active");
        var i = $(this).parent().children("span").index(this) + 1;
        $(this).parent().children().slice(0, i).addClass("active");

        var question = {};
        var teamMember = {
            ID: null,
            Name: null,
            Position: null
        };
        var questionID = $(this).parent().parent().attr("id").split("question-")[1];
        var qList = getTokenizedQuestions();

        for (var j = 0; j < qList.length; j++) {
            if (qList[j].Code == questionID) {
                question = qList[j];
                break;
            }
        }

        if (question.Text.indexOf(rtFeedback.Keys.CsrName) != -1) {
            teamMember.ID = rtOrder.CsrID || null;
            teamMember.Name = rtOrder.CsrName || null;
            teamMember.Position = "CSR";
        } else if (question.Text.indexOf(rtFeedback.Keys.ManagerName) != -1) {
            teamMember.ID = rtOrder.ManagerID || null;
            teamMember.Name = rtOrder.ManagerName || null;
            teamMember.Position = "Manager";
        } else if (question.Text.indexOf(rtFeedback.Keys.DriverName) != -1) {
            teamMember.ID = rtOrder.DriverID || null;
            teamMember.Name = rtOrder.DriverName || null;
            teamMember.Position = "Driver";
        }

        RealtimeProxy.Ajax.PutFeedback({
            data: {
                StoreID: rtOrder.StoreID,
                OrderID: rtOrder.OrderID,
                OrderKey: rtOrder.OrderKey,
                QuestionID: question.Code,
                QuestionType: question.Type,
                TeamMemberID: question.Question == "Ultimate" ? rtOrder.ManagerID : teamMember.ID,
                TeamMemberName: question.Question == "Ultimate" ? rtOrder.ManagerName : teamMember.Name,
                TeamMemberPosition: question.Question == "Ultimate" ? "Manager" : teamMember.Position,
                FeedbackResponse: i
            },
            success: function(data) {}
        });
    });
}

function blockQuestions () {
    $("#feedbackQuestions .container").css("position", "relative").not("#orderingExperienceWrapper, #shoutoutWrapper").each(function() {
        $(this).append($("<div/>").addClass("layerBlocker").css({
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            "background-color": "#fff",
            opacity: "0.6",
            filter: "alpha(opacity=60)"
        }).click(function() {
            alert(text.pleaseAnswerAfterReceiving);
        }));
    });

    var blockQuestionsInterval = doInterval(function() {
        if (rtOrder.OrderStatus == "Complete" || rtOrder.OrderStatus == "Out the Door") {
            $(".layerBlocker").not("#shoutoutWrapper .layerBlocker").remove();
            clearInterval(blockQuestionsInterval);
        }
    }, 5000);
}

// Helper Functions
function getTokenizedQuestions () {
    var surveyArray = [];
    var csrKey = "$CsrName$";
    var managerKey = "$managerName$";
    var driverKey = "$driverName$";

    for (var i = 0; i < rtFeedback.Questions.length; i++) {
        surveyArray.push($.extend(true, {}, rtFeedback.Questions[i]));
    }
    for (var i = 0; i < surveyArray.length; i++) {
        surveyArray[i].Text = surveyArray[i].Text.replace(csrKey, rtOrder.CsrName || "Our Expert Customer Representative")
        .replace(managerKey, rtOrder.ManagerName || "Our Expert Pizza Maker")
        .replace(driverKey, rtOrder.DriverName || "Our Delivery Expert");
    }

    return surveyArray;
}

function doInterval (func, timeout) {
    func();
    return setInterval(func, timeout);
}

function getLanguage () {
    return $("body").attr("lang") || "en";
}

function sendTrackerFeedback (opts) {
    var opts = $.extend(true, {
        data: {
            StoreID: RealtimeProxy.Data.Orders[0].StoreID,
            OrderID: RealtimeProxy.Data.Orders[0].OrderID,
            OrderKey: RealtimeProxy.Data.Orders[0].OrderKey,
            TeamMemberID: null,
            TeamMemberName: null,
            TeamMemberPosition: null,
            FeedbackResponse: ""
        }
    }, opts);
    RealtimeProxy.Ajax.PutFeedback(opts);
}
