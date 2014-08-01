/**
 * 已选条件模块
 *
 * author: angtian
 * e-mail: angtian.fgm@taobao.com
 */
KISSY.add(function (S, Event, FilterTemplate) {


/**
 * 已选条件模块构造函数
 *
 * @class FilterFilter
 * @constructor
 */
function FilterQuery() {
    this._init.apply(this, arguments);
}

return S.augment(FilterQuery, Event.Target, {

    /**
     * 模块初始化
     *
     * @method _init
     * @private
     */
    _init: function(cfg) {
        var self = this;

        self.nContainer = S.one(cfg.id);

        self.nList = S.one(cfg.listId);

        // 单项删除事件
        self.nContainer.delegate('click', '.J_FilterQueryDel', function(e) {
            var node = S.one(e.currentTarget);
            self._remove(node.attr('data-type'), node.attr('data-value'));
        });

        // 全部清除事件
        self.nContainer.delegate('click', '.J_FilterQueryClear', function(e) {
            self._remove();
        });
    },

    /**
     * 删除已选条件
     *
     * @method remove
     * @param  {String} type  筛选类型
     * @param  {String} value 已选条件值
     */
    _remove: function(type, value) {
        var self = this;
        self.fire('remove', {
            data: {
                type: type,
                value: value
            }
        });
    },

    /**
     * 更新已选
     *
     * @method update
     */
    update: function(data) {
        var self = this;

        self.nList.html(FilterTemplate.queryList(data));

        self.nContainer[data.length > 0 ? 'removeClass' : 'addClass']('hotel-filter-list-hidden');
    }

});

}, {requires: ['event', './filter-template']});