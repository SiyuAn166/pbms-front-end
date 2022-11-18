<template>
    <div class="monitor-map">
        <g-d-map :projects="projects" :show-pointer="false" :show-search-component="false"></g-d-map>
    </div>
</template>

<script>
    import GDMap from "../../common/AMap"

    export default {
        name: "MonitorMap",
        components: {
            GDMap
        },
        data() {
            return {
                positions: [
                    [115.826391, 39.297569],
                    [115.899307, 39.314971]
                ],
                projects: []
            }
        },
        methods: {
            listAllProjects: function () {
                this.$axios.post(this.$Api.project.listAll).then(
                    r => {
                        if (r.status === 200 && r.data.code === 200) {
                            let {msg} = r.data;
                            this.projects = msg;
                        }
                    }
                ).catch(
                    e => {
                        console.log(e);
                    }
                );

            }
        },
        mounted() {
            this.$nextTick(() => {
                this.listAllProjects();
            });
        }
    }
</script>

<style scoped>
    .monitor-map {
        width: 100%;
        height: 100%;
    }
</style>
