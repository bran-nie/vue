// 用法 new Compile(el, vm)

class Compile {
    constructor(el, vm) {
        // 要便利的宿主节点
        this.$el = document.querySelector(el)

        this.$vm = vm

        // 开始编译
        if (this.$el) {
            // 转换内部内容为片段 Fragment
            this.$fragment = this.node2Fragment(this.$el)

            // 执行编译
            this.compile(this.$fragment)

            // 将编译完的HTML结果追加至$el
            this.$el.appendChild(this.$fragment)
        }
    }

    // 将宿主元素中代码片段拿出来遍历，这样作比较高效
    node2Fragment(el) {
        const frag = document.createDocumentFragment()

        // 将el中所有子元素搬家至fragment中
        let child
        while (child = el.firstChild) {
            frag.appendChild(child)
        }

        return frag
    }

    compile(fragment) {
        const childNodes = fragment.childNodes
        Array.from(childNodes).forEach(node => {
            // 类型判断
            if (this.isElement(node)) {
                // 元素
                // console.log('编译元素', node.nodeName)
                // 查找  m-, @, :  开头的指令
                const nodeAttrs = node.attributes
                Array.from(nodeAttrs).forEach(attr => {
                    const attrName = attr.name  // 属性名
                    const exp = attr.value   // 属性值
                    if (this.isDirective(attrName)) {
                        node.removeAttribute(attrName)
                        // m-text
                        const dir = attrName.substring(2)
                        // 执行指令
                        this[dir] && this[dir](node, this.$vm, exp)
                    }
                    if (this.isEvent(attrName)) {
                        node.removeAttribute(attrName)
                        const dir = attrName.substring(1)
                        this.eventHandler(node, this.$vm, exp, dir)
                    }
                })

            } else if (this.isInterpolation(node)) {
                // 文本
                // console.log('编译文本', node.textContent)
                this.compileText(node)
            }

            // 递归子节点
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }

    compileText(node) {
        console.log(RegExp.$1)
        this.update(node, this.$vm, RegExp.$1, 'text')
    }

    // 更新函数
    update(node, vm, exp, dir) {
        const updaterFn = this[dir+'Updater']
        // 初始化
        updaterFn && updaterFn(node, vm[exp])

        // 依赖收集
        new Watcher(vm, exp, function (value) {
            updaterFn && updaterFn(node, value)
        })
    }

    text(node, vm, exp) {
        this.update(node, vm, exp, 'text')
    }

    textUpdater(node, value) {
        node.textContent = value
    }

    // 双向绑定
    model(node, vm, exp) {
        // 指定 input 的value 属性
        this.update(node, vm, exp, 'model')

        // 视图对模型的响应
        node.addEventListener('input', e => {
            vm[exp] = e.target.value
        })
    }

    modelUpdater(node, value) {
        node.value = value
    }

    html(node, vm, exp) {
        this.update(node, vm, exp, 'html')
    }

    htmlUpdater(node, value) {
        node.innerHTML = value
    }

    eventHandler(node, vm, exp, dir) {
        const fn = vm.$options.methods && vm.$options.methods[exp]  // example: exp: click

        if (dir && fn) {
            node.addEventListener(dir, fn.bind(vm))    // 使用bind绑定后，在实例中的methods，才可以放心的使用this
        }
    }


    isDirective(attr) {
        return attr.indexOf('m-') === 0
    }
    isEvent(attr) {
        return attr.indexOf('@') === 0
    }
    isElement(node) {
        return node.nodeType === 1
    }
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
}
