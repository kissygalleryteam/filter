## 综述

Filter是一个筛选控件，在HTML结构上简单配置几个选项，即可完成筛选模块的订制。

* 版本：2.0.0
* 作者：昂天
* 标签：筛选
* demo：[http://kg.kissyui.com/filter/2.0.0/demo/index.html](http://kg.kissyui.com/filter/2.0.0/demo/index.html)

## 初始化组件

    KISSY.use('kg/filter/2.0.0/', function (S, Filter) {
         var filter = new Filter();
    });
    
Filter依赖典型的HTML结构

	<div id="J_Filter">
	    <ul>
	        <li><a href="#" class="filter-tag filter-unlimit" data-text="不限" data-value="0">不限</a></li>
	        <li><a href="#" class="filter-tag" data-text="选项一" data-value="1">选项一</a></li>
	        <li><a href="#" class="filter-tag" data-text="选项二" data-value="2">选项二</a></li>
	    </ul>
	</div>

- `#J_Filter`，Filter的ID，名称自取，必须指定，用作hook
- `.filter-tag`，筛选选项，必须指定，名称可定制
- `.filter-unlimit`，筛选不限选项，可以不指定，名称可定制
- `data-text`，选项文本，必须指定
- `data-value`，选项值，必须指定

这样来调用

    KISSY.use('kg/filter/2.0.0/, function (S, Filter) {
        var filter = new Filter({
            id: '',
            type: '',
            tagClass: '',
            unlimitClass: '',
            selectedClass: '',
            disabledClass: ''
        });
    });

## API说明

### 基本参数

*id* （String）

筛选模块id `Required`

*type* （String）

筛选模块类型，单选'radio'，复选'checkbox'，默认为'radio'

*tagClass* （String）

选项的className，默认为'filter-tag'

*unlimitClass* （String）

不限选项的className，默认为'filter-unlimit'

*selectedClass* （String）

选项选中时的className，默认为'selected'

*disabledClass* （String）

选项禁用时的className，默认为'disabled'

### 事件

通过给实例绑定

*select*

点选发生时事件，带入参数为

    单选类型:
    option: {
        text: '', // 筛选模块文本
        value: '' // 筛选模块选项值
    }
    
    复选类型:    
    option: {
        text: [],  // 筛选模块文本数组
        value: [], // 筛选模块值数据
    }
    
### 方法

*select(value)*

选择匹配项，参数为选项值

- 单选时为选项值字符串
- 复选时为选项值数组

*remove(value)*

删除匹配项，参数为选项值

- 单选时为选项值字符串
- 复选时为选项值数组
- 不传入参数时，删除所有选项

*getValue*

获取筛选模块值，返回格式为

    单选类型:
    option: {
        text: '', // 筛选模块文本
        value: '' // 筛选模块选项值
    }
    
    复选类型:    
    option: {
        text: [],  // 筛选模块文本数组
        value: [], // 筛选模块值数据
    }
    
*getLength*

获取筛选模块已选择的选项个数

*disabled(value)*

禁用匹配项，如果不传入参数，禁用所有选项

*enabled*

启用匹配项，如果不传入参数，启用所有选项