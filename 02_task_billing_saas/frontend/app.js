// TaskFlow & Invoice SaaS Logic (with Smart Live Demo Fallback)
const { useState, useEffect, useRef } = React;

function App() {
    const [tasks, setTasks] = useState([
        { id: 1, title: "公式LINE Messaging API Webhook & 予約連動設計", project_name: "株式会社サイバーエステート", hourly_rate: 7500, status: "done", priority: "high" },
        { id: 2, title: "Stripe Checkout決済および在庫ロック・トランザクション実装", project_name: "合同会社ネクストデザイン", hourly_rate: 7000, status: "in_progress", priority: "high" },
        { id: 3, title: "モバイル表示速度改善 (Core Web Vitals LCP 1.2秒達成)", project_name: "株式会社サイバーエステート", hourly_rate: 6500, status: "done", priority: "medium" },
        { id: 4, title: "Googleカレンダー双方向同期＆リマインド通知バックエンド", project_name: "医療法人社団メディカルワン", hourly_rate: 8000, status: "todo", priority: "high" }
    ]);
    const [timeLogs, setTimeLogs] = useState([
        { id: 1, project_name: "株式会社サイバーエステート", duration_seconds: 14400, notes: "LINE API Webhook連携 & DBスキーマ設計", created_at: "2026-09-02" },
        { id: 2, project_name: "合同会社ネクストデザイン", duration_seconds: 18000, notes: "Stripe決済トランザクション＆例外ハンドリング", created_at: "2026-09-03" },
        { id: 3, project_name: "株式会社サイバーエステート", duration_seconds: 7200, notes: "表示速度チューニング＆画像WebP化", created_at: "2026-09-04" }
    ]);
    const [currentView, setCurrentView] = useState("kanban"); // "kanban" | "timer" | "invoice"
    
    // タイマー状態
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [selectedProject, setSelectedProject] = useState("ECリニューアル");
    const [timerNote, setTimerNote] = useState("機能実装とテスト");
    const timerRef = useRef(null);

    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isTimerRunning]);

    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    });

    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const stopAndSaveTimer = () => {
        setIsTimerRunning(false);
        if (timerSeconds > 0) {
            setTimeLogs(prev => [
                { id: Date.now(), project_name: selectedProject, duration_seconds: timerSeconds, notes: timerNote, created_at: "今日" },
                ...prev
            ]);
            setTimerSeconds(0);
            alert("稼働ログを記録しました！");
        }
    };

    const moveTaskStatus = (taskId, nextStatus) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
    };

    const totalHours = timeLogs.reduce((sum, l) => sum + (l.duration_seconds / 3600), 0);
    const totalEarnings = timeLogs.reduce((sum, l) => {
        const rate = l.project_name.includes("EC") ? 6500 : 5500;
        return sum + Math.floor((l.duration_seconds / 3600) * rate);
    }, 0);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            {/* ヘッダー */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 sm:px-10 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold font-serif text-lg shadow-sm">
                        T
                    </div>
                    <div>
                        <span className="font-extrabold text-lg tracking-wider text-slate-900 font-serif">TaskFlow</span>
                        <span className="ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">SaaS & Invoice</span>
                    </div>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                    <button onClick={() => setCurrentView("kanban")} className={`px-4 py-2 rounded-lg transition ${currentView === "kanban" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"}`}>
                        📋 カンバンボード
                    </button>
                    <button onClick={() => setCurrentView("timer")} className={`px-4 py-2 rounded-lg transition ${currentView === "timer" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"}`}>
                        ⏱️ 稼働タイマー
                    </button>
                    <button onClick={() => setCurrentView("invoice")} className={`px-4 py-2 rounded-lg transition ${currentView === "invoice" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"}`}>
                        🧾 請求書発行
                    </button>
                </div>
            </header>

            {/* サマリーバー */}
            <div className="max-w-6xl w-full mx-auto px-6 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-500 font-medium">総計測稼働時間</div>
                    <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalHours.toFixed(1)} 時間</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-500 font-medium">売上見込額 (時給連動)</div>
                    <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">¥{totalEarnings.toLocaleString()}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-500 font-medium">アクティブタスク数</div>
                    <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{tasks.filter(t => t.status !== "done").length} 件</div>
                </div>
            </div>

            {/* メインコンテンツ */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
                {currentView === "kanban" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["todo", "in_progress", "done"].map(status => (
                            <div key={status} className="bg-slate-100/80 p-5 rounded-2xl border border-slate-200 space-y-4">
                                <div className="flex justify-between items-center font-bold text-xs uppercase tracking-wider text-slate-700">
                                    <span>{status === "todo" ? "📌 To Do" : status === "in_progress" ? "⚡ 進行中" : "✅ 完了"}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-white text-slate-600 font-mono shadow-sm">
                                        {tasks.filter(t => t.status === status).length}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {tasks.filter(t => t.status === status).map(t => (
                                        <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                                            <div className="flex justify-between items-center text-[10px] font-mono">
                                                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">{t.project_name}</span>
                                                <span className="text-slate-400 font-bold">¥{t.hourly_rate.toLocaleString()}/h</span>
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                                            <div className="pt-2 flex justify-end space-x-1 border-t border-slate-50 text-[11px]">
                                                {status !== "todo" && <button onClick={() => moveTaskStatus(t.id, "todo")} className="px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded text-slate-600">← ToDo</button>}
                                                {status !== "in_progress" && <button onClick={() => moveTaskStatus(t.id, "in_progress")} className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-semibold">進行中</button>}
                                                {status !== "done" && <button onClick={() => moveTaskStatus(t.id, "done")} className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-semibold">完了 →</button>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {currentView === "timer" && (
                    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
                        <div className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-semibold">Real-Time Stopwatch</div>
                        <div className="text-6xl font-extrabold font-mono text-slate-900 tracking-wider">
                            {formatTime(timerSeconds)}
                        </div>

                        <div className="space-y-3 text-left">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">プロジェクト</label>
                                <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800">
                                    <option value="ECリニューアル">ECリニューアル (時給: ¥6,500)</option>
                                    <option value="ブランドLP制作">ブランドLP制作 (時給: ¥5,500)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">作業メモ</label>
                                <input type="text" value={timerNote} onChange={e => setTimerNote(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800" />
                            </div>
                        </div>

                        <div className="flex justify-center space-x-3 pt-2">
                            {!isTimerRunning ? (
                                <button onClick={() => setIsTimerRunning(true)} className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20">
                                    ▶ 計測スタート
                                </button>
                            ) : (
                                <button onClick={stopAndSaveTimer} className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/20">
                                    ⏹ 計測停止してログ保存
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {currentView === "invoice" && (
                    <div className="max-w-3xl mx-auto bg-white p-10 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8 relative overflow-hidden">
                        {/* 請求書ヘッダー */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-900 pb-6 gap-4">
                            <div>
                                <span className="text-[10px] font-mono tracking-widest text-indigo-600 uppercase font-bold px-2.5 py-0.5 bg-indigo-50 rounded border border-indigo-100">INVOICE (適格請求書)</span>
                                <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 tracking-wider mt-1">御 請 求 書</h2>
                                <p className="text-xs text-slate-400 font-mono mt-1">請求書番号: INV-202609-001 / 発行日: 2026年9月4日</p>
                            </div>
                            {/* 発行元・朱肉風電子角印スタンプ */}
                            <div className="relative flex items-center space-x-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                                <div className="text-right text-xs text-slate-600 space-y-1">
                                    <div className="font-bold text-slate-900 text-sm">Kazuhiro Suzuki Web Engineering</div>
                                    <div className="text-[11px] text-slate-500">代表: 鈴木 一郎</div>
                                    <div className="text-[10px] font-mono text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">登録番号: T1234567890123</div>
                                    <div className="text-[10px] text-slate-400">contact@suzuki-dev.jp</div>
                                </div>
                                {/* 朱肉風SVG電子印影 */}
                                <div className="w-12 h-12 rounded-lg border-2 border-red-600/80 flex items-center justify-center text-red-600 font-serif font-black text-[11px] leading-tight select-none transform rotate-[-4deg] opacity-90 shadow-sm p-0.5">
                                    <div className="border border-red-500/60 w-full h-full flex items-center justify-center text-center">
                                        鈴木<br/>之印
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 宛名および請求金額サマリー */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                            <div className="border-b border-slate-300 pb-3">
                                <p className="text-xs text-slate-500">ご請求先：</p>
                                <h3 className="text-xl font-bold text-slate-900 mt-1">株式会社サイバーエステート 御中</h3>
                                <p className="text-xs text-slate-500 mt-1">件名: 2026年9月度 Webシステム開発およびAPI連携業務</p>
                            </div>
                            <div className="bg-slate-900 text-white p-5 rounded-2xl flex justify-between items-baseline">
                                <div>
                                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">ご請求総額 (税込)</span>
                                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">¥{Math.floor(totalEarnings * 1.1).toLocaleString()}</span>
                                </div>
                                <span className="text-[11px] text-slate-300 font-mono">お支払期限: 2026年9月30日</span>
                            </div>
                        </div>

                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                                    <th className="py-2 text-left">品目・作業内容</th>
                                    <th className="py-2 text-right">稼働時間</th>
                                    <th className="py-2 text-right">単価 (時給)</th>
                                    <th className="py-2 text-right">金額</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                                {timeLogs.map(l => {
                                    const rate = l.project_name.includes("EC") ? 6500 : 5500;
                                    const amount = Math.floor((l.duration_seconds / 3600) * rate);
                                    return (
                                        <tr key={l.id}>
                                            <td className="py-3 font-sans font-medium text-slate-800">{l.project_name} - {l.notes}</td>
                                            <td className="py-3 text-right">{(l.duration_seconds / 3600).toFixed(1)}h</td>
                                            <td className="py-3 text-right">¥{rate.toLocaleString()}</td>
                                            <td className="py-3 text-right font-bold text-slate-900">¥{amount.toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="border-t-2 border-slate-900 pt-4 flex justify-between items-center text-sm font-bold">
                            <span>ご請求総額 (税込)</span>
                            <span className="text-2xl text-indigo-600 font-mono font-extrabold">¥{Math.floor(totalEarnings * 1.1).toLocaleString()}</span>
                        </div>

                        {/* お振込先口座・特記事項 */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                            <div>
                                <span className="font-bold text-slate-800 block mb-1">【お振込先口座】</span>
                                <div className="font-mono space-y-0.5 text-[11px]">
                                    <div>銀行名：三菱UFJ銀行（0005） 渋谷支店（135）</div>
                                    <div>預金種目：普通預金 / 口座番号：1234567</div>
                                    <div>口座名義：スズキ カズヒロ (鈴木 一郎)</div>
                                </div>
                            </div>
                            <div>
                                <span className="font-bold text-slate-800 block mb-1">【税率内訳 (10%対象)】</span>
                                <div className="font-mono space-y-0.5 text-[11px]">
                                    <div>税抜金額：¥{totalEarnings.toLocaleString()}</div>
                                    <div>消費税額 (10%)：¥{Math.floor(totalEarnings * 0.1).toLocaleString()}</div>
                                    <div className="text-slate-400">※振込手数料は貴社にてご負担願います。</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                            <span className="text-[11px] text-slate-400 font-mono">※電子帳簿保存法・インボイス制度対応フォーマット</span>
                            <button onClick={() => window.print()} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition">
                                <span>🖨️ この請求書を印刷 / PDF保存</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
