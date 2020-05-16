
const Route = function(path, title='') {
    const record = {
        id: 1,
        path: path,
        lastPosition: [0, 0],
        title: title,
    }

    const records = [record]
    const top = record
    const index = 0

    return {
        top: top,
        topIndex: index,
        records: records,
    }
}

function initRoute() {
    return Route(location.pathname)
}

function getCurrentUrl() {
    return location.pathname
}

function indexOfRecords(records, record) {
    for (let i = records.length - 1; i >= 0; --i) {
        if (records[i].id === record.id) {
            // return records[i]
            return i
        }
    }
    return -1
}

function findRouteRecord(record) {
    let step = record.id > route.top.id ? 1 : (-1);
    for (let i = route.topIndex; i >= 0 && i < route.records.length; i += step) {
        if (route.records[i].id === record.id) {
            return [i, route.records[i]]
        }
    }

}

function updateRoute(record) {
    [route.topIndex, route.top] = findRouteRecord(record)
    return route.top
}

function clearForward() {
    route.records = route.records.slice(0, route.topIndex + 1)
}

function pushRecords(record) {
    route.records.push(record)
    route.top = record
    route.topIndex += 1
}

function pushRoute(record) {
    console.log('添加记录', record)
    clearForward()
    pushRecords(record)
}

function pushHistory(record) {
    pushState(record)
    // pushRoute(record)
}
