import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ProcessingProvider } from './context/ProcessingContext.jsx';
import { useProcessing } from './hooks/useProcessing';
import { PROCESSING_STATUS } from './utils/constants';
import Layout from './components/Layout';
import UploadPage from './pages/UploadPage';
import ProcessingListPage from './pages/ProcessingListPage';
import ReportPage from './pages/ReportPage';
import StatusPage from './pages/StatusPage';

function ReportsRedirect() {
  const { uploads } = useProcessing();

  const latestAnalyzedUpload = [...uploads]
    .filter((upload) => upload.status === PROCESSING_STATUS.ANALISADO)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

  const latestUpload = [...uploads]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

  if (latestAnalyzedUpload) {
    return <Navigate to={`/reports/${latestAnalyzedUpload.id}`} replace />;
  }

  if (latestUpload) {
    return <Navigate to={`/reports/${latestUpload.id}`} replace />;
  }

  return <Navigate to="/processing" replace />;
}

function ReportAliasRedirect() {
  const { uploadId } = useParams();

  if (!uploadId) {
    return <Navigate to="/reports" replace />;
  }

  return <Navigate to={`/reports/${uploadId}`} replace />;
}

function App() {
  return (
    <ProcessingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/upload" replace />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="processing" element={<ProcessingListPage />} />
            <Route path="reports" element={<ReportsRedirect />} />
            <Route path="reports/:uploadId" element={<ReportPage />} />
            <Route path="report" element={<ReportsRedirect />} />
            <Route path="report/:uploadId" element={<ReportAliasRedirect />} />
            <Route path="status" element={<Navigate to="/processing" replace />} />
            <Route path="status/:uploadId" element={<StatusPage />} />
            <Route path="*" element={<Navigate to="/upload" replace />} />
          </Route>
        </Routes>
      </Router>
    </ProcessingProvider>
  );
}

export default App;
