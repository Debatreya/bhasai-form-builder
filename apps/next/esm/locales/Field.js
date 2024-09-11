export const Field = {
    'zh-CN': {
        settings: {
            name: '字段标识',
            title: '标题',
            required: '必填',
            description: '描述',
            default: '默认值',
            enum: '可选项',
            'x-display': {
                title: '展示状态',
                tooltip: '半隐藏只会隐藏UI，全隐藏会删除数据',
                dataSource: ['显示', '半隐藏', '全隐藏', '继承'],
            },
            'x-pattern': {
                title: 'UI形态',
                dataSource: ['可编辑', '禁用', '只读', '阅读', '继承'],
            },
            'x-validator': '校验规则',
            'x-decorator': '容器组件',
            'x-reactions': '响应器规则',
            'field-group': '字段属性',
            'component-group': '组件属性',
            'decorator-group': '容器属性',
            'component-style-group': '组件样式',
            'decorator-style-group': '容器样式',
            'x-component-props': {
                title: '标题',
                placeholder: '占位提示',
                extra: '右侧扩展',
                min: '最小值',
                max: '最大值',
                step: '步长',
                closeable: '可关闭',
                autoFocus: '自动聚焦',
                width: '宽度',
                height: '高度',
                minLength: '最小长度',
                maxLength: '最大长度',
                minWidth: '最小宽度',
                maxWidth: '最大宽度',
                minHeight: '最小高度',
                maxHeight: '最大高度',
                notFoundContent: '无内容提示文案',
                addonBefore: '前缀',
                addonAfter: '后缀',
                innerBefore: '框内前缀',
                innerAfter: '框内后缀',
                addonTextBefore: '前缀标签',
                addonTextAfter: '后缀标签',
                tooltip: '提示',
                autoWidth: '自动宽度',
                name: '名称',
                showSearch: '搜索按钮',
                multiple: '允许多选',
                hasArrow: '下拉箭头',
                hasBorder: '边框',
                hasClear: {
                    title: '清除按钮',
                    tooltip: '启用后，输入时可点击右侧清除按钮快速清空输入',
                },
                size: {
                    title: '尺寸',
                    dataSource: ['小', '中', '大', '继承'],
                },
                direction: {
                    title: '方向',
                    dataSource: ['水平', '垂直'],
                },
                followTrigger: {
                    title: '跟随滚动',
                    tooltip: '启用后可让弹层跟随组件一起滚动，而不是停留在弹出的位置',
                },
                useVirtual: {
                    title: '虚拟滚动',
                    tooltip: '用于数据量较大时优化性能，快速滚动时可能闪烁',
                },
                immutable: '不可变数据',
                popupTriggerType: {
                    title: '触发弹层',
                    dataSource: ['点击', '移入'],
                },
                popupAlign: {
                    title: '弹层对齐方式',
                    tooltip: '参考 Overlay 文档',
                },
                rtl: '从右至左',
                style: {
                    width: '宽度',
                    height: '高度',
                    display: '展示',
                    background: '背景',
                    boxShadow: '阴影',
                    font: '字体',
                    margin: '外边距',
                    padding: '内边距',
                    borderRadius: '圆角',
                    border: '边框',
                    opacity: '透明度',
                },
            },
            'x-decorator-props': {
                addonAfter: '后缀标签',
                addonBefore: '前缀标签',
                tooltip: '提示',
                asterisk: '星号',
                gridSpan: '网格跨列',
                labelCol: '标签网格宽度',
                wrapperCol: '组件网格宽度',
                colon: '是否有冒号',
                labelAlign: {
                    title: '标签对齐',
                    dataSource: ['左对齐', '右对齐', '继承'],
                },
                wrapperAlign: {
                    title: '组件对齐',
                    dataSource: ['左对齐', '右对齐', '继承'],
                },
                labelWrap: '标签换行',
                wrapperWrap: '组件换行',
                labelWidth: '标签宽度',
                wrapperWidth: '组件宽度',
                fullness: '组件占满',
                inset: '内联布局',
                shallow: '是否浅传递',
                bordered: '是否有边框',
                size: { title: '尺寸', dataSource: ['大', '小', '默认', '继承'] },
                layout: { title: '布局', dataSource: ['垂直', '水平', '内联', '继承'] },
                feedbackLayout: {
                    title: '反馈布局',
                    dataSource: ['宽松', '紧凑', '弹层', '无', '继承'],
                },
                tooltipLayout: {
                    title: '提示布局',
                    dataSource: ['图标', '文本', '继承'],
                },
                style: {
                    width: '宽度',
                    height: '高度',
                    display: '展示',
                    background: '背景',
                    boxShadow: '阴影',
                    font: '字体',
                    margin: '外边距',
                    padding: '内边距',
                    borderRadius: '圆角',
                    border: '边框',
                    opacity: '透明度',
                },
            },
        },
    },
    'en-US': {
        settings: {
            name: 'Name',
            title: 'Title',
            required: 'Required',
            description: 'Description',
            default: 'Default',
            enum: 'Options',
            'x-display': {
                title: 'Display State',
                tooltip: 'When the display value is "None", the data will be "Hidden" and deleted. When the display value is hidden, only the UI will be hidden',
                dataSource: ['Visible', 'Hidden', 'None', 'Inherit'],
            },
            'x-pattern': {
                title: 'UI Pattern',
                dataSource: [
                    'Editable',
                    'Disabled',
                    'ReadOnly',
                    'ReadPretty',
                    'Inherit',
                ],
            },
            'x-validator': 'Validator',
            'x-decorator': 'Decorator',
            'x-reactions': 'Reactions',
            'field-group': 'Field Properties',
            'component-group': 'Component Properties',
            'decorator-group': 'Decorator Properties',
            'component-style-group': 'Component Style',
            'decorator-style-group': 'Decorator Style',
            'x-component-props': {
                title: 'Title',
                placeholder: 'Placeholder',
                extra: 'Extra',
                min: 'Min Value',
                max: 'Max Value',
                step: 'Step',
                closeable: 'Closeable',
                autoFocus: 'Auto Focus',
                width: 'Width',
                height: 'Height',
                minLength: 'Min Length',
                maxLength: 'Max Length',
                minWidth: 'Min Width',
                maxWidth: 'Max Width',
                minHeight: 'Min Height',
                maxHeight: 'Max Height',
                notFoundContent: 'No Content Prompt',
                addonBefore: 'Addon Before',
                addonAfter: 'Addon After',
                innerBefore: 'Inner Before',
                innerAfter: 'Inner After',
                addonTextBefore: 'Addon Text Before',
                addonTextAfter: 'Addon Text After',
                tooltip: 'Tooltip',
                autoWidth: 'Auto Width',
                name: 'Name',
                showSearch: 'Search Button',
                multiple: 'Allow Multiple Selections',
                hasArrow: 'Dropdown Arrow',
                hasBorder: 'Frame',
                hasClear: {
                    title: 'Clear Button',
                    tooltip: 'When enabled, you can click the clear button on the right to clear the input quickly',
                },
                size: {
                    title: 'Size',
                    dataSource: ['Small', 'Medium', 'Large', 'Inherit'],
                },
                direction: {
                    title: 'Direction',
                    dataSource: ['Horizontal', 'Vertical'],
                },
                followTrigger: {
                    title: 'Follow Scroll',
                    tooltip: 'When enabled, allows the popup layer to scroll with the component instead of staying in the popup position',
                },
                useVirtual: {
                    title: 'Virtual Scroll',
                    tooltip: 'It is used to optimize performance when the amount of data is large, and may flicker when scrolling quickly',
                },
                immutable: 'Immutable Data',
                popupTriggerType: {
                    title: 'Popup Trigger',
                    dataSource: ['Click', 'Hover'],
                },
                popupAlign: {
                    title: 'Popup Align',
                    tooltip: 'Refer to the Overlay documentation',
                },
                rtl: 'Right to Left',
                style: {
                    width: 'Width',
                    height: 'Height',
                    display: 'Display',
                    background: 'Background',
                    boxShadow: 'Box Shadow',
                    font: 'Font',
                    margin: 'Margin',
                    padding: 'Padding',
                    borderRadius: 'Radius',
                    border: 'Border',
                    opacity: 'Opacity',
                },
            },
            'x-decorator-props': {
                addonAfter: 'Addon After',
                addonBefore: 'Addon Before',
                tooltip: 'Tooltip',
                asterisk: 'Asterisk',
                gridSpan: 'Grid Span',
                labelCol: 'Label Col',
                wrapperCol: 'Wrapper Col',
                colon: 'Colon',
                labelAlign: {
                    title: 'Label Align',
                    dataSource: ['Left', 'Right', 'Inherit'],
                },
                wrapperAlign: {
                    title: 'Wrapper Align',
                    dataSource: ['Left', 'Right', 'Inherit'],
                },
                labelWrap: 'Label Wrap',
                wrapperWrap: 'Wrapper Wrap',
                labelWidth: 'Label Width',
                wrapperWidth: 'Wrapper Width',
                fullness: 'Fullness',
                inset: 'Inset',
                shallow: 'Shallow',
                bordered: 'Bordered',
                size: {
                    title: 'Size',
                    dataSource: ['Large', 'Small', 'Default', 'Inherit'],
                },
                layout: {
                    title: 'Layout',
                    dataSource: ['Vertical', 'Horizontal', 'Inline', 'Inherit'],
                },
                feedbackLayout: {
                    title: 'Feedback Layout',
                    dataSource: ['Loose', 'Terse', 'Popup', 'None', 'Inherit'],
                },
                tooltipLayout: {
                    title: 'Tooltip Layout',
                    dataSource: ['Icon', 'Text', 'Inherit'],
                },
                style: {
                    width: 'Width',
                    height: 'Height',
                    display: 'Display',
                    background: 'Background',
                    boxShadow: 'Box Shadow',
                    font: 'Font',
                    margin: 'Margin',
                    padding: 'Padding',
                    borderRadius: 'Radius',
                    border: 'Border',
                    opacity: 'Opacity',
                },
            },
        },
    },
};
