/**
 * 筛选模板
 *
 * author: angtian
 * e-mail: angtian.fgm@taobao.com
 */
KISSY.add(function (S, Template) {

// 位置筛选模板
var LOCATION = ''
    + '<div id="${id.substr(1)}" class="hotel-filter-list">'
        + '<strong class="tit">${title}</strong>'
        + '<div id="J_LocationSlide" class="con ${type} location">'
            + '<div class="location-nav">'
                + '<ul class="any">'
                    + '<li><a class="filter-unlimit filter-tag" href="javascript:;" data-location-index="0">不限</a></li>'
                + '</ul>'
                + '<ul class="list nav">'
                    + '{@each data as location}'
                        + '<li><a href="javascript:;">${location.text}<i></i></a></li>'
                    + '{@/each}'
                + '</ul>'
            + '</div>'
            + '<div class="location-content">'
                + '<div class="location-pannel location-pannel-empty"></div>'
                + '{@each data as location,location_index}'
                    + '<div class="location-pannel">'
                        + '{@if location.columnType == "subway"}'
                            + '<div id="J_SubwaySlide" class="subway">'
                                + '<div class="subway-nav">'
                                    + '<ul>'
                                        + '{@each location.groups as station}'
                                            + '<li><a href="javascript:;">${station.text}</a></li>'
                                        + '{@/each}'
                                    + '</ul>'
                                + '</div>'
                                + '<div class="subway-content">'
                                    + '{@each location.groups as station,subway_index}'
                                        + '<ul class="subway-pannel">'
                                            + '{@each station.options as o}'
                                                + '<li><a class="filter-tag" href="javascript:;" data-value="${o.value}" data-text="${o.text}" data-location-index=${location_index * 1 + 1} data-subway-index=${subway_index}>${o.text|cutStr,11}</a></li>'
                                            + '{@/each}'
                                        + '</ul>'
                                    + '{@/each}'
                                + '</div>'
                            + '</div>'
                        + '{@else if location.columnType == "airport"}'
                            + '{@each location.groups as station}'
                                + '<div class="transport">'
                                    + '<i class="{@if station.text == "火车站"}train{@else if station.text == "机场"}airport{@else}bus{@/if}"></i>'
                                    + '<ul>'
                                        + '{@each station.options as o}'
                                            + '<li><a class="filter-tag" href="javascript:;" data-value="${o.value}" data-text="${o.text}" data-location-index=${location_index * 1 + 1}>${o.text|cutStr,19}</a></li>'
                                        + '{@/each}'
                                    + '</ul>'
                                + '</div>'
                            + '{@/each}'
                        + '{@else}'
                            + '<ul>'
                                + '{@each location.options as o}'
                                    + '<li><a class="filter-tag" href="javascript:;" data-value="${o.value}" data-text="${o.text}" data-location-index=${location_index * 1 + 1}>${o.text|cutStr,19}</a></li>'
                                + '{@/each}'
                            + '</ul>'
                        + '{@/if}'
                    + '</div>'
                + '{@/each}'
            + '</div>'
            + '<span class="J_FilterMore filter-more"><span class="open">更多</span><span class="close">收起</span><i></i></span>'
        + '</div>'
    + '</div>';

// 品牌筛选模板
var BRAND = ''
    + '<div id="${id.substr(1)}" class="hotel-filter-list">'
        + '<strong class="tit">${title}</strong>'
        + '<div class="con ${type}">'
            + '<ul class="any">'
                + '<li><a class="filter-unlimit filter-tag" href="javascript:;">不限</a></li>'
            + '</ul>'
            + '<ul class="list brand">'
                + '{@each data as brand}'
                    + '<li class="brand-type">'
                        + '<strong>${brand.text}</strong>'
                        + '<ul>'
                            + '{@each brand.options as o}'
                                + '<li><a class="filter-tag" href="javascript:;" data-value="${o.value}" data-text="${o.text}">${o.text|cutStr,11}<i></i></a></li>'
                            + '{@/each}'
                        + '</ul>'
                    + '</li>'
                + '{@/each}'
            + '</ul>'
            + '<span class="J_FilterMore filter-more"><span class="open">更多</span><span class="close">收起</span><i></i></span>'
        + '</div>'
    + '</div>';

// 价格筛选模块
var PRICE = ''
    + '<div id="${id.substr(1)}" class="hotel-filter-list">'
        + '<strong class="tit">${title}</strong>'
        + '<div class="con ${type}">'
            + '<ul class="any">'
                + '<li><a class="filter-unlimit filter-tag" href="javascript:;">不限</a></li>'
            + '</ul>'
            + '<ul class="list">'
                + '{@each data as o}'
                    + '{@if o.value == "R0"}'
                        + ''
                    + '{@else if o.value == "R5"}'
                        + '<li class="J_FilterCustom filter-custom">'
                            + '<a href="javascript:;">'
                                + '<span class="filter-custom-text J_FilterCustomText">自定义</span>'
                                + '<span class="filter-custom-range J_FilterCustomRange">'
                                    + '<input class="J_FilterCustomMin" type="text" placeholder="￥" maxlength="5" />'
                                    + '<strong>-</strong>'
                                    + '<input class="J_FilterCustomMax" type="text" placeholder="￥" maxlength="5" />'
                                    + '<span class="filter-custom-confirm J_FilterCustomConfirm">确定</span>'
                                + '</span>'
                            + '</a>'
                        + '</li>'
                    + '{@else}'
                        + '<li><a class="filter-tag" href="javascript:;" data-value="${o.value}" data-text="${o.text}">${o.text|cutStr,11}<i></i></a></li>'
                    + '{@/if}'
                + '{@/each}'
            + '</ul>'
            + '<span class="J_FilterMore filter-more"><span class="open">更多</span><span class="close">收起</span><i></i></span>'
        + '</div>'
    + '</div>';

// 普通筛选模板
var NORMAL = ''
    + '<div id="${id.substr(1)}" class="hotel-filter-list">'
        + '<strong class="tit">${title}</strong>'
        + '<div class="con ${type}">'
            + '<ul class="any">'
                + '<li><a class="filter-unlimit filter-tag" href="javascript:;">不限</a></li>'
            + '</ul>'
            + '<ul class="list">'
                + '{@each data as o}'
                    + '<li><a class="filter-tag" href="javascript:;" data-value="${o.value}" data-text="${o.text}">${o.text|cutStr,11}<i></i></a></li>'
                + '{@/each}'
            + '</ul>'
            + '<span class="J_FilterMore filter-more"><span class="open">更多</span><span class="close">收起</span><i></i></span>'
        + '</div>'
    + '</div>';

// 已选列表模板
var QUERY = ''
    + '<div id="${id.substr(1)}" class="hotel-filter-list hotel-filter-list-hidden">'
        + '<strong class="tit">${title}</strong>'
        + '<div class="con selected-query">'
            + '<ul id="J_FilterQueryList" class="list"></ul>'
        + '</div>'
    + '</div>';

var QUERYLIST = ''
    + '{@each _ as o}'
        + '<li><a href="javascript:;">${o.text}<i class="J_FilterQueryDel" data-type="${o.type}" data-value="${o.value}"></i></a></li>'
    + '{@/each}'
    + '<li class="filter-query-clear"><a class="J_FilterQueryClear" href="javascript:;">全部清除</a></li>';


// 向模板引擎注册截取字符串自定义函数
Template.register('cutStr', function(v, n) {
    var reg = /[^\x00-\xff]/g;
    var len = v.replace(reg, "rr").length;

    var subString = function (s, len) {
        if (!s) {
            return '';
        }
        if (s.replace(reg, "mm").length <= len) {
            return s;
        }
        for (var i = Math.floor(len / 2); i < s.length; i++) {
            if (s.substr(0, i).replace(reg, "mm").length >= len) {
                return s.substr(0, i);
            }
        }
        return s;
    };

    if (len > n) {
        return subString(v, n - 4) + '...';
    }

    return v;
});

return {

    // 位置筛选HTML结构
    location: function(data) {
        return Template(LOCATION, data);
    },

    // 品牌筛选HTML结构
    brand: function(data) {
        return Template(BRAND, data);
    },

    // 价格筛选HTML结构
    price: function(data) {
        return Template(PRICE, data);
    },

    // 常规筛选HTML结构
    normal: function(data) {
        return Template(NORMAL, data);
    },

    // 已选参数HTML结构
    query: function(data) {
        return Template(QUERY, data);
    },

    // 参数列表
    queryList: function(data) {
        return Template(QUERYLIST, data);
    }
};

}, {requires:['gallery/juicer/1.3/']});