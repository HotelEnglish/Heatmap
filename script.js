<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>中国城市热力图</title>
    <!-- 引入 ECharts -->
    <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
    <style>
        #map-container {
            width: 100%;
            height: 600px;
        }
        .controls {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="controls">
        <button id="loadDataBtn">加载CSV文件</button>
        <button id="processInputBtn">处理文本输入</button>
        <input type="checkbox" id="showValues">显示数值</input>
        <button id="resetMapViewBtn">还原视图</button>
        <button id="clearAllDataBtn">清空所有数据</button>
        <button id="exportImageBtn">导出图片</button>
    </div>

    <div>
        <textarea id="dataInput" placeholder="请输入省份名称和数值（每行一个），例如：北京市,100" style="width: 100%; height: 150px;"></textarea>
    </div>

    <div id="map-container"></div>

    <input type="file" id="fileInput" accept=".csv" style="display: none;" />

    <script>
        let myChart;
        let showValuesFlag = false;
        let currentData = []; // 保存当前数据

        // 初始化地图
        async function initMap() {
            myChart = echarts.init(document.getElementById('map-container'));
            
            try {
                const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const chinaJson = await response.json();
                console.log('Loaded China map data:', chinaJson); // 调试信息
                echarts.registerMap('china', chinaJson);
                renderMap([]);
                
                window.addEventListener('resize', function() {
                    myChart.resize();
                });
            } catch (error) {
                console.error('加载地图数据失败:', error);
                alert('加载地图数据失败，请检查网络连接或地图数据源。');
            }
        }

        // 渲染地图
        function renderMap(data) {
            currentData = data;
            
            const option = {
                title: {
                    text: '中国城市热力图',
                    left: 'center',
                    textStyle: {
                        fontSize: 24,
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    show: false
                },
                visualMap: {
                    left: 'left',
                    min: 0,
                    max: 100,
                    text: ['高', '低'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    },
                    textStyle: {
                        color: '#333'
                    }
                },
                geo: {
                    map: 'china',
                    roam: true,
                    label: {
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#f3f3f3',
                            borderColor: '#ddd'
                        },
                        emphasis: {
                            areaColor: '#e6e6e6'
                        }
                    }
                },
                series: [
                    {
                        name: '热力图',
                        type: 'map',
                        map: 'china',
                        geoIndex: 0,
                        data: data
                    }
                ]
            };

            // 如果需要显示数值，添加散点图层
            if (showValuesFlag && data.length > 0) {
                option.series.push({
                    name: '数值标记',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    symbolSize: 15,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                        period: 4,
                        scale: 3
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            offset: [0, 5],
                            formatter: function(params) {
                                return params.value[2];
                            },
                            fontSize: 14,
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            padding: [4, 8],
                            borderRadius: 4,
                            color: '#333'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#FF4136',
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    },
                    zlevel: 1,
                    data: data.map(item => {
                        const coord = geoCoordMap[item.name];
                        return coord ? {
                            name: item.name,
                            value: [...coord, item.value]
                        } : null;
                    }).filter(item => item !== null)
                });
            }
            
            // 使用 setOption 的第二个参数为 true，清除之前的配置
            myChart.setOption(option, true);
        }

        // 还原地图视图
        function resetMapView() {
            myChart.dispatchAction({
                type: 'restore'
            });
        }

        // 修改清空文件输入框功能
        function clearFileInput() {
            const fileInput = document.getElementById('fileInput');
            fileInput.value = '';
            
            // 如果当前数据来自文件输入，则清空地图数据
            const textInput = document.getElementById('dataInput');
            if (!textInput.value.trim()) {
                currentData = [];
                renderMap([]);
                // 重置数值显示复选框
                const showValues = document.getElementById('showValues');
                showValues.checked = false;
                showValuesFlag = false;
            }
        }

        // 修改清空所有数据功能
        function clearAllData() {
            // 清空文件输入
            const fileInput = document.getElementById('fileInput');
            fileInput.value = '';
            
            // 清空文本框
            const textInput = document.getElementById('dataInput');
            textInput.value = '';
            
            // 重置数值显示复选框
            const showValues = document.getElementById('showValues');
            showValues.checked = false;
            showValuesFlag = false;
            
            // 清空数据并重新渲染地图
            currentData = [];
            renderMap([]);
        }

        // 地图坐标数据
        const geoCoordMap = {
            '北京市': [116.4551, 40.2539],
            '上海市': [121.4648, 31.2891],
            '天津市': [117.190182, 39.125596],
            '重庆市': [106.504962, 29.533155],
            '河北省': [114.502461, 38.045474],
            '山西省': [112.549248, 37.857014],
            '辽宁省': [123.429096, 41.796767],
            '吉林省': [125.3245, 43.886841],
            '黑龙江省': [126.642464, 45.756967],
            '江苏省': [118.767413, 32.041544],
            '浙江省': [120.153576, 30.287459],
            '安徽省': [117.283042, 31.86119],
            '福建省': [119.306239, 26.075302],
            '江西省': [115.892151, 28.676493],
            '山东省': [117.000923, 36.675807],
            '河南省': [113.665412, 34.757975],
            '湖北省': [114.298572, 30.584355],
            '湖南省': [112.982279, 28.19409],
            '广东省': [113.280637, 23.125178],
            '海南省': [110.33119, 20.031971],
            '四川省': [104.065735, 30.659462],
            '贵州省': [106.713478, 26.578343],
            '云南省': [102.712251, 25.040609],
            '陕西省': [108.948024, 34.263161],
            '甘肃省': [103.823557, 36.058039],
            '青海省': [101.778916, 36.623178],
            '内蒙古自治区': [111.670801, 40.818311],
            '广西壮族自治区': [108.320004, 22.82402],
            '西藏自治区': [91.132212, 29.660361],
            '宁夏回族自治区': [106.278179, 38.46637],
            '新疆维吾尔自治区': [87.617733, 43.792818]
        };

        // 切换显示数值
        function toggleValues() {
            showValuesFlag = document.getElementById('showValues').checked;
            console.log('Show values:', showValuesFlag); // 调试信息
            renderMap(currentData); // 使用保存的数据重新渲染
        }

        // 导出图片
        function exportImage() {
            const url = myChart.getDataURL({
                pixelRatio: 2,
                backgroundColor: '#fff'
            });
            
            const link = document.createElement('a');
            link.download = '中国热力图.png';
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // 加载 CSV 数据
        function loadData() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('请上传CSV文件后再试');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const text = e.target.result;
                    const data = parseCSV(text);
                    if (data.length > 0) {
                        renderMap(data);
                    } else {
                        alert('CSV文件中没有找到有效数据，请检查文件格式。');
                    }
                } catch (error) {
                    console.error('数据处理错误:', error);
                    alert('文件处理出错，请确保上传了正确格式的CSV文件。');
                }
            };
            reader.onerror = function() {
                alert('文件读取失败，请重试。');
            };
            reader.readAsText(file);
        }

        // 解析 CSV 数据
        function parseCSV(csv) {
            const lines = csv.split('\n');
            const data = [];
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    const [name, value] = line.split(',');
                    console.log('Parsed line:', { name, value }); // 调试信息
                    data.push({
                        name: name.trim(),
                        value: parseFloat(value.trim())
                    });
                }
            }
            
            return data.filter(item => item.name && !isNaN(item.value) && geoCoordMap[item.name]);
        }

        // 添加文本处理功能
        function processInput() {
            const inputText = document.getElementById('dataInput').value;
            
            // 检查是否有输入
            if (!inputText.trim()) {
                alert('请输入数据后再试');
                return;
            }

            try {
                // 分行处理文本
                const lines = inputText.split(/[\n\r]+/);
                const cleanedLines = lines.map(line => {
                    // 替换所有非中文、数字和英文逗号的字符
                    let cleaned = line.replace(/[^\u4e00-\u9fa5\d,]/g, '');
                    // 确保只有一个英文逗号
                    let parts = cleaned.split(',').map(p => p.trim()).filter(p => p);
                    if (parts.length >= 2) {
                        console.log('Cleaned line:', { original: line, cleaned: `${parts[0]},${parts[1]}` }); // 调试信息
                        return `${parts[0]},${parts[1]}`;
                    }
                    return '';
                }).filter(line => line);

                // 更新文本框内容为清理后的格式
                document.getElementById('dataInput').value = cleanedLines.join('\n');

                // 处理数据
                const cleanedData = cleanedLines
                    .map(line => {
                        const [name, value] = line.split(',');
                        return { 
                            name: name.trim(), 
                            value: parseFloat(value.trim()) 
                        };
                    })
                    .filter(item => item.name && !isNaN(item.value) && geoCoordMap[item.name]);

                if (cleanedData.length > 0) {
                    currentData = cleanedData;
                    renderMap(cleanedData);
                } else {
                    alert('没有找到有效数据，请检查输入格式是否正确。\n省份名称必须包含"省"、"市"或"自治区"。');
                }
            } catch (error) {
                console.error('数据处理错误:', error);
                alert('数据处理出错，请检查输入格式是否正确。');
            }
        }

        // 页面加载完成后初始化地图
        window.onload = async () => {
            await initMap();

            // 绑定事件
            document.getElementById('loadDataBtn').addEventListener('click', () => {
                document.getElementById('fileInput').click();
            });
            document.getElementById('fileInput').addEventListener('change', loadData);
            document.getElementById('processInputBtn').addEventListener('click', processInput);
            document.getElementById('showValues').addEventListener('change', toggleValues);
            document.getElementById('resetMapViewBtn').addEventListener('click', resetMapView);
            document.getElementById('clearAllDataBtn').addEventListener('click', clearAllData);
            document.getElementById('exportImageBtn').addEventListener('click', exportImage);
        };
    </script>
</body>
</html>
