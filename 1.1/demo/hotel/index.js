/**
 * 酒店筛选模块
 *
 * author: angtian
 * e-mail: angtian.fgm@taobao.com
 */
KISSY.add(function (S, Event, IO, Filter, FilterLocation, FilterPrice, FilterTemplate, FilterQuery) {

var URL = 'http://kezhan.trip.taobao.com/remote/getHotelList.do';

var filter_data = {};

/**
 * 酒店筛选模块构造函数
 *
 * @class FilterFilter
 * @constructor
 */
function HotelFilter() {
    this._init.apply(this, arguments);
}

return S.augment(HotelFilter, Event.Target, {

    /**
     * 筛选模块入口
     *
     * @method _init
     * @private
     */
    _init: function(id, data) {
        var self = this;

        self.data = data;
        self.nContainer = S.one(id);

        // 渲染酒店筛选结构
        self._renderUI();

        // 绑定事件
        self._bindUI();
    },

    /**
     * 渲染结构
     *
     * @method _renderUI()
     * @private
     */
    _renderUI: function() {
        var self = this;

        // 初始化位置筛选
        self._initFilterLocation({
            id: '#J_FilterLocation',
            type: 'radio',
            title: '位置'
        });

        // 初始化价格筛选
        self._initFilterPrice({
            id: '#J_FilterPrice',
            type: 'radio',
            title: '价格'
        });

        // 初始化星级筛选
        self._initFilterLevel({
            id: '#J_FilterLevel',
            type: 'checkbox',
            title: '星级'
        });

        // 初始化品牌筛选
        self._initFilterBrand({
            id: '#J_FilterBrand',
            type: 'checkbox',
            title: '品牌'
        });

        // 初始化设施筛选
        self._initFilterService({
            id: '#J_FilterService',
            type: 'checkbox',
            title: '设施'
        });

        // 初始化已选列表
        self._initFilterQuery({
            id: '#J_FilterQuery',
            listId: '#J_FilterQueryList',
            title: '已选'
        });
    },

    /**
     * 绑定事件
     *
     * @method _bindUI()
     * @private
     */
    _bindUI: function() {
        var self = this;

        // 包含位置数据
        if (self.filterLocation) {

            // 监听筛选条件改变事件
            self.filterLocation.on('select', function(e) {
                S.mix(filter_data, {location: e.option}, true);
                self._fire();
            });
        }

        // 包含价格数据
        if (self.filterPrice) {

            // 监听筛选条件改变事件
            self.filterPrice.on('select', function(e) {
                S.mix(filter_data, {price: e.option}, true);
                self._fire();
            });
        }

        // 包含星级数据
        if (self.filterLevel) {

            // 监听筛选条件改变事件
            self.filterLevel.on('select', function(e) {
                S.mix(filter_data, {level: e.option}, true);
                self._fire();
            });
        }

        var minHeightClass = 'hotel-filter-list-min';

        // 包含品牌数据
        if (self.filterBrand) {

            // 监听筛选条件改变事件
            self.filterBrand.on('select', function(e) {
                S.mix(filter_data, {brand: e.option}, true);
                self._fire();
            });

            // 监听更多按钮点击事件
            var brandContainer = self.filterBrand.nContainer;
            brandContainer.delegate('click', '.J_FilterMore', function(e) {
                brandContainer.toggleClass(minHeightClass);
                brandContainer[brandContainer.hasClass(minHeightClass) ? 'removeClass' : 'addClass']('hotel-filter-list-brand');
            });
        }

        // 包含设施数据
        if (self.filterService) {

            // 监听筛选条件改变事件
            self.filterService.on('select', function(e) {
                S.mix(filter_data, {service: e.option}, true);
                self._fire();
            });

            // 监听更多按钮点击事件
            var serviceContainer = self.filterService.nContainer;
            serviceContainer.delegate('click', '.J_FilterMore', function(e) {
                serviceContainer.toggleClass(minHeightClass);
            });
        }

        // 酒店筛选数据改变事件
        self.on('filter:change', function(e) {

            // 更新已选列表
            self.filterQuery.update(self._formatData(e.data));

            var param = self._getParam(e.data);

            // console.log('请求接口参数:', param);

            // 发送异步请求
            IO.jsonp(URL, param, function(data) {
                var activeOption = data.activeOption;

                // 更新星级筛选状态
                if (self.filterLevel) {
                    if (self.filterLevel.getLength() > 0) {
                        self.filterLevel.enabled();
                    } else {
                        self.filterLevel.disabled();
                        self.filterLevel.enabled(activeOption.level);
                    }
                }

                // 更新品牌筛选状态
                if (self.filterBrand) {
                    if (self.filterBrand.getLength() > 0) {
                        self.filterBrand.enabled();
                    } else {
                        self.filterBrand.disabled();
                        self.filterBrand.enabled(activeOption.brand);
                    }
                }

                // 更新设计筛选状态
                if (self.filterService) {
                    if (self.filterService.getLength() > 0) {
                        self.filterService.enabled();
                    } else {
                        self.filterService.disabled();
                        self.filterService.enabled(activeOption.service);
                    }
                }

                // console.log('接口返回数据:', data);
            });
        });

        // 删除已选条件事件
        if (self.filterQuery) {
            self.filterQuery.on('remove', function(e) {
                var type = e.data.type;
                var value = e.data.value;

                switch(type) {
                    case 'location':
                        self.filterLocation.remove();
                        S.mix(filter_data, {location: self.filterLocation.getValue()}, true);
                        break;
                    case 'price':
                        self.filterPrice.remove();
                        S.mix(filter_data, {price: self.filterPrice.getValue()}, true);
                        break;
                    case 'level':
                        self.filterLevel.remove(value);
                        S.mix(filter_data, {level: self.filterLevel.getValue()}, true);
                        break;
                    case 'brand':
                        self.filterBrand.remove(value);
                        S.mix(filter_data, {brand: self.filterBrand.getValue()}, true);
                        break;
                    case 'service':
                        self.filterService.remove(value);
                        S.mix(filter_data, {service: self.filterService.getValue()}, true);
                        break;
                }

                if (!type) {
                    self.filterLocation.remove();
                    self.filterPrice.remove();
                    self.filterLevel.remove();
                    self.filterBrand.remove();
                    self.filterService.remove();
                    filter_data = {};
                }

                self._fire();
            });
        }
    },

    /**
     * 初始化位置筛选
     *
     * @method _initFilterLocation
     * @param  {Object} cfg 配置参数
     * @private
     */
    _initFilterLocation: function(cfg) {
        var self = this;

        var id    = cfg.id;
        var type  = cfg.type;
        var title = cfg.title;
        var data  = self.data.queryLocat;
        var query = self.data.query;

        if (!self._checkData(data)) {
            return;
        }

        self.nContainer.append(FilterTemplate.location({
            id: id,
            type: type,
            data: data,
            title: title
        }));

        self.filterLocation = new FilterLocation({
            id: id,
            type: type
        });

        // 接口参数: 位置经度
        var lng = query.pByRadiusLng;

        // 接口参数: 位置纬度
        var lat = query.pByRadiusLat;

        // 选中已选择的位置
        self.filterLocation.select(lng + ',' + lat);

        // 设置位置数据
        S.mix(filter_data, {location: self.filterLocation.getValue()}, true);
    },

    /**
     * 初始化价格筛选
     *
     * @method _initFilterPrice
     * @param  {Object} cfg 配置参数
     * @private
     */
    _initFilterPrice: function(cfg) {
        var self = this;

        var id    = cfg.id;
        var type  = cfg.type;
        var title = cfg.title;
        var data  = self.data.queryPrice;
        var query = self.data.query;

        if (!self._checkData(data)) {
            return;
        }

        self.nContainer.append(FilterTemplate.price({
            id: id,
            type: type,
            data: data,
            title: title
        }));

        self.filterPrice = new FilterPrice({
            id: id,
            type: type
        });

        // 接口参数: 价格区间
        var price = query.priceRange;

        // 接口参数: 最低价
        var lowPrice = query.lowPrice;

        // 接口参数: 最高价
        var highPrice = query.highPrice;

        // 选中已选择的价格区间
        self.filterPrice.select(price, lowPrice, highPrice);

        // 设置价格数据
        S.mix(filter_data, {price: self.filterPrice.getValue()}, true);
    },

    /**
     * 初始化星级筛选
     *
     * @method _initFilterLevel
     * @param  {Object} cfg 配置参数
     * @private
     */
    _initFilterLevel: function(cfg) {
        var self = this;

        var id    = cfg.id;
        var type  = cfg.type;
        var title = cfg.title;
        var data  = self.data.queryLevel;
        var query = self.data.query;

        if (!self._checkData(data)) {
            return;
        }

        self.nContainer.append(FilterTemplate.normal({
            id: id,
            type: type,
            data: data,
            title: title
        }));

        self.filterLevel = new Filter({
            id: id,
            type: type
        });

        // 可使用的筛选条件
        var levelActive = self.data.activeOption.level;
        self.filterLevel.disabled();
        self.filterLevel.enabled(levelActive);

        // 接口参数: 已选择的品牌
        var value = query.dangcis;

        // 选中已选择的品牌
        self.filterLevel.select(value);

        // 设置星级数据
        S.mix(filter_data, {level: self.filterLevel.getValue()}, true);
    },

    /**
     * 初始化品牌筛选
     *
     * @method _initFilterBrand
     * @param  {Object} cfg 配置参数
     * @private
     */
    _initFilterBrand: function(cfg) {
        var self = this;

        var id    = cfg.id;
        var type  = cfg.type;
        var title = cfg.title;
        var data  = self.data.queryBrand;
        var query = self.data.query;

        if (!self._checkData(data)) {
            return;
        }

        self.nContainer.append(FilterTemplate.brand({
            id: id,
            type: type,
            data: data,
            title: title
        }));

        self.filterBrand = new Filter({
            id: id,
            type: type
        });

        // 判断是否显示更多按钮
        if (self.filterBrand.nContainer.height() > 36) {
            self.filterBrand.nContainer.addClass('filter-list-has-more hotel-filter-list-min');
        }

        // 可使用的筛选条件
        var brandActive = self.data.activeOption.brand;
        self.filterBrand.disabled();
        self.filterBrand.enabled(brandActive);

        // 接口参数: 已选择的品牌
        var value = query.brands;

        // 选中已选择的品牌
        self.filterBrand.select(value);

        // 设置星级数据
        S.mix(filter_data, {brand: self.filterBrand.getValue()}, true);
    },

    /**
     * 初始化设施筛选
     *
     * @method _initFilterService
     * @param  {Object} cfg 配置参数
     * @private
     */
    _initFilterService: function(cfg) {
        var self = this;

        var id    = cfg.id;
        var type  = cfg.type;
        var title = cfg.title;
        var data  = self.data.queryService;
        var query = self.data.query;

        if (!self._checkData(data)) {
            return;
        }

        self.nContainer.append(FilterTemplate.normal({
            id: id,
            type: type,
            data: data,
            title: title
        }));

        self.filterService = new Filter({
            id: id,
            type: type
        });

        // 判断是否显示更多按钮
        if (self.filterService.nContainer.height() > 36) {
            self.filterService.nContainer.addClass('filter-list-has-more hotel-filter-list-min');
        }

        // 可使用的筛选条件
        var serviceActive = self.data.activeOption.service;
        self.filterService.disabled();
        self.filterService.enabled(serviceActive);

        // 接口参数: 已选择的服务设施
        var value = query.services;

        // 选中已选择的服务设施
        self.filterService.select(value);

        // 设置星级数据
        S.mix(filter_data, {service: self.filterService.getValue()}, true);
    },

    /**
     * 初始化已选区域
     *
     * @method _initFilterQuery
     * @param  {Object} cfg 配置参数
     * @private
     */
    _initFilterQuery: function(cfg) {
        var self = this;

        var id = cfg.id;
        var listId = cfg.listId;
        var title = cfg.title;

        self.nContainer.append(FilterTemplate.query({
            id: id,
            listId: listId,
            title: title
        }));

        self.filterQuery = new FilterQuery({
            id: id,
            listId: listId
        });

        // 更新已选列表，不请求接口
        self.filterQuery.update(self._formatData(filter_data));
    },

    /**
     * 触发数据变化事件方法
     *
     * @method _fire
     * @private
     */
    _fire: function() {
        var self = this;

        self.fire('filter:change', {data: filter_data});
    },

    /**
     * 检验数据有效性
     *
     * @method _checkData
     * @param  {Array} data 待检验的数据
     * @return {Boolean}
     * @private
     */
    _checkData: function(data) {
        return S.isArray(data) && data.length > 0;
    },

    /**
     * 格式化已选条件数据
     *
     * @method _formatQueryData
     * @private
     */
    _formatData: function(data) {
        var self = this;

        var result = [];

        S.each(data, function(o, k) {
            if (!o.value || !o.text) {
                return;
            }
            if (S.isArray(o.value)) {
                S.each(o.value, function(v, i) {
                    result.push({
                        type: k,
                        text: o.text[i],
                        value: v
                    });
                });
                return;
            }
            result.push({
                type: k,
                text: o.text,
                value: o.value
            });
        });

        return result;
    },

    /**
     * 获取请求参数
     *
     * @method _getParam
     * @return {Object} 返回参数对象
     * @private
     */
    _getParam: function(data) {
        var self = this;
        var query = self.data.query;

        // 位置参数
        if (data.location && data.location.value) {
            var lnglat = data.location.value.split(',');
            var lng = lnglat[0];
            var lat = lnglat[1];
        }

        // 价格参数
        if (data.price) {
            var price = data.price.value || 'R0';
            var lowPrice = -1;
            var highPrice = -1;

            if (price == 'R5') {
                var priceRange = data.price.text.match(/\d+/g);
                var lowPrice = priceRange[0];
                var highPrice = priceRange[1];
            }
        }

        // 星级参数
        if (data.level && data.level.value.length > 0) {
            var level = data.level.value.join();
        }

        // 品牌参数
        if (data.brand && data.brand.value.length > 0) {
            var brand = data.brand.value.join();
        }

        // 设施参数
        if (data.service && data.service.value.length > 0) {
            var service = data.service.value.join();
        }

        // 返回merge后的query对象
        return S.merge(query, {
            pByRadiusLng: lng || -10000,
            pByRadiusLat: lat || -10000,
            priceRange: price || 'R0',
            lowPrice: lowPrice || -1,
            highPrice: highPrice || -1,
            dangcis: level || '',
            brands: brand || '',
            services: service || '',
            _input_charset: 'utf-8'
        });
    }

});

}, {requires:['event', 'ajax', 'gallery/filter/1.1/', './filter-location', './filter-price', './filter-template', './filter-query']});