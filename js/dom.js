var domOperate = {
    offsetTop: $(".infotop").height(),
    fixheight: $(".tablenav").height(),
    init: function () {
        var _this = this;
        _this.yearBind();
        //初始化计算
        var sdYear = $("#sylanyear").val() || "20",
            gjjYear = $("#gjjlanyear").val() || "20";
        _this.lilvCal(sdYear, config.shangdaiLilv, config.shangdaiSelect, "shangyelanlilv");
        _this.lilvCal(gjjYear, config.gjjLilv, config.gjjSelect, "gjjlanlilv");

        //商贷年利率变化计算
        $("#sylanyear").change(function () {
            var year = $(this).val();
            _this.lilvCal(year, config.shangdaiLilv, config.shangdaiSelect, "shangyelanlilv");
            var selectvalue = $("#lanChange").val();
            if (selectvalue == "1") {
                _this.resultSd();
            }
            if (selectvalue == "3") {
                _this.resuleZh();
            }
        })
        //公积金年利率变化计算
        $("#gjjlanyear").change(function () {
            var year = $(this).val();
            _this.lilvCal(year, config.gjjLilv, config.gjjSelect, "gjjlanlilv");
            var selectvalue = $("#lanChange").val();
            if (selectvalue == "2") {
                _this.resultGjj();
            }
            if (selectvalue == "3") {
                _this.resuleZh();
            }

        })

        //商贷利率切换变化
        $("#shangyelanlilv").change(function () {
            var selectvalue = $("#lanChange").val();
            if (selectvalue == "1") {
                _this.resultSd();
            }
            if (selectvalue == "3") {
                _this.resuleZh();
            }
        })
        //公积金利率切换变化
        $("#gjjlanlilv").change(function () {
            var selectvalue = $("#lanChange").val();
            if (selectvalue == "2") {
                _this.resultGjj();
            }
            if (selectvalue == "3") {
                _this.resuleZh();
            }
        })




        //本息本金按钮点击
        $(".cal_changenav").on("click", function () {
            var name = $(this).data("name");
            $(this).addClass("current").siblings().removeClass("current");
            if (name == "benxi") {
                //执行本息计算逻辑 本息type 1,本金type 2
                _this.checkLanType("1")
                $("#typethml").html("等额本息还款详情");
                if ($(this).hasClass("inner_bx")) {
                    _this.resultBind("1");
                }

            } else if (name == "benjin") {
                //执行本金计算逻辑 
                _this.checkLanType("2")
                $("#typethml").html("等额本金还款详情");
                if ($(this).hasClass("inner_bj")) {
                    _this.resultBind("2");
                }
            }
        })

        //贷款类型切换
        $("#lanChange").change(function () {
            var values = $(this).val();
            if (values == "1") {
                //商业贷款dom操作
                $(".sdfund").removeClass("split");
                $(".shangdai_hook").show();
                $(".gjj_hook").hide();
                $(".dkname").html("贷款金额");
                //执行计算逻辑
                _this.resultSd();

            } else if (values == "2") {
                //公积金贷款dom操作
                $(".sdfund").removeClass("split");
                $(".shangdai_hook").hide();
                $(".gjj_hook").show();
                $(".dkname").html("贷款金额");
                //执行计算逻辑
                _this.resultGjj();

            } else if (values == "3") {
                //组合贷款dom操作
                $(".sdfund").addClass("split");
                $(".shangdai_hook").show();
                $(".gjj_hook").show();
                $(".dkname").each(function () {
                    $(this).html($(this).data("zuhe"));
                })
                //执行计算逻辑
                _this.resuleZh();
            }
        })
        //历史返回初始化逻辑计算
        if ($("#infoDialog").length <= 0) {
            _this.historyBackinit();
        }

        //贷款输入数字监听
        $(".lannum").on("input", function (e) {
            var enterkey = e.target.value,
                stype = $(".current", ".cal_nav").data("name"),
                type = "";
            stype == "benxi" ? type = "1" : type = "2";
            if ($(this).hasClass("gjjf")) {
                // console.log("公积金逻辑")
                _this.checkLanType(type, "", enterkey);

            } else {
                // console.log("商贷计算逻辑");
                _this.checkLanType(type, enterkey, "");
            }
            //详情显示
            if ($.trim(enterkey) != "" && !isNaN(enterkey) && enterkey > 0) {
                $(".cal_benxiinfo").show();
            } else {
                $(".cal_benxiinfo").hide();
            }

        })

        //详情滚动导航固定
        $("#infoDialog").scroll(_this.fixTop);

        //详情页面数据绑定
        if ($("#infoDialog").length > 0) {
            _this.resultBind();
        }



    },
    fixTop: function () {
        var _this = domOperate;
        var scrollTop = $("#infoDialog").scrollTop();
        if (scrollTop >= _this.offsetTop) {
            if (!$(".tablenav").hasClass("topfixedpc")) {
                $(".tablenav").addClass("topfixedpc");
                $(".yearouter").css("padding-top", _this.fixheight + "px")
            }
        } else {
            $(".tablenav").removeClass("topfixedpc");
            $(".yearouter").removeAttr("style");
        }
    },
    resultSd: function () {
        var _this = this;
        var stype = $(".current", ".cal_top").data("name"),
            type = "";
        stype == "benxi" ? type = "1" : type = "2";
        _this.shangdaiData(type);
    },
    resultGjj: function () {
        var _this = this;
        var stype = $(".current", ".cal_top").data("name"),
            type = "";
        stype == "benxi" ? type = "1" : type = "2";
        _this.gjjData(type);
    },
    resuleZh: function () {
        var _this = this;
        var stype = $(".current", ".cal_top").data("name"),
            type = "";
        stype == "benxi" ? type = "1" : type = "2";
        _this.zuheData(type);
    },
    checkLanType: function (type, sdnum, gjjnum) {
        var _this = this;
        var lanType = $("#lanChange").val();
        if (lanType == "1") {
            _this.shangdaiData(type, sdnum);
        } else if (lanType == "2") {
            _this.gjjData(type, gjjnum);
        } else if (lanType == "3") {
            _this.zuheData(type, sdnum, gjjnum);
        }
    },
    shangdaiData: function (type, num) {
        num = num || $(".shangyef").val();
        var _this = this;
        var year = $("#sylanyear").val();
        var lilv = $("#shangyelanlilv").val();
        //结果地址传参数
        _this.navigateUrl(type, "1", num, "", year, "", lilv, "");
        //调用商贷计算公式
        var resobj = calcute.singleDk(type, num, year, lilv);
        // console.log(resobj);
        _this.domOperates(type, resobj);

    },
    gjjData: function (type, num) {
        num = num || $(".gjjf").val();
        var _this = this;
        var year = $("#gjjlanyear").val();
        var lilv = $("#gjjlanlilv").val();
        //结果地址传参数
        _this.navigateUrl(type, "2", "", num, "", year, "", lilv);
        //调用公积金计算公式
        var resobj = calcute.singleDk(type, num, year, lilv);
        //console.log(resobj);
        _this.domOperates(type, resobj);
    },
    zuheData: function (type, sdnum, gjjnum) {
        sdnum = sdnum || $(".shangyef").val(), gjjnum = gjjnum || $(".gjjf").val();
        var _this = this;
        var sdyear = $("#sylanyear").val(),
            sdlilv = $("#shangyelanlilv").val();
        var gjjyear = $("#gjjlanyear").val(),
            gjjlilv = $("#gjjlanlilv").val();
        //结果地址传参数
        _this.navigateUrl(type, "3", sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv);
        //调用组合贷款计算公式
        var resobj = calcute.zuhe(type, sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv);
        //console.log(resobj);
        _this.domOperates(type, resobj);
    },
    yearBind: function () { //年份绑定
        var yearArray = [];
        config.loanyear.forEach(function (item, index) {
            var selectflag = "";
            if (item.select) {
                selectflag = 'selected="selected"'
            }
            yearArray[index] = '<option value="' + item.year + '" ' + selectflag + '>' + item.year + '年</option>'
        })
        $("#gjjlanyear").html(yearArray.join(""));
        $("#sylanyear").html(yearArray.join(""));
    },
    lilvCal: function (year, lilv, selectcontent, id) {
        var getLilv = "",
            lilvbindArray = [];
        lilv.forEach(function (item, index) {
            if (year >= item.year) {
                getLilv = item.lilv;
            }
        })
        var callilv = selectcontent.map(function (item, index) {
            return {
                lilv: (item.lilv * getLilv).toFixed(4),
                name: item.name
            }
        })
        callilv.forEach(function (item, index) {
            lilvbindArray[index] = '<option value="' + item.lilv + '" >' + item.name + '</option>'
        })
        $("#" + id).html(lilvbindArray.join(""));

    },
    formatCurrency: function (num) { //将数值四舍五入(保留2位小数)后格式化成金额形式
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents);
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    domOperates: function (type, data) {
        var _this = this;
        var yuegong = _this.formatCurrency(data.yuegong);
        var totalPrice = _this.formatCurrency(data.totalPrice / 10000); //万元转换
        var totalLixi = _this.formatCurrency(data.totalLixi / 10000); //万元转换
        var totalDknum = _this.formatCurrency(data.totalDknum);
        var mouthdataArray = data.mouthdataArray;
        $(".cal_price_hook").html(yuegong);
        $(".htotalnum").html(totalPrice + "万");
        $(".htotallixinum").html(totalLixi + "万");
        if (type == "1") { //等额本息dom操作
            $(".cal_dijian").html("");
            $(".cal_dijianprice").html("");
            $(".inner_bx").addClass("current");
            $(".inner_bj").removeClass("current");
        } else if (type == "2") {
            $(".cal_dijian").html("每月递减(元)");
            $(".cal_dijianprice").html(_this.formatCurrency(data.yuegongdijian));
            $(".inner_bx").removeClass("current");
            $(".inner_bj").addClass("current");
        }
        if ($("#infoDialog").length > 0) {
            $("#totalPrice").html(totalPrice);
            $("#totalLixi").html(totalLixi);
            $("#totalDknum").html(totalDknum);
            $("#totalyear").html(data.year);
            //详情页面循环
            var yeartitle = '<div class="yeartitle">第一年</div>',
                yearHtmlArray = [],
                yeartitleHtml = "",
                mouthliArray = [],
                yearflag = 1;
            mouthdataArray.forEach(function (item, index) {
                var pushnum = parseInt(item.monthName);

                mouthliArray[index] = '<div class="mouthli displayflex border_bottom">' +
                    '<div class="mouthtd flexli"><span>' + item.monthName + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatCurrency(item.yuebenjin) + '</span></div>' +
                    '<div class="mouthtd flexli"> <span>' + _this.formatCurrency(item.yuelixi) + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatCurrency(item.leftFund) + '</span> </div></div>';
                if (pushnum == 12) {
                    yeartitleHtml = yeartitle.replace("一", yearflag);
                    yearflag++;
                    yearHtmlArray.push('<div class="oneyear">' + yeartitleHtml + '<div class="mounths">' + mouthliArray.join("") + '</div></div>');
                    mouthliArray = [];
                }
            })
            yeartitleHtml = yeartitle.replace("一", yearflag);
            $("#yearouter").html(yearHtmlArray.join("") + '<div class="oneyear">' + yeartitleHtml + '<div class="mounths">' + mouthliArray.join("") + '</div></div>');

        }

    },
    navigateUrl: function (type, loantype, sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv) {
        var type = type || "1",
            loantype = loantype || "1",
            sdnum = sdnum || "",
            gjjnum = gjjnum || "",
            sdyear = sdyear || "",
            gjjyear = gjjyear || "",
            sdlilv = sdlilv || "",
            gjjlilv = gjjlilv || "";
        if (loantype == "1") {
            var url = 'result.html?type=' + type + '&sdnum=' + sdnum + '&sdyear=' + sdyear + '&sdlilv=' + sdlilv + '&loantype=1';
        } else if (loantype == "2") {
            var url = 'result.html?type=' + type + '&gjjnum=' + gjjnum + '&gjjyear=' + gjjyear + '&gjjlilv=' + gjjlilv + '&loantype=2';
        } else if (loantype == "3") {
            var url = 'result.html?type=' + type + '&sdnum=' + sdnum + '&gjjnum=' + gjjnum + '&sdyear=' + sdyear + '&gjjyear=' + gjjyear + '&sdlilv=' + sdlilv + '&gjjlilv=' + gjjlilv + '&loantype=3';
        }
        $("#typethml").attr("href", url);
    },
    resultBind: function (type) {
        var _this = this;
        var loantype = _this.getQueryString("loantype");
        if (loantype == "1") {
            var type = type || _this.getQueryString("type"),
                sdnum = _this.getQueryString("sdnum"),
                sdyear = _this.getQueryString("sdyear"),
                sdlilv = _this.getQueryString("sdlilv");

            var ressdobj = calcute.singleDk(type, sdnum, sdyear, sdlilv);
            //console.log(resobj);
            _this.domOperates(type, ressdobj);

        } else if (loantype == "2") {
            var type = type || _this.getQueryString("type"),
                gjjnum = _this.getQueryString("gjjnum"),
                gjjyear = _this.getQueryString("gjjyear"),
                gjjlilv = _this.getQueryString("gjjlilv");

            var resgjjobj = calcute.singleDk(type, gjjnum, gjjyear, gjjlilv);
            //console.log(resobj);
            _this.domOperates(type, resgjjobj);
        } else if (loantype == "3") {
            var type = type || _this.getQueryString("type"),
                gjjnum = _this.getQueryString("gjjnum"),
                gjjyear = _this.getQueryString("gjjyear"),
                gjjlilv = _this.getQueryString("gjjlilv"),
                sdnum = _this.getQueryString("sdnum"),
                sdyear = _this.getQueryString("sdyear"),
                sdlilv = _this.getQueryString("sdlilv");
            var reszhobj = calcute.zuhe(type, sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv);
            //console.log(resobj);
            _this.domOperates(type, reszhobj);
        }
    },
    historyBackinit: function () { //历史返回初始化逻辑计算
        var _this = this;
        if ($("#lanChange").val() != "1") {
            $("#lanChange").trigger("change")
        }
        if ($(".shangyef").val() != "") {
            _this.inputChange($(".shangyef").val());
        }
        if ($(".gjjf").val() != "") {
            _this.inputChange($(".gjjf").val());
        }
    },
    inputChange: function (values) {
        var _this = this,
            enterkey = values,
            stype = $(".current", ".cal_nav").data("name"),
            type = "";
        stype == "benxi" ? type = "1" : type = "2";
        if ($(this).hasClass("gjjf")) {
            // console.log("公积金逻辑")
            _this.checkLanType(type, "", enterkey);

        } else {
            // console.log("商贷计算逻辑");
            _this.checkLanType(type, enterkey, "");
        }
        //详情显示
        if ($.trim(enterkey) != "" && !isNaN(enterkey) && enterkey > 0) {
            $(".cal_benxiinfo").show();
        } else {
            $(".cal_benxiinfo").hide();
        }
    }



}
domOperate.init();