import axios from "axios";
import { REACT_APP_ADMIN_API_KEY } from "@env"; // Import from @env

/**
 * IPFS Gateway URL
 */
const GATEWAY_URL = "https://firstfltb.com/chat/gateway";

/**
 * Queue for managing uploads
 */
const uploadQueue = [];
let isProcessing = false;

/**
 * Upload a file to IPFS via the Gateway with queue support
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Callback for progress updates
 * @param {Function} onComplete - Callback when upload is complete
 * @param {Function} onError - Callback for error handling
 * @returns {Promise<string>} - The IPFS URL of the uploaded file
 */
export const uploadFileToIPFS = async (file, onProgress, onComplete, onError) => {
  if (!file) {
    throw new Error("❌ No file provided.");
  }

  // Add to queue
  const uploadTask = {
    file,
    onProgress,
    onComplete,
    onError,
    status: "pending",
    token: null,
    cid: null,
  };

  uploadQueue.push(uploadTask);


  // Process the queue if not already processing
  if (!isProcessing) {
    processQueue();
  }

  return new Promise((resolve, reject) => {
    uploadTask.resolve = resolve;
    uploadTask.reject = reject;
  });
};

/**
 * Process the upload queue
 */
const processQueue = async () => {
  if (isProcessing || uploadQueue.length === 0) return;

  isProcessing = true;
  const task = uploadQueue[0];

  try {

    // Step 1: Request an Upload Token
    const tokenResponse = await axios.post(GATEWAY_URL, {
      command: "verify",
      apiKey: REACT_APP_ADMIN_API_KEY, // Use imported key
      fileSize: task.file.size,
      filename: task.file.name,
    });

    if (!tokenResponse.data.success || !tokenResponse.data.uploadToken) {
      throw new Error(`❌ Failed to get upload token: ${tokenResponse.data.error || "Unknown error"}`);
    }

    task.token = tokenResponse.data.uploadToken;

    if (task.onProgress) task.onProgress({ status: "token_received" });

    // Step 2: Upload File with Token
    const formData = new FormData();
    formData.append("file", task.file);
    formData.append("filename", task.file.name);

    const uploadResponse = await axios.post(
      `${GATEWAY_URL}?token=${task.token}`,
      formData,
      {
        headers: {
          "X-Upload-Token": task.token,
          "X-Command": "upload",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!uploadResponse.data.success) {
      throw new Error(`❌ Upload failed: ${uploadResponse.data.error || "Unknown error"}`);
    }

    if (task.onProgress) task.onProgress({ status: "uploading" });

    // Step 3: Finalize Upload
    const finalizeResponse = await axios.post(
      `${GATEWAY_URL}?token=${task.token}`,
      { isFinalRequest: true },
      {
        headers: {
          "X-Upload-Token": task.token,
          "X-Command": "upload",
          "Content-Type": "application/json",
        },
      }
    );

    if (!finalizeResponse.data.success) {
      throw new Error("❌ Finalization failed.");
    }

    if (task.onProgress) task.onProgress({ status: "finalizing" });

    // Step 4: Poll for `upload_status` to Retrieve CID
    const CHECK_STATUS_URL = `${GATEWAY_URL}?command=upload_status&token=${task.token}`;
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
      try {
        const statusResponse = await axios.get(CHECK_STATUS_URL);
        if (statusResponse.data.success && statusResponse.data.cid) {
          task.cid = statusResponse.data.cid;
          if (task.onProgress) task.onProgress({ status: "completed" });
          if (task.onComplete) task.onComplete();
          task.resolve(`https://ipfs.phonetor.com/ipfs/${task.cid}`);
          break;
        }
      } catch (error) {
      }
    }

    if (!task.cid) {
      throw new Error("❌ Upload finalized but CID retrieval failed after multiple attempts.");
    }
  } catch (error) {
    console.error("❌ [IPFS UPLOAD ERROR]:", error);
    if (task.onError) task.onError(error);
    task.reject(error);
  } finally {
    uploadQueue.shift(); // Remove the processed task
    isProcessing = false;
    processQueue(); // Process the next task
  }
};

export default uploadFileToIPFS;