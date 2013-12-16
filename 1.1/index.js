/**
 * @fileoverview
 * @author 昂天<angtian.fgm@taobao.com>
 * @module filter
 **/
KISSY.add(function (S, Base) {

/**
 * 筛选模块构造函数
 *
 * @class Filter
 * @constructor
 */
function Filter() {
    var self = this;

    // 调用父类构造函数
    Filter.superclass.constructor.apply(self, arguments);

    // 初始化组件
    self._init();
}

return S.extend(Filter, Base, {

    /**
     * 筛选模块初始化
     *
     * @method init
     * @private
     */
    _init: function() {
        var self = this;

        var id = self.get('id');

        if (!id) {
            throw new Error('请设置筛选模块id');
            return;
        }

        // 筛选模块容器
        self.nContainer = S.one(id);

        if (!self.nContainer) {
            throw new Error('未找到筛选模块容器');
            return;
        }

        // 筛选模块包含的所有选项
        self.nFilterTags = self.nContainer.all(self.get('tagClass'));

        if (self.nFilterTags.length < 1) {
            throw new Error('未找到筛选项，请检查筛选项className是否配置正确');
            return;
        }

        // 不限选项
        self.nFilterUnlimit = self.nContainer.one(self.get('unlimitClass'));

        // 单选类型存储: text
        self._radioText = null;

        // 单选类型存储: value
        self._radioValue = null;

        // 多选类型存储: text
        self._checkboxText = [];

        // 多选类型存储: value
        self._checkboxValue = [];

        // 绑定事件
        self._bindUI();

        // 初始化调用
        self.afterInit();
    },

    /**
     * 模块初始化后调用
     *
     * @method afterInit
     */
    afterInit: function() {

    },

    /**
     * 选择匹配项
     *
     * @method select
     * @param  {String} v 选项值
     */
    select: function(v) {
        var self = this;

        switch(self.get('type')) {
            case 'radio':
                self._radioSelect(v);
                break;
            case 'checkbox':
                self._checkboxSelect(v);
                break;
        }
    },

    /**
     * 删除已选选项
     *
     * @method remove
     * @param  {String} v 选项值（如果不传递，删除所有选项）
     */
    remove: function(v) {
        var self = this;

        switch(self.get('type')) {
            case 'radio':
                self._radioRemove();
                break;
            case 'checkbox':
                self._checkboxRemove(v);
                break;
        }
    },

    /**
     * 获取筛选模块选中的值
     *
     * @method getValue
     * @return {Object} 筛选模块值
     */
    getValue: function() {
        var self = this;

        switch(self.get('type')) {
            case 'radio':
                return {
                    text: self._radioText,
                    value: self._radioValue
                };
            case 'checkbox':
                return {
                    text: S.clone(self._checkboxText),
                    value: S.clone(self._checkboxValue)
                };
        }
    },

    /**
     * 获取已选择的选项个数
     *
     * @method getLength
     * @return {Number} 已选择的选项个数
     */
    getLength: function() {
        var self = this;

        switch(self.get('type')) {
            case 'radio':
                return self._radioValue ? 1 : 0;
            case 'checkbox':
                return self._checkboxValue.length
        }
    },

    /**
     * 禁用选项
     *
     * @method disabled
     * @param  {Array} data 要禁用的选项值数组
     */
    disabled: function(data) {
        var self = this;

        var disabledClass = self.get('disabledClass');

        if (S.isArray(data) && data.length > 0) {
            self.nFilterTags.each(function (node) {
                if (S.inArray(node.attr('data-value'), data)) {
                    node.addClass(disabledClass);
                }
            });

            return;
        }

        self.nFilterTags.addClass(disabledClass);

        // 如果包含不限选项，将其设为可用状态
        self.nFilterUnlimit && self.nFilterUnlimit.removeClass(disabledClass);
    },

    /**
     * 启用选项
     *
     * @method enabled
     * @param  {Array} data 要启用的选项值数组
     * @return {[type]}      [description]
     */
    enabled: function(data) {
        var self = this;

        var disabledClass = self.get('disabledClass');

        if (S.isArray(data) && data.length > 0) {
            self.nFilterTags.each(function (node) {
                if (S.inArray(node.attr('data-value'), data)) {
                    node.removeClass(disabledClass);
                }
            });

            return;
        }

        self.nFilterTags.removeClass(disabledClass);
    },

    /**
     * 绑定事件
     *
     * @method _bindUi
     * @private
     */
    _bindUI: function() {
        var self = this;

        // 筛选模块选项点击事件
        self.nContainer.delegate('click', self.get('tagClass'), function(e) {
            e.preventDefault();

            var node = S.one(e.currentTarget);
            var value = node.attr('data-value');
            var isUnlimit = node.hasClass(self.get('unlimitClass').substr(1));
            var isSelected = node.hasClass(self.get('selectedClass').substr(1));
            var isDisabled = node.hasClass(self.get('disabledClass').substr(1));

            if (isDisabled) {
                return;
            }

            switch(self.get('type')) {
                case 'radio':
                    switch(true) {
                        case isSelected:
                            return;
                        default:
                            self.select(value);
                            break;
                    }
                    break;
                case 'checkbox':
                    switch(true) {
                        case isUnlimit && isSelected:
                            return;
                        case isSelected:
                            self.remove(value);
                            break;
                        default:
                            self.select(value);
                            break;
                    }
                    break;
            }

            // 触发选项选择事件
            self.fire('select', {option: self.getValue()});
        });
    },

    /**
     * 单选类型匹配选择
     *
     * @method _radioSelect
     * @param  {String} v 匹配值
     * @private
     */
    _radioSelect: function(v) {
        var self = this;

        var selectedClass = self.get('selectedClass');

        // 已选项节点
        var node = self.nContainer.one('a[data-value="'+ v +'"]') || self.nFilterUnlimit;

        // 清除所有选项选中状态
        self.nFilterTags.removeClass(selectedClass);

        // 添加选中样式
        node && node.addClass(selectedClass);

        // 筛选模块值
        self._radioText = node && node.attr('data-text');
        self._radioValue = v;
    },

    /**
     * 单选类型删除已选项
     *
     * @method _radioRemove
     * @private
     */
    _radioRemove: function() {
        var self = this;

        self._radioSelect();
    },

    /**
     * 多选类型匹配选择
     *
     * @method _checkboxSelect
     * @param  {String} v 匹配值
     * @private
     */
    _checkboxSelect: function(v) {
        var self = this;

        var selectedClass = self.get('selectedClass');

        // 如果匹配值为空，将不限设为已选项
        if (!v) {
            self._checkboxText.length = 0;
            self._checkboxValue.length = 0;
            self.nFilterTags.removeClass(selectedClass);
            self.nFilterUnlimit && self.nFilterUnlimit.addClass(selectedClass);
            return;
        }

        self.nFilterUnlimit && self.nFilterUnlimit.removeClass(selectedClass);

        S.each(v.split(','), function(v) {
            var node = self.nContainer.one('a[data-value="'+ v +'"]');

            if (!node) {
                return;
            }

            node.addClass(selectedClass);

            self._checkboxText.push(node.attr('data-text'));
            self._checkboxValue.push(node.attr('data-value'));
        });
    },

    /**
     * 单选类型删除匹配项
     *
     * @method _checkboxRemove
     * @param  {String} v 选项值，如果不传递，删除所有选项
     * @private
     */
    _checkboxRemove: function(v) {
        var self = this;

        var node = self.nContainer.one('a[data-value="'+ v +'"]');
        var index = S.indexOf(v, self._checkboxValue);

        var selectedClass = self.get('selectedClass');

        if (v) {
            if (node) {
                node.removeClass(selectedClass);
            }
            if (index != -1) {
                self._checkboxText.splice(index, 1);
                self._checkboxValue.splice(index, 1);
            }
            if (self._checkboxValue.length < 1) {
                self._checkboxSelect();
            }
            return;
        }

        self._checkboxSelect();
    }

}, {
    ATTRS: {

        /**
         * 筛选模块id
         *
         * @attribute id
         * @type {String}
         * @default ''
         */
        id: {
            value: '',
            getter: function(v) {
                if (!/^#.+/.test(v)) {
                    return '#' + v;
                }
                return v;
            }
        },

        /**
         * 筛选模块类型
         *
         * @attribute type
         * @type {String}
         * @default 'radio'
         */
        type: {
            value: 'radio'
        },

        /**
         * 筛选项className
         *
         * @attribute tagClass
         * @type {String}
         * @default 'filter-tag'
         */
        tagClass: {
            value: 'filter-tag',
            getter: function(v) {
                if (!/^\..+/.test(v)) {
                    return '.' + v;
                }
                return v;
            }
        },

        /**
         * 筛选项不限className
         *
         * @attribute tagClass
         * @type {String}
         * @default 'filter-unlimit'
         */
        unlimitClass: {
            value: 'filter-unlimit',
            getter: function(v) {
                if (!/^\..+/.test(v)) {
                    return '.' + v;
                }
                return v;
            }
        },

        /**
         * 筛选项选中时的className
         *
         * @attribute selectedClass
         * @type {String}
         * @default 'selected'
         */
        selectedClass: {
            value: 'selected',
            getter: function(v) {
                if (!/^\..+/.test(v)) {
                    return '.' + v;
                }
                return v;
            }
        },

        /**
         * 筛选项选中时的className
         *
         * @attribute disabledClass
         * @type {String}
         * @default 'disabled'
         */
        disabledClass: {
            value: 'disabled',
            getter: function(v) {
                if (!/^\..+/.test(v)) {
                    return '.' + v;
                }
                return v;
            }
        }
    }
});

}, {requires:['base', 'node']});