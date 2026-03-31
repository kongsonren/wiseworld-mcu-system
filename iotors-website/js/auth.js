/**
 * AuthSystem - 统一认证系统
 * 用于管理用户登录、退出和用户信息
 */

const AuthSystem = (function() {
    const USER_KEY = 'auth_current_user';
    const SESSION_KEY = 'auth_session_token';

    // 测试账号列表
    const TEST_ACCOUNTS = [
        { username: 'admin', password: 'admin123', name: 'KR', role: 'admin', department: '集团总部' },
        { username: 'rd_zhang', password: 'admin123', name: '张工', role: 'rd', department: '硬件研发' },
        { username: 'rd_li', password: 'admin123', name: '李工', role: 'rd', department: '软件研发' },
        { username: 'sales_wang', password: 'admin123', name: '王经理', role: 'sales', department: '业务部' },
        { username: 'sales_chen', password: 'admin123', name: '陈经理', role: 'sales', department: '业务部' }
    ];

    // 登录函数
    function login(username, password) {
        if (!username || !password) {
            return {
                success: false,
                message: '用户名和密码不能为空'
            };
        }

        // 查找匹配的账号
        const account = TEST_ACCOUNTS.find(acc =>
            acc.username === username.trim() && acc.password === password
        );

        if (!account) {
            return {
                success: false,
                message: '用户名或密码错误'
            };
        }

        // 保存用户信息到 sessionStorage
        const user = {
            username: account.username,
            name: account.name,
            role: account.role,
            department: account.department,
            loginTime: new Date().toISOString()
        };

        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        sessionStorage.setItem(SESSION_KEY, generateToken());

        return {
            success: true,
            message: '登录成功',
            user: user
        };
    }

    // 退出登录
    function logout() {
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = 'login.html';
    }

    // 检查是否已登录
    function isLoggedIn() {
        const user = sessionStorage.getItem(USER_KEY);
        const token = sessionStorage.getItem(SESSION_KEY);
        return !!(user && token);
    }

    // 获取当前用户信息
    function getCurrentUser() {
        if (!isLoggedIn()) {
            return null;
        }
        try {
            return JSON.parse(sessionStorage.getItem(USER_KEY));
        } catch (e) {
            return null;
        }
    }

    // 生成简单的 session token
    function generateToken() {
        return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 获取所有测试账号（用于显示在登录页面）
    function getTestAccounts() {
        return TEST_ACCOUNTS.map(acc => ({
            username: acc.username,
            name: acc.name,
            role: acc.role,
            department: acc.department
        }));
    }

    // 公开 API
    return {
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        getCurrentUser: getCurrentUser,
        getTestAccounts: getTestAccounts
    };
})();
