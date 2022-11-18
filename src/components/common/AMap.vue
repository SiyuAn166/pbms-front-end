<template>
    <div class="amap-container">
        <div :id="containerId">
            <!--搜索組件-->
            <a-map-search-input v-if="showSearchComponent" :map="map" :geocoder="geocoder"
                                :geocoder-complete="onGeocoderComplete"></a-map-search-input>
            <div v-if="showAddress" class="address">
                <span>地址:{{addressText}}</span>
            </div>
        </div>
        <a-map-marker-cluster :map="map"
                              :projects="projects"></a-map-marker-cluster>
    </div>
</template>

<script>
    import AMapSearchInput from './AMapSearchInput.vue';
    import AMapMarkerCluster from './AMapMarkerCluster';

    let marker = new AMap.Marker();  //點擊処顯示的marker
    let geocoder, geolocation;

    export default {

        name: "GDMap",
        components: {
            AMapSearchInput, AMapMarkerCluster
        },
        props: {
            containerId: {
                type: String,
                default: "container"
            },
            zoom: {
                type: Number,
                default: 5
            },
            showAddress: {
                type: Boolean,
                default: false
            },
            showPointer: {
                type: Boolean,
                default: true
            },
            clickable: {
                type: Boolean,
                default: true
            },
            address: {
                type: String
            },
            onClick: {
                type: Function
            },
            onGetAddress: {
                type: Function
            },
            coordinate: {
                type: Array
            },
            projects: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            showSearchComponent: {
                type: Boolean,
                default: true
            }
        },
        model: {
            prop: 'address',
            event: 'pushAddress'
        },
        data() {
            return {
                map: {},  //地圖容器
                addressText: '',
                geocoder: {}
            }
        },
        methods: {
            init: function () {

                let self = this;

                self.map = new AMap.Map(self.containerId, {
                    center: [116.397428, 39.90923],
                    resizeEnable: true,
                    zoom: self.zoom
                });


                let plugins = [
                    'AMap.ToolBar', //工具条，控制地图的缩放、平移等
                    'AMap.Geolocation', //定位，提供了获取用户当前准确位置、所在城市的方法
                    'AMap.Geocoder',  //地理编码与逆地理编码服务，提供地址与坐标间的相互转换
                    'AMap.MarkerClusterer',  //点聚合插件
                ]
                AMap.plugin(plugins, function () {
                    self.map.addControl(new AMap.ToolBar());

                    //地址转换插件
                    geocoder = new AMap.Geocoder();
                    self.map.addControl(geocoder);
                    self.geocoder = {...geocoder};

                    //定位插件
                    geolocation = new AMap.Geolocation(
                        {
                            enableHighAccuracy: true,//是否使用高精度定位，默认:true
                            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                            showButton: false,        //显示定位按钮，默认：true
                            buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
                            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                            showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
                            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                            zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                            markerOptions: {
                                clickable: true
                            }
                        }
                    );
                    self.map.addControl(geolocation);

                    AMap.event.addListener(geolocation, 'complete', self.onGeolocationComplete);

                });

                //显示指针
                if (this.showPointer) self.map.add(marker);   //添加默認鼠標點擊marker
                //可点击
                if (this.clickable) self.map.on('click', this.handleClick);  //監聽點擊地圖


            },
            handleClick: function (ev) {
                // 触发事件的地理坐标，AMap.LngLat 类型
                this.click(ev);   //组件自己的一些处理

                if (this.onClick) {   //调用组件自己的处理
                    this.onClick(ev)
                }
            },

            onGeolocationComplete: function (data) {
                let {lng, lat} = data.position;
                marker.setPosition([lng, lat]);
                geocoder.getAddress([lng, lat], this.onGeocoderComplete);
                this.$emit("geolocationComplete", {lng: lng, lat: lat});  //地图定位完成，会把定位的坐标发送给父组件，父组件@geolocationComplete="function"自行处理
            },

            onGeocoderComplete: function (status, result) {

                if (status === 'complete' && result.info === 'OK') {
                    if (result && result.regeocode) {
                        let address = result.regeocode.formattedAddress;
                        // console.log(address);
                        this.addressText = address;

                        if (this.onGetAddress) {
                            this.onGetAddress(result.regeocode);
                        }
                        this.$emit('pushAddress', result.regeocode.formattedAddress);
                    }
                }
            },
            click: function (ev) {
                let lnglat = ev.lnglat;
                marker.setPosition(lnglat);
                this.map.setCenter(lnglat);
                geocoder.getAddress(lnglat, this.onGeocoderComplete);
            },
            goToPosition: function (lnglat) {  //儅有坐標傳入時，定位至傳入的坐標
                this.map.setCenter(lnglat);
                geocoder.getAddress(lnglat, this.onGeocoderComplete);

                // let m = new AMap.Marker();
                // m.setPosition(lnglat);
                // this.map.add(m);
                marker.setPosition(lnglat);
            },
            isValidCoordinate: function (arr) {
                let result = arr.every((item) => {
                    return item !== undefined && item !== null && item !== '';
                });
                return result;
            }
        },
        mounted() {
            this.init();
            if (this.coordinate && this.isValidCoordinate(this.coordinate)) {//设定了中心坐标
                this.goToPosition(this.coordinate);
            } else {
                geolocation.getCurrentPosition();  //没设定则默认定位
            }
        }
    }
</script>

<style scoped>
    .amap-container, #container {
        width: 100%;
        height: 100%;
    }

    #container {
        position: relative;
    }

    .address {
        color: #f2f8fe;
        position: absolute;
        left: 0;
        right: 0;
        top: 95%;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 200;
        text-indent: 10px;
    }


</style>
