let prefix = '/api'
let online_url = {
    //login
    loginUrl: prefix + '/doLogin',
    logoutUrl: prefix + '/doLogout',
    vCodeUrl: prefix + '/captcha',
    vCodeCheckUrl: prefix + '/checkCode',

    //user
    user: {
        list: prefix + '/system/user/list',
        listAll: prefix + '/system/user/listAll',
        listUserWithRoleDO: prefix + '/system/user/listUserWithRoleDO',
        find: prefix + '/system/user/find',
        update: prefix + '/system/user/update',
        updateProfile: prefix + '/system/user/updateProfile',
        save: prefix + '/system/user/save',
        delete: prefix + '/system/user/delete',
        deleteBatch: prefix + '/system/user/deleteBatch',
        getInfo: prefix + '/system/user/getInfo',
        getSession: prefix + '/system/user/getSession',
        checkSession: prefix + '/system/user/checkSession',
        modifyPassword: prefix + '/system/user/modifyPassword',
        avatar: prefix + '/system/user/avatar'
    },

    role: {
        list: prefix + '/system/role/list',
        listRemarksByUsername: prefix + '/system/role/listRemarksByUsername',
        listAll: prefix + '/system/role/listAll',
        find: prefix + '/system/role/find',
        update: prefix + '/system/role/update',
        save: prefix + '/system/role/save',
        delete: prefix + '/system/role/delete',
        deleteBatch: prefix + '/system/role/deleteBatch'
    },
    resource: {
        list: prefix + '/system/resource/list',
        listAll: prefix + '/system/resource/listAll',
        find: prefix + '/system/resource/find',
        update: prefix + '/system/resource/update',
        save: prefix + '/system/resource/save',
        delete: prefix + '/system/resource/delete',
        deleteBatch: prefix + '/system/resource/deleteBatch',
        getTree: prefix + '/system/resource/getTree',
        getTreeByUsername: prefix + '/system/resource/getTreeByUsername',
    },
    job: {
        checkCron: prefix + '/job/checkCron',
        listAll: prefix + '/job/list',
        find: prefix + '/job/find',
        update: prefix + '/job/update',
        save: prefix + '/job/save',
        delete: prefix + '/job/delete',
        run: prefix + '/job/run',
        pause: prefix + '/job/pause',
        resume: prefix + '/job/resume'
    },
    log: {
        list: prefix + '/system/log/list'
    },
    upload: {
        file: prefix + '/system/upload/file',
        image: prefix + '/system/upload/image'
    },
    device: {
        save: prefix + "/devicemgr/device/save",
        update: prefix + "/devicemgr/device/update",
        delete: prefix + "/devicemgr/device/delete",
        deleteBatch: prefix + "/devicemgr/device/deleteBatch",
        find: prefix + "/devicemgr/device/find",
        list: prefix + "/devicemgr/device/list",
        listAll: prefix + "/devicemgr/device/listAll"
    },
    project: {
        save: prefix + "/project/project/save",
        update: prefix + "/project/project/update",
        delete: prefix + "/project/project/delete",
        deleteBatch: prefix + "/project/project/deleteBatch",
        find: prefix + "/project/project/find",
        list: prefix + "/project/project/list",
        listAll: prefix + "/project/project/listAll"
    },
    dictionaryType: {
        save: prefix + "/system/dictionaryType/save",
        update: prefix + "/system/dictionaryType/update",
        delete: prefix + "/system/dictionaryType/delete",
        deleteBatch: prefix + "/system/dictionaryType/deleteBatch",
        find: prefix + "/system/dictionaryType/find",
        list: prefix + "/system/dictionaryType/list",
        listAll: prefix + "/system/dictionaryType/listAll"
    },
    dictionaryItem: {
        save: prefix + "/system/dictionaryItem/save",
        update: prefix + "/system/dictionaryItem/update",
        delete: prefix + "/system/dictionaryItem/delete",
        deleteBatch: prefix + "/system/dictionaryItem/deleteBatch",
        find: prefix + "/system/dictionaryItem/find",
        list: prefix + "/system/dictionaryItem/list",
        listItemsWithType: prefix + "/system/dictionaryItem/listItemsWithType",
        listAll: prefix + "/system/dictionaryItem/listAll",
        listItemsByType: prefix + "/system/dictionaryItem/listItemsByType"
    }


}

export default online_url
