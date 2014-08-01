/**
 * 价格筛选模块
 *
 * author: angtian
 * e-mail: angtian.fgm@taobao.com
 */
KISSY.add(function (S, Filter) {

/**
 * 价格筛选模块构造函数
 *
 * @class FilterPrice
 * @constructor
 */
function FilterPrice() {
    var self = this;

    // 调用父类构造函数
    FilterPrice.superclass.constructor.apply(self, arguments);
}

/**
 * 继承筛选基础模块
 */
return S.extend(FilterPrice, Filter, {

    /**
     * 初始化后调用
     *
     * @method afterInit
     */
    afterInit: function() {
        var self = this;

        // 自定义容器
        self.nCustom = self.nContainer.one('.J_FilterCustom');

        // 自定义文本节点
        self.nCustomText = self.nContainer.one('.J_FilterCustomText');

        // 自定义范围节点
        self.nCustomRange = self.nContainer.one('.J_FilterCustomRange');

        // 自定义范围最小输入节点
        self.nCustomMin = self.nContainer.one('.J_FilterCustomMin');

        // 自定义范围最大输入节点
        self.nCustomMax = self.nContainer.one('.J_FilterCustomMax');

        // 绑定自定义价格相关事件
        self._bindCustomPriceEvent();
    },

    /**
     * 选择匹配项
     *
     * @method select
     * @param  {String} v   筛选值
     * @param  {Strong} min 自定义最小
     * @param  {Strong} max 自定义最大
     */
    _radioSelect: function(v, min, max) {
        var self = this;

        // 已选项节点
        var node = self.nContainer.one('a[data-value="'+ v +'"]') || self.nFilterUnlimit;

        var selectedClass = self.get('selectedClass');

        // 清除所有选项选中状态
        self.nFilterTags.removeClass(selectedClass);

        // 自定义价格处理
        if (v == 'R5') {
            min = min || 0;
            max = max || 10000;
            self._radioText = min + '-' + max + '元';
            self._radioValue = 'R5';
            self.nCustom && self.nCustom.addClass('filter-custom-active');
            self.nCustomMin && self.nCustomMin.val(min);
            self.nCustomMax && self.nCustomMax.val(max);
            return;
        }

        // 隐藏自定义价格编辑状态
        self.nCustom && self.nCustom.removeClass('filter-custom-active');

        // 添加选中样式
        node && node.addClass(selectedClass);

        // 价格筛选模块值
        self._radioText = node && node.attr('data-text');
        self._radioValue = v;
    },

    /**
     * 绑定事件
     *
     * @method _bindCustomPriceEvent
     * @private
     */
    _bindCustomPriceEvent: function() {
        var self = this;

        // 自定义点击事件
        self.nContainer.delegate('click', '.J_FilterCustomText', function(e) {
            self.nCustom && self.nCustom.addClass('filter-custom-active');
            self.nCustomMin && self.nCustomMin.val('');
            self.nCustomMax && self.nCustomMax.val('');
        });

        // 自定义确定按钮点击事件
        self.nContainer.delegate('click', '.J_FilterCustomConfirm', function(e) {

            // 如果无自定义节点，退出
            if (!self.nCustomMin || !self.nCustomMax) {
                return;
            }

            var min = Number(self.nCustomMin.val());
            var max = Number(self.nCustomMax.val());

            if (isNaN(min) || min < 0 || min > 10000){
                min = 0;
            }

            if (isNaN(max) || max <=0 || max > 10000){
                max = 10000;
            }

            // 如果最小值大于最大值，数值交换
            if (min > max){
                min = [min, max];
                max = min[0];
                min = min[1];
            }

            self._radioSelect('R5', min, max);

            // 触发选项选择事件
            self.fire('select', {option: self.getValue()});
        });
    }

});

}, {requires:['gallery/filter/1.1/']});