Vue.component('page-pagination', {
    props:{
        id: [String, Number],
        paginationConfig: {
            type: Object,
            required: true
        }
    },
    data(){
        return{
            page_current: Number.parseInt(this.paginationConfig['page_current']) || 1,
            page_jump_num: Number.parseInt(this.paginationConfig['page_current']) || 1,
        }
    },
    template: `
        <div class="page-pagination" v-if="page_num > 1" :id="id" v-cloak>
            <ul class="page-nav ele-unselected">
                <li @click="clickCurrentPage(page_current - 1)">< 上一页</li>
                <!--小于分页组时-->
                <template v-if="page_num <= page_group">
                    <li v-for="(n, index) in page_num" 
                        :class="{active: n == page_current}" 
                        @click="clickCurrentPage(n)">{{n}}</li>
                </template>
                
                <!--当前页数还不到切换状态时-->
                <template v-else-if="page_current+page_group_n < page_group">
                    <li v-for="(n, index) in page_num" 
                        v-show="n < page_group"
                        :class="{active: n == page_current}"
                        @click="clickCurrentPage(n)">{{n}}</li>
                </template>
                <!--显示第二种分页情况-->
                <template v-else>
                    <li v-for="(n, index) in page_group_n" 
                        v-show="n < page_group"
                        :class="{active: n == page_current}" 
                        @click="clickCurrentPage(n)">{{n}}</li>
                    <li>...</li>
                    
                    <li v-for="(n, index) in page_num" 
                        v-if="n>page_group_n+1" 
                        v-show="page_num-page_current > page_group_n && n>page_current-page_group_n-1 && n<page_current+page_group_n+1 || page_num-page_current <= page_group_n && n>page_num - page_group_n*2-1" 
                        :class="{active: n === page_current}" 
                        @click="clickCurrentPage(n)">{{ n }}</li>
                    
                </template>
                
                <!--还未到尾页的时候，显示省略号-->
                <li v-if="page_num > page_group && page_current+page_group_n < page_num">...</li>
                
                <br class="mobile">
                <li @click="clickCurrentPage(page_current + 1)">下一页 ></li>
                
                <!--显示总页数，默认关闭-->
                <li v-if="page_num_show">共 {{page_num}} 页</li>
                <!--增加跳转页数功能，默认关闭-->
                <template v-if="page_jump">
                    <li class="page-jump">第 <input type="text" v-model="page_jump_num" @keyup.enter="jumpPage"> 页</li>
                    <li @click="jumpPage">确定</li>
                </template>
            </ul>
        </div>
    `,
    created(){
        console.log('组件的初始化 打印');
    },
    // 这里的计算属性，支持 用户再次修改配置。
    computed: {
        page_num: function () {
            var page_total= Number.parseInt(this.paginationConfig['page_total']) || 0,
                page_one_page_num= Number.parseInt(this.paginationConfig['page_one_page_num']) || 1;
            if(page_total === 0) return 0;
            return Math.ceil(page_total / page_one_page_num);
        },
        page_group: function () {
            return this.paginationConfig['page_group_xs_mode'] ? 5 : 8;
        },
        page_group_n: function () {
            return this.paginationConfig['page_group_xs_mode'] ? 1 : 2;
        },
        page_jump: function () {
            return this.paginationConfig['page_jump'] || false;
        },
        page_num_show: function () {
            return this.paginationConfig['page_num_show'] || false;
        }
    },
    methods: {
        clickCurrentPage: function(val) {
            val = Number.parseInt(val);
            // 如果点击的页数（包括上一页下一页按钮）已经是第一页 或 最后一页 或是当前页
            if(val === 0 || val>this.page_num || val === this.page_current) return;

            this.page_current = val;
            this.page_jump_num = val;

            this.$emit('current-page', this.page_current);
        },
        jumpPage: function () {
            // 校验输入框，保证传入符合条件
            this.page_jump_num = Number.parseInt(this.page_jump_num) ? Number.parseInt(this.page_jump_num): this.page_current;
            this.page_jump_num = this.page_jump_num<1 ? 1: this.page_jump_num;
            this.page_jump_num = this.page_jump_num>this.page_num ? this.page_num: this.page_jump_num;

            if(this.page_jump_num === this.page_current) return;

            this.page_current = this.page_jump_num;
            this.$emit('current-page', this.page_current);
        }
    }
});