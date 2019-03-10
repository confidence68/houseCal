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
            if (sdObj.mouthdataArray.length > gjjObj.mouthdataArray.length) {
                var mergemouthdataArray = sdObj.mouthdataArray.map(function (item, index) {
                    if (index < gjjObj.mouthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi + gjjObj.mouthdataArray[index].yuelixi,
                            yuebenjin: item.yuebenjin + gjjObj.mouthdataArray[index].yuebenjin,
                            leftFund: item.leftFund + gjjObj.mouthdataArray[index].leftFund
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
                var mergemouthdataArray = gjjObj.mouthdataArray.map(function (item, index) {
                    if (index < sdObj.mouthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi + sdObj.mouthdataArray[index].yuelixi,
                            yuebenjin: item.yuebenjin + sdObj.mouthdataArray[index].yuebenjin,
                            leftFund: item.leftFund + sdObj.mouthdataArray[index].leftFund
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
                mouthdataArray: mergemouthdataArray,
                totalDknum: parseFloat(sdObj.totalDknum) + parseFloat(gjjObj.totalDknum),
                year: year
            }

        } else if (type == 2) {
            var sdObj = _this.benjin(type, sdnum, sdyear, sdlilv);
            var gjjObj = _this.benjin(type, gjjnum, gjjyear, gjjlilv);
            if (sdObj.mouthdataArray.length > gjjObj.mouthdataArray.length) {
                var mergemouthdataArray = sdObj.mouthdataArray.map(function (item, index) {
                    if (index < gjjObj.mouthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi + gjjObj.mouthdataArray[index].yuelixi,
                            yuebenjin: item.yuebenjin + gjjObj.mouthdataArray[index].yuebenjin,
                            leftFund: item.leftFund + gjjObj.mouthdataArray[index].leftFund
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
                var mergemouthdataArray = gjjObj.mouthdataArray.map(function (item, index) {
                    if (index < sdObj.mouthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi + sdObj.mouthdataArray[index].yuelixi,
                            yuebenjin: item.yuebenjin + sdObj.mouthdataArray[index].yuebenjin,
                            leftFund: item.leftFund + sdObj.mouthdataArray[index].leftFund
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
                mouthdataArray: mergemouthdataArray
            }
        }

    },
    //等额本息计算
    benxi: function (type, num, year, lilv) {
        //每月月供额=〔贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔(1＋月利率)＾还款月数-1〕
        var mouth = parseInt(year) * 12,
            mouthlilv = parseFloat(lilv) / 12,
            dknum = parseFloat(num) * 10000;
        //每月月供
        var yuegong = (dknum * mouthlilv * Math.pow((1 + mouthlilv), mouth)) / (Math.pow((1 + mouthlilv), mouth) - 1);
        //总利息=还款月数×每月月供额-贷款本金
        var totalLixi = mouth * yuegong - dknum;
        //还款总额 总利息+贷款本金
        var totalPrice = totalLixi + dknum,
            leftFund = totalLixi + dknum;

        //循环月份
        var mouthdataArray = [],
            nowmouth = new Date().getMonth(),
            realmonth = 0;

        for (var i = 1; i <= mouth; i++) {
            realmonth = nowmouth + i;
            var yearlist = Math.floor(i / 12);

            realmonth = realmonth - 12 * yearlist;

            if (realmonth > 12) {
                realmonth = realmonth - 12
            }
            //console.log(realmonth)
            //每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
            var yuelixi = dknum * mouthlilv * (Math.pow((1 + mouthlilv), mouth) - Math.pow((1 + mouthlilv), i - 1)) / (Math.pow((1 + mouthlilv), mouth) - 1);
            //每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
            var yuebenjin = dknum * mouthlilv * Math.pow((1 + mouthlilv), i - 1) / (Math.pow((1 + mouthlilv), mouth) - 1);
            leftFund = leftFund - (yuelixi + yuebenjin);
            if (leftFund < 0) {
                leftFund = 0
            }
            mouthdataArray[i - 1] = {
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
            mouthdataArray: mouthdataArray,
            totalDknum: num,
            year: year
        };
    },
    //等额本金计算
    benjin: function (type, num, year, lilv) {
        var mouth = parseInt(year) * 12,
            mouthlilv = parseFloat(lilv) / 12,
            dknum = parseFloat(num) * 10000,
            yhbenjin = 0; //首月还款已还本金金额是0
        //每月应还本金=贷款本金÷还款月数
        var everymonthyh = dknum / mouth
        //每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
        var yuegong = everymonthyh + (dknum - yhbenjin) * mouthlilv;
        //每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
        var yuegongdijian = everymonthyh * mouthlilv;
        //总利息=〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×还款月数-总贷款额
        var totalLixi = ((everymonthyh + dknum * mouthlilv) + dknum / mouth * (1 + mouthlilv)) / 2 * mouth - dknum;
        //还款总额 总利息+贷款本金
        var totalPrice = totalLixi + dknum,
            leftFund = totalLixi + dknum;

        //循环月份
        var mouthdataArray = [],
            nowmouth = new Date().getMonth(),
            realmonth = 0;

        for (var i = 1; i <= mouth; i++) {
            realmonth = nowmouth + i;
            var yearlist = Math.floor(i / 12);

            realmonth = realmonth - 12 * yearlist;

            if (realmonth > 12) {
                realmonth = realmonth - 12
            }
            yhbenjin = everymonthyh * (i - 1);
            var yuebenjin = everymonthyh + (dknum - yhbenjin) * mouthlilv;
            //每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
            var yuelixi = (dknum - yhbenjin) * mouthlilv;
            leftFund = leftFund - yuebenjin;
            if (leftFund < 0) {
                leftFund = 0
            }
            mouthdataArray[i - 1] = {
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
            mouthdataArray: mouthdataArray,
            totalDknum: num,
            year: year
        }

    }

}