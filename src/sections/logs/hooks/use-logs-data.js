'use client';

import { useState, useCallback } from 'react';

import axios from 'src/utils/axios';

export function useLogsData() {
  const [logFiles, setLogFiles] = useState([]);
  const [logEntries, setLogEntries] = useState({ data: [], pagination: null });
  const [logStats, setLogStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('api/admin/logs/files');

      if (response.data.success) {
        setLogFiles(response.data.files);
      } else {
        setError('Failed to fetch log files');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch log files');
      console.error('Error fetching log files:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLogEntries = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('api/admin/logs/entries', { params });

      if (response.data.success) {
        setLogEntries({
          data: response.data.data,
          pagination: response.data.pagination,
        });
      } else {
        setError('Failed to fetch log entries');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch log entries');
      console.error('Error fetching log entries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLogStats = useCallback(async (params = {}) => {
    try {
      const response = await axios.get('api/admin/logs/stats', { params });

      if (response.data.success) {
        setLogStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching log stats:', err);
    }
  }, []);

  const clearLogFile = useCallback(async (fileName) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('api/admin/logs/clear', { file: fileName });

      if (response.data.success) {
        return true;
      }
      setError('Failed to clear log file');
      return false;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear log file');
      console.error('Error clearing log file:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadLogFile = useCallback(async (fileName) => {
    try {
      const response = await axios.get('api/admin/logs/download', {
        params: { file: fileName },
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download log file');
      console.error('Error downloading log file:', err);
    }
  }, []);

  return {
    logFiles,
    logEntries,
    logStats,
    loading,
    error,
    fetchLogFiles,
    fetchLogEntries,
    fetchLogStats,
    clearLogFile,
    downloadLogFile,
  };
}
