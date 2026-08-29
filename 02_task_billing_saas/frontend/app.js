const { useState, useEffect, useRef } = React;
const API_BASE = window.location.origin;

function App() {
    const [currentTab, setCurrentTab] = useState("kanban"); // kanban | timer | projects | invoices
    const [summary, setSummary] = useState({ total_hours: 0, total_revenue: 0, active_tasks: 0, done_tasks: 0 });
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [timeLogs, setTimeLogs] = useState([]);
    const [invoices, setInvoices] = useState([]);

    // タイマー状態
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [selectedProjectForTimer, setSelectedProjectForTimer] = useState("");
    const [selectedTaskForTimer, setSelectedTaskForTimer] = useState("");
    const [timerNote, setTimerNote] = useState("");
    const timerRef = useRef(null);

    // モーダル状態
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [previewInvoice, setPreviewInvoice] = useState(null);

    // 初期ロード
    useEffect(() => {
        loadAllData();
    }, []);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    const loadAllData = async () => {
        try {
            const [sumRes, tasksRes, projRes, logsRes, invRes] = await Promise.all([
                fetch(`${API_BASE}/api/summary`).then(r => r.json()),
                fetch(`${API_BASE}/api/tasks`).then(r => r.json()),
                fetch(`${API_BASE}/api/projects`).then(r => r.json()),
                fetch(`${API_BASE}/api/timelogs`).then(r => r.json()),
                fetch(`${API_BASE}/api/invoices`).then(r => r.json())
            ]);

            if (sumRes.status === "success") setSummary(sumRes);
            if (tasksRes.status === "success") setTasks(tasksRes.data);
            if (projRes.status === "success") {
                setProjects(projRes.data);
                if (projRes.data.length > 0 && !selectedProjectForTimer) {
                    setSelectedProjectForTimer(projRes.data[0].id);
                }
            }
            if (logsRes.status === "success") setTimeLogs(logsRes.data);
            if (invRes.status === "success") setInvoices(invRes.data);
        } catch (e) {
            console.error("Data load error:", e);
        }
    };

    // --- タイマー操作 ---
    const startTimer = () => {
        if (!selectedProjectForTimer) {
            alert("稼働を記録するプロジェクトを選択してください");
            return;
        }
        setIsTimerRunning(true);
        timerRef.current = setInterval(() => {
            setTimerSeconds(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = async () => {
        clearInterval(timerRef.current);
        setIsTimerRunning(false);

        if (timerSeconds > 0) {
            try {
                await fetch(`${API_BASE}/api/timelogs`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        project_id: selectedProjectForTimer,
                        task_id: selectedTaskForTimer || null,
                        duration_seconds: timerSeconds,
                        notes: timerNote || "タイマー計測稼働"
                    })
                });
                alert(`稼働ログを保存しました (${Math.round(timerSeconds / 60)} 分)`);
                setTimerSeconds(0);
                setTimerNote("");
                loadAllData();
            } catch (e) {
                alert("保存エラー: " + e.message);
            }
        }
    };

    // --- タスク更新 ---
    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await fetch(`${API_BASE}/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            loadAllData();
        } catch (e) {
            alert("更新エラー: " + e.message);
        }
    };

    const deleteTask = async (taskId) => {
        if (!confirm("このタスクを削除しますか？")) return;
        try {
            await fetch(`${API_BASE}/api/tasks/${taskId}`, { method: "DELETE" });
            loadAllData();
        } catch (e) {
            alert("削除エラー: " + e.message);
        }
    };

    // 時間フォーマット hh:mm:ss
    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* ヘッダー */}
            <header className="sticky top-0 z-40 glass-panel border-b border-gray-800 px-6 py-3.5 flex items-center justify-between no-print">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <i data-lucide="check-square" className="w-5 h-5 text-white"></i>
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-lg text-white tracking-tight">TaskFlow SaaS</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">LIVE API</span>
                        </div>
                        <p className="text-xs text-gray-400">React + Tailwind + Flask / Task & Invoice System</p>
                    </div>
                </div>

                {/* タブナビゲーション */}
                <nav className="flex items-center space-x-1 bg-gray-900/80 p-1 rounded-xl border border-gray-800">
                    <button
                        onClick={() => setCurrentTab("kanban")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${currentTab === "kanban" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"}`}>
                        <i data-lucide="kanban" className="w-4 h-4"></i>
                        <span>カンバン</span>
                    </button>
                    <button
                        onClick={() => setCurrentTab("timer")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${currentTab === "timer" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"}`}>
                        <i data-lucide="timer" className="w-4 h-4"></i>
                        <span>タイマー</span>
                    </button>
                    <button
                        onClick={() => setCurrentTab("projects")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${currentTab === "projects" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"}`}>
                        <i data-lucide="briefcase" className="w-4 h-4"></i>
                        <span>プロジェクト</span>
                    </button>
                    <button
                        onClick={() => setCurrentTab("invoices")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${currentTab === "invoices" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"}`}>
                        <i data-lucide="receipt" className="w-4 h-4"></i>
                        <span>請求書作成</span>
                    </button>
                </nav>
            </header>

            {/* メインエリア */}
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
                
                {/* KPI サマリーバー */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
                    <div className="glass-panel rounded-2xl p-4">
                        <div className="text-xs text-gray-400 mb-1 flex justify-between">
                            <span>総稼働時間</span>
                            <i data-lucide="clock" className="w-4 h-4 text-indigo-400"></i>
                        </div>
                        <div className="text-2xl font-extrabold text-white font-mono">{summary.total_hours} <span className="text-xs font-normal text-gray-400">時間</span></div>
                    </div>
                    <div className="glass-panel rounded-2xl p-4">
                        <div className="text-xs text-gray-400 mb-1 flex justify-between">
                            <span>今月請求確定額</span>
                            <i data-lucide="dollar-sign" className="w-4 h-4 text-emerald-400"></i>
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-400 font-mono">¥{summary.total_revenue.toLocaleString()}</div>
                    </div>
                    <div className="glass-panel rounded-2xl p-4">
                        <div className="text-xs text-gray-400 mb-1 flex justify-between">
                            <span>進行中タスク</span>
                            <i data-lucide="activity" className="w-4 h-4 text-amber-400"></i>
                        </div>
                        <div className="text-2xl font-extrabold text-white font-mono">{summary.active_tasks} <span className="text-xs font-normal text-gray-400">件</span></div>
                    </div>
                    <div className="glass-panel rounded-2xl p-4">
                        <div className="text-xs text-gray-400 mb-1 flex justify-between">
                            <span>完了済みタスク</span>
                            <i data-lucide="check-circle" className="w-4 h-4 text-violet-400"></i>
                        </div>
                        <div className="text-2xl font-extrabold text-violet-400 font-mono">{summary.done_tasks} <span className="text-xs font-normal text-gray-400">件</span></div>
                    </div>
                </section>

                {/* 1. カンバンボード */}
                {currentTab === "kanban" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-white">タスクカンバンボード</h2>
                                <p className="text-xs text-gray-400">進捗状況に応じたタスクの整理・更新</p>
                            </div>
                            <button
                                onClick={() => setIsTaskModalOpen(true)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-indigo-500/20 transition">
                                <i data-lucide="plus" className="w-4 h-4"></i>
                                <span>新規タスク作成</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* ToDo 列 */}
                            <KanbanColumn
                                title="ToDo (未着手)"
                                count={tasks.filter(t => t.status === "todo").length}
                                tasks={tasks.filter(t => t.status === "todo")}
                                status="todo"
                                onStatusChange={updateTaskStatus}
                                onDelete={deleteTask}
                                badgeColor="bg-slate-500/20 text-slate-300 border-slate-500/30"
                            />
                            {/* In Progress 列 */}
                            <KanbanColumn
                                title="In Progress (進行中)"
                                count={tasks.filter(t => t.status === "in_progress").length}
                                tasks={tasks.filter(t => t.status === "in_progress")}
                                status="in_progress"
                                onStatusChange={updateTaskStatus}
                                onDelete={deleteTask}
                                badgeColor="bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                            />
                            {/* Done 列 */}
                            <KanbanColumn
                                title="Done (完了)"
                                count={tasks.filter(t => t.status === "done").length}
                                tasks={tasks.filter(t => t.status === "done")}
                                status="done"
                                onStatusChange={updateTaskStatus}
                                onDelete={deleteTask}
                                badgeColor="bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            />
                        </div>
                    </div>
                )}

                {/* 2. タイムトラッカー */}
                {currentTab === "timer" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="glass-panel rounded-2xl p-6 space-y-6">
                            <div className="flex items-center space-x-2 pb-4 border-b border-gray-800">
                                <i data-lucide="timer" className="w-5 h-5 text-indigo-400"></i>
                                <h2 className="text-base font-bold text-white">リアルタイム稼働タイマー</h2>
                            </div>

                            {/* タイマー表示 */}
                            <div className="text-center py-6 bg-gray-900/90 rounded-2xl border border-gray-800">
                                <div className="text-5xl font-extrabold text-white font-mono tracking-wider">
                                    {formatTime(timerSeconds)}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    {isTimerRunning ? "🟢 稼働時間を計測中..." : "⚪ 停止中"}
                                </p>
                            </div>

                            {/* プロジェクト・タスク選択 */}
                            <div className="space-y-4 text-xs">
                                <div>
                                    <label className="block text-gray-400 mb-1">プロジェクト</label>
                                    <select
                                        value={selectedProjectForTimer}
                                        onChange={(e) => setSelectedProjectForTimer(e.target.value)}
                                        disabled={isTimerRunning}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-white">
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.client_name})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-1">関連タスク (任意)</label>
                                    <select
                                        value={selectedTaskForTimer}
                                        onChange={(e) => setSelectedTaskForTimer(e.target.value)}
                                        disabled={isTimerRunning}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-white">
                                        <option value="">タスクを選択しない</option>
                                        {tasks.map(t => (
                                            <option key={t.id} value={t.id}>{t.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-1">作業メモ</label>
                                    <input
                                        type="text"
                                        placeholder="例: API仕様書の作成とテスト"
                                        value={timerNote}
                                        onChange={(e) => setTimerNote(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                                    />
                                </div>

                                {isTimerRunning ? (
                                    <button
                                        onClick={stopTimer}
                                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-red-500/20 transition">
                                        <i data-lucide="square" className="w-4 h-4"></i>
                                        <span>タイマーを停止して保存</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={startTimer}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20 transition">
                                        <i data-lucide="play" className="w-4 h-4"></i>
                                        <span>計測を開始</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 稼働履歴リスト */}
                        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col">
                            <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                                <i data-lucide="history" className="w-5 h-5 text-gray-400"></i>
                                <span>最近の稼働ログ履歴</span>
                            </h3>

                            <div className="flex-1 overflow-y-auto space-y-3">
                                {timeLogs.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 text-xs">稼働ログがまだありません</div>
                                ) : (
                                    timeLogs.map(log => (
                                        <div key={log.id} className="p-4 bg-gray-900/60 rounded-xl border border-gray-800 flex justify-between items-center text-xs">
                                            <div>
                                                <div className="font-bold text-white text-sm">{log.project_name}</div>
                                                <div className="text-gray-400 mt-0.5">{log.notes || log.task_title || "作業ログ"}</div>
                                                <div className="text-[11px] text-gray-500 mt-1">{log.created_at}</div>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-mono font-bold text-indigo-400 text-sm">{Math.round(log.duration_seconds / 60)} 分</span>
                                                <div className="text-[11px] text-emerald-400">¥{Math.round((log.duration_seconds / 3600) * log.hourly_rate).toLocaleString()} 相当</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. プロジェクト管理 */}
                {currentTab === "projects" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-white">プロジェクト ＆ クライアント時給設定</h2>
                                <p className="text-xs text-gray-400">時給（Hourly Rate）に基づいた請求金額の自動算定基盤</p>
                            </div>
                            <button
                                onClick={() => setIsProjectModalOpen(true)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-indigo-500/20 transition">
                                <i data-lucide="plus" className="w-4 h-4"></i>
                                <span>新規プロジェクト追加</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(p => (
                                <div key={p.id} className="glass-panel rounded-2xl p-5 border-l-4 space-y-3" style={{ borderLeftColor: p.color }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white text-base">{p.name}</h3>
                                            <p className="text-xs text-gray-400">{p.client_name}</p>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20">
                                            ¥{p.hourly_rate.toLocaleString()} /h
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400 pt-2 border-t border-gray-800/80 flex justify-between">
                                        <span>登録日: {p.created_at ? p.created_at.split(" ")[0] : "-"}</span>
                                        <span className="text-emerald-400">Active</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. 請求書 (Invoices) */}
                {currentTab === "invoices" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-white">請求書 (Invoice) マネージャー</h2>
                                <p className="text-xs text-gray-400">稼働時間からワンクリックで請求書を発行・PDF印刷</p>
                            </div>
                            <button
                                onClick={() => setIsInvoiceModalOpen(true)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition">
                                <i data-lucide="plus" className="w-4 h-4"></i>
                                <span>新規請求書を作成</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {invoices.map(inv => (
                                <div key={inv.id} className="glass-panel rounded-2xl p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-mono text-indigo-400">{inv.invoice_number}</span>
                                            <h3 className="font-bold text-white text-base mt-0.5">{inv.client_name}</h3>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${inv.status === "sent" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"}`}>
                                            {inv.status}
                                        </span>
                                    </div>

                                    <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800 space-y-1 text-xs">
                                        <div className="flex justify-between text-gray-400">
                                            <span>小計 (税抜):</span>
                                            <span>¥{inv.subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                            <span>消費税 (10%):</span>
                                            <span>¥{inv.tax_amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-white font-bold border-t border-gray-800 pt-1 text-sm">
                                            <span>請求合計:</span>
                                            <span className="text-emerald-400 font-mono">¥{inv.total_amount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-[11px] text-gray-500">支払期限: {inv.due_date}</span>
                                        <button
                                            onClick={() => setPreviewInvoice(inv)}
                                            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-indigo-300 rounded-lg transition flex items-center space-x-1">
                                            <i data-lucide="eye" className="w-3.5 h-3.5"></i>
                                            <span>プレビュー / 印刷</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>

            {/* --- モーダル: 新規タスク --- */}
            {isTaskModalOpen && (
                <TaskModal
                    projects={projects}
                    onClose={() => setIsTaskModalOpen(false)}
                    onCreated={() => { setIsTaskModalOpen(false); loadAllData(); }}
                />
            )}

            {/* --- モーダル: 新規プロジェクト --- */}
            {isProjectModalOpen && (
                <ProjectModal
                    onClose={() => setIsProjectModalOpen(false)}
                    onCreated={() => { setIsProjectModalOpen(false); loadAllData(); }}
                />
            )}

            {/* --- モーダル: 新規請求書 --- */}
            {isInvoiceModalOpen && (
                <InvoiceCreateModal
                    projects={projects}
                    timeLogs={timeLogs}
                    onClose={() => setIsInvoiceModalOpen(false)}
                    onCreated={() => { setIsInvoiceModalOpen(false); loadAllData(); }}
                />
            )}

            {/* --- 請求書印刷プレビューモーダル --- */}
            {previewInvoice && (
                <InvoicePreviewModal
                    invoice={previewInvoice}
                    onClose={() => setPreviewInvoice(null)}
                />
            )}
        </div>
    );
}

// カンバンカラムコンポーネント
function KanbanColumn({ title, count, tasks, status, onStatusChange, onDelete, badgeColor }) {
    return (
        <div className="glass-panel rounded-2xl p-4 flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
                <span className="font-bold text-sm text-white">{title}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${badgeColor}`}>
                    {count}
                </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
                {tasks.map(t => (
                    <div key={t.id} className="p-4 bg-gray-900/80 rounded-xl border border-gray-800/80 hover:border-gray-700 transition space-y-2">
                        <div className="flex justify-between items-start">
                            <span className="text-[11px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-medium">{t.project_name || "一般"}</span>
                            <button onClick={() => onDelete(t.id)} className="text-gray-500 hover:text-red-400 transition text-xs">✕</button>
                        </div>
                        <h4 className="font-bold text-sm text-white leading-tight">{t.title}</h4>
                        {t.description && <p className="text-xs text-gray-400">{t.description}</p>}
                        
                        <div className="flex justify-between items-center pt-2 border-t border-gray-800/50">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${t.priority === "high" ? "text-red-400 bg-red-500/10" : "text-gray-400"}`}>
                                Priority: {t.priority}
                            </span>
                            <div className="flex space-x-1">
                                {status !== "todo" && (
                                    <button onClick={() => onStatusChange(t.id, "todo")} className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded hover:bg-gray-700">← ToDo</button>
                                )}
                                {status !== "in_progress" && (
                                    <button onClick={() => onStatusChange(t.id, "in_progress")} className="text-[10px] px-1.5 py-0.5 bg-indigo-900/60 text-indigo-300 rounded hover:bg-indigo-800">進行中</button>
                                )}
                                {status !== "done" && (
                                    <button onClick={() => onStatusChange(t.id, "done")} className="text-[10px] px-1.5 py-0.5 bg-emerald-900/60 text-emerald-300 rounded hover:bg-emerald-800">完了 ✓</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// タスク作成モーダル
function TaskModal({ projects, onClose, onCreated }) {
    const [title, setTitle] = useState("");
    const [projectId, setProjectId] = useState(projects[0]?.id || "");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_BASE}/api/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, project_id: projectId, description, priority, status: "todo" })
            });
            onCreated();
        } catch (err) {
            alert("エラー: " + err.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel rounded-2xl p-6 max-w-md w-full border border-gray-700 space-y-4">
                <h3 className="text-base font-bold text-white">新規タスク作成</h3>
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-gray-300 mb-1">タスク名 *</label>
                        <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">プロジェクト</label>
                        <select value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white">
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">詳細説明</label>
                        <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"></textarea>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl">キャンセル</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl">作成</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// プロジェクト作成モーダル
function ProjectModal({ onClose, onCreated }) {
    const [name, setName] = useState("");
    const [clientName, setClientName] = useState("");
    const [hourlyRate, setHourlyRate] = useState(6000);
    const [color, setColor] = useState("#6366f1");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_BASE}/api/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, client_name: clientName, hourly_rate: hourlyRate, color })
            });
            onCreated();
        } catch (err) {
            alert("エラー: " + err.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel rounded-2xl p-6 max-w-md w-full border border-gray-700 space-y-4">
                <h3 className="text-base font-bold text-white">新規プロジェクト登録</h3>
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-gray-300 mb-1">プロジェクト名 *</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">クライアント企業名 *</label>
                        <input type="text" required value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">設定時給 (¥/hour)</label>
                        <input type="number" step="500" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl">キャンセル</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl">登録</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// 請求書作成モーダル
function InvoiceCreateModal({ projects, timeLogs, onClose, onCreated }) {
    const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
    const [dueDate, setDueDate] = useState("2026-09-30");

    const selectedProj = projects.find(p => p.id === parseInt(selectedProjectId)) || projects[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 該当プロジェクトの稼働時間を集計
        const projLogs = timeLogs.filter(l => l.project_id === parseInt(selectedProjectId));
        const totalSecs = projLogs.reduce((acc, cur) => acc + cur.duration_seconds, 0);
        const hours = Math.max(1.0, roundHours(totalSecs / 3600.0));
        const rate = selectedProj?.hourly_rate || 6000;
        const amount = hours * rate;

        const items = [
            { description: `${selectedProj?.name} 開発・設計稼働 (${hours}時間)`, hours, rate, amount }
        ];

        try {
            await fetch(`${API_BASE}/api/invoices`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    project_id: selectedProjectId,
                    client_name: selectedProj?.client_name || "クライアント",
                    due_date: dueDate,
                    items
                })
            });
            onCreated();
        } catch (err) {
            alert("エラー: " + err.message);
        }
    };

    const roundHours = (h) => Math.round(h * 10) / 10;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel rounded-2xl p-6 max-w-md w-full border border-gray-700 space-y-4">
                <h3 className="text-base font-bold text-white">請求書を新規発行</h3>
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-gray-300 mb-1">対象プロジェクト</label>
                        <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white">
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.client_name})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">お支払期日 (Due Date)</label>
                        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-[11px] text-gray-400 leading-relaxed">
                        💡 選択したプロジェクトの蓄積された稼働ログから、時給単価を自動計算して請求書を生成します。
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl">キャンセル</button>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl">発行</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// 請求書印刷プレビューモーダル
function InvoicePreviewModal({ invoice, onClose }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white text-gray-900 rounded-2xl p-8 max-w-2xl w-full shadow-2xl space-y-6">
                
                {/* 請求書ヘッダー */}
                <div className="flex justify-between items-start border-b pb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">御 請 求 書</h2>
                        <p className="text-sm font-mono text-gray-500 mt-1">請求番号: {invoice.invoice_number}</p>
                    </div>
                    <div className="text-right text-xs text-gray-600">
                        <div>発行日: {invoice.issue_date}</div>
                        <div className="font-bold text-red-600 mt-1">お支払期日: {invoice.due_date}</div>
                    </div>
                </div>

                {/* 宛先 & 発行者 */}
                <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                        <div className="text-xs text-gray-500">ご請求先</div>
                        <div className="text-lg font-bold border-b-2 border-gray-900 pb-1 mt-1">{invoice.client_name} 御中</div>
                        <p className="text-xs text-gray-600 mt-2">件名: {invoice.project_name} に伴う開発稼働費用</p>
                    </div>
                    <div className="text-right text-xs text-gray-600 space-y-1">
                        <div className="font-bold text-sm text-gray-900">鈴木 和裕 (Kazuhiro Suzuki)</div>
                        <div>エンジニアリング / Web開発事業</div>
                        <div>Email: portfolio@example.com</div>
                    </div>
                </div>

                {/* 請求金額ハイライト */}
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex justify-between items-center">
                    <span className="font-bold text-gray-700">ご請求金額 (税込)</span>
                    <span className="text-2xl font-extrabold text-indigo-700 font-mono">¥{invoice.total_amount.toLocaleString()} -</span>
                </div>

                {/* 明細テーブル */}
                <table className="w-full text-xs text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 border-b">
                            <th className="p-2.5">品目・作業内容</th>
                            <th className="p-2.5 text-center">稼働時間</th>
                            <th className="p-2.5 text-right">単価 (時給)</th>
                            <th className="p-2.5 text-right">金額</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items?.map((item, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="p-2.5">{item.description}</td>
                                <td className="p-2.5 text-center font-mono">{item.hours} h</td>
                                <td className="p-2.5 text-right font-mono">¥{item.rate.toLocaleString()}</td>
                                <td className="p-2.5 text-right font-mono font-bold">¥{item.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* 金額計算サマリー */}
                <div className="w-64 ml-auto text-xs space-y-1.5 pt-2">
                    <div className="flex justify-between text-gray-600">
                        <span>小計 (税抜):</span>
                        <span className="font-mono">¥{invoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>消費税 (10%):</span>
                        <span className="font-mono">¥{invoice.tax_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-900 border-t pt-1.5">
                        <span>合計金額:</span>
                        <span className="font-mono text-indigo-600">¥{invoice.total_amount.toLocaleString()}</span>
                    </div>
                </div>

                {/* ボタン群 */}
                <div className="flex justify-end space-x-3 pt-4 border-t no-print">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-xl transition">
                        閉じる
                    </button>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow transition">
                        <span>🖨️ 印刷 / PDF保存</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
