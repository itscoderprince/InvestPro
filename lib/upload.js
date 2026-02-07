import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];

// Ensure upload directory exists
async function ensureDir(dirPath) {
    try {
        await mkdir(dirPath, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') throw error;
    }
}

// Validate file type and size
function validateFile(file) {
    if (!file) {
        return { valid: false, message: 'No file provided' };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, message: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, message: 'Invalid file type. Only JPG, PNG, PDF allowed' };
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return { valid: false, message: 'Invalid file extension' };
    }

    return { valid: true };
}

// Upload single file
export async function uploadFile(file, folder = 'general') {
    try {
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
            throw new Error(validation.message);
        }

        // Read file data
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const ext = path.extname(file.name).toLowerCase();
        const filename = `${nanoid()}-${Date.now()}${ext}`;
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', folder);
        const filePath = path.join(uploadPath, filename);

        // Ensure directory exists
        await ensureDir(uploadPath);

        // Write file
        await writeFile(filePath, buffer);

        // Return public URL
        return {
            success: true,
            url: `/uploads/${folder}/${filename}`,
            filename,
            originalName: file.name,
            size: file.size,
            type: file.type
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Upload multiple files
export async function uploadMultipleFiles(files, folder = 'general') {
    const results = [];
    const errors = [];

    for (const file of files) {
        const result = await uploadFile(file, folder);
        if (result.success) {
            results.push(result);
        } else {
            errors.push({ file: file.name, error: result.error });
        }
    }

    return {
        success: errors.length === 0,
        uploaded: results,
        errors
    };
}

// Delete file
export async function deleteFile(filePath) {
    try {
        // Remove leading slash and construct full path
        const relativePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
        const fullPath = path.join(process.cwd(), 'public', relativePath);

        await unlink(fullPath);
        return { success: true };
    } catch (error) {
        console.error('File deletion error:', error);
        return { success: false, error: error.message };
    }
}

// Get file info
export function getFileInfo(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    const isPDF = ext === '.pdf';

    return {
        extension: ext,
        isImage,
        isPDF,
        isDocument: isPDF,
        mimeType: isImage ? `image/${ext.slice(1)}` : (isPDF ? 'application/pdf' : 'application/octet-stream')
    };
}

// Upload KYC documents (Aadhar and PAN)
export async function uploadKYCDocuments(aadharFile, panFile) {
    const results = {
        aadhar: null,
        pan: null,
        errors: []
    };

    // Upload Aadhar
    if (aadharFile) {
        const aadharResult = await uploadFile(aadharFile, 'kyc/aadhar');
        if (aadharResult.success) {
            results.aadhar = aadharResult;
        } else {
            results.errors.push({ document: 'aadhar', error: aadharResult.error });
        }
    } else {
        results.errors.push({ document: 'aadhar', error: 'Aadhar document is required' });
    }

    // Upload PAN
    if (panFile) {
        const panResult = await uploadFile(panFile, 'kyc/pan');
        if (panResult.success) {
            results.pan = panResult;
        } else {
            results.errors.push({ document: 'pan', error: panResult.error });
        }
    } else {
        results.errors.push({ document: 'pan', error: 'PAN document is required' });
    }

    results.success = results.errors.length === 0;
    return results;
}

// Upload payment proof
export async function uploadPaymentProof(file) {
    return await uploadFile(file, 'payments');
}
