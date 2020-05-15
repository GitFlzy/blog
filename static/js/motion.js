const backToTop = function() {
    window.scrollTo(0, 0)
}

const pushState = function(record, title='') {
    history.pushState(record, title, record.path)
    document.title = title
}

const replaceState = function(record=null, title='') {
    if (record == null) {
        let history = JSON.parse(localStorage.history)
        record = history.records[0]
    }
    history.replaceState(record, title, record.path)
    document.title = title
}

const clearPage = function() {
    let classList = e('.article-list')
    removeAllChildren(classList)
}

function getCurrentUrl() {
    return location.pathname
}

function isIndex(url) {
    return url === '/'
}

function isDetail(url) {
    // "/post/12345"
    let arr = url.split('/')
    return arr.length > 0 && arr[1] === 'post'
}

function loadPage(record) {
    // console.log('load page start')
    let path = record.path
    if (isIndex(path)) {
        Front.unit.registerIndexBody(record)
    } else if (isDetail(path)) {
        Front.unit.registerDetailBody(record)
    }
}

function initHistoryRecord() {
    // 浏览记录是一个数组，有一个 activeIndex 指向当前的页面记录
    // 每个记录元素都是一个对象，对象存储
    // path，id，valid（记录的有效性），lastPosition（上次访问的y坐标位置）
    let history = {
        activeIndex: 0,
        records: [],
    }
    localStorage.history = JSON.stringify(history)

    let record = newRecord(location.pathname)

    saveRecord(record)
}

function newRecord(path, title='') {
    let history = JSON.parse(localStorage.history)
    let index = history.records.length
    // console.log('生成新的 id', lastId+1)
    // let y = window.scrollY
    // console.log('生成的 Y 坐标位置', y)

    let record = {
        // id: lastId + 1,
        index: index,
        path: path,
        valid: true,
        lastPosition: [0, 0],
        title: title,
    }
    return record
}

function invalidateForwards() {
    // console.log('invalidate start')
    // console.log('点击了新页面，清空前进栈的数据')

    let history = JSON.parse(localStorage.history)
    let index = Number(history.activeIndex)
    // console.log('当前的 index', index)
    for (let i = index + 1; i < history.records.length; ++i) {
        history.records[i].valid = false
    }

    // console.log('现在的 history', history)
    localStorage.history = JSON.stringify(history)
}

function findIndexFiredRecord(record) {
    // console.log('查找目标下标', record.id-1)
    let targetIndex = record.index
    // console.log('find index by record', record)
    let storage = JSON.parse(localStorage.history)
    let activeIndex = storage.activeIndex
    let records = storage.records
    // console.log('记录列表', records)

    if (records[targetIndex].valid) {
        return targetIndex
    }

    // console.log('当前的 下标', activeIndex)
    // console.log('目标下标', targetIndex)
    if (activeIndex > targetIndex) {
        // 后退，无效化后面的记录
        for (let i = activeIndex; i >= 0; --i) {
            if (records[i].valid) {
                return i
            }
        }
    } else {
        // 前进
        for (let j = activeIndex; j < records.length; ++j) {
            let record = records[j]
            if (record.valid) {
                return j
            }
        }
    }
}

counter = 0
function saveRecord(record) {
    // console.log('保存了记录 ', counter++, '次')
    let history = JSON.parse(localStorage.history)
    history.records.push(record)
    history.activeIndex = history.records.length - 1
    localStorage.history = JSON.stringify(history)
}

function scrollToPosition(position) {
    let x = position[0]
    let y = position[1]
    window.scrollTo(x, y)
}

function loadPageByRecord(record) {
    // console.log('load page by record start')
    let index = findIndexFiredRecord(record)
    updateActiveIndex(index)
    let history = getHistory()
    record = history.records[index]
    loadPage(record)
}

function updateActiveIndex(index) {
    let history = JSON.parse(localStorage.history)
    history.activeIndex = index
    localStorage.history = JSON.stringify(history)
}

function getHistory() {
    return JSON.parse(localStorage.history)
}

function updateHistory(history) {
    localStorage.history = JSON.stringify(history)
}

function saveCurrentPosition() {
    let history = getHistory()
    let index = history.activeIndex
    let records = history.records
    records[index].lastPosition = [0, window.scrollY]
    updateHistory(history)
}

function initApp() {
    Front.utils.bindEvent('.content-wrap', 'click', function(event){
        let target = event.target
        console.log('点击了目标', target)
        if (target.classList.contains('post-link')) {
            // console.log('点击了文章', target)
            // console.log('当前的位置是', window.scrollY)
            saveCurrentPosition()
            let item = target.closest('.post-item')
            let blogId = item.dataset.blogId
            // console.log('获取到blogId', blogId)
            let url = '/post/' + blogId
            let record = newRecord(url)
            Front.unit.registerDetailBody(record)
            invalidateForwards()
            pushState(record)
            // console.log('after push record, state', history.state)
            saveRecord(record)
            updateActiveIndex(record.index)
            // console.log('after save record, my history', JSON.parse(localStorage.history))
        }
    })

    window.addEventListener('popstate', function(event){
        // console.log('触发了 popstate', event)
        // state 就是一个 record 对象
        let record = event.state
        // console.log('state', record)
        saveCurrentPosition()
        loadPageByRecord(record)
    })

    initHistoryRecord()
    let record = getHistory().records[0]
    loadPage(record)
    replaceState()
    // console.log('初始化页面 replace state', localStorage.history)
}