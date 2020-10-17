var calcute = {
    //商贷-公积金贷款统一函数
    singleDk: function (type, num, year, lilv) {
        var _this = this;
        // type:1等额本息 2等额本金，num 贷款金额 year贷款年限，lilv：贷款基准利率
        if (type == 1) {
            return _this.benxi(type, num, year, lilv)
        } else if (type == 2) {
            return _this.benjin(type, num, year, lilv)
        }
    },
    //组合贷款计算
    zuhe: function (type, sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv) {
        var _this = this,
            year = sdyear > gjjyear ? sdyear : gjjyear;
        if (type == 1) {
            var sdObj = _this.benxi(type, sdnum, sdyear, sdlilv);
            var gjjObj = _this.benxi(type, gjjnum, gjjyear, gjjlilv);
            if (sdObj.monthdataArray.length > gjjObj.monthdataArray.length) {
                var mergemonthdataArray = sdObj.monthdataArray.map(function (item, index) {
                    if (index < gjjObj.monthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi + gjjObj.monthdataArray[index].yuelixi,
                            yuebenjin: item.yuebenjin + gjjObj.monthdataArray[index].yuebenjin,
                            leftFund: item.leftFund + gjjObj.monthdataArray[index].leftFund
                        }
                    } else {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi,
                            yuebenjin: item.yuebenjin,
                            leftFund: item.leftFund
                        }
                    }

                })
            } else {
                var mergemonthdataArray = gjjObj.monthdataArray.map(function (item, index) {
                    if (index < sdObj.monthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi + sdObj.monthdataArray[index].yuelixi,
                            yuebenjin: item.yuebenjin + sdObj.monthdataArray[index].yuebenjin,
                            leftFund: item.leftFund + sdObj.monthdataArray[index].leftFund
                        }
                    } else {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi,
                            yuebenjin: item.yuebenjin,
                            leftFund: item.leftFund
                        }
                    }
                })
            }
            return {
                yuegong: sdObj.yuegong + gjjObj.yuegong,
                totalLixi: sdObj.totalLixi + gjjObj.totalLixi,
                totalPrice: sdObj.totalPrice + gjjObj.totalPrice,
                monthdataArray: mergemonthdataArray,
                totalDknum: parseFloat(sdObj.totalDknum) + parseFloat(gjjObj.totalDknum),
                year: year
            }

        } else if (type == 2) {
            var sdObj = _this.benjin(type, sdnum, sdyear, sdlilv);
            var gjjObj = _this.benjin(type, gjjnum, gjjyear, gjjlilv);
            if (sdObj.monthdataArray.length > gjjObj.monthdataArray.length) {
                var mergemonthdataArray = sdObj.monthdataArray.map(function (item, index) {
                    if (index < gjjObj.monthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi + gjjObj.monthdataArray[index].yuelixi,
                            yuebenjin: item.yuebenjin + gjjObj.monthdataArray[index].yuebenjin,
                            leftFund: item.leftFund + gjjObj.monthdataArray[index].leftFund
                        }
                    } else {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi,
                            yuebenjin: item.yuebenjin,
                            leftFund: item.leftFund
                        }
                    }

                })
            } else {
                var mergemonthdataArray = gjjObj.monthdataArray.map(function (item, index) {
                    if (index < sdObj.monthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi + sdObj.monthdataArray[index].yuelixi,
                            yuebenjin: item.yuebenjin + sdObj.monthdataArray[index].yuebenjin,
                            leftFund: item.leftFund + sdObj.monthdataArray[index].leftFund
                        }
                    } else {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi,
                            yuebenjin: item.yuebenjin,
                            leftFund: item.leftFund
                        }
                    }
                })
            }
            return {
                yuegong: sdObj.yuegong + gjjObj.yuegong,
                totalLixi: sdObj.totalLixi + gjjObj.totalLixi,
                totalPrice: sdObj.totalPrice + gjjObj.totalPrice,
                yuegongdijian: sdObj.yuegongdijian + gjjObj.yuegongdijian,
                totalDknum: parseFloat(sdObj.totalDknum) + parseFloat(gjjObj.totalDknum),
                year: year,
                monthdataArray: mergemonthdataArray
            }
        }

    },
    //等额本息计算
    benxi: function (type, num, year, lilv) {
        //每月月供额=〔贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔(1＋月利率)＾还款月数-1〕
        var month = parseInt(year) * 12,
            monthlilv = parseFloat(lilv) / 12,
            dknum = parseFloat(num) * 10000;
        //每月月供
        var yuegong = (dknum * monthlilv * Math.pow((1 + monthlilv), month)) / (Math.pow((1 + monthlilv), month) - 1);
        //总利息=还款月数×每月月供额-贷款本金
        var totalLixi = month * yuegong - dknum;
        //还款总额 总利息+贷款本金
        var totalPrice = totalLixi + dknum,
            leftFund = totalLixi + dknum;

        //循环月份
        var monthdataArray = [],
            nowmonth = new Date().getMonth(),
            realmonth = 0;

        for (var i = 1; i <= month; i++) {
            realmonth = nowmonth + i;
            var yearlist = Math.floor(i / 12);

            realmonth = realmonth - 12 * yearlist;

            if (realmonth > 12) {
                realmonth = realmonth - 12
            }
            //console.log(realmonth)
            //每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
            var yuelixi = dknum * monthlilv * (Math.pow((1 + monthlilv), month) - Math.pow((1 + monthlilv), i - 1)) / (Math.pow((1 + monthlilv), month) - 1);
            //每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
            var yuebenjin = dknum * monthlilv * Math.pow((1 + monthlilv), i - 1) / (Math.pow((1 + monthlilv), month) - 1);
            leftFund = leftFund - (yuelixi + yuebenjin);
            if (leftFund < 0) {
                leftFund = 0
            }
            monthdataArray[i - 1] = {
                monthName: realmonth + "月",
                yuelixi: yuelixi,
                yuebenjin: yuebenjin,
                //剩余还款
                leftFund: leftFund
            }
        }
        return {
            yuegong: yuegong,
            totalLixi: totalLixi,
            totalPrice: totalPrice,
            monthdataArray: monthdataArray,
            totalDknum: num,
            year: year
        };
    },
    //等额本金计算
    benjin: function (type, num, year, lilv) {
        var month = parseInt(year) * 12,
            monthlilv = parseFloat(lilv) / 12,
            dknum = parseFloat(num) * 10000,
            yhbenjin = 0; //首月还款已还本金金额是0
        //每月应还本金=贷款本金÷还款月数
        var everymonthyh = dknum / month
        //每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
        var yuegong = everymonthyh + (dknum - yhbenjin) * monthlilv;
        //每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
        var yuegongdijian = everymonthyh * monthlilv;
        //总利息=〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×还款月数-总贷款额
        var totalLixi = ((everymonthyh + dknum * monthlilv) + dknum / month * (1 + monthlilv)) / 2 * month - dknum;
        //还款总额 总利息+贷款本金
        var totalPrice = totalLixi + dknum,
            leftFund = totalLixi + dknum;

        //循环月份
        var monthdataArray = [],
            nowmonth = new Date().getMonth(),
            realmonth = 0;

        for (var i = 1; i <= month; i++) {
            realmonth = nowmonth + i;
            var yearlist = Math.floor(i / 12);

            realmonth = realmonth - 12 * yearlist;

            if (realmonth > 12) {
                realmonth = realmonth - 12
            }
            yhbenjin = everymonthyh * (i - 1);
            var yuebenjin = everymonthyh + (dknum - yhbenjin) * monthlilv;
            //每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
            var yuelixi = (dknum - yhbenjin) * monthlilv;
            leftFund = leftFund - yuebenjin;
            if (leftFund < 0) {
                leftFund = 0
            }
            monthdataArray[i - 1] = {
                monthName: realmonth + "月",
                yuelixi: yuelixi,
                //每月本金
                yuebenjin: everymonthyh,
                //剩余还款
                leftFund: leftFund
            }
        }
        return {
            yuegong: yuegong,
            totalLixi: totalLixi,
            totalPrice: totalPrice,
            yuegongdijian: yuegongdijian,
            monthdataArray: monthdataArray,
            totalDknum: num,
            year: year
        }

    }

}
