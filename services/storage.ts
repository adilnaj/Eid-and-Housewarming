
import { ReservationData } from '../types';

// Helper to safely access environment variables
const getEnvVar = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[`VITE_${key}`]) {
      // @ts-ignore
      return import.meta.env[`VITE_${key}`];
    }
  } catch (e) { /* ignore */ }

  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[`VITE_${key}`] || 
             process.env[`NEXT_PUBLIC_${key}`] || 
             process.env[`REACT_APP_${key}`] || 
             process.env[key];
    }
  } catch (e) { /* ignore */ }

  return '';
};

// CONFIGURATION
const GITHUB_TOKEN = getEnvVar('GITHUB_TOKEN');
const REPO_OWNER = getEnvVar('REPO_OWNER');
const REPO_NAME = getEnvVar('REPO_NAME');
const FILE_PATH = 'rsvps.json';

// Simple Base64 encode/decode for UTF-8 content
const toBase64 = (str: string) => btoa(unescape(encodeURIComponent(str)));
const fromBase64 = (str: string) => decodeURIComponent(escape(atob(str)));

export const isCloudEnabled = () => !!(GITHUB_TOKEN && REPO_OWNER && REPO_NAME);

export const fetchRSVPs = async (): Promise<ReservationData[]> => {
  if (!isCloudEnabled()) {
    console.warn("[Storage] GitHub credentials missing. Using local storage.");
    const saved = localStorage.getItem('as_event_rsvps');
    return saved ? JSON.parse(saved) : [];
  }

  try {
    // Add timestamp to prevent caching
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?t=${Date.now()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = fromBase64(data.content); // Decode Base64 content
    const rsvps = JSON.parse(content);
    
    // Sort by newest
    return rsvps.sort((a: ReservationData, b: ReservationData) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('[Storage] Error fetching from GitHub:', error);
    return [];
  }
};

export const saveRSVP = async (newRsvp: ReservationData): Promise<void> => {
  // Always save to local storage as backup/immediate UI update
  const saved = localStorage.getItem('as_event_rsvps');
  const currentLocal = saved ? JSON.parse(saved) : [];
  localStorage.setItem('as_event_rsvps', JSON.stringify([newRsvp, ...currentLocal]));

  if (!isCloudEnabled()) {
    console.warn("[Storage] GitHub credentials missing. Saved locally only.");
    return;
  }

  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    // 1. GET current file to get the SHA (required for update) and current data
    const getResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let currentData: ReservationData[] = [];
    let sha = '';

    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
      try {
        currentData = JSON.parse(fromBase64(fileData.content));
      } catch (e) {
        currentData = [];
      }
    } else if (getResponse.status === 404) {
      console.log("[Storage] File doesn't exist yet, creating new.");
    } else {
      throw new Error("Failed to fetch current file for update");
    }

    // 2. Add new RSVP
    const updatedData = [newRsvp, ...currentData];
    const contentEncoded = toBase64(JSON.stringify(updatedData, null, 2));

    // 3. PUT update to GitHub
    const putResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `RSVP: ${newRsvp.name} (${newRsvp.guests} guests)`,
        content: contentEncoded,
        sha: sha || undefined // Only include SHA if file existed
      })
    });

    if (!putResponse.ok) {
      const err = await putResponse.json();
      throw new Error(`GitHub Write Error: ${err.message}`);
    }

    console.log('[Storage] RSVP successfully synced to GitHub.');
  } catch (error) {
    console.error('[Storage] Failed to save to GitHub:', error);
    alert("Saved locally. Could not sync to cloud (Check console).");
  }
};
