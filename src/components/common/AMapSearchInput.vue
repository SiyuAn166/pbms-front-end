<template>
    <div class="map-search">
        <div class="search-input">
            <input placeholder="请输入关键字" id="searchIp"></input>
        </div>
    </div>
</template>

<script>
    export default {

        name: "AmapSearchInput",
        props: {
            map: {
                type: Object,
                required: true
            },
            geocoder: {
                type: Object,
                required: true
            },
            geocoderComplete: {
                type: Function,
                required: true
            }
        },
        data() {
            return {}
        },
        methods: {
            init: function () {

                let self = this;
                AMapUI.loadUI(['misc/PoiPicker'], function (PoiPicker) {
                    let poiPicker = new PoiPicker({
                        input: 'searchIp' //输入框id
                    });
                    //初始化poiPicker
                    self.poiPickerReady(poiPicker);
                    //监听poi选中信息
                    poiPicker.on('poiPicked', function (poiResult) {
                        //用户选中的poi点信息
                    });
                });
            },
            poiPickerReady: function (poiPicker) {
                window.poiPicker = poiPicker;
                //选取了某个POI
                poiPicker.on('poiPicked', this.poiPicked);
            },
            poiPicked: function (poiResult) {


                let marker = new AMap.Marker();

                let poi = poiResult.item;

                marker.setMap(this.map);
                marker.setPosition(poi.location);
                this.map.setCenter(poi.location);

                let {lng, lat} = poi.location;
                this.map.emit('click', {lnglat: poi.location});  //触发点击事件

                this.geocoder.getAddress([lng, lat], this.geocoderComplete);

            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>
    .search-input {
        position: absolute;
        top: 20px;
        left: 10%;
        z-index: 1000;
    }

    #searchIp {
        width: 120%;
        height: 20px;
    }
</style>
