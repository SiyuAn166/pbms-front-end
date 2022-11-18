<template>
    <div class="cluster">
        <div ref="infoWindow" class='info-window'>
            <h2 class='info-window-header'><i class='el-icon-folder'></i><span>{{project.proName}}</span></h2>
            <div class='info-window-content'>
                <div>项目号：{{project.proId}}</div>
                <div>项目地址：{{project.proAddr}}</div>
            </div>
            <div class='info-window-footer'>
                <el-link icon="el-icon-view" type="primary" @click="onEdit(project.id)">项目管理</el-link>
                <el-link icon="el-icon-s-data" type="primary" @click="onEdit(project.id)">监控详情</el-link>
            </div>
        </div>

    </div>
</template>
<script>

    export default {
        name: "AMapMarkerCluster",
        props: {
            map: {
                type: Object,
                required: true
            },
            projects: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                project: {
                    id: "",
                    proName: "",
                    proId: "",
                    proAddr: ""
                }
            }
        },
        methods: {
            createMarkers: function () {
                let self = this;
                let markers = [];
                // const content = '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>';
                const content = '<i class="el-icon-location" style="font-size: 30px;color: #2d8cf0;"></i>';
                if (this.projects && this.projects.length) {
                    let icon = new AMap.Icon({
                        image: require('../../assets/img/location.png'),
                        imageSize: new AMap.Size(30, 30),
                    });
                    this.projects.map((v, i) => {
                        let marker = new AMap.Marker({
                            icon: icon,
                            position: [v.proLng, v.proLat],
                            // content: content,
                            offset: new AMap.Pixel(-15, -15),
                            extData: {          //額外添加内容：該點的詳細項目信息
                                obj: v
                            }
                        });
                        AMap.event.addListener(marker, 'click', function (e) {
                            self.openInfoWindow(marker, v);
                        });
                        markers.push(marker);
                    });
                }
                return markers;
            },
            init: function () {
                AMap.plugin('AMap.MarkerClusterer', function () {
                });
            },
            createCluster: function () {
                let markers = this.createMarkers();
                // console.log(markers);
                // markers.forEach(m => {
                //    console.log(m.getPosition())
                // });
                let count = markers.length;
                let _renderClusterMarker = function (context) {
                    let factor = Math.pow(context.count / count, 1 / 18);
                    let div = document.createElement('div');
                    let Hue = 180 - factor * 180;
                    let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
                    let fontColor = 'hsla(' + Hue + ',100%,20%,1)';
                    let borderColor = 'hsla(' + Hue + ',100%,40%,1)';
                    let shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
                    div.style.backgroundColor = bgColor;
                    let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
                    div.style.width = div.style.height = size + 'px';
                    div.style.border = 'solid 1px ' + borderColor;
                    div.style.borderRadius = size / 2 + 'px';
                    div.style.boxShadow = '0 0 1px ' + shadowColor;
                    div.innerHTML = context.count;
                    div.style.lineHeight = size + 'px';
                    div.style.color = fontColor;
                    div.style.fontSize = '14px';
                    div.style.textAlign = 'center';
                    context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
                    context.marker.setContent(div)
                };
                //創建點聚合
                let markerCluster = new AMap.MarkerClusterer(
                    this.map, markers, {
                        gridSize: 60,
                        renderClusterMarker: _renderClusterMarker
                    }
                );
            },
            openInfoWindow: function (marker, info) {
                let infoWindow = this.createInfoWindow(info);
                infoWindow.open(this.map, marker.getPosition());

            },
            createInfoWindow: function (info) {
                let {id, proId, proName, proAddr} = info;
                this.project.id = id;
                this.project.proId = proId;
                this.project.proName = proName;
                this.project.proAddr = proAddr;
                let infoWindow = new AMap.InfoWindow({
                    content: this.$refs.infoWindow,  //传入 dom 对象，或者 html 字符串
                    closeWhenClickMap: true,
                });
                return infoWindow;
            },
            onEdit: function (id) {
                // console.log(id);
                this.$router.push("/project/detail?id=" + id);
            }
        },
        mounted() {
            this.init();

            //必須在DOM文檔渲染完成后執行。
            this.$nextTick(() => {
                this.createCluster();
            });
        },
        watch: {
            //实时刷新cluster
            projects: function (n, o) {
                this.$nextTick(() => {
                    this.createCluster();
                });
            }
        }
    }


</script>

<style lang="scss">
    .info-window {
        padding: 5px;
        color: #666666;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }

    .info-window-header {
        padding: 5px 0;

        * {
            margin: 0 10px 0 0;
        }
    }

    .info-window-content {
        font-size: 13px;
    }

    .info-window-footer {
        padding: 5px 0;
        font-size: 14px;

        a {
            margin-right: 20px;
            cursor: pointer;
        }

        a:hover {
            text-decoration: underline;
        }

        a:active {
            color: blue;
        }

    }

    .markerContent {
        background-color: hsla(180, 100%, 50%, 0.7);
        height: 24px;
        width: 24px;
        border: 1px solid hsl(180, 100%, 40%);
        border-radius: 12px;
        box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;
    }

    .cluster {
        display: none;
    }
</style>
