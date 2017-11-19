# 用法
1. 在页面需要的地方，添加
```html
<page-pagination :pagination-config="XXX" @current-page="some-methods"></page-pagination>
```
> 其中 id 是可选的  ```id="xxx"```
2. 在实例的data中，声明配置Json对象，
```javascript
data: {
      XXX: {
          // 必选参数
          page_total:0,
          page_onePageNum: 2,
          
          //options
          page_current: 1,    // 页面初始化的时候，展示的页数。   默认为1， 类型Number
          page_current: 1,    // 页面初始化的时候，展示的页数。   默认为1， 类型Number
          page_group_xs_mode: true,  // 控制分页可见页码的模式  xs则展示较少页码，一般用作移动端   默认 是false，类型Boolean
          page_num_show: true,  // 为true时，在下一页后面显示总页数  默认 是false  类型Boolean
          page_jump: true,     //  为true时，开启跳转页数功能  默认 是false 类型Boolean
         
      },
}
```
3. 一般是在created（）中请求接口，获取数据的长度，赋值给page_total，现在可选项配置可以在某些需要的时候，再次修改。

# 示例
HTML或模板
```html
<page-pagination :pagination-config="pageInfo" @current-page="showPage" id="my_pagination"></page-pagination>
```
Vue.js
```javascript
(function () {
    const isNews = DISPLAY === 'news';
    const URL = isNews ? NEWS_DETAIL_URL : ANNOUNCE_DETAIL_URL;

    let infoVM = new Vue({
        el: '#info',
        data: {
            show_data: {},
            start: 0,

            pageInfo: {
                page_total: 0,  // 数据总数  默认空 可请求接口获取总数据数 为0或小于每页显示数 时，组件不展示。 类型Number
                page_one_page_num: 1,    // 每页显示条数  默认1   类型Number

                page_current: 1,    // 页面初始化的时候，展示的页数。   默认为1， 类型Number
                page_group_xs_mode: true,  // 控制分页可见页码的模式  xs则展示较少页码，一般用作移动端   为空和默认 是false，类型Boolean
                page_num_show: true,  // 为true时，在下一页后面显示总页数  为空和默认 是false  类型Boolean
                page_jump: true,     //  为true时，开启跳转页数功能  为空和默认 是false 类型Boolean
            },
        },
        created(){
            console.log('实例的初始化 打印，然后请求接口，得到数据总数');
            if(this.pageInfo['page_current']){
                this.start = (this.pageInfo['page_current']-1) * this.pageInfo.page_one_page_num;
            }
            this.getData(this.start, this.pageInfo.page_one_page_num);
        },
        methods: {
            showPage: function (val) {
                this.start = (val-1) * this.pageInfo.page_one_page_num;
                // 可以 在需要的时候，切换分页显示的 模式。  比如手机上以  xs_group 模式。
                //this.pageInfo.page_group_xs_mode = true;
                

                this.getData(this.start, this.pageInfo.page_one_page_num);
            },

            getData: function (start,limit) {
                // $.ajaxGet(`/api/media/${DISPLAY}?start=${start}&limit=${start}`, (flag, data)=>{
                $.ajaxGet(`/api/media/news?start=${start}&limit=${limit}`, (flag, data)=>{
                    if(flag){
                        console.log(data);
                        this.pageInfo.page_total = data['count'];

                        data['data'].forEach(a=>{
                            a.url = `${URL}?pid=${a.pid}&tid=${a.tid}`;
                        });

                        this.show_data = data['data'];
                    }
                });
            },
        },
    });
})();
```