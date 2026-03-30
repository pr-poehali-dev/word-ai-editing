import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "editor" | "documents";

interface Document {
  id: number;
  name: string;
  date: string;
  size: string;
  status: "ready" | "processing" | "done";
}

const mockDocuments: Document[] = [
  { id: 1, name: "Отчёт за квартал.docx", date: "28 марта 2026", size: "142 КБ", status: "done" },
  { id: 2, name: "Договор с подрядчиком.docx", date: "25 марта 2026", size: "89 КБ", status: "done" },
  { id: 3, name: "Техническое задание.docx", date: "20 марта 2026", size: "215 КБ", status: "ready" },
];

const sampleText = `Совет директоров компании провёл расширеное заседание в котором принимали участие все ключевые сотрудники отдела. На повестке стояли вопросы связаные с реструктуризацией бизнесс-процессов и внедрением новых технологических решений.

В ходе обсуждения были выявлены основные проблемы: отсутствие четкой коммуникации между отделами и несоблюдение дедлайнов. Руководство приняло решение разработать план мероприятий до конца следующего квартала.`;

const correctedText = `Совет директоров компании провёл расширенное заседание, в котором принимали участие все ключевые сотрудники отдела. На повестке стояли вопросы, связанные с реструктуризацией бизнес-процессов и внедрением новых технологических решений.

В ходе обсуждения были выявлены основные проблемы: отсутствие чёткой коммуникации между отделами и несоблюдение дедлайнов. Руководство приняло решение разработать план мероприятий до конца следующего квартала.`;

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeFixType, setActiveFixType] = useState<string>("all");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setIsProcessed(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsProcessed(false);
    }
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsProcessed(true);
    }, 2200);
  };

  const fixes = [
    { id: "all", label: "Все", count: 7 },
    { id: "grammar", label: "Грамматика", count: 3 },
    { id: "punctuation", label: "Пунктуация", count: 2 },
    { id: "style", label: "Стиль", count: 2 },
  ];

  const corrections = [
    { original: "расширеное", fixed: "расширенное", type: "grammar" },
    { original: "в котором", fixed: ", в котором", type: "punctuation" },
    { original: "связаные", fixed: "связанные", type: "grammar" },
    { original: "бизнесс-процессов", fixed: "бизнес-процессов", type: "grammar" },
    { original: "четкой", fixed: "чёткой", type: "style" },
    { original: "дедлайнов", fixed: "сроков", type: "style" },
    { original: "вопросы связаные", fixed: "вопросы, связанные", type: "punctuation" },
  ];

  const filteredCorrections = activeFixType === "all"
    ? corrections
    : corrections.filter(c => c.type === activeFixType);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-foreground rounded-sm flex items-center justify-center">
              <span className="text-background text-xs font-bold font-display">Д</span>
            </div>
            <span className="font-semibold text-foreground tracking-tight">ДокИИ</span>
          </div>

          <nav className="flex items-center gap-1 bg-secondary rounded-md p-1">
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
                activeTab === "editor"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Редактор
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
                activeTab === "documents"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Документы
            </button>
          </nav>

          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Войти
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">

        {/* ── EDITOR TAB ── */}
        {activeTab === "editor" && (
          <div className="animate-fade-in">
            {!fileName ? (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
                <div className="mb-10 text-center">
                  <h1 className="font-display text-5xl font-semibold text-foreground mb-3 leading-tight">
                    Умное редактирование<br />
                    <em className="text-muted-foreground font-normal">документов Word</em>
                  </h1>
                  <p className="text-muted-foreground text-base max-w-md mx-auto">
                    ИИ исправит грамматику, пунктуацию и стиль текста в вашем документе за секунды
                  </p>
                </div>

                <label
                  className={`relative w-full max-w-xl cursor-pointer group transition-all ${
                    isDragging ? "scale-[1.02]" : ""
                  }`}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".docx,.doc"
                    className="sr-only"
                    onChange={handleFileInput}
                  />
                  <div className={`border-2 border-dashed rounded-2xl p-14 flex flex-col items-center gap-4 transition-all ${
                    isDragging
                      ? "border-foreground bg-secondary"
                      : "border-border bg-card group-hover:border-muted-foreground"
                  }`}>
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                      isDragging ? "bg-foreground" : "bg-secondary group-hover:bg-muted"
                    }`}>
                      <Icon
                        name="Upload"
                        size={24}
                        className={isDragging ? "text-background" : "text-muted-foreground"}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground mb-1">
                        Перетащите файл или нажмите для выбора
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Поддерживаются форматы .docx и .doc
                      </p>
                    </div>
                  </div>
                </label>

                <div className="mt-10 flex items-center gap-8 text-sm text-muted-foreground">
                  {[
                    { icon: "SpellCheck", text: "Грамматика" },
                    { icon: "AlignLeft", text: "Пунктуация" },
                    { icon: "Wand2", text: "Стиль текста" },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2">
                      <Icon name={item.icon} size={15} className="text-accent" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setFileName(null); setIsProcessed(false); setIsProcessing(false); }}
                      className="p-1.5 rounded hover:bg-secondary transition-colors"
                    >
                      <Icon name="ArrowLeft" size={18} className="text-muted-foreground" />
                    </button>
                    <div>
                      <p className="font-medium text-foreground">{fileName}</p>
                      <p className="text-xs text-muted-foreground">Загружен только что</p>
                    </div>
                  </div>

                  {!isProcessed ? (
                    <button
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <>
                          <Icon name="Loader2" size={16} className="animate-spin" />
                          Анализирую…
                        </>
                      ) : (
                        <>
                          <Icon name="Sparkles" size={16} />
                          Проверить документ
                        </>
                      )}
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-all">
                      <Icon name="Download" size={16} />
                      Скачать исправленный
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                  <div className={isProcessed ? "lg:col-span-3" : "lg:col-span-5"}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Original */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2.5">
                          Оригинал
                        </p>
                        <div className="bg-card border border-border rounded-xl p-5 min-h-64">
                          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                            {sampleText}
                          </p>
                        </div>
                      </div>

                      {/* Result */}
                      <div>
                        <div className="flex items-center mb-2.5">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            После исправления
                          </p>
                          {isProcessed && (
                            <span className="ml-auto text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium border border-green-100">
                              7 исправлений
                            </span>
                          )}
                        </div>
                        <div className={`border rounded-xl p-5 min-h-64 transition-all ${
                          isProcessed
                            ? "bg-card border-border"
                            : "bg-secondary/60 border-dashed border-border"
                        }`}>
                          {isProcessed ? (
                            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                              {correctedText}
                            </p>
                          ) : isProcessing ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
                              <Icon name="Loader2" size={28} className="animate-spin text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Анализирую текст…</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-2 py-10">
                              <Icon name="Sparkles" size={24} className="text-muted-foreground/30" />
                              <p className="text-sm text-muted-foreground text-center">
                                Нажмите «Проверить», чтобы увидеть результат
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Corrections panel */}
                  {isProcessed && (
                    <div className="lg:col-span-2 animate-slide-up">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2.5">
                        Список исправлений
                      </p>
                      <div className="bg-card border border-border rounded-xl overflow-hidden">
                        <div className="border-b border-border p-3 flex gap-1 flex-wrap">
                          {fixes.map(fix => (
                            <button
                              key={fix.id}
                              onClick={() => setActiveFixType(fix.id)}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                                activeFixType === fix.id
                                  ? "bg-foreground text-background"
                                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                              }`}
                            >
                              {fix.label}
                              <span className="ml-1.5 opacity-50">{fix.count}</span>
                            </button>
                          ))}
                        </div>
                        <div className="divide-y divide-border max-h-72 overflow-auto">
                          {filteredCorrections.map((c, i) => (
                            <div key={i} className="px-4 py-3 flex items-start gap-3">
                              <div className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                c.type === "grammar" ? "bg-red-400" :
                                c.type === "punctuation" ? "bg-amber-400" : "bg-blue-400"
                              }`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-red-500 line-through font-mono">
                                    {c.original}
                                  </span>
                                  <Icon name="ArrowRight" size={11} className="text-muted-foreground flex-shrink-0" />
                                  <span className="text-xs text-green-700 font-mono font-medium">
                                    {c.fixed}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {c.type === "grammar" ? "Грамматика" : c.type === "punctuation" ? "Пунктуация" : "Стиль"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── DOCUMENTS TAB ── */}
        {activeTab === "documents" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="font-display text-3xl font-semibold">Мои документы</h2>
                <p className="text-sm text-muted-foreground mt-0.5">История загруженных файлов</p>
              </div>
              <button
                onClick={() => setActiveTab("editor")}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-all"
              >
                <Icon name="Plus" size={15} />
                Загрузить документ
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-7">
              {[
                { label: "Всего документов", value: "3", icon: "FileText" },
                { label: "Исправлено ошибок", value: "24", icon: "CheckCircle2" },
                { label: "Сохранено времени", value: "~40 мин", icon: "Clock" },
              ].map(stat => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name={stat.icon} size={15} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-semibold text-foreground font-display">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Documents list */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-secondary/40">
                <span className="col-span-6 text-xs font-medium text-muted-foreground uppercase tracking-widest">Файл</span>
                <span className="col-span-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">Размер</span>
                <span className="col-span-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">Дата</span>
                <span className="col-span-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">Статус</span>
              </div>
              <div className="divide-y divide-border">
                {mockDocuments.map((doc, i) => (
                  <div
                    key={doc.id}
                    className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-secondary/40 transition-colors group animate-slide-up"
                    style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                  >
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0">
                        <Icon name="FileText" size={15} className="text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-foreground truncate">{doc.name}</span>
                    </div>
                    <span className="col-span-2 text-sm text-muted-foreground">{doc.size}</span>
                    <span className="col-span-2 text-sm text-muted-foreground">{doc.date}</span>
                    <div className="col-span-2 flex items-center justify-between">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        doc.status === "done"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : doc.status === "processing"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-secondary text-muted-foreground border border-border"
                      }`}>
                        {doc.status === "done" ? "Готово" : doc.status === "processing" ? "Обработка" : "Ожидает"}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-secondary rounded-md">
                        <Icon name="Download" size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}