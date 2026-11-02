# Implementation Plan - Gold Icons & Bulletproof PDF Subfolder Rendering

## User Requirements
1. **24K Gold Crowns for Panther & Wolf**: Add luxury gold crown badges/icons next to Panther Mode and Wolf Mode titles on the Dashboard and inside their 3D Flashcards modal headers.
2. **Bulletproof PDF Opening from Subfolders**: Ensure uploaded PDF files open instantly and reliably from any subfolder or library view with 100% full efficiency, using PDF.js high-resolution page extraction and reliable object/blob URL iframe rendering.

## Proposed Changes

### 1. PredatorFlashcardsModal & DashboardView (Gold Crowns)
- Add glowing 24K gold crown badges (`👑` / `⚜️`) next to Panther Mode and Wolf Mode card headers and modal titles.

### 2. MultiPdfLibraryView & DocumentStudioModal (PDF Subfolder Rendering)
- Ensure PDFs uploaded from any subfolder correctly instantiate pages using PDF.js (`convertPdfToImages`) with 100% parsing success.
- Provide direct fallback viewer and "Open PDF in New Tab / View Fullscreen" button inside `DocumentStudioModal` so users can access raw PDFs instantly if iframe restrictions apply on mobile devices.

## Verification Plan
- Compile and lint applet.
- Verify zero build errors.
