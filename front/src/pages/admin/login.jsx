import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [employeeData, setEmployeeData] = useState(null);
    const [currentView, setCurrentView] = useState('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [loginData, setLoginData] = useState({ employee_id: '', password: '' });
    const [newEmployee, setNewEmployee] = useState({
        employee_id: '', name: '', department: '', position: '', email: '', phone: '', password: '', role: 'normal'
    });
    const [editEmployee, setEditEmployee] = useState({
        employee_id: '', name: '', department: '', position: '', email: '', phone: '', password: '', role: 'normal'
    });
    
    const [employeesData, setEmployeesData] = useState([]);
    const [stats, setStats] = useState(null);
    const [recentLogs, setRecentLogs] = useState([]);
    const [newsData, setNewsData] = useState([]);
    const [newNews, setNewNews] = useState({
        title: '', description: '', url: '', embedding: '', status: true, employee_id: ''
    });
    const [editNews, setEditNews] = useState({
        id: null, title: '', description: '', url: '', embedding: '', status: false, employee_id: ''
    });

    const handleInputChange = (e, setter) => {
        const { name, value, type, checked } = e.target;
        setter(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const login = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const params = new URLSearchParams(loginData).toString();
            const response = await fetch(`http://127.0.0.1:8000/sadik/login?${params}`);
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('employee_data', JSON.stringify(data.employee));
                setEmployeeData(data.employee);
                setIsLoggedIn(true);
                setCurrentView('dashboard');
                setSuccess(data.message);
                loadDashboardData();
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('❌ خطأ في الاتصال بالخادم. تأكد من أن الخادم يعمل.');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('employee_data');
        setIsLoggedIn(false);
        setEmployeeData(null);
        setCurrentView('login');
        setLoginData({ employee_id: '', password: '' });
    };

    const loadDashboardData = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const [statsResponse, employeesResponse, newsResponse] = await Promise.all([
                fetch('http://127.0.0.1:8000/sadik/admin-dashboard'),
                fetch('http://127.0.0.1:8000/sadik/employees'),
                fetch('http://127.0.0.1:8000/sadik/news')
            ]);
            
            const statsData = await statsResponse.json();
            const employeesData = await employeesResponse.json();
            const newsData = await newsResponse.json();
            
            if (statsData.success) {
                setStats(statsData.stats);
                setRecentLogs(statsData.recent_logs || []);
            }
            
            if (employeesData.success) {
                setEmployeesData(employeesData.employees || []);
            }

            if (newsData.success) {
                setNewsData(newsData.news || []);
            }
            
        } catch (err) {
            setError('❌ خطأ في تحميل بيانات لوحة التحكم');
        } finally {
            setIsLoading(false);
        }
    };

    const addEmployee = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await fetch('http://127.0.0.1:8000/sadik/add-employee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmployee),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSuccess(data.message);
                setNewEmployee({
                    employee_id: '', name: '', department: '', position: '', email: '', phone: '', password: '', role: 'normal'
                });
                loadDashboardData();
                setCurrentView('employees');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('❌ خطأ في الاتصال بالخادم. تأكد من أن الخادم يعمل.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateEmployee = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await fetch('http://127.0.0.1:8000/sadik/update-employee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editEmployee),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSuccess(data.message);
                loadDashboardData();
                setCurrentView('employees');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('❌ خطأ في الاتصال بالخادم. تأكد من أن الخادم يعمل.');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteEmployee = async (employeeId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
            return;
        }
        
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await fetch('http://127.0.0.1:8000/sadik/delete-employee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employee_id: employeeId }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSuccess(data.message);
                loadDashboardData();
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('❌ خطأ في الاتصال بالخادم. تأكد من أن الخادم يعمل.');
        } finally {
            setIsLoading(false);
        }
    };

    const addNews = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const newsDataWithEmployee = {
                ...newNews,
                employee_id: employeeData.employee_id
            };

            const response = await fetch('http://127.0.0.1:8000/sadik/add-news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsDataWithEmployee),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSuccess(data.message);
                setNewNews({
                    title: '', description: '', url: '', embedding: '', status: true, employee_id: ''
                });
                loadDashboardData();
                setCurrentView('news');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('❌ خطأ في الاتصال بالخادم. تأكد من أن الخادم يعمل.');
        } finally {
            setIsLoading(false);
        }
    };

    const getNewsForEdit = async (newsId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/sadik/news/${newsId}`);
            const data = await response.json();
            
            if (data.success) {
                setEditNews({
                    id: data.news.id,
                    title: data.news.title,
                    description: data.news.description,
                    url: data.news.url || '',
                    embedding: data.news.embedding || '',
                    status: data.news.status,
                    employee_id: data.news.employee_id
                });
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('❌ خطأ في الاتصال بالخادم. تأكد من أن الخادم يعمل.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateNews = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await fetch('http://127.0.0.1:8000/sadik/update-news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editNews),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSuccess(data.message);
                loadDashboardData();
                setCurrentView('news');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('❌ خطأ في الاتصال بالخادم. تأكد من أن الخادم يعمل.');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNews = async (newsId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
            return;
        }
        
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await fetch('http://127.0.0.1:8000/sadik/delete-news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: newsId }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSuccess(data.message);
                loadDashboardData();
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('❌ خطأ في الاتصال بالخادم. تأكد من أن الخادم يعمل.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const savedEmployee = localStorage.getItem('employee_data');
        if (savedEmployee) {
            const parsedData = JSON.parse(savedEmployee);
            setEmployeeData(parsedData);
            setNewNews(prev => ({ ...prev, employee_id: parsedData.employee_id }));
            setIsLoggedIn(true);
            setCurrentView('dashboard');
            loadDashboardData();
        }
    }, []);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">نظام صادق</h1>
                    
                    {error && (
                        <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                            <p className="font-medium">❌ {error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-100 border-r-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                            <p className="font-medium">✅ {success}</p>
                        </div>
                    )}
                    
                    <form onSubmit={login} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الموظف</label>
                            <input
                                type="text"
                                name="employee_id"
                                value={loginData.employee_id}
                                onChange={(e) => setLoginData({...loginData, employee_id: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="أدخل رقم الموظف"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="أدخل كلمة المرور"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                        >
                            تسجيل الدخول
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-gray-800">نظام صادق - لوحة التحكم</h1>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                        >
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0 mr-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">القائمة الرئيسية</h2>
                            <nav className="space-y-2">
                                <button
                                    onClick={() => { setCurrentView('dashboard'); loadDashboardData(); }}
                                    className={`w-full text-right px-4 py-3 rounded-lg transition duration-300 ${
                                        currentView === 'dashboard' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    📊 لوحة التحكم
                                </button>
                                <button
                                    onClick={() => { setCurrentView('employees'); loadDashboardData(); }}
                                    className={`w-full text-right px-4 py-3 rounded-lg transition duration-300 ${
                                        currentView === 'employees' || currentView === 'add-employee' || currentView === 'edit-employee'
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    👥 الموظفين
                                </button>
                                <button
                                    onClick={() => { setCurrentView('news'); loadDashboardData(); }}
                                    className={`w-full text-right px-4 py-3 rounded-lg transition duration-300 ${
                                        currentView === 'news' || currentView === 'add-news' || currentView === 'edit-news'
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    📰 الأخبار
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {error && (
                            <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                                <p className="font-medium">❌ {error}</p>
                            </div>
                        )}
                        
                        {success && (
                            <div className="bg-green-100 border-r-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                                <p className="font-medium">✅ {success}</p>
                            </div>
                        )}

                        {/* Dashboard View */}
                        {currentView === 'dashboard' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 p-3 rounded-full">
                                                <span className="text-blue-600 text-2xl">👥</span>
                                            </div>
                                            <div className="mr-4">
                                                <p className="text-gray-600">إجمالي الموظفين</p>
                                                <p className="text-3xl font-bold text-gray-800">{stats?.total_employees || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <div className="flex items-center">
                                            <div className="bg-green-100 p-3 rounded-full">
                                                <span className="text-green-600 text-2xl">📰</span>
                                            </div>
                                            <div className="mr-4">
                                                <p className="text-gray-600">إجمالي الأخبار</p>
                                                <p className="text-3xl font-bold text-gray-800">{stats?.total_news || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <div className="flex items-center">
                                            <div className="bg-purple-100 p-3 rounded-full">
                                                <span className="text-purple-600 text-2xl">✅</span>
                                            </div>
                                            <div className="mr-4">
                                                <p className="text-gray-600">سجل تسجيل الدخول</p>
                                                <p className="text-3xl font-bold text-gray-800">{stats?.total_login_logs || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">أحدث عمليات تسجيل الدخول</h3>
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {recentLogs.length > 0 ? (
                                            recentLogs.map((log, index) => (
                                                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium text-gray-800">موظف: {log.employee_id || 'غير معروف'}</p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {log.created_at ? new Date(log.created_at).toLocaleString('ar-EG') : 'غير متوفر'}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            log.success 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {log.success ? 'نجاح' : 'فشل'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">لا توجد عمليات تسجيل دخول حديثة</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Employees View */}
                        {currentView === 'employees' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">إدارة الموظفين</h2>
                                    <button
                                        onClick={() => setCurrentView('add-employee')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300"
                                    >
                                        إضافة موظف
                                    </button>
                                </div>
                                
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الموظف</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القسم</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنصب</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {employeesData.length > 0 ? (
                                                    employeesData.map((employee) => (
                                                        <tr key={employee.employee_id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{employee.employee_id}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <div className="flex space-x-2 space-x-reverse">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditEmployee({ ...employee, password: '' });
                                                                            setCurrentView('edit-employee');
                                                                        }}
                                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-300"
                                                                    >
                                                                        تعديل
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteEmployee(employee.employee_id)}
                                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-300"
                                                                    >
                                                                        حذف
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                            لا توجد موظفين مسجلين
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Add Employee View */}
                        {currentView === 'add-employee' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">إضافة موظف جديد</h2>
                                    <button
                                        onClick={() => setCurrentView('employees')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-300"
                                    >
                                        رجوع
                                    </button>
                                </div>
                                
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <form onSubmit={addEmployee} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الموظف</label>
                                                <input
                                                    type="text"
                                                    name="employee_id"
                                                    value={newEmployee.employee_id}
                                                    onChange={(e) => handleInputChange(e, setNewEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل رقم الموظف"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={newEmployee.name}
                                                    onChange={(e) => handleInputChange(e, setNewEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل الاسم الكامل"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">القسم</label>
                                                <input
                                                    type="text"
                                                    name="department"
                                                    value={newEmployee.department}
                                                    onChange={(e) => handleInputChange(e, setNewEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل القسم"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">المنصب</label>
                                                <input
                                                    type="text"
                                                    name="position"
                                                    value={newEmployee.position}
                                                    onChange={(e) => handleInputChange(e, setNewEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل المنصب"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={newEmployee.email}
                                                    onChange={(e) => handleInputChange(e, setNewEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل البريد الإلكتروني"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={newEmployee.phone}
                                                    onChange={(e) => handleInputChange(e, setNewEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل رقم الهاتف"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={newEmployee.password}
                                                    onChange={(e) => handleInputChange(e, setNewEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل كلمة المرور"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
                                                <select
                                                    name="role"
                                                    value={newEmployee.role}
                                                    onChange={(e) => handleInputChange(e, setNewEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="normal">موظف عادي</option>
                                                    <option value="admin">مدير</option>
                                                    <option value="super_admin">مدير رئيسي</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                            >
                                                إضافة الموظف
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Edit Employee View */}
                        {currentView === 'edit-employee' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">تعديل بيانات الموظف</h2>
                                    <button
                                        onClick={() => setCurrentView('employees')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-300"
                                    >
                                        رجوع
                                    </button>
                                </div>
                                
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <form onSubmit={updateEmployee} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الموظف</label>
                                                <input
                                                    type="text"
                                                    name="employee_id"
                                                    value={editEmployee.employee_id}
                                                    onChange={(e) => handleInputChange(e, setEditEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                                                    placeholder="أدخل رقم الموظف"
                                                    required
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editEmployee.name}
                                                    onChange={(e) => handleInputChange(e, setEditEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل الاسم الكامل"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">القسم</label>
                                                <input
                                                    type="text"
                                                    name="department"
                                                    value={editEmployee.department}
                                                    onChange={(e) => handleInputChange(e, setEditEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل القسم"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">المنصب</label>
                                                <input
                                                    type="text"
                                                    name="position"
                                                    value={editEmployee.position}
                                                    onChange={(e) => handleInputChange(e, setEditEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل المنصب"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editEmployee.email}
                                                    onChange={(e) => handleInputChange(e, setEditEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل البريد الإلكتروني"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={editEmployee.phone}
                                                    onChange={(e) => handleInputChange(e, setEditEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل رقم الهاتف"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة (اختياري)</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={editEmployee.password}
                                                    onChange={(e) => handleInputChange(e, setEditEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="أدخل كلمة المرور الجديدة"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
                                                <select
                                                    name="role"
                                                    value={editEmployee.role}
                                                    onChange={(e) => handleInputChange(e, setEditEmployee)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="normal">موظف عادي</option>
                                                    <option value="admin">مدير</option>
                                                    <option value="super_admin">مدير رئيسي</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-4 space-x-reverse pt-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                            >
                                                تحديث البيانات
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteEmployee(editEmployee.employee_id)}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                            >
                                                حذف الموظف
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* News View */}
                        {currentView === 'news' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">إدارة الأخبار</h2>
                                    <button
                                        onClick={() => setCurrentView('add-news')}
                                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition duration-300"
                                    >
                                        إضافة خبر
                                    </button>
                                </div>
                                
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموظف</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {newsData.length > 0 ? (
                                                    newsData.map((news) => (
                                                        <tr key={news.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{news.title}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{news.employee_id}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    news.status 
                                                                        ? 'bg-green-100 text-green-800' 
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                    {news.status ? 'منشور' : 'مسودة'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <div className="flex space-x-2 space-x-reverse">
                                                                    <button
                                                                        onClick={() => {
                                                                            getNewsForEdit(news.id);
                                                                            setCurrentView('edit-news');
                                                                        }}
                                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-300"
                                                                    >
                                                                        تعديل
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteNews(news.id)}
                                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-300"
                                                                    >
                                                                        حذف
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                            لا توجد أخبار مسجلة
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Add News View */}
                        {currentView === 'add-news' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">إضافة خبر جديد</h2>
                                    <button
                                        onClick={() => setCurrentView('news')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-300"
                                    >
                                        رجوع
                                    </button>
                                </div>
                                
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <form onSubmit={addNews} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الخبر</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={newNews.title}
                                                onChange={(e) => handleInputChange(e, setNewNews)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="أدخل عنوان الخبر"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">وصف الخبر</label>
                                            <textarea
                                                name="description"
                                                value={newNews.description}
                                                onChange={(e) => handleInputChange(e, setNewNews)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="أدخل وصف الخبر"
                                                rows="5"
                                                required
                                            ></textarea>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الموظف</label>
                                            <input
                                                type="text"
                                                name="employee_id"
                                                value={newNews.employee_id}
                                                onChange={(e) => handleInputChange(e, setNewNews)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="أدخل رقم الموظف"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">رابط الخبر (اختياري)</label>
                                            <input
                                                type="url"
                                                name="url"
                                                value={newNews.url}
                                                onChange={(e) => handleInputChange(e, setNewNews)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="أدخل رابط الخبر"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">تضمين (اختياري)</label>
                                            <input
                                                type="text"
                                                name="embedding"
                                                value={newNews.embedding}
                                                onChange={(e) => handleInputChange(e, setNewNews)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="أدخل التضمين"
                                            />
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="status"
                                                name="status"
                                                checked={newNews.status}
                                                onChange={(e) => handleInputChange(e, setNewNews)}
                                                className="h-5 w-5 text-blue-600 rounded"
                                            />
                                            <label htmlFor="status" className="mr-2 text-sm font-medium text-gray-700">نشر الخبر مباشرة</label>
                                        </div>
                                        
                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                            >
                                                إضافة الخبر
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Edit News View */}
                        {currentView === 'edit-news' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">تعديل خبر</h2>
                                    <button
                                        onClick={() => setCurrentView('news')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-300"
                                    >
                                        رجوع
                                    </button>
                                </div>
                                
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <form onSubmit={updateNews} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الخبر</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={editNews.title}
                                                onChange={(e) => handleInputChange(e, setEditNews)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="أدخل عنوان الخبر"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">وصف الخبر</label>
                                            <textarea
                                                name="description"
                                                value={editNews.description}
                                                onChange={(e) => handleInputChange(e, setEditNews)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="أدخل وصف الخبر"
                                                rows="5"
                                                required
                                            ></textarea>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الموظف</label>
                                            <input
                                                type="text"
                                                name="employee_id"
                                                value={editNews.employee_id}
                                                onChange={(e) => handleInputChange(e, setEditNews)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="أدخل رقم الموظف"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">رابط الخبر (اختياري)</label>
                                            <input
                                                type="url"
                                                name="url"
                                                value={editNews.url}
                                                onChange={(e) => handleInputChange(e, setEditNews)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="أدخل رابط الخبر"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">تضمين (اختياري)</label>
                                            <input
                                                type="text"
                                                name="embedding"
                                                value={editNews.embedding}
                                                onChange={(e) => handleInputChange(e, setEditNews)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="أدخل التضمين"
                                            />
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="status"
                                                name="status"
                                                checked={editNews.status}
                                                onChange={(e) => handleInputChange(e, setEditNews)}
                                                className="h-5 w-5 text-blue-600 rounded"
                                            />
                                            <label htmlFor="status" className="mr-2 text-sm font-medium text-gray-700">نشر الخبر مباشرة</label>
                                        </div>
                                        
                                        <div className="flex space-x-4 space-x-reverse pt-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                            >
                                                تحديث الخبر
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteNews(editNews.id)}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                            >
                                                حذف الخبر
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
