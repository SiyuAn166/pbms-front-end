<script>
    import path from 'path'

    export default {
        name: "SidebarItem",
        functional: true,
        props: {
            item: {
                type: Object,
                required: true
            },
            basePath: {
                type: String,
                required: true
            }

        },
        render(h, context) {
            const {item, basePath} = context.props;

            let onlyChild = {};

            function resolvePath(index) {
                return path.resolve(basePath, index);
            }

            function hasOnlyOneChild(item) {
                if (item.children && item.children.length === 1) {
                    onlyChild = item.children[0];
                    return true
                }
                return false
            }

            function renderIt(item) {
                if (!item.hidden) {
                    if (!item.children) {  //最下级子节点
                        const el = (
                            <el-menu-item index={resolvePath(item.path)}
                                          key={resolvePath(item.path)}>
                                <i class={item.meta.icon}/>
                                <span slot='title'>{item.meta.title}</span>
                            </el-menu-item>
                        );
                        return el;

                    } else if (hasOnlyOneChild(item) && !onlyChild.children) {      //只有一个children
                        let [onlyChild] = item.children;
                        if (onlyChild.meta && onlyChild.meta.root) {   //root节点，渲染为根节点

                            const el = (
                                <el-menu-item index={resolvePath(onlyChild.path)}
                                              key={resolvePath(onlyChild.path)}>
                                    <i class={onlyChild.meta.icon}/>
                                    <span slot='title'>{onlyChild.meta.title}</span>
                                </el-menu-item>
                            );
                            return el;
                        } else {           //否则作为子菜单
                            const el = (
                                <el-submenu index={resolvePath(item.path)}
                                            key={resolvePath(item.path)}>
                                    <template slot="title">
                                        <i class={item.meta.icon}/>
                                        <span slot="title">{item.meta.title}</span>
                                    </template>
                                    <el-menu-item index={resolvePath(onlyChild.path)}
                                                  key={resolvePath(onlyChild.path)}>
                                        <i class={onlyChild.meta.icon}/>
                                        <span
                                            slot="title">{onlyChild.meta.title}</span>
                                    </el-menu-item>
                                </el-submenu>
                            );
                            return el;
                        }
                    } else {
                        const el = (
                            <el-submenu index={resolvePath(item.path)} key={resolvePath(item.path)}>
                                <template slot="title">
                                    <i class={item.meta.icon}/>
                                    <span slot="title">{item.meta.title}</span>
                                </template>
                                {
                                    item.children.map(i => {
                                        return (<sidebar-item item={i} basePath={resolvePath(item.path)}/>)
                                    })
                                }
                            </el-submenu>
                        );
                        return el;
                    }
                }
            }

            return renderIt(item);

        }
    }
</script>
