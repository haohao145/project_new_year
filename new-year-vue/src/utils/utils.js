export default {
    //获取两个时间段之间有多少天
    getDateDif(fd, sd) {
        //开始时间
        let firstDate = new Date(fd)
        //结束时间
        let secondDate = new Date(sd)
        let diff = Math.abs(firstDate.getTime() - secondDate.getTime())
        let result = parseInt(diff / (1000 * 60 * 60 * 24))
        return result
    },
    //获取年月日
    formatDate(date) {
        let d = new Date(date)
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        let year = d.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        return [year, month, day].join('/')
    },
    // 获取年月日
    formatChinaDate(date) {
        let d = new Date(date)
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        let year = d.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        return year + '年' + month + '月' + day + '日'
    },

    formatDateCostomer(date, fenge) {
        let d = new Date(date)
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        let year = d.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        return [year, month, day].join(fenge)
    },
    deepClone(obj) {
        var oType = this.getObjectType(obj)
        // eslint-disable-next-line eqeqeq
        if (oType == 'Object') {
            var result = {}
            for (let key in obj) {
                result[key] = this.deepClone(obj[key])
            }
            return result
            // eslint-disable-next-line eqeqeq
        } else if (oType == 'Array') {
            // eslint-disable-next-line no-redeclare
            var result = []
            for (var i = 0; i < obj.length; i++) {
                result[i] = this.deepClone(obj[i])
            }
            return result
        } else {
            return obj
        }
    },

    getObjectType(o) {
        if (o === null) return 'Null'
        if (o === undefined) return 'Undefined'
        return Object.prototype.toString.call(o).slice(8, -1)
    },
    numberThousandFmt: function (num) {

        try {
            if (num > 10000) {
                num = this.fomatFloat(num / 1000, 1) + 'K'
            }
        } catch (e) {
            return '0'
        }
        return num
    },
    uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";

        this.uuidA = s.join("");
        console.log(s.join(""), 's.join("")');
        return this.uuidA;
    },
    // /生成从minNum到maxNum的随机数
    randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }
}
