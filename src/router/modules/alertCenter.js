import Home from '../../components/common/Home.vue'

const alertCenter = {
    path: '/alert',
    component: Home,
    meta: {title: '报警监控', icon: 'el-icon-document'},
    children: [
        {
            path: 'history',
            component: resolve => require(['../../components/page/alert/AlertHistoryPage.vue'], resolve),
            meta: {title: '报警历史记录', icon: 'el-icon-document', permission: 'alert:history:view'}
        },
        {
            path: 'proposal',
            component: resolve => require(['../../components/page/alert/ProposalPage.vue'], resolve),
            meta: {title: '报警处理方案', icon: 'el-icon-document', permission: 'alert:proposal:view'}
        }
    ]
}
