/**
 * 位置筛选模块
 *
 * author: angtian
 * e-mail: angtian.fgm@taobao.com
 */
KISSY.add(function (S, Slide, Filter) {

/**
 * 位置筛选构造函数
 *
 * @class FilterLocation
 * @constructor
 */
function FilterLocation() {
    var self = this;

    // 调用父类构造函数
    FilterLocation.superclass.constructor.apply(self, arguments);
}

return S.extend(FilterLocation, Filter, {

    /**
     * 初始化后调用
     *
     * @method afterInit
     */
    afterInit: function() {
        var self = this;

        // 初始化Slide
        self._initSlide();
    },

    /**
     * 单选类型匹配选择
     *
     * @method select
     * @param  {String} v 位置坐标lng,lat
     */
    _radioSelect: function(v) {
        var self = this;

        // 匹配选项节点
        var node = self.nContainer.one('a[data-value="'+ v +'"]');

        var selectedClass = self.get('selectedClass');

        // 清除所有选项选中状态
        self.nFilterTags.removeClass(selectedClass);

        // 如果不包含匹配选项节点，将不限设为选中状态
        if (!node) {
            self.locationSlide && self.locationSlide.tabs.removeClass(selectedClass);
            self.nFilterUnlimit.addClass(selectedClass);
            self._radioText = null;
            self._radioValue = null;
            return;
        }

        // 添加选中样式
        node.addClass(selectedClass);

        // 如果位置是地铁线路，切换到相应Tab
        var subwayTab = node.attr('data-subway-index') * 1;
        if (self.subwaySlide && subwayTab) {
            self.subwaySlide.go(subwayTab);
        }

        // 切换位置Tab
        var locationTab = node.attr('data-location-index') * 1;
        if (self.locationSlide && locationTab) {
            self.locationSlide.go(-1);
            self.locationSlide.tabs.removeClass(selectedClass);
            self.locationSlide.tabs.item(locationTab).addClass(selectedClass);
        }

        // 位置筛选模块值
        self._radioText = node.attr('data-text');
        self._radioValue = v;
    },

    /**
     * 初始化Slide
     *
     * @method _initSlide
     * @private
     */
    _initSlide: function() {
        var self = this;

        var nLocationSlide = S.one('#J_LocationSlide');
        var nSubwaySlide = S.one('#J_SubwaySlide');

        // 如果包含位置Tab结构，实例位置Slide
        if (nLocationSlide) {
            self.locationSlide = new Slide(nLocationSlide, {
                navClass: 'location-nav',
                contentClass: 'location-content',
                pannelClass: 'location-pannel',
                selectedClass: 'location-selected',
                triggerSelector: 'li a'
            });
        }

        // 如果包含地铁Tab结构，实例地铁Slide
        if (nSubwaySlide) {
            self.subwaySlide = new Slide(nSubwaySlide, {
                navClass: 'subway-nav',
                contentClass: 'subway-content',
                pannelClass: 'subway-pannel',
                selectedClass: 'subway-selected',
                triggerSelector: 'li a'
            });
        }
    }

});

}, {requires:['gallery/slide/1.2/', 'gallery/filter/1.1/']});