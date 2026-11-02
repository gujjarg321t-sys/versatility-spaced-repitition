import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Check,
  Undo2,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  Save,
  Highlighter,
  Upload,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Copy,
  Layers,
  PenTool,
  StickyNote,
  Video,
  Play,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sliders,
  Wrench,
  Maximize,
  Minimize,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { VaultFile, HighlighterType, TextBlock, DocumentPage } from '../types';
import { HIGHLIGHTERS, HIGHLIGHTER_LIST } from '../utils/highlighterConfig';
import { convertPdfToImages, dataUrlToBlobUrl } from '../utils/pdfRenderer';
import { getBlob } from '../utils/blobStorage';

interface XodoViewerProps {
  fileId: string;
  onClose: () => void;
}

interface StickyNoteItem {
  id: string;
  text: string;
  xPercent: number;
  yPercent: number;
  colorHex: string;
}

export const XodoViewer: React.FC<XodoViewerProps> = ({ fileId, onClose }) => {
  const {
    vaultFiles,
    addBlankPageToFile,
    addMultipleBlankPagesToFile,
    attachImagePageToFile,
    updatePageBlock,
    deleteBlockHighlight,
    addBlockToPage,
  } = useStudy();

  const file = vaultFiles.find((f) => f.id === fileId);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [pageBlobUrl, setPageBlobUrl] = useState<string | null>(null);

  // 100% Immersive View & Xodo Overlay Tool State
  const [showToolsOverlay, setShowToolsOverlay] = useState<boolean>(false);
  const [isImmersiveMode, setIsImmersiveMode] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showNotesDrawer, setShowNotesDrawer] = useState<boolean>(false);

  // Highlighters State
  const [activeHighlighter, setActiveHighlighter] = useState<HighlighterType | 'eraser' | null>(
    'important'
  );

  // Xodo Freehand Pen Annotation State
  const [isPenActive, setIsPenActive] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#FFD700'); // Gold default
  const [penWidth, setPenWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Sticky Notes State
  const [stickyNotes, setStickyNotes] = useState<Record<string, StickyNoteItem[]>>({});
  const [showAddStickyModal, setShowAddStickyModal] = useState<boolean>(false);
  const [newStickyText, setNewStickyText] = useState<string>('');

  // Inline Block Editing State
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [showAddBlockInput, setShowAddBlockInput] = useState<boolean>(false);
  const [newBlockText, setNewBlockText] = useState<string>('');
  const [newBlockType, setNewBlockType] = useState<TextBlock['type']>('paragraph');

  // Bulk Pages & Processing
  const [showAddPagesModal, setShowAddPagesModal] = useState<boolean>(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState<boolean>(false);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const documentContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!file) {
    return null;
  }

  const pages = file.pages || [];
  const safePageIndex = Math.min(currentPageIndex, Math.max(0, pages.length - 1));
  const currentPage: DocumentPage | undefined = pages[safePageIndex];

  useEffect(() => {
    const loadBlob = async () => {
      if (currentPage?.blobKey) {
        const blob = await getBlob(currentPage.blobKey);
        if (blob) {
          setPageBlobUrl(URL.createObjectURL(blob));
        }
      } else {
        setPageBlobUrl(currentPage?.imageUrl || null);
      }
    };
    loadBlob();
    return () => {
      if (pageBlobUrl && pageBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pageBlobUrl);
      }
    };
  }, [currentPage]);

  // Canvas drawing setup & clear
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Resize canvas to container
  useEffect(() => {
    if (canvasRef.current && documentContainerRef.current) {
      const rect = documentContainerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = Math.max(600, rect.height);
    }
  }, [safePageIndex, currentPage, isPenActive, zoomLevel, showToolsOverlay, isImmersiveMode]);

  // Handle Freehand Pen Drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPenActive || !canvasRef.current) return;
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isPenActive || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleStartEditBlock = (block: TextBlock) => {
    setEditingBlockId(block.id);
    setEditText(block.text);
  };

  const handleSaveEditBlock = (blockId: string) => {
    if (currentPage && editText.trim()) {
      updatePageBlock(file.id, currentPage.id, blockId, editText.trim());
    }
    setEditingBlockId(null);
  };

  const handleBlockClick = (block: TextBlock) => {
    if (editingBlockId === block.id || isPenActive) return;

    if (activeHighlighter === 'eraser') {
      if (currentPage) {
        deleteBlockHighlight(file.id, currentPage.id, block.id);
      }
    } else if (activeHighlighter) {
      if (currentPage) {
        const nextType = block.highlightType === activeHighlighter ? null : activeHighlighter;
        updatePageBlock(file.id, currentPage.id, block.id, block.text, nextType);
      }
    } else {
      handleStartEditBlock(block);
    }
  };

  const handleAddBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockText.trim() || !currentPage) return;
    addBlockToPage(
      file.id,
      currentPage.id,
      newBlockText.trim(),
      newBlockType,
      activeHighlighter && activeHighlighter !== 'eraser' ? activeHighlighter : null
    );
    setNewBlockText('');
    setShowAddBlockInput(false);
  };

  const handleAddStickyNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStickyText.trim() || !currentPage) return;

    const newNote: StickyNoteItem = {
      id: `sticky_${Date.now()}`,
      text: newStickyText.trim(),
      xPercent: 20 + Math.random() * 40,
      yPercent: 20 + Math.random() * 40,
      colorHex: penColor || '#FFD700',
    };

    setStickyNotes((prev) => ({
      ...prev,
      [currentPage.id]: [...(prev[currentPage.id] || []), newNote],
    }));

    setNewStickyText('');
    setShowAddStickyModal(false);
  };

  // Gallery File Upload inside Studio
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files ? Array.from(e.target.files) : [];
    if (filesList.length === 0) return;

    filesList.forEach((uploadedFile) => {
      const fileName = uploadedFile.name.replace(/\.[^/.]+$/, '');
      const ext = uploadedFile.name.split('.').pop()?.toLowerCase() || '';
      const mime = uploadedFile.type.toLowerCase();

      const isVid = mime.startsWith('video/') || ['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext);
      const isPdf = mime.includes('pdf') || ext === 'pdf';

      const reader = new FileReader();

      reader.onload = async (evt) => {
        const result = evt.target?.result as string;
        if (!result) return;

        if (isPdf) {
          setIsProcessingPdf(true);
          try {
            const extracted = await convertPdfToImages(result);
            if (extracted.length > 0) {
              extracted.forEach((p) => {
                attachImagePageToFile(
                  file.id,
                  `${fileName} - P${p.pageNumber}`,
                  p.dataUrl,
                  'pdf_page'
                );
              });
              setCurrentPageIndex(file.pages.length);
            } else {
              attachImagePageToFile(file.id, fileName, result, 'pdf_file');
              setCurrentPageIndex(file.pages.length);
            }
          } catch (err) {
            attachImagePageToFile(file.id, fileName, result, 'pdf_file');
          } finally {
            setIsProcessingPdf(false);
          }
        } else {
          const notes = isVid ? 'video_file' : undefined;
          attachImagePageToFile(file.id, fileName, result, notes);
          setCurrentPageIndex(file.pages.length);
        }
      };

      reader.readAsDataURL(uploadedFile);
    });

    if (e.target) e.target.value = '';
  };

  const handleAddSinglePage = () => {
    addBlankPageToFile(file.id);
    setCurrentPageIndex(pages.length);
  };

  const handleAddMultiplePages = (count: number) => {
    addMultipleBlankPagesToFile(file.id, count);
    setCurrentPageIndex(pages.length);
    setShowAddPagesModal(false);
  };

  const isVideoPage =
    currentPage?.notes === 'video_file' ||
    (currentPage?.imageUrl && currentPage.imageUrl.startsWith('data:video/'));

  const isPdfFilePage =
    currentPage?.notes === 'pdf_file' ||
    (currentPage?.imageUrl &&
      (currentPage.imageUrl.startsWith('data:application/pdf') ||
       currentPage.imageUrl.includes('application/pdf')));

  return (
    <div className="fixed inset-0 z-50 bg-[#090704] flex overflow-hidden select-none font-sans">
      {/* 1. Left Thumbnail Sidebar */}
      <div className="w-48 bg-[#120F0A] border-r border-[#D4AF37]/30 flex flex-col overflow-y-auto shrink-0">
        <div className="p-3 font-cinzel text-xs font-bold text-[#FFF3BE] border-b border-[#D4AF37]/20">
          Pages ({pages.length})
        </div>
        {pages.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setCurrentPageIndex(idx)}
            className={`p-2 border-b border-[#1A150D] ${idx === safePageIndex ? 'bg-[#261F13]' : 'hover:bg-[#1C1710]'}`}
          >
            {p.imageUrl && <img src={p.imageUrl} alt={`Page ${p.pageNumber}`} className="w-full h-auto rounded" />}
            <span className="text-[10px] text-[#7A705E] block mt-1">Page {p.pageNumber}</span>
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full relative">
      {/* FLOATING TOP ACTION BAR (MINIMAL, ZERO CLUTTER) */}
      <div
        className={`px-3 sm:px-5 py-2.5 bg-[#120F0A]/90 backdrop-blur-md border-b border-[#D4AF37]/30 flex items-center justify-between shrink-0 z-40 transition-all ${
          isImmersiveMode ? 'hidden sm:flex' : 'flex'
        }`}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          {/* Main Toggle Button for Xodo Tools Overlay */}
          <button
            onClick={() => setShowToolsOverlay(!showToolsOverlay)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer border ${
              showToolsOverlay
                ? 'bg-[#FFDF00] text-black border-white shadow-[0_0_15px_rgba(255,223,0,0.6)]'
                : 'bg-[#221B10] border-[#D4AF37] text-[#FFF2B2] hover:bg-[#2F2415]'
            }`}
            title="Toggle Xodo Highlighters, Pen & Tools"
          >
            <Wrench className="w-4 h-4 text-[#D4AF37]" />
            <span>{showToolsOverlay ? '🛠️ Hide Tools' : '🛠️ Xodo Tools'}</span>
          </button>

          <div className="flex items-center space-x-2 truncate">
            <span className="font-cinzel text-xs sm:text-sm font-bold text-[#FFF3BE] truncate max-w-xs sm:max-w-md">
              {file.title}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1710] border border-[#D4AF37]/30 text-[#D4AF37]">
              P{safePageIndex + 1}/{Math.max(1, pages.length)}
            </span>
          </div>
        </div>

        {/* Top Right Quick Buttons */}
        <div className="flex items-center space-x-2">
          {/* Zoom Level */}
          <div className="hidden md:flex items-center bg-[#1A150D] border border-[#D4AF37]/30 rounded-xl px-2 py-1 text-xs text-[#FFF2B2] space-x-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
              className="p-1 hover:text-[#D4AF37] cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] min-w-[36px] text-center font-bold">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(250, z + 25))}
              className="p-1 hover:text-[#D4AF37] cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Full Screen Immersive Reading Mode */}
          <button
            onClick={() => setIsImmersiveMode(!isImmersiveMode)}
            className={`p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
              isImmersiveMode
                ? 'bg-amber-950 border-amber-500 text-amber-200'
                : 'bg-[#18140D] border-[#D4AF37]/30 text-[#8C8069] hover:text-white'
            }`}
            title="Toggle 100% Fullscreen Immersive Reading Mode"
          >
            {isImmersiveMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Hidden Gallery File Upload Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,application/pdf,.pdf,.doc,.docx,.txt"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FFDF00] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs hover:opacity-95 transition-all cursor-pointer shadow-md"
            title="Attach photo, video, or PDF directly from device gallery"
          >
            <Upload className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">📱 Upload</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8C8069] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* FLOATING TOP CORNER BUTTON WHEN IN IMMERSIVE / MOBILE FULLSCREEN MODE */}
      {isImmersiveMode && (
        <div className="fixed top-3 right-3 z-50 flex items-center space-x-2 bg-black/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#D4AF37]/60 shadow-2xl">
          <button
            onClick={() => setShowToolsOverlay(!showToolsOverlay)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FFDF00] to-[#D4AF37] text-black font-extrabold text-xs shadow-md cursor-pointer flex items-center space-x-1"
          >
            <Wrench className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Tools</span>
          </button>
          <button
            onClick={() => setIsImmersiveMode(false)}
            className="p-1.5 rounded-xl bg-[#1C1710] text-[#D4AF37] hover:text-white border border-[#D4AF37]/40 cursor-pointer"
            title="Exit Immersive Mode"
          >
            <Minimize className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-red-950/80 text-red-200 hover:text-white border border-red-500/40 cursor-pointer"
            title="Close PDF"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* XODO TOOLS FLOATING OVERLAY PANEL (DOES NOT SQUEEZE PDF HORIZONTALLY!) */}
      {showToolsOverlay && (
        <div className="absolute top-14 left-3 sm:left-6 z-50 w-72 max-w-[90vw] p-4 rounded-2xl bg-[#120F0A] border-2 border-[#D4AF37] shadow-[0_20px_60px_rgba(0,0,0,0.95)] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
            <span className="font-cinzel text-xs font-bold text-[#FFF3BE] uppercase tracking-wider flex items-center space-x-1.5">
              <Wrench className="w-4 h-4 text-[#D4AF37]" />
              <span>Xodo Annotation Toolbar</span>
            </span>
            <button
              onClick={() => setShowToolsOverlay(false)}
              className="text-[#8C8069] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Freehand Pen Tool */}
          <div className="space-y-2">
            <button
              onClick={() => {
                setIsPenActive(!isPenActive);
                if (!isPenActive) setActiveHighlighter(null);
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer border ${
                isPenActive
                  ? 'bg-[#FFD700] text-black border-white shadow-[0_0_15px_rgba(255,215,0,0.6)]'
                  : 'bg-[#1D170E] border-[#D4AF37]/40 text-[#FFF2B2] hover:border-[#D4AF37]'
              }`}
            >
              <span className="flex items-center space-x-2">
                <PenTool className="w-4 h-4" />
                <span>✏️ Freehand Pen Tool</span>
              </span>
              <span className="text-[10px] font-mono">{isPenActive ? 'ON' : 'OFF'}</span>
            </button>

            {isPenActive && (
              <div className="p-2 rounded-xl bg-[#17130B] border border-[#D4AF37]/30 space-y-2">
                <div className="text-[10px] text-[#A89878] font-semibold">Pen Color:</div>
                <div className="flex items-center space-x-2">
                  {['#FFD700', '#EF4444', '#10B981', '#3B82F6', '#FFFFFF'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setPenColor(color)}
                      className={`w-5 h-5 rounded-full border cursor-pointer ${
                        penColor === color ? 'scale-125 border-white ring-2 ring-white' : 'border-black'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="w-full py-1 rounded-lg bg-red-950 text-red-200 border border-red-500/40 text-[10px] font-semibold cursor-pointer text-center"
                >
                  🧹 Clear Pen Canvas
                </button>
              </div>
            )}
          </div>

          {/* 5 Highlighters */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#8C8069] uppercase tracking-wider block">
              Highlighters (5 Colors):
            </span>

            {HIGHLIGHTER_LIST.map((hl) => {
              const isSelected = !isPenActive && activeHighlighter === hl.type;
              return (
                <button
                  key={hl.type}
                  onClick={() => {
                    setIsPenActive(false);
                    setActiveHighlighter(isSelected ? null : hl.type);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer border ${
                    isSelected
                      ? `${hl.bgClass} ${hl.borderClass} ${hl.textClass} shadow-md scale-[1.02]`
                      : 'bg-[#16120B] border-transparent text-[#8C8069] hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <span>{hl.icon}</span>
                    <span>{hl.label}</span>
                  </span>
                  <span className="text-[9px] opacity-75 font-mono">{hl.urduName}</span>
                </button>
              );
            })}

            {/* Eraser */}
            <button
              onClick={() => {
                setIsPenActive(false);
                setActiveHighlighter(activeHighlighter === 'eraser' ? null : 'eraser');
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer border ${
                !isPenActive && activeHighlighter === 'eraser'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                  : 'bg-[#16120B] border-transparent text-[#8C8069] hover:text-white'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Eraser Tool</span>
            </button>
          </div>

          {/* Sticky Notes & Text Adders */}
          <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center space-x-2">
            <button
              onClick={() => setShowAddStickyModal(true)}
              className="flex-1 py-1.5 rounded-xl bg-[#1F190F] border border-[#D4AF37]/40 text-[#FFF2B2] text-xs font-semibold hover:border-[#D4AF37] cursor-pointer"
            >
              📌 Sticky Note
            </button>
            <button
              onClick={() => setShowAddBlockInput(true)}
              className="flex-1 py-1.5 rounded-xl bg-[#1F190F] border border-[#D4AF37]/40 text-[#FFF2B2] text-xs font-semibold hover:border-[#D4AF37] cursor-pointer"
            >
              📝 + Formula Note
            </button>
          </div>
        </div>
      )}

      {/* MAIN 100% FULL-VIEWPORT PDF & DOCUMENT CANVAS */}
      <div
        ref={documentContainerRef}
        className="flex-1 w-full h-full relative overflow-auto p-2 sm:p-4 flex flex-col items-center justify-start bg-black"
      >
        {/* Xodo Freehand Drawing Overlay Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`absolute inset-0 z-30 ${
            isPenActive ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
          }`}
        />

        {/* Sticky Notes Overlay */}
        {currentPage && stickyNotes[currentPage.id]?.map((note) => (
          <div
            key={note.id}
            style={{ left: `${note.xPercent}%`, top: `${note.yPercent}%` }}
            className="absolute z-40 p-3 rounded-xl bg-[#2B210F] border-2 border-[#D4AF37] text-[#FFF3BE] shadow-[0_10px_30px_rgba(0,0,0,0.9)] max-w-xs space-y-1 text-xs"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37] border-b border-[#D4AF37]/20 pb-1">
              <span>📌 STICKY NOTE</span>
              <button
                onClick={() =>
                  setStickyNotes((prev) => ({
                    ...prev,
                    [currentPage.id]: prev[currentPage.id].filter((n) => n.id !== note.id),
                  }))
                }
                className="hover:text-red-400 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="font-serif leading-snug">{note.text}</p>
          </div>
        ))}

        {/* PDF Processing Indicator */}
        {isProcessingPdf && (
          <div className="my-auto text-center space-y-3 z-20">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-cinzel text-sm font-bold text-[#FFF3BE]">
              Extracting PDF Pages with PDF.js...
            </p>
            <p className="text-xs text-[#8C8069]">Converting PDF to high-resolution mobile pages</p>
          </div>
        )}

        {/* DOCUMENT PAGE RENDERER */}
        {!isProcessingPdf && currentPage ? (
          <div
            className="w-full h-full flex flex-col items-center justify-start transition-transform duration-200 my-auto"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* 1. EXTRACTED Crisp PDF Image Page OR Attached Gallery Image */}
            {pageBlobUrl ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                {isPdfFilePage ? (
                  /* Full efficiency PDF Viewer with direct open button */
                  <div className="w-full flex-1 flex flex-col items-center justify-start space-y-2">
                    <div className="w-full flex items-center justify-between px-3 py-2 bg-[#1A150D] rounded-xl border border-[#D4AF37]/40 text-xs">
                      <span className="font-semibold text-[#FFF2B2]">
                        📄 {file.title} (PDF Document)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          window.open(pageBlobUrl, '_blank');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FFDF00] to-[#D4AF37] text-black font-extrabold shadow-md hover:opacity-95 cursor-pointer flex items-center space-x-1"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Open PDF Fullscreen ↗</span>
                      </button>
                    </div>

                    <div className="w-full flex-1 min-h-[80vh] rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-[#12100C]">
                      <iframe
                        src={pageBlobUrl}
                        className="w-full h-full min-h-[80vh] border-0 rounded-2xl"
                        title={currentPage.title}
                      />
                    </div>
                  </div>
                ) : isVideoPage ? (
                  <video
                    controls
                    autoPlay={false}
                    src={pageBlobUrl}
                    className="w-full max-h-[88vh] rounded-xl object-contain bg-black mx-auto shadow-2xl"
                  />
                ) : (
                  /* 100% Crisp PDF Page Rendered Image */
                  <img
                    src={pageBlobUrl}
                    alt={currentPage.title}
                    className="max-w-full max-h-[92vh] object-contain mx-auto rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] border border-[#D4AF37]/30"
                  />
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* FLOATING BOTTOM PAGINATION BAR */}
      <div
        className={`px-4 py-2 bg-[#120F0A]/90 backdrop-blur-md border-t border-[#D4AF37]/30 flex items-center justify-between shrink-0 z-40 text-xs transition-all ${
          isImmersiveMode ? 'hidden sm:flex' : 'flex'
        }`}
      >
        <button
          onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
          disabled={safePageIndex === 0}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#18140D] border border-[#D4AF37]/30 text-[#FFF2B2] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-[#221B12]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 max-w-xs sm:max-w-lg">
          {pages.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentPageIndex(idx)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                idx === safePageIndex
                  ? 'bg-[#FFDF00] text-black font-extrabold shadow-[0_0_10px_rgba(255,223,0,0.5)] scale-105'
                  : 'bg-[#18140D] text-[#7A705E] border border-transparent hover:text-[#C7B58B]'
              }`}
            >
              P{p.pageNumber}
            </button>
          ))}

          <button
            onClick={handleAddSinglePage}
            className="px-2 py-1 rounded-lg bg-[#221B10] border border-dashed border-[#D4AF37] text-[#D4AF37] text-xs font-bold hover:bg-[#2D2315] cursor-pointer"
            title="Add blank page"
          >
            + Page
          </button>
        </div>

        <button
          onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
          disabled={safePageIndex >= pages.length - 1}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#18140D] border border-[#D4AF37]/30 text-[#FFF2B2] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-[#221B12]"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* BULK ADD PAGES MODAL */}
      {showAddPagesModal && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#14110A] border border-[#D4AF37]/70 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="font-cinzel text-sm font-bold text-[#FFF3BE]">
                  Add Multiple Blank Pages
                </h4>
              </div>
              <button
                onClick={() => setShowAddPagesModal(false)}
                className="text-[#8C8069] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleAddMultiplePages(num)}
                  className="py-2 rounded-xl bg-[#1F190F] border border-[#D4AF37]/40 text-[#FFF2B2] font-semibold text-xs hover:bg-[#D4AF37] hover:text-black cursor-pointer text-center"
                >
                  +{num} Pages
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD STICKY NOTE MODAL */}
      {showAddStickyModal && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#14110A] border border-[#D4AF37]/70 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
              <div className="flex items-center space-x-2">
                <StickyNote className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="font-cinzel text-sm font-bold text-[#FFF3BE]">
                  Add Xodo Sticky Note Pin
                </h4>
              </div>
              <button
                onClick={() => setShowAddStickyModal(false)}
                className="text-[#8C8069] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStickyNoteSubmit} className="space-y-3 text-xs">
              <textarea
                rows={3}
                required
                autoFocus
                placeholder="Type sticky note comment or exam reminder..."
                value={newStickyText}
                onChange={(e) => setNewStickyText(e.target.value)}
                className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl p-2.5 text-[#FFF2B2] focus:outline-none"
              />

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStickyModal(false)}
                  className="px-3 py-1.5 text-[#8C8069]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs"
                >
                  Pin Note 📌
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD FORMULA / NOTE BLOCK MODAL */}
      {showAddBlockInput && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14110A] border border-[#D4AF37]/70 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="font-cinzel text-sm font-bold text-[#FFF3BE]">
                  Add Text Note or Formula Box
                </h4>
              </div>
              <button
                onClick={() => setShowAddBlockInput(false)}
                className="text-[#8C8069] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBlockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">Block Format</label>
                <select
                  value={newBlockType}
                  onChange={(e) => setNewBlockType(e.target.value as TextBlock['type'])}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2]"
                >
                  <option value="paragraph">Standard Paragraph</option>
                  <option value="heading">Section Heading</option>
                  <option value="bullet">Bullet Point</option>
                  <option value="formula">Formula / Reaction Box</option>
                </select>
              </div>

              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">Note Content</label>
                <textarea
                  rows={4}
                  required
                  autoFocus
                  placeholder="Type formulas, notes, or exam points..."
                  value={newBlockText}
                  onChange={(e) => setNewBlockText(e.target.value)}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl p-2.5 text-[#FFF2B2] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBlockInput(false)}
                  className="px-3 py-1.5 text-[#8C8069]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs"
                >
                  Add to Page 📝
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div> {/* End Main Container */}
    </div>
  );
};
