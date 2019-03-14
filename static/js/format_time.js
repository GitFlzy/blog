var buildBoundaryTimesBaseOnNow = function (timestamp = Date.now()) {
    var nowDate = new Date(timestamp)
    var year = nowDate.getFullYear()
    var month = nowDate.getMonth() + 1
    var day = nowDate.getDate()
    var hour = nowDate.getHours()
    var minute = nowDate.getMinutes()

    return [year, month, day, hour, minute]
}

var formatTime = function (createTime) {
    // python 的 time.time() 时间戳在 js 中要先乘以 1000
    var t = parseInt(createTime) * 1000
    var ct = buildBoundaryTimesBaseOnNow(t)
    var cy = ct[0]
    var cm = ct[1]
    var cd = ct[2]
    var ch = ct[3]
    var cM = ct[4]

    var now = buildBoundaryTimesBaseOnNow()
    var ny = now[0]
    var nm = now[1]
    var nd = now[2]
    var nh = now[3]
    var nM = now[4]

    if (ny > cy) {
        return cy + '年' + cm + '月' + cd + '日'
    } else if (ny == cy && nm - cm >= 1) {
        return cm + '月' + cd + '日'
    } else if (ny == cy && nm - cm < 1 && nd - cd >= 1) {
        return cd + '日' + ch + '时' + cM + '分'
    } else if (ny == cy && nm == cm && nd == cd && nh - ch >= 1) {
        return '今天 ' + ch + ' 时 ' + cM + ' 分'
    } else if (ny == cy && nm == cm && nd == cd && nh == ch && nM - cM >= 1) {
        return (nM - cM) + '分钟前'
    } else if (ny == cy && nm == cm && nd == cd && nh == ch && nM - cM < 1 && nM - cM >= 0){
        return '刚刚'
    } else {
        return '时间格式错误'
    }
}

var loadFormatDate = function() {
    var times = document.querySelectorAll('.archive-article-date')
    for (var i = 0; i < times.length; ++i) {
        var time = times[i]
        var date = time.getAttribute('datetime')
        date = formatTime(date)
        time.setAttribute('datetime', date)
        time.innerHTML = date
    }
}