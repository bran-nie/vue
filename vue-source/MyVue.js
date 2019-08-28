// new MyVue({data: {...}})

class MyVue {
    constructor(options) {
        this.$options = options

        // 数据响应化
        this.$data = options.data
        this.observe(this.$data)

        // 模拟 watcher 创建
        // new Watcher()
        // this.$data.test
        // new Watcher()
        // this.$data.foo.bar

        new Compile(options.el, this)

        // created 执行
        if (options.created) {
            options.created.call(this)
        }
    }

    observe(data) {
        if (!data || typeof data !== 'object') return

        // 遍历该对象
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
            // 代理data中的属性到Vue实例上
            this.proxyData(key)
            this.defineReactive(data, key, data[key])
        })
    }

    // 数据响应化
    defineReactive(obj, key, val) {

        this.observe(val)  // 递归解决数据嵌套

        const dep = new Dep()

        Object.defineProperty(obj, key, {
            get() {
                Dep.target && dep.addDep(Dep.target)
                return val
            },
            set(newVal) {
                if (newVal === val) {
                    return
                }

                val = newVal
                // console.log(`${key}属性更新了：${val}`)
                dep.notify()
            }
        })
    }

    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key]
            },
            set(newVal) {
                this.$data[key] = newVal
            }
        })
    }
}


// Dep: 用来管理watcher
class Dep {
    constructor() {
        // 这里存放若干依赖 (watcher)
        this.deps = []
    }

    addDep(dep) {
        this.deps.push(dep)
    }

    notify() {
        this.deps.forEach(dep => {
            dep.update()
        })
    }
}

// Watcher
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb
        // 将当前的watcher实例指定到Dep静态属性的target
        Dep.target = this
        this.vm[this.key]   // 触发getter， 添加依赖
        Dep.target = null
    }

    update() {
        this.cb.call(this.vm, this.vm[this.key])
    }
}
