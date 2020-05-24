function registerSidebarTOC() {
    function headingTemplate(number, title) {
        let t = `
            <li class="nav-item">
                <a class="nav-title" href="#${title}">
                    <span class="nav-number">${number}.</span>
                    <span class="nav-text">${title}</span>
                </a>
            </li>
        `
        return t
    }

    function initTOC(heading) {
        // [编号，等级，目录元素节点，目录元素的父节点]
        let stack = [
            {
                number: '0',
                level: heading.nodeName.replace('H', ''),
                headingNode: null,
                parentNode: utils.e('.toc-nav'),
            },
        ]
        return stack
    }

    function newChild() {
        let newNode = document.createElement('ol')
        newNode.classList.add('nav-child')
        return newNode
    }

    function newSubLevel(number) {
        newNumber = number + '.1'
        return newNumber
    }

    function appendSubHeading(top, subHeading) {
        top.headingNode.appendChild(subHeading)
    }

    function newSibling(number) {
        let numbers = number.split('.')
        numbers[numbers.length - 1] = (Number(numbers[numbers.length - 1]) + 1).toString()
        sibling = numbers.join('.')
        return sibling
    }

    function insertSidebar(parent, heading) {
        parent.insertAdjacentHTML('beforeend', heading)
    }

    function buildTOC() {
        let headings = utils.es('h2, h3, h4, h5, h6, h7')

        if (headings.length === 0) {
            return
        }

        let toc = initTOC(headings[0])
        for (const heading of headings) {
            let level = Number(heading.nodeName.replace('H', ''))
            let top = toc[toc.length - 1]
            while (level < top.level) {
                toc.pop()
                top = toc[toc.length - 1]
            }

            let number = ''
            let parentNode = top.parentNode
            if (level > top.level) {
                number = newSubLevel(top.number)
                let subHeading = newChild()
                appendSubHeading(top, subHeading)
                parentNode = subHeading
            } else {
                toc.pop()
                number = newSibling(top.number)
            }

            let headingText = heading.id
            let ht = headingTemplate(number, headingText)
            insertSidebar(parentNode, ht)

            let record = {
                number: number,
                level: level,
                headingNode: parentNode.lastElementChild,
                parentNode: parentNode,
            }

            toc.push(record)
        }
    }

    function bindEventBookMark() {
        let links = utils.es('.nav-title')
        links.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                let id = event.target.closest('.nav-title').getAttribute('href')
                let title = document.querySelector(id)
                let y = title.getBoundingClientRect().top + window.scrollY
                window.scrollTo(0, y + 5)
            })

        })
    }

    function activateNavByIndex(index) {
        let catalog = document.querySelectorAll('.nav-title')
        let target = catalog[index]
        if (target.classList.contains('active-current')) {
            return
        }

        document.querySelectorAll('.post-toc .active').forEach(element => {
            element.classList.remove('active', 'active-current');
        })
        target.classList.add('active', 'active-current');
        let parent = target.parentNode;
        while (!parent.matches('.post-toc')) {
            if (parent.matches('li')) parent.classList.add('active');
            parent = parent.parentNode;
        }
    }

    function findIndex(entries, sections) {
        let index = 0
        let entry = entries[index]
        for (; index < entries.length; ++index) {
            if (entries[index].boundingClientRect.top > 0) {
                entry = entries[index]
                index = sections.indexOf(entry.target)
                return index === 0 ? 0 : (index - 1)
            } else {
                entry = entries[index]
            }
        }

        return sections.indexOf(entry.target)
    }

    function observeDocument(marginTop) {
        marginTop = 10000 + marginTop
        let sections = [...utils.es('h2, h3, h4, h5, h6, h7')]
        if (sections.length === 0) {
            return
        }

        let options = {
            root: null,
            rootMargin: `${marginTop}px 0px -100% 0px`,
            threshold: 0,
        }

        let observer = new IntersectionObserver(function(entries, observe) {
            let scrollHeight = document.documentElement.scrollHeight + 100;
            if (scrollHeight > marginTop) {
                observe.disconnect();
                observeDocument(scrollHeight);
                return;
            }

            let index = findIndex(entries, sections)
            activateNavByIndex(index)
        }, options);

        for (const title of sections) {
            observer.observe(title)
        }

        // 观察的元素被删除后垃圾回收前仍然能触发观察事件
        // 这里保存，清理页面数据时手动停止观察再清除元素
        observers.push(observer)
    }

    buildTOC()
    bindEventBookMark()
    observeDocument(document.documentElement.scrollHeight)
}
