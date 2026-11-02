import React, { useState, useMemo, useRef } from 'react';
import {
  Folder,
  FolderPlus,
  FileText,
  Image as ImageIcon,
  Video,
  Plus,
  ChevronRight,
  ArrowLeft,
  Search,
  Trash2,
  Edit2,
  Sparkles,
  Layers,
  Database,
  ExternalLink,
  BookOpen,
  X,
  FileUp,
  Upload,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { VaultCategory, VaultFolder, VaultFile, SubjectId } from '../types';
import { convertPdfToImages } from '../utils/pdfRenderer';
import { saveBlob } from '../utils/blobStorage';
import { XodoViewer } from './XodoViewer';

export const MultiPdfLibraryView: React.FC<{ onNavigateToStudy: () => void }> = ({
  onNavigateToStudy,
}) => {
  const {
    folders,
    vaultFiles,
    subjects,
    addFolder,
    deleteFolder,
    renameFolder,
    addVaultFile,
    deleteVaultFile,
  } = useStudy();

  const [activeCategory, setActiveCategory] = useState<VaultCategory>('pdf');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFilterCategory, setSearchFilterCategory] = useState<'all' | VaultCategory>('all');
  const [activeStudioFileId, setActiveStudioFileId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);

  // New Folder Modal
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newFolderSubjectId, setNewFolderSubjectId] = useState<SubjectId>('bio');

  // New File Modal
  const [showNewFileModal, setShowNewFileModal] = useState<boolean>(false);
  const [newFileTitle, setNewFileTitle] = useState<string>('');
  const [newFileSubjectId, setNewFileSubjectId] = useState<SubjectId>('bio');
  const [newFilePages, setNewFilePages] = useState<number>(3);
  const [newFileTags, setNewFileTags] = useState<string>('Exam Core, Notes');

  // Bulletproof Gallery File Upload (Photos, Videos, PDFs - Multiple File Support)
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files ? Array.from(e.target.files) : [];
    if (filesList.length === 0) return;

    setIsUploading(true);
    const targetFolderId = currentFolderId || 'root';

    for (const uploadedFile of filesList) {
      const fileName = uploadedFile.name.replace(/\.[^/.]+$/, '');
      const ext = uploadedFile.name.split('.').pop()?.toLowerCase() || '';
      const fileSizeKb = Math.round(uploadedFile.size / 1024);
      const isImg = uploadedFile.type.startsWith('image/');
      const isVid = uploadedFile.type.startsWith('video/');
      const isPdf = uploadedFile.type.includes('pdf') || ext === 'pdf';

      let cat: VaultCategory = 'pdf';
      if (isImg) cat = 'images';
      else if (isVid) cat = 'lectures';
      else if (isPdf) cat = 'pdf';

      let filePages: DocumentPage[] = [];

      if (isPdf) {
        const extracted = await convertPdfToImages(uploadedFile);
        filePages = extracted.map((p) => {
            const blobKey = `blob_${Date.now()}_${p.pageNumber}`;
            // Convert dataUrl to blob to save to blobStorage
            // This is a bit inefficient, but it solves the base64 problem for storage
            // In a real app, I'd convert the dataURL directly to Blob when rendering, 
            // but this is the minimal change for now.
            // Actually, let's just create a blob here
            const blob = new Blob([p.dataUrl], { type: 'image/png' }); 
            saveBlob(blobKey, blob);
            return {
                id: `p_${Date.now()}_${p.pageNumber}`,
                pageNumber: p.pageNumber,
                type: 'image' as const,
                title: `${fileName} - Page ${p.pageNumber}`,
                blobKey: blobKey,
                notes: 'pdf_page',
                blocks: [{
                    id: `b_${Date.now()}_${p.pageNumber}_1`,
                    type: 'paragraph' as const,
                    text: `PDF Page ${p.pageNumber} of ${extracted.length}`,
                }],
            };
        });
      } else {
        const blobKey = `blob_${Date.now()}`;
        saveBlob(blobKey, uploadedFile);
        filePages = [{
          id: `p_${Date.now()}`,
          pageNumber: 1,
          type: 'image' as const,
          title: fileName,
          blobKey: blobKey,
          notes: isPdf ? 'pdf_file' : isVid ? 'video_file' : undefined,
          blocks: [{
            id: `b_${Date.now()}_1`,
            type: 'paragraph' as const,
            text: `Attached File: ${uploadedFile.name}`,
          }],
        }];
      }

      const newFile = addVaultFile({
        folderId: targetFolderId,
        category: cat,
        title: fileName,
        subjectId: currentFolder?.subjectId || newFileSubjectId,
        totalPages: filePages.length,
        fileSizeKb,
        tags: ['Gallery Asset', isPdf ? 'PDF' : isVid ? 'Video' : 'Photo'],
        pages: filePages,
      });

      setActiveCategory(cat);
      setActiveStudioFileId(newFile.id);
    }
    setShowNewFileModal(false);
    setIsUploading(false);

    if (e.target) {
      e.target.value = '';
    }
  };

  // Find current folder
  const currentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return folders.find((f) => f.id === currentFolderId) || null;
  }, [folders, currentFolderId]);

  // Compute breadcrumbs path
  const breadcrumbs = useMemo(() => {
    const path: VaultFolder[] = [];
    let curr = currentFolder;
    while (curr) {
      path.unshift(curr);
      if (curr.parentId) {
        curr = folders.find((f) => f.id === curr?.parentId) || null;
      } else {
        curr = null;
      }
    }
    return path;
  }, [folders, currentFolder]);

  // Folders in current view
  const visibleFolders = useMemo(() => {
    return folders.filter((f) => {
      if (f.category !== activeCategory) return false;
      if (currentFolderId === null) {
        return f.parentId === null;
      }
      return f.parentId === currentFolderId;
    });
  }, [folders, activeCategory, currentFolderId]);

  // Files in current view
  const visibleFiles = useMemo(() => {
    return vaultFiles.filter((file) => {
      if (file.category !== activeCategory) return false;
      if (currentFolderId === null) {
        // If at root, only show files that don't belong to a subfolder
        return !file.folderId || file.folderId === 'root';
      }
      return file.folderId === currentFolderId;
    });
  }, [vaultFiles, activeCategory, currentFolderId]);

  // UNIVERSAL TOP-TO-BOTTOM SEARCH Across PDFs, Images & Videos
  const universalSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const allMatches = vaultFiles.filter((f) => {
      const titleMatch = f.title.toLowerCase().includes(q);
      const tagMatch = f.tags.some((t) => t.toLowerCase().includes(q));
      const subjectMatch = f.subjectId?.toLowerCase().includes(q);
      const textMatch = f.pages.some((p) =>
        p.title.toLowerCase().includes(q) ||
        p.blocks.some((b) => b.text.toLowerCase().includes(q))
      );
      return titleMatch || tagMatch || subjectMatch || textMatch;
    });

    const pdfs = allMatches.filter((f) => f.category === 'pdf');
    const images = allMatches.filter((f) => f.category === 'images');
    const lectures = allMatches.filter((f) => f.category === 'lectures');

    return {
      all: allMatches,
      pdfs,
      images,
      lectures,
      totalCount: allMatches.length,
    };
  }, [vaultFiles, searchQuery]);

  // Handle Create Folder Submit
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    addFolder(
      newFolderName.trim(),
      currentFolderId,
      activeCategory,
      currentFolder?.subjectId || newFolderSubjectId
    );

    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  // Handle Create File Submit
  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileTitle.trim()) return;

    const tags = newFileTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const targetFolderId = currentFolderId || 'root';

    const newFile = addVaultFile({
      folderId: targetFolderId,
      category: activeCategory,
      title: newFileTitle.trim(),
      subjectId: currentFolder?.subjectId || newFileSubjectId,
      totalPages: Math.max(1, newFilePages),
      fileSizeKb: Math.round(newFilePages * 65),
      tags: tags.length > 0 ? tags : ['Study Vault'],
      pages: Array.from({ length: Math.max(1, newFilePages) }, (_, idx) => ({
        id: `p_${Date.now()}_${idx + 1}`,
        pageNumber: idx + 1,
        type: 'text',
        title: `${newFileTitle.trim()} - Page ${idx + 1}`,
        blocks: [
          {
            id: `b_${Date.now()}_${idx + 1}_1`,
            type: 'heading',
            text: `Chapter Topic ${idx + 1}: Key Notes & Derivations`,
            highlightType: 'important',
          },
          {
            id: `b_${Date.now()}_${idx + 1}_2`,
            type: 'paragraph',
            text: 'Click here to write study points. Use the 5 highlighters (Ratta, Mistakes, Weak, Important, Doubts) above.',
          },
        ],
      })),
    });

    setNewFileTitle('');
    setShowNewFileModal(false);
    setActiveStudioFileId(newFile.id); // open newly created file immediately
  };

  // Category counts
  const pdfCount = vaultFiles.filter((f) => f.category === 'pdf').length;
  const imgCount = vaultFiles.filter((f) => f.category === 'images').length;
  const lecCount = vaultFiles.filter((f) => f.category === 'lectures').length;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-6 pb-28">
      {/* Top Banner: Multi-PDF Library & Vault File Manager */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1A160F] via-[#120F0A] to-[#0A0906] border border-[#D4AF37]/50 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
              <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>VERSATILITY FILE MANAGER & REVISION VAULT</span>
            </div>
            <h2 className="text-xl md:text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C6] via-[#D4AF37] to-[#AA771C] mt-1">
              Multi-PDF Library & Deep Vault
            </h2>
            <p className="text-xs text-[#9E927A] mt-0.5">
              Folders inside folders (up to 500+ items capacity) • Top-to-Bottom Search for PDFs, Images & Videos
            </p>
          </div>

          {/* Hidden File Picker for Gallery Attachments (Multiple Files Allowed) */}
          <input
            ref={galleryInputRef}
            type="file"
            multiple
            accept="image/*,video/*,application/pdf,.pdf,.doc,.docx,.txt"
            onChange={handleGalleryFileUpload}
            className="hidden"
          />

          {/* YELLOW BUTTONS REQUESTED BY USER */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFDF00] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.6)] cursor-pointer ring-2 ring-white/50"
              title="Attach photos, videos, or PDFs directly from phone/device gallery"
            >
              <Upload className="w-4 h-4 text-black stroke-[3]" />
              <span>📱 Upload from Gallery</span>
            </button>

            <button
              onClick={() => setShowNewFolderModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#221B10] border border-[#D4AF37] text-[#FFF2B2] font-semibold text-xs tracking-wider uppercase hover:bg-[#2B2215] transition-all cursor-pointer"
              title="Create a new folder or subfolder inside current directory"
            >
              <FolderPlus className="w-4 h-4 text-[#D4AF37]" />
              <span>+ New Folder</span>
            </button>

            <button
              onClick={() => setShowNewFileModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#221B10] border border-[#D4AF37] text-[#FFF2B2] font-semibold text-xs tracking-wider uppercase hover:bg-[#2B2215] transition-all cursor-pointer"
              title="Create a new blank PDF, study document, or note"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>+ Create Blank PDF</span>
            </button>
          </div>
        </div>

        {/* 3 Vault Categories: PDF Library, Images Vault, Lectures Vault */}
        <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setActiveCategory('pdf');
                setCurrentFolderId(null);
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer border ${
                activeCategory === 'pdf'
                  ? 'bg-[#261F13] border-[#D4AF37] text-[#FFF2B2] shadow-[0_0_12px_rgba(212,175,55,0.3)] font-semibold'
                  : 'bg-[#14110A] border-[#D4AF37]/20 text-[#8C8069] hover:text-[#C7B58B]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>PDF Library ({pdfCount} / 500)</span>
            </button>

            <button
              onClick={() => {
                setActiveCategory('images');
                setCurrentFolderId(null);
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer border ${
                activeCategory === 'images'
                  ? 'bg-[#261F13] border-[#D4AF37] text-[#FFF2B2] shadow-[0_0_12px_rgba(212,175,55,0.3)] font-semibold'
                  : 'bg-[#14110A] border-[#D4AF37]/20 text-[#8C8069] hover:text-[#C7B58B]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Images Vault ({imgCount})</span>
            </button>

            <button
              onClick={() => {
                setActiveCategory('lectures');
                setCurrentFolderId(null);
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer border ${
                activeCategory === 'lectures'
                  ? 'bg-[#261F13] border-[#D4AF37] text-[#FFF2B2] shadow-[0_0_12px_rgba(212,175,55,0.3)] font-semibold'
                  : 'bg-[#14110A] border-[#D4AF37]/20 text-[#8C8069] hover:text-[#C7B58B]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Lectures Vault ({lecCount})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder='Search topics e.g. "Bone", "Support", "Krebs"...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#14110A] border-2 border-[#D4AF37]/40 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#FFF2B2] placeholder-[#7A705E] focus:outline-none focus:border-[#D4AF37] shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8C8069] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DRAG & DROP / TAP TO BROWSE UPLOAD ZONE */}
      <div
        onClick={() => galleryInputRef.current?.click()}
        className="rounded-2xl border-2 border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] bg-gradient-to-r from-[#1E180D] via-[#141008] to-[#0D0A05] p-4 text-center cursor-pointer hover:bg-[#221B10] transition-all shadow-md group relative"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#2B210F] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0">
            <Upload className="w-5 h-5 text-[#D4AF37] stroke-[2.5]" />
          </div>
          <div className="text-left">
            <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#FFF3BE] group-hover:text-[#D4AF37] transition-colors">
              📱 Tap Here to Upload PDFs, Photos or Videos directly from Phone Gallery
            </h4>
            <p className="text-[10px] text-[#A89878] mt-0.5">
              Select multiple files at once • Auto-saved in IndexedDB Vault • Full Interactive PDF Engine
            </p>
          </div>
        </div>
      </div>

      {/* FILE MANAGER NAVIGATION & BREADCRUMBS */}
      {!universalSearchResults && (
        <div className="rounded-xl bg-[#110E09] border border-[#D4AF37]/25 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Breadcrumb Path */}
          <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
            {currentFolderId && (
              <button
                onClick={() => {
                  if (currentFolder?.parentId) {
                    setCurrentFolderId(currentFolder.parentId);
                  } else {
                    setCurrentFolderId(null);
                  }
                }}
                className="p-1 rounded-md bg-[#1C1710] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#251E14] mr-1.5 cursor-pointer"
                title="Go up one folder level"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setCurrentFolderId(null)}
              className={`font-semibold transition-colors cursor-pointer ${
                currentFolderId === null ? 'text-[#D4AF37]' : 'text-[#8C8069] hover:text-white'
              }`}
            >
              {activeCategory === 'pdf'
                ? 'PDF Root'
                : activeCategory === 'images'
                ? 'Images Root'
                : 'Lectures Root'}
            </button>

            {breadcrumbs.map((f, idx) => (
              <React.Fragment key={f.id}>
                <ChevronRight className="w-3 h-3 text-[#5A5040] shrink-0" />
                <button
                  onClick={() => setCurrentFolderId(f.id)}
                  className={`font-semibold truncate max-w-xs transition-colors cursor-pointer ${
                    idx === breadcrumbs.length - 1
                      ? 'text-[#FFF2B2]'
                      : 'text-[#8C8069] hover:text-white'
                  }`}
                >
                  {f.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div className="text-[11px] text-[#8C8069] font-mono">
            <span>{visibleFolders.length} Folders</span>
            <span className="mx-1.5">•</span>
            <span>{visibleFiles.length} Files</span>
          </div>
        </div>
      )}

      {/* TOP-TO-BOTTOM UNIVERSAL SEARCH RESULTS VIEW (IF SEARCHING TOPICS LIKE "BONE", "SUPPORT AND MOVEMENT", ETC.) */}
      {universalSearchResults ? (
        <div className="space-y-6 rounded-2xl bg-[#120F0A] border-2 border-[#D4AF37]/50 p-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D4AF37]/30">
            <div>
              <div className="flex items-center space-x-2 text-xs font-cinzel font-bold text-[#FFF3BE]">
                <Search className="w-4 h-4 text-[#D4AF37]" />
                <span>TOP-TO-BOTTOM SEARCH RESULTS FOR "{searchQuery.toUpperCase()}"</span>
              </div>
              <p className="text-[11px] text-[#A89878] mt-0.5">
                Found {universalSearchResults.totalCount} items across PDFs, Diagrams/Images & Revision Lectures
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 text-xs">
              {[
                { key: 'all', label: `All (${universalSearchResults.totalCount})` },
                { key: 'pdf', label: `📄 PDFs (${universalSearchResults.pdfs.length})` },
                { key: 'images', label: `🖼️ Images (${universalSearchResults.images.length})` },
                { key: 'lectures', label: `🎥 Videos (${universalSearchResults.lectures.length})` },
              ].map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => setSearchFilterCategory(pill.key as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                    searchFilterCategory === pill.key
                      ? 'bg-[#D4AF37] text-black border-white shadow-md font-bold'
                      : 'bg-[#1E180D] border-[#D4AF37]/30 text-[#A89878] hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}

              <button
                onClick={() => setSearchQuery('')}
                className="px-2.5 py-1 rounded-xl text-xs text-[#8C8069] hover:text-white underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {universalSearchResults.totalCount === 0 ? (
            <div className="text-center py-12 text-[#8C8069] text-xs space-y-2">
              <Search className="w-8 h-8 text-[#D4AF37]/40 mx-auto" />
              <p>No matching PDFs, Images, or Video Lectures found for "{searchQuery}".</p>
              <p className="text-[11px]">Try searching "bone", "support", "krebs", "diagram", or "chemistry".</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* SECTION 1: 📄 PDFs & MASTER NOTES */}
              {(searchFilterCategory === 'all' || searchFilterCategory === 'pdf') &&
                universalSearchResults.pdfs.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-cinzel font-bold text-[#FFF2B2] border-b border-[#D4AF37]/20 pb-1">
                      <FileText className="w-4 h-4 text-[#D4AF37]" />
                      <span>SECTION 1: 📄 MATCHING PDFs & MASTER NOTES ({universalSearchResults.pdfs.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {universalSearchResults.pdfs.map((file) => (
                        <div
                          key={file.id}
                          onClick={() => setActiveStudioFileId(file.id)}
                          className="group rounded-2xl bg-gradient-to-b from-[#18140D] to-[#0E0C07] border border-[#D4AF37]/40 hover:border-[#D4AF37] p-4 shadow-md transition-all cursor-pointer space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2 py-0.5 rounded bg-black/60 font-mono text-[10px] text-[#D4AF37]">
                              {file.subjectId?.toUpperCase() || 'PDF'}
                            </span>
                            <span className="text-[10px] text-[#7A705E]">{file.totalPages} Pages</span>
                          </div>
                          <h4 className="font-cinzel text-sm font-bold text-[#FFF3BE] group-hover:text-[#D4AF37] transition-colors">
                            {file.title}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {file.tags.map((t, i) => (
                              <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-[#1C1710] text-[#A89878]">
                                #{t}
                              </span>
                            ))}
                          </div>
                          <div className="pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between text-[11px] text-[#D4AF37]">
                            <span>Open PDF Notes →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* SECTION 2: 🖼️ ANATOMICAL DIAGRAMS & FLOWCHARTS */}
              {(searchFilterCategory === 'all' || searchFilterCategory === 'images') &&
                universalSearchResults.images.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-cinzel font-bold text-[#FFF2B2] border-b border-[#D4AF37]/20 pb-1">
                      <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                      <span>SECTION 2: 🖼️ MATCHING DIAGRAMS, MICROGRAPHS & IMAGES ({universalSearchResults.images.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {universalSearchResults.images.map((file) => (
                        <div
                          key={file.id}
                          onClick={() => setActiveStudioFileId(file.id)}
                          className="group rounded-2xl bg-gradient-to-b from-[#18140D] to-[#0E0C07] border border-[#D4AF37]/40 hover:border-[#D4AF37] p-4 shadow-md transition-all cursor-pointer space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 font-mono text-[10px] text-emerald-300">
                              IMAGE / DIAGRAM
                            </span>
                            <span className="text-[10px] text-[#7A705E]">{file.fileSizeKb} KB</span>
                          </div>
                          <h4 className="font-cinzel text-sm font-bold text-[#FFF3BE] group-hover:text-[#D4AF37] transition-colors">
                            {file.title}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {file.tags.map((t, i) => (
                              <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-[#1C1710] text-[#A89878]">
                                #{t}
                              </span>
                            ))}
                          </div>
                          <div className="pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between text-[11px] text-[#D4AF37]">
                            <span>Inspect Image & Annotations →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* SECTION 3: 🎥 REVISION LECTURES & AUDIO WALKTHROUGHS */}
              {(searchFilterCategory === 'all' || searchFilterCategory === 'lectures') &&
                universalSearchResults.lectures.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-cinzel font-bold text-[#FFF2B2] border-b border-[#D4AF37]/20 pb-1">
                      <Video className="w-4 h-4 text-[#D4AF37]" />
                      <span>SECTION 3: 🎥 MATCHING REVISION LECTURES & AUDIO WALKTHROUGHS ({universalSearchResults.lectures.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {universalSearchResults.lectures.map((file) => (
                        <div
                          key={file.id}
                          onClick={() => setActiveStudioFileId(file.id)}
                          className="group rounded-2xl bg-gradient-to-b from-[#1C150B] to-[#0E0C07] border-2 border-[#D4AF37]/60 hover:border-[#D4AF37] p-4 shadow-md transition-all cursor-pointer space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 font-mono text-[10px] text-amber-300 font-bold flex items-center space-x-1">
                              <Play className="w-3 h-3 fill-amber-300" />
                              <span>LECTURE VIDEO</span>
                            </span>
                            <span className="text-[10px] text-[#7A705E]">{file.fileSizeKb} KB</span>
                          </div>
                          <h4 className="font-cinzel text-sm font-bold text-[#FFF3BE] group-hover:text-[#D4AF37] transition-colors">
                            {file.title}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {file.tags.map((t, i) => (
                              <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-[#1C1710] text-[#A89878]">
                                #{t}
                              </span>
                            ))}
                          </div>
                          <div className="pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between text-[11px] text-[#D4AF37]">
                            <span className="flex items-center space-x-1 font-bold">
                              <Play className="w-3 h-3 fill-[#D4AF37]" />
                              <span>Play Video Lecture →</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      ) : (
        /* STANDARD FOLDER & FILE HIERARCHY WORKBENCH */
        <div className="space-y-6">
          {/* 1. FOLDERS / SUBFOLDERS GRID */}
          {visibleFolders.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-cinzel font-bold text-[#D4AF37] uppercase tracking-wider">
                <span>Folders & Subfolders ({visibleFolders.length})</span>
                <span className="text-[10px] text-[#8C8069] font-normal font-sans">
                  Tap any folder to enter subfolder
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {visibleFolders.map((folder) => {
                  const childCount = folders.filter((f) => f.parentId === folder.id).length;
                  const fileCount = vaultFiles.filter((f) => f.folderId === folder.id).length;

                  return (
                    <div
                      key={folder.id}
                      onClick={() => setCurrentFolderId(folder.id)}
                      className="group p-3.5 rounded-xl bg-gradient-to-b from-[#18140D] to-[#0F0D08] border border-[#D4AF37]/25 hover:border-[#D4AF37] hover:bg-[#201A10] transition-all duration-200 cursor-pointer shadow-md flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-[#251E12] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-transform shrink-0">
                          <Folder className="w-5 h-5 fill-[#D4AF37]/20 text-[#D4AF37]" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-semibold text-xs text-[#FFF2B2] truncate group-hover:text-[#D4AF37] transition-colors">
                            {folder.name}
                          </h4>
                          <p className="text-[10px] text-[#7A705E] mt-0.5">
                            {childCount > 0 ? `${childCount} subfolders` : `${fileCount} items`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete folder "${folder.name}"?`)) {
                              deleteFolder(folder.id);
                            }
                          }}
                          className="p-1 text-[#5A5040] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete folder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-[#7A705E] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. FILES IN THIS FOLDER */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-cinzel font-bold text-[#D4AF37] uppercase tracking-wider">
              <span>Documents & PDFs in this Vault ({visibleFiles.length})</span>
              <button
                onClick={() => setShowNewFileModal(true)}
                className="text-[#D4AF37] hover:underline font-sans text-xs cursor-pointer flex items-center space-x-1"
              >
                <span>+ Add to this folder</span>
              </button>
            </div>

            {visibleFiles.length === 0 && visibleFolders.length === 0 ? (
              <div className="rounded-2xl bg-[#12100B] border border-[#D4AF37]/20 p-12 text-center space-y-3">
                <Folder className="w-12 h-12 text-[#D4AF37]/40 mx-auto" />
                <h4 className="font-cinzel text-base font-bold text-[#E5D7A3]">
                  Folder is Empty
                </h4>
                <p className="text-xs text-[#8C8069] max-w-sm mx-auto">
                  Click the yellow "+ New Folder" to add up to 500+ subfolders, or "+ Add PDF / Note" to create study files.
                </p>
                <div className="flex items-center justify-center space-x-2 pt-2">
                  <button
                    onClick={() => setShowNewFolderModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#1F190F] border border-[#D4AF37] text-xs font-semibold text-[#FFF2B2] hover:bg-[#2B2316] cursor-pointer"
                  >
                    + New Subfolder
                  </button>
                  <button
                    onClick={() => setShowNewFileModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs cursor-pointer"
                  >
                    + Add New PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {visibleFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => setActiveStudioFileId(file.id)}
                    className="group rounded-2xl bg-gradient-to-b from-[#16130B] to-[#0E0C07] border border-[#D4AF37]/30 hover:border-[#D4AF37] p-4 shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="px-2 py-0.5 rounded bg-black/60 border border-[#D4AF37]/30 font-mono text-[10px] text-[#D4AF37] uppercase">
                          {file.subjectId?.toUpperCase() || file.category.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-[#7A705E] font-mono">
                          {file.totalPages} Pages • {file.fileSizeKb} KB
                        </span>
                      </div>

                      <h4 className="font-cinzel text-sm font-bold text-[#FFF3BE] group-hover:text-[#D4AF37] transition-colors leading-snug">
                        {file.title}
                      </h4>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.tags.map((t, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.2 rounded bg-[#1C1710] text-[#A89878]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#D4AF37] font-semibold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                        <span>Open & Edit in Studio</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${file.title}"?`)) {
                            deleteVaultFile(file.id);
                          }
                        }}
                        className="p-1 text-[#5A5040] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW FOLDER MODAL */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14110A] border border-[#D4AF37]/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
              <div className="flex items-center space-x-2">
                <FolderPlus className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="font-cinzel text-base font-bold text-[#FFF3BE]">
                  Create New Vault Folder ({activeCategory.toUpperCase()})
                </h4>
              </div>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="text-[#8C8069] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">Folder Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Support & Movement - Chapter 14"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {!currentFolder && (
                <div>
                  <label className="block text-[#C7B58B] mb-1 font-semibold">Subject Vault</label>
                  <select
                    value={newFolderSubjectId}
                    onChange={(e) => setNewFolderSubjectId(e.target.value as SubjectId)}
                    className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <p className="text-[11px] text-[#7A705E]">
                Target Category: <span className="text-[#D4AF37] font-semibold">{activeCategory.toUpperCase()}</span> | Location:{' '}
                <span className="text-[#D4AF37] font-semibold">
                  {currentFolder ? currentFolder.name : 'Vault Root'}
                </span>
              </p>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-3 py-1.5 rounded-xl text-[#8C8069] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 cursor-pointer shadow-md"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW PDF / FILE MODAL */}
      {showNewFileModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#14110A] border border-[#D4AF37]/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="font-cinzel text-base font-bold text-[#FFF3BE]">
                  Add Document / PDF to Vault ({activeCategory.toUpperCase()})
                </h4>
              </div>
              <button
                onClick={() => setShowNewFileModal(false)}
                className="text-[#8C8069] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Upload Option */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#201A0E] to-[#141007] border border-[#D4AF37]/50 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#FFF2B2] flex items-center space-x-1.5">
                  <Upload className="w-4 h-4 text-[#D4AF37]" />
                  <span>Attach from Device Gallery</span>
                </span>
                <p className="text-[10px] text-[#A89878]">
                  Select any Photo, Lecture Video, or PDF Document from phone gallery
                </p>
              </div>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 cursor-pointer whitespace-nowrap shadow-sm"
              >
                Choose File 📁
              </button>
            </div>

            <div className="text-center text-[10px] text-[#7A705E] font-mono uppercase tracking-widest my-1">
              — OR CREATE BLANK PDF NOTEBOOK —
            </div>

            <form onSubmit={handleCreateFile} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">Document Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Support & Movement: Bone Matrix & Muscle Contraction"
                  value={newFileTitle}
                  onChange={(e) => setNewFileTitle(e.target.value)}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold flex items-center justify-between">
                  <span>Initial Number of Pages</span>
                  <span className="text-[10px] text-[#D4AF37] font-normal">Unlimited (1 to 500+ Pages)</span>
                </label>
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 5, 10, 20, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewFilePages(num)}
                      className={`flex-1 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                        newFilePages === num
                          ? 'bg-[#D4AF37] text-black font-bold border-white'
                          : 'bg-[#1C1710] text-[#A89878] border-[#D4AF37]/30 hover:text-white'
                      }`}
                    >
                      {num}p
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={newFilePages}
                      onChange={(e) => setNewFilePages(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Tags: e.g. Bone, Support"
                      value={newFileTags}
                      onChange={(e) => setNewFileTags(e.target.value)}
                      className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[#8C8069] mt-1">
                  ✨ No 3-page limitation! You can add as many pages as you want anytime inside the document studio.
                </p>
              </div>

              <p className="text-[11px] text-[#7A705E]">
                Folder Destination:{' '}
                <span className="text-[#D4AF37] font-semibold">
                  {currentFolder ? currentFolder.name : 'Root Vault'}
                </span>
              </p>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFileModal(false)}
                  className="px-3 py-1.5 rounded-xl text-[#8C8069] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 cursor-pointer shadow-md"
                >
                  Create & Launch Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT STUDIO MODAL (EDIT TEXT, INSERT BLANK PAGE, ATTACH GALLERY, 5 HIGHLIGHTERS) */}
      {activeStudioFileId && (
        <DocumentStudioModal
          fileId={activeStudioFileId}
          onClose={() => setActiveStudioFileId(null)}
        />
      )}
    </div>
  );
};
