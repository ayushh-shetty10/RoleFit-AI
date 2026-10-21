import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useReport } from '../hooks/useReport';
import { useReportJob } from '../hooks/useReportJob';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Progress } from '../../../components/ui/Progress';

export const Analyze = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const resumeInputRef = useRef(null);

  const { reports } = useReport();
  const { jobState, isSubmitting, stageMessage, startReportJob, resetJobState } = useReportJob();

  // Navigate automatically when job reaches COMPLETED status with a valid reportId
  useEffect(() => {
    if (jobState.status === 'COMPLETED' && jobState.reportId) {
      navigate(`/interview/${jobState.reportId}`);
    }
  }, [jobState.status, jobState.reportId, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (resumeInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        resumeInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const removeSelectedFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  const handleGenerateReport = async () => {
    if (!jobDescription || !jobDescription.trim()) {
      alert('Please enter a Target Job Description.');
      return;
    }

    const resumeFile = selectedFile || resumeInputRef.current?.files?.[0];
    if (!resumeFile && (!selfDescription || !selfDescription.trim())) {
      alert('Please provide either a Resume file or a Self Description.');
      return;
    }

    startReportJob({ jobDescription, selfDescription, resumeFile });
  };

  const isJobActive = isSubmitting || jobState.status === 'QUEUED' || jobState.status === 'PROCESSING';

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analyze an Opportunity"
        subtitle="Match your background against target job requirements to generate a tailored interview strategy."
      />

      {/* Async Generation Progress View */}
      {isJobActive && (
        <Card className="p-8 border-primary/30">
          <CardContent className="flex flex-col items-center text-center gap-6 p-0">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                {stageMessage}
              </h3>
              <p className="text-xs text-muted max-w-md">
                Analyzing target requirements against your background to build a tailored interview plan.
              </p>
            </div>

            <Progress
              value={jobState.progress}
              showPercentage
              size="lg"
              variant="primary"
              className="max-w-md"
            />
          </CardContent>
        </Card>
      )}

      {/* Failed Job Banner */}
      {jobState.status === 'FAILED' && (
        <Card className="border-danger/40 bg-danger/5 p-6">
          <CardContent className="flex flex-col items-center text-center gap-3 p-0">
            <div className="flex items-center gap-2 text-danger font-semibold text-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Report Generation Failed</span>
            </div>
            <p className="text-xs text-muted max-w-md">
              {jobState.error || 'Report generation failed. Please try again.'}
            </p>
            <Button variant="secondary" size="sm" onClick={resetJobState} className="mt-1">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Card */}
      {!isJobActive && jobState.status !== 'FAILED' && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Job Description */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-sm bg-primary-soft text-primary">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <h2 className="text-sm font-semibold text-foreground">Target Job Description</h2>
                  </div>
                  <Badge variant="primary" size="sm">Required</Badge>
                </div>

                <Textarea
                  rows={12}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here (responsibilities, required skills, tech stack)..."
                  maxLength={5000}
                  disabled={isJobActive}
                />
                <div className="flex justify-end text-[11px] text-muted font-mono">
                  {jobDescription.length} / 5000 chars
                </div>
              </div>

              {/* Right Column: Candidate Profile */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-sm bg-secondary-soft text-secondary">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <h2 className="text-sm font-semibold text-foreground">Your Profile & Background</h2>
                </div>

                {/* Upload Resume */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-foreground">Upload Resume</label>
                    <Badge variant="secondary" size="sm">Best Results</Badge>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !isJobActive && resumeInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors duration-150 ${
                      isDragging
                        ? 'border-primary bg-primary-soft/30'
                        : selectedFile
                        ? 'border-success bg-success/5'
                        : 'border-border bg-app-bg/50 hover:border-primary/50'
                    }`}
                  >
                    <input
                      ref={resumeInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      disabled={isJobActive}
                    />

                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-success">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{selectedFile.name}</span>
                        </div>
                        <p className="text-[11px] text-muted">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Click to change
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeSelectedFile}
                          disabled={isJobActive}
                          className="text-danger hover:bg-danger/10 text-[11px] py-1 h-auto"
                        >
                          Remove file
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <svg className="h-7 w-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-xs font-medium text-foreground">Click to upload or drag & drop</p>
                        <p className="text-[11px] text-muted">PDF or DOCX (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* OR Divider */}
                <div className="relative flex items-center justify-center my-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <span className="relative bg-surface px-3 text-[11px] uppercase font-semibold text-muted tracking-wider">
                    OR
                  </span>
                </div>

                {/* Quick Self-Description */}
                <Textarea
                  label="Quick Self-Description"
                  rows={3}
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Briefly describe your experience, core skills, and tech stack if you don't have a resume handy..."
                  disabled={isJobActive}
                />

                {/* Help Callout */}
                <div className="p-3 bg-app-bg border border-border/80 rounded-sm text-xs text-muted flex items-start gap-2">
                  <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required alongside the job description.</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-muted">
                AI Strategy Generation &bull; Takes ~30 seconds
              </span>
              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerateReport}
                disabled={isJobActive}
                className="w-full sm:w-auto"
              >
                {isJobActive ? 'Submitting Job...' : 'Generate Strategy Plan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reports Section */}
      {reports && reports.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground tracking-tight">
              Recent Interview Plans ({reports.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((r) => {
              const scoreVariant = r.matchScore >= 80 ? 'success' : r.matchScore >= 60 ? 'warning' : 'danger';
              return (
                <Card
                  key={r._id}
                  onClick={() => navigate(`/interview/${r._id}`)}
                  className="cursor-pointer hover:border-primary/50 transition-colors duration-150"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm line-clamp-1">
                        {r.title || 'Interview Strategy Plan'}
                      </CardTitle>
                      <Badge variant={scoreVariant} size="sm">
                        {r.matchScore}% Match
                      </Badge>
                    </div>
                    <CardDescription>
                      Generated {new Date(r.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2 text-xs text-muted">
                    <p className="line-clamp-2 leading-relaxed">
                      {r.jobDescription ? r.jobDescription.substring(0, 120) + '...' : 'Target position review.'}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;
