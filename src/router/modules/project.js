import Home from '../../components/common/Home.vue';

const projectRouter = {
    path: '/project',
    component: Home,
    meta: {title: '项目中心', icon: 'el-icon-document'},
    children: [
        {
            path: 'manage',
            component: resolve => require(['../../components/page/project/ProjectPage.vue'], resolve),
            meta: {title: '项目管理', icon: 'el-icon-document', permission: 'project:manage:view'}
        },
        {
            path: 'detail',
            component: resolve => require(['../../components/page/project/ProjectDetailPage.vue'], resolve),
            meta: {title: '项目信息', icon: 'el-icon-document', permission: 'project:manage:view'},
            hidden: true
        }
    ]
}

export default projectRouter
